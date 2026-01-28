# Shahar Ishay - Portfolio Website

A minimalist portfolio website inspired by marclou.com, built with Next.js 14, Tailwind CSS, and Recharts.

## Features

- **Responsive Design**: Mobile-first approach with sticky sidebar on desktop
- **Project Showcase**: Grid layout with status badges and sparkline charts
- **Hidden Admin Mode**: Secret UI for generating project JSON without a backend

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Hidden Admin Mode

The portfolio includes a secure admin mode for managing projects without a backend.

### Setup

1. Copy `.env.example` to `.env.local`
2. Set your secret admin URL:
   ```bash
   NEXT_PUBLIC_MODE_URL=your_super_secret_key_here
   ```
3. **Important**: Change the default value to something secure and unique!

### Accessing Admin Mode

Visit: `http://localhost:3000/?mode=YOUR_SECRET_KEY`

Replace `YOUR_SECRET_KEY` with the value you set in `NEXT_PUBLIC_MODE_URL`.

### Admin Features

**Full CRUD Operations:**

- **CREATE**: Click "ADD" button → Fill form → Copy JSON → Paste to `data/projects.ts`
- **READ**: All projects visible in normal mode
- **UPDATE**: Click orange pencil icon → Edit fields → Save → Replace entire file content
- **DELETE**: Click red trash icon → Confirm → Replace entire file content

Each operation copies the complete file (with TypeScript interface) to your clipboard for easy paste into `data/projects.ts`.

**Editable Fields:**
- Project name and description
- Status (Live, Beta, Coming Soon, Development)
- Optional link
- Sparkline metrics (comma-separated numbers)

## Project Structure

```
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── AddProjectModal.tsx
│   ├── ProjectCard.tsx
│   ├── Sidebar.tsx
│   └── Sparkline.tsx
├── data/
│   └── projects.ts
└── lib/
    └── utils.ts
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: TypeScript

## Customization

Update your profile in `components/Sidebar.tsx`:
- Name, role, and bio
- Social links (GitHub, Twitter, LinkedIn)

Add projects in `data/projects.ts` or use the admin mode to generate JSON.

## License

MIT
