import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/",
  build: {
    outDir: "dist",
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-animation": ["framer-motion", "gsap"],
          "vendor-three": ["three", "@react-three/fiber"],
          "vendor-ui": ["lucide-react", "class-variance-authority", "clsx", "tailwind-merge"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    cors: true,
    hmr: {
      clientPort: 443,
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
  },
}))
