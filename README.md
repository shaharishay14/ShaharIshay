# Shahar Ishay - Portfolio

Personal portfolio website showcasing projects and contact information.

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
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

- Project showcase with live metrics
- Contact form with email notifications
- Responsive brutalist design
- Admin mode for project management
