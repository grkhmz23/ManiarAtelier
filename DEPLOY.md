# 🚀 Vercel Deployment Guide

## Quick Deploy Checklist

### ✅ Pre-deployment Verification

```bash
# 1. Build locally (must pass)
npm run build

# 2. Verify dist folder exists
ls dist/
# Should show: index.html, assets/, images/, favicon.png, logoManiar.jpeg

# 3. No TypeScript errors
npx tsc --noEmit
```

### 🎯 Deployment Steps

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### Step 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Select your `maniar-atelier` repository
5. Vercel will auto-detect settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **Deploy**

#### Step 3: Wait for Build (~2-3 minutes)

Vercel will:
- Install dependencies (`npm install`)
- Build the project (`npm run build`)
- Deploy to edge network

#### Step 4: Verify Deployment

Check these routes work:
- `/` — Homepage with split hero
- `/` (navigate to brand) — Brand Story
- `/` (navigate to men) — Men's Collection
- `/` (navigate to women) — Women's Collection

### 🔧 Configuration Details

**`vercel.json`** (already configured):
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!api/.*).*)", "destination": "/index.html" }
  ]
}
```

This ensures:
- ✅ SPA routing works (all paths → index.html)
- ✅ Client-side navigation works
- ✅ Page refresh works on any route

### 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` works locally first |
| 404 on refresh | Ensure `vercel.json` has rewrite rules |
| Images not loading | Check images are in `public/` folder |
| Styles missing | Verify `dist/assets/*.css` exists |

### 🎉 Post-Deployment

- **Custom Domain:** Go to Project → Settings → Domains
- **Analytics:** Enable in Project → Analytics
- **Environment Variables:** Add in Project → Settings → Environment Variables

---

## 📊 Build Output Verification

Successful build produces:
```
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-*.js         # Main bundle
│   ├── index-*.css        # Styles
│   ├── vendor-react-*.js  # React chunk
│   ├── vendor-animation-*.js  # Framer Motion + GSAP
│   └── vendor-ui-*.js     # UI libraries
├── images/                 # Product images
├── favicon.png
├── logoManiar.jpeg
└── logo-transparent.png
```

---

**Ready to deploy!** 🚀
