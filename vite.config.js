import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,  // Exposes local IP address for network testing (e.g., mobile testing)
    open: true   // Automatically opens the web app in the browser on startup
  }
})
