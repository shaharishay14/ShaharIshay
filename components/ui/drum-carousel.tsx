"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { DrumCarousel as DrumCarouselCore } from "@/lib/drum-carousel";

export interface DrumCarouselHandle {
  goTo: (index: number) => void;
}

interface DrumCarouselProps {
  images: string[];
  onActiveChange?: (index: number) => void;
  onOpen?: (index: number) => void;
  className?: string;
  ariaLabel?: string;
}

/** React wrapper around the WebGL drum carousel in lib/drum-carousel.ts */
export const DrumCarousel = forwardRef<DrumCarouselHandle, DrumCarouselProps>(function DrumCarousel(
  { images, onActiveChange, onOpen, className = "", ariaLabel = "Carousel" },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<DrumCarouselCore | null>(null);
  // Latest callbacks without rebuilding the WebGL scene
  const callbacks = useRef({ onActiveChange, onOpen });
  callbacks.current = { onActiveChange, onOpen };

  useImperativeHandle(ref, () => ({ goTo: (index: number) => appRef.current?.goTo(index) }), []);

  useEffect(() => {
    if (!containerRef.current || !images.length) return;
    const app = new DrumCarouselCore(containerRef.current, {
      images,
      onActiveChange: (i) => callbacks.current.onActiveChange?.(i),
      onOpen: (i) => callbacks.current.onOpen?.(i),
    });
    appRef.current = app;
    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, [images]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={`h-full w-full cursor-grab select-none outline-none [touch-action:pan-y] ${className}`}
    />
  );
});
