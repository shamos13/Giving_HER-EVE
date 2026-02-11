import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      tailwindcss(),
      react()
  ],
    build: {
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom", "react-router"],
                    motion: ["framer-motion"],
                    charts: ["recharts"],
                    icons: ["lucide-react", "react-icons"],
                },
            },
        },
    },
    base:
        process.env.NODE_ENV === "production"
            ? (process.env.VITE_BASE_PATH || "/Giving_HER-EVE/")
            : "/"
})
