# Shahar Ishay - Portfolio

Personal portfolio website showcasing projects and contact information.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Motion + OGL (WebGL) for animations
- Resend (for contact form emails)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with:
```
NEXT_PUBLIC_MODE_URL=your_admin_secret
RESEND_API_KEY=your_resend_api_key
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Admin Mode

Access admin features to add/edit projects:
- Visit: `/?mode=YOUR_SECRET_HERE`

## Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

## Features

- Light, single-column layout: name and links, a short intro, and a full-width WebGL drum carousel of project cards
- Drum carousel with spring physics (drag, fling, scroll or ← →) and motion blur that grows with spin speed; click the front card to open the project
- Project cards drawn from `data/projects.ts`: name, tagline, the project's icon (`public/projects/`), status and link on a colour gradient. Set `image` on a project to use your own card image instead
- Contact form (dialog) with email notifications
- Admin mode for project management

## UI components

- `lib/drum-carousel.ts`: the WebGL drum carousel (OGL, framework-agnostic), wrapped for React in `components/ui/drum-carousel.tsx`
- `lib/project-cards.ts`: draws the project cards on a canvas
- `components/ui/blur-fade.tsx`: Magic UI Blur Fade from [21st.dev](https://21st.dev) (used with blur off, as a gentle fade-up)

`components.json` is set up, so more can be added with `npx shadcn@latest add <registry-url>`.
