# Maniar Atelier

**Luxury Moroccan Fashion** — Hand-crafted garments inspired by the geometric patterns of Fez.

![Maniar Atelier](public/logoManiar.jpeg)

## 🚀 Deploy to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/maniar-atelier)

### Option 2: Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/maniar-atelier.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings
   - Click "Deploy"

3. **Build Settings** (Auto-detected)
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Build Configuration

The project includes optimized configuration:

```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion + GSAP |
| 3D Graphics | Three.js + React Three Fiber |
| Icons | Lucide React |

## 📁 Project Structure

```
maniar-atelier/
├── public/              # Static assets
│   ├── images/         # Product images
│   └── logoManiar.jpeg # Brand logo
├── src/
│   ├── components/     # React components
│   │   ├── home/      # Hero, split-hero
│   │   ├── layout/    # Header, Menu, Navigation
│   │   ├── shop/      # Cart, Product Modal
│   │   └── ui/        # GlassCard, GlassNav, etc.
│   ├── i18n/          # Translations (6 languages)
│   ├── lib/           # Catalog, utilities
│   ├── pages/         # Brand, Craft, Shipping, Journal
│   ├── App.tsx        # Main application
│   └── index.tsx      # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── vercel.json        # Vercel deployment config
```

## 🌍 Features

- **Split Hero** — Full-screen gender selector with hover interactions
- **Glassmorphism UI** — Frosted glass cards and navigation
- **Fullscreen Menu** — Elegant overlay navigation with animations
- **Multi-language** — English, French, Spanish, German, Italian, Arabic
- **Product Catalog** — Filterable collection with size selection
- **Shopping Cart** — Add, remove, quantity controls
- **Concierge Chat** — Customer service interface
- **Responsive** — Mobile-first design

## 🎨 Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Background | `#0B1026` | Deep navy base |
| Primary Gold | `#D6AC54` | Accents, CTAs |
| Light Gold | `#F4E5A7` | Highlights |
| Gradient | `#F9F1D0 → #D4AF37 → #B5922F` | Logo, premium |

### Typography
- **Headings:** Serif (system) + Semi-bold
- **Body:** System sans-serif
- **Monospace:** Labels, kickers

## 📝 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

No environment variables required for basic deployment.

Optional:
```env
VITE_ANALYTICS_ID=your_analytics_id
```

## 📄 License

ISC License — See [LICENSE](./LICENSE) for details.

---

**Maniar Atelier** © 2026 — Moroccan heritage, modern elegance.
