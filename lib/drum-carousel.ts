/**
 * DrumCarousel: project cards wrapped around a cylinder (WebGL via OGL).
 *
 * Motion is a critically damped spring toward a target card, so drags, flings, wheel
 * scrolls and clicks all hand their velocity to the spring instead of restarting an
 * ease. The cards get a directional motion blur proportional to how fast the drum
 * spins. Framework-agnostic so it can run in the Next.js page and a standalone page.
 */

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";

const CARD_ASPECT = 7 / 9; // width / height of the card images
const FOV = 30;
const CAMERA_Z = 10;
const MIN_CARDS = 10; // repeat the set so the loop never shows a gap
const CLICK_SLOP = 6; // px a press can move and still count as a click

// Spring: omega sets how quickly it settles (critically damped, so no overshoot)
const SPRING_OMEGA = 7.5;
// How far a fling carries, in seconds of its release velocity
const FLING_CARRY = 0.32;

const VERTEX = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uOffset;   // this card's offset from the front, in cards
  uniform vec2 uCard;      // card size in world units
  uniform float uPitch;    // arc length between card centres
  uniform float uRadius;
  varying vec2 vUv;
  varying float vTheta;

  void main() {
    vUv = uv;
    float theta = (uOffset * uPitch + position.x * uCard.x) / uRadius;
    vTheta = theta;
    vec3 pos = vec3(uRadius * sin(theta), position.y * uCard.y, uRadius * cos(theta) - uRadius);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uReady;
  uniform float uBlur;     // horizontal blur length in uv units
  uniform float uRadiusUv; // corner radius (in card-height units)
  uniform float uShade;
  varying vec2 vUv;
  varying float vTheta;

  const float ASPECT = ${CARD_ASPECT.toFixed(5)};

  float cornerMask(vec2 uv) {
    vec2 p = (uv - 0.5) * vec2(ASPECT, 1.0);
    vec2 b = vec2(0.5 * ASPECT, 0.5) - uRadiusUv;
    vec2 d = abs(p) - b;
    float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - uRadiusUv;
    return 1.0 - smoothstep(-0.0025, 0.0025, dist);
  }

  void main() {
    vec4 acc = vec4(0.0);
    float total = 0.0;
    if (uBlur < 0.0005) {
      float m = cornerMask(vUv);
      acc = vec4(texture2D(tMap, vUv).rgb * m, m);
      total = 1.0;
    } else {
      // Motion blur along the direction of travel; masks are blurred too so edges smear
      // Per-pixel jitter hides the gaps between samples
      float jitter = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
      for (int i = -7; i <= 7; i++) {
        float t = clamp((float(i) + jitter) / 7.0, -1.0, 1.0);
        float w = 1.0 - 0.65 * abs(t);
        vec2 uv = vUv + vec2(t * uBlur, 0.0);
        float m = cornerMask(uv) * step(0.0, uv.x) * step(uv.x, 1.0);
        acc += vec4(texture2D(tMap, uv).rgb * m, m) * w;
        total += w;
      }
    }
    vec3 color = acc.a > 0.0001 ? acc.rgb / acc.a : vec3(0.0);
    float alpha = acc.a / total;

    color = mix(vec3(0.86), color, uReady);
    // Turn away from the viewer: shade, then fade before the back of the drum
    float turn = clamp(1.0 - cos(vTheta), 0.0, 1.0);
    color *= 1.0 - uShade * turn;
    alpha *= 1.0 - smoothstep(1.25, 1.55, abs(vTheta));
    gl_FragColor = vec4(color, alpha);
  }
`;

export interface DrumCarouselOptions {
  images: string[];
  onActiveChange?: (index: number) => void;
  onOpen?: (index: number) => void;
}

function wrap(value: number, length: number) {
  return ((value % length) + length) % length;
}

type CardMesh = Mesh & { offset: { value: number }; ready: { value: number } };

export class DrumCarousel {
  container: HTMLElement;
  renderer: Renderer;
  gl: Renderer["gl"];
  camera: Camera;
  scene = new Transform();
  cards: CardMesh[] = [];
  itemCount: number;
  total: number;

  shared = {
    uCard: { value: [1, 1] as number[] },
    uPitch: { value: 1 },
    uRadius: { value: 1 },
    uBlur: { value: 0 },
    uRadiusUv: { value: 0.03 },
    uShade: { value: 0.42 },
  };

  // Scroll state, in cards
  x = 0;
  v = 0;
  target = 0;
  blur = 0;

  activeIndex = -1;
  raf = 0;
  lastTime = 0;
  pxPerCard = 300;
  cardPx = { w: 0, h: 0 };
  reducedMotion: boolean;

  drag: { startX: number; startPos: number; moved: number; id: number; samples: { x: number; t: number }[] } | null = null;
  wheelTimer = 0;
  resizeObserver: ResizeObserver;
  onActiveChange?: (index: number) => void;
  onOpen?: (index: number) => void;

  constructor(container: HTMLElement, { images, onActiveChange, onOpen }: DrumCarouselOptions) {
    this.container = container;
    this.onActiveChange = onActiveChange;
    this.onOpen = onOpen;
    this.itemCount = images.length;
    this.reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    const canvas = this.gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    container.appendChild(canvas);

    this.camera = new Camera(this.gl, { fov: FOV });
    this.camera.position.z = CAMERA_Z;

    const copies = Math.max(1, Math.ceil(MIN_CARDS / Math.max(1, images.length)));
    const all = Array.from({ length: copies }, () => images).flat();
    this.total = all.length;

    // Dense along x so the curve is smooth; one segment is enough vertically
    const geometry = new Plane(this.gl, { width: 1, height: 1, widthSegments: 64, heightSegments: 1 });
    // One texture per distinct image, shared by its copies
    const textures = images.map((src) => {
      const texture = new Texture(this.gl, { generateMipmaps: true, minFilter: this.gl.LINEAR_MIPMAP_LINEAR, anisotropy: 8 });
      const ready = { value: 0 };
      const img = new Image();
      img.onload = () => {
        texture.image = img;
        ready.value = 1;
      };
      img.src = src;
      return { texture, ready };
    });

    all.forEach((_, i) => {
      const { texture, ready } = textures[i % images.length];
      const offset = { value: 0 };
      const program = new Program(this.gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        uniforms: { ...this.shared, uOffset: offset, tMap: { value: texture }, uReady: ready },
        transparent: true,
        cullFace: false,
        depthTest: false,
        depthWrite: false,
      });
      const mesh = new Mesh(this.gl, { geometry, program, frustumCulled: false }) as CardMesh;
      mesh.offset = offset;
      mesh.ready = ready;
      mesh.setParent(this.scene);
      this.cards.push(mesh);
    });

    // Spin in from the side on load
    if (!this.reducedMotion) this.x = -2.5;

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
    this.addListeners();
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  size = { w: 0, h: 0 };

  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    // Resizing clears the canvas, so skip no-op resizes and redraw right away after real ones
    if (!w || !h || (w === this.size.w && h === this.size.h)) return;
    this.size = { w, h };
    this.renderer.setSize(w, h);
    this.camera.perspective({ aspect: w / h });
    const viewH = 2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
    const viewW = viewH * (w / h);
    let cardH = viewH * 0.8;
    let cardW = cardH * CARD_ASPECT;
    const maxW = viewW * (w < h ? 0.64 : 0.46);
    if (cardW > maxW) {
      cardW = maxW;
      cardH = cardW / CARD_ASPECT;
    }
    this.shared.uCard.value = [cardW, cardH];
    this.shared.uPitch.value = cardW * 1.07;
    this.shared.uRadius.value = cardW * 2.0;
    const pxPerWorld = w / viewW;
    this.cardPx = { w: cardW * pxPerWorld, h: cardH * pxPerWorld };
    this.pxPerCard = Math.max(this.cardPx.w * 1.07, 120);
    if (this.cards.length) this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  goTo(index: number) {
    const base = Math.round(this.target);
    let delta = wrap(index - wrap(base, this.itemCount), this.itemCount);
    if (delta > this.itemCount / 2) delta -= this.itemCount;
    this.target = base + delta;
  }

  step(direction: 1 | -1) {
    this.target = Math.round(this.target) + direction;
  }

  tick = (now: number) => {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (!this.drag) {
      // Critically damped spring, in small substeps for stability
      const steps = Math.ceil(dt / (1 / 120));
      const h = dt / steps;
      const k = SPRING_OMEGA * SPRING_OMEGA;
      const c = 2 * SPRING_OMEGA;
      for (let i = 0; i < steps; i++) {
        this.v += (k * (this.target - this.x) - c * this.v) * h;
        this.x += this.v * h;
      }
      if (Math.abs(this.target - this.x) < 0.0003 && Math.abs(this.v) < 0.003) {
        this.x = this.target;
        this.v = 0;
      }
    }

    // Blur follows speed, eased so it swells and fades instead of flickering
    const blurTarget = this.reducedMotion ? 0 : Math.min(0.07, Math.abs(this.v) * 0.009);
    this.blur += (blurTarget - this.blur) * (1 - Math.exp(-dt * 18));
    this.shared.uBlur.value = this.blur < 0.0005 ? 0 : this.blur;

    this.cards.forEach((card, i) => {
      const k = wrap(i - this.x + this.total / 2, this.total) - this.total / 2;
      card.offset.value = k;
      card.visible = Math.abs(k) < 4.2;
      // Far cards first so the front card is drawn on top
      card.renderOrder = -Math.round(Math.abs(k) * 100);
    });

    const active = wrap(Math.round(this.x), this.total) % this.itemCount;
    if (active !== this.activeIndex) {
      this.activeIndex = active;
      this.onActiveChange?.(active);
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.raf = requestAnimationFrame(this.tick);
  };

  /* ---- input ---- */

  overFrontCard(clientX: number, clientY: number) {
    const r = this.container.getBoundingClientRect();
    return (
      Math.abs(clientX - (r.left + r.width / 2)) < this.cardPx.w / 2 &&
      Math.abs(clientY - (r.top + r.height / 2)) < this.cardPx.h / 2
    );
  }

  onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    this.drag = { startX: e.clientX, startPos: this.x, moved: 0, id: e.pointerId, samples: [{ x: e.clientX, t: e.timeStamp }] };
    this.v = 0;
  };

  onPointerMove = (e: PointerEvent) => {
    const drag = this.drag;
    if (!drag || e.pointerId !== drag.id) {
      if (e.pointerType === "mouse" && e.target === this.gl.canvas) {
        this.container.style.cursor = this.overFrontCard(e.clientX, e.clientY) ? "pointer" : "grab";
      }
      return;
    }
    const dx = e.clientX - drag.startX;
    drag.moved = Math.max(drag.moved, Math.abs(dx));
    if (drag.moved > CLICK_SLOP && !this.container.hasPointerCapture(e.pointerId)) {
      this.container.setPointerCapture(e.pointerId);
      this.container.style.cursor = "grabbing";
    }
    const prevX = this.x;
    this.x = drag.startPos - dx / this.pxPerCard;
    drag.samples.push({ x: e.clientX, t: e.timeStamp });
    if (drag.samples.length > 6) drag.samples.shift();
    // Track velocity while dragging so the blur responds to the hand
    const first = drag.samples[0];
    const span = (e.timeStamp - first.t) / 1000;
    if (span > 0) this.v = -(e.clientX - first.x) / this.pxPerCard / span;
    else this.v = (this.x - prevX) * 60;
    this.target = this.x;
  };

  onPointerUp = (e: PointerEvent) => {
    const drag = this.drag;
    if (!drag || e.pointerId !== drag.id) return;
    this.drag = null;
    this.container.style.cursor = "";
    if (drag.moved < CLICK_SLOP) {
      this.v = 0;
      const r = this.container.getBoundingClientRect();
      if (this.overFrontCard(e.clientX, e.clientY)) this.onOpen?.(this.activeIndex);
      else this.step(e.clientX > r.left + r.width / 2 ? 1 : -1);
      return;
    }
    // Fling: keep the hand's velocity and aim for the card it would coast to
    const last = drag.samples[drag.samples.length - 1];
    if (e.timeStamp - last.t > 80) this.v = 0; // held still before letting go
    const carry = Math.max(-4, Math.min(4, this.v * FLING_CARRY));
    this.target = Math.round(this.x + carry);
  };

  onPointerCancel = () => {
    if (!this.drag) return;
    this.drag = null;
    this.target = Math.round(this.x);
  };

  onWheel = (e: WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!delta) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? this.pxPerCard : 1;
    this.target += (delta * unit) / (this.pxPerCard * 1.2);
    window.clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => (this.target = Math.round(this.target)), 140);
  };

  onKeyDown = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      this.step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.step(-1);
    } else if (e.key === "Enter" && t === this.container) {
      this.onOpen?.(this.activeIndex);
    }
  };

  addListeners() {
    this.container.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerCancel);
    this.container.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("keydown", this.onKeyDown);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.wheelTimer);
    this.resizeObserver.disconnect();
    this.container.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerCancel);
    this.container.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("keydown", this.onKeyDown);
    (this.gl.canvas as HTMLCanvasElement).remove();
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
