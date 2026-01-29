# Maniar - Moroccan Fashion E-commerce

## Overview

Maniar is a luxury Moroccan fashion e-commerce website built as a single-page React application. The project showcases hand-crafted garments inspired by traditional Moroccan craftsmanship, featuring an immersive visual experience with custom shaders, animations, and a watch-inspired navigation system.

The application is a frontend-only implementation using Vite as the build tool, React 18 with TypeScript, and Tailwind CSS for styling. It includes a product catalog, shopping cart, chat interface, and multiple content pages (brand story, craft origin, shipping info, journal).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7.x with hot module replacement
- **Styling**: Tailwind CSS 3.x with custom theme extensions
- **Animations**: Framer Motion for page transitions and micro-interactions
- **3D Graphics**: Three.js with @react-three/fiber for custom shader effects

### Component Architecture
The application uses a component-based architecture with clear separation:

- **Pages** (`src/pages/`): Full-page views like MenPage, WomenPage, BrandStory, Journal
- **UI Components** (`src/components/ui/`): Reusable primitives (drawer, buttons, knobs, shaders)
- **Feature Components** (`src/components/shop/`, `src/components/chat/`, `src/components/watch/`): Domain-specific components

### State Management
- Local React state with useState hooks
- No external state management library
- Cart state managed in App.tsx and passed down via props

### Routing
- Custom page navigation using React state (no React Router)
- Page type controlled by `PageType` union type in App.tsx

### Design System
Custom CSS variables define the brand palette:
- Deep navy background (`--maniar-bg: #070817`)
- Gold accent colors (`--maniar-gold: #d6ac54`)
- Light gold ink for text (`--maniar-ink: #f4e5a7`)

### Visual Effects
- Custom WebGL shaders for background patterns (`PatternShader`, `ShieldShader`)
- Framer Motion for scroll-based animations and transitions
- Elevated UI elements with custom shadow system

## External Dependencies

### Core Libraries
- **React 18.2.0**: UI framework
- **Vite 7.3.0**: Development server and bundler
- **TypeScript 4.7.4**: Type safety

### Styling & Animation
- **Tailwind CSS 3.4.17**: Utility-first CSS
- **Framer Motion 12.25.0**: Animation library
- **class-variance-authority + clsx + tailwind-merge**: Component variant utilities

### Visual
- **Three.js 0.182.0**: 3D graphics engine
- **@react-three/fiber 8.18.0**: React renderer for Three.js
- **Lucide React 0.562.0**: Icon library

### External Services
- No backend API integration (static catalog data)
- Instagram integration placeholder (configurable via `VITE_INSTAGRAM_URL` env var)
- Images served from `/images/` and `/public/` directories

### Build Configuration
- Path alias `@/*` maps to `src/*`
- Server configured for Replit deployment (port 5000, host 0.0.0.0)
- PostCSS with Autoprefixer for CSS compatibility