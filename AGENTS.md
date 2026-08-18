# Birthday Website - Agent Guidelines

## Project Overview
A soft & dreamy single-page birthday website with countdown lock screen, hero, photo/text sections, and interactive timeline. Built with Vite + React + TypeScript, Framer Motion, and Tailwind CSS.

## Tech Stack
- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Deployment:** Vercel (free)

## Architecture
- Single-page app with 5 scrollable sections
- Content centralized in `src/config/content.ts`
- Components are isolated with clear responsibilities
- All animations handled by Framer Motion

## Color Palette
```
pastel-pink: #FFB6C1
pastel-lavender: #E6E6FA
pastel-blush: #FFF0F5
pastel-rose: #FFD1DC
soft-text: #4A4A4A
```

## Development Workflow

### Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

### Commit Conventions
- `init:` - Project scaffolding
- `add:` - New feature/component
- `fix:` - Bug fixes
- `style:` - Styling changes
- `compose:` - App assembly/integration

### Task Tracking
Update `feature_list.json` after completing each task:
1. Set task status to `"completed"`
2. Add agent name
3. Add `completedAt` timestamp
4. Update summary counts

## Component Guidelines
- Each component is a single responsibility
- Props typed with TypeScript interfaces
- Framer Motion for all animations (no CSS animations)
- Tailwind classes only (no custom CSS unless necessary)

## Content Guidelines
- All text lives in `src/config/content.ts`
- Photo paths are relative to `/public/assets/`
- Dates should be in `YYYY-MM-DD` format for config, human-readable for display

## Testing
- Manual testing via `npm run dev`
- Verify: lock screen countdown, unlock transition, animations, responsive layout
- Build must succeed with `npm run build` before marking task complete

## Deployment
- Push to GitHub
- Deploy to Vercel (connect repo, auto-deploy)
- Custom domain optional
