# Maniar - Moroccan Fashion E-commerce

## Overview

Maniar is a luxury Moroccan fashion e-commerce website showcasing hand-crafted garments inspired by traditional Moroccan craftsmanship. The application is a single-page React application built with TypeScript, featuring an immersive visual experience with custom shaders, animations, and a luxury watch-inspired UI design system.

The platform displays a catalog of men's and women's clothing (djellabas, kaftans, coats, gilets, etc.) with product modals, a shopping cart drawer, and an AI-powered chat assistant for styling guidance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 18 with TypeScript** - Modern component-based architecture with strict type checking
- **Vite** - Fast development server and build tooling with HMR support
- **Single-page application** - No routing library; page state managed via React state (`PageType`)

### Styling System
- **Tailwind CSS 3** - Utility-first CSS with custom theme extensions
- **CSS Custom Properties** - Brand colors and elevation system defined in `index.css`
- **Custom utility function** - `cn()` helper combining `clsx` and `tailwind-merge` for conditional classes

### Animation & Visual Effects
- **Framer Motion** - Page transitions, micro-interactions, and scroll-based animations
- **React Three Fiber + Three.js** - WebGL shader effects for background patterns (`PatternShader`, `ShieldShader`)
- **Custom Canvas shaders** - GPU-accelerated background animations with palette controls

### Component Architecture
- **UI Components** (`src/components/ui/`) - Reusable design system components (drawers, buttons, knobs, switches)
- **Watch Components** (`src/components/watch/`) - Navigation dock and panel system inspired by luxury watch interfaces
- **Shop Components** (`src/components/shop/`) - Cart drawer, product modal for e-commerce functionality
- **Chat Components** (`src/components/chat/`) - AI styling assistant interface
- **Pages** (`src/pages/`) - Full-page content sections (Brand Story, Craft Origin, Men/Women catalogs, Journal, Shipping)

### State Management
- **React useState/useMemo** - Local component state for UI controls, cart, and navigation
- **No global state library** - State lifted to `App.tsx` and passed via props
- **Cart stored in component state** - `CartLine[]` array with product, size, and quantity

### Data Layer
- **Static catalog** (`src/lib/catalog.ts`) - Product data defined as TypeScript constants
- **No backend/database** - Purely frontend application with static data
- **Type-safe product definitions** - `Product`, `ProductSize`, `ProductCategory`, `ProductGender` types

### Path Aliases
- **`@/*` alias** - Maps to `src/*` for clean imports (configured in `tsconfig.json` and `vite.config.js`)

## External Dependencies

### Core Libraries
| Package | Purpose |
|---------|---------|
| `react` / `react-dom` | UI framework |
| `framer-motion` | Animation library for page transitions and micro-interactions |
| `@react-three/fiber` + `three` | WebGL rendering for custom shader backgrounds |
| `lucide-react` | Icon library (arrows, navigation, UI icons) |

### Styling
| Package | Purpose |
|---------|---------|
| `tailwindcss` | Utility CSS framework |
| `class-variance-authority` | Component variant utilities |
| `clsx` + `tailwind-merge` | Conditional class name handling |

### Build Tools
| Package | Purpose |
|---------|---------|
| `vite` | Development server and production bundler |
| `@vitejs/plugin-react` | React Fast Refresh and JSX transform |
| `typescript` | Type checking |
| `postcss` + `autoprefixer` | CSS processing |

### External Services
- **Instagram integration** - Environment variable `VITE_INSTAGRAM_URL` for social stories component
- **Static images** - Product and lifestyle images served from `/images/` and `/public/` directories

### No Backend Services
This is a frontend-only application. There is no:
- Database connection
- Authentication system
- Payment processing
- API endpoints

Future integration would require adding backend infrastructure for cart persistence, user accounts, and checkout flow.