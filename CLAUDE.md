# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

### Package Management
- Uses npm (package-lock.json present)

## Architecture

This is a Next.js 15.4.3 application using the App Router pattern with TypeScript and Tailwind CSS.

### Key Technologies
- **Next.js 15.4.3** with App Router
- **React 19.1.0** 
- **TypeScript 5**
- **Tailwind CSS 4** for styling
- **ESLint 9** with Next.js config

### Project Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global Tailwind styles
- TypeScript path alias: `@/*` maps to `./src/*`

### Styling
- Uses Tailwind CSS 4 with PostCSS
- Geist and Geist Mono fonts configured via next/font/google
- Dark mode support implemented via CSS classes

### Configuration
- `next.config.ts` - Empty Next.js config (uses defaults)
- `tsconfig.json` - Strict TypeScript with Next.js plugin
- `eslint.config.mjs` - ESLint configuration