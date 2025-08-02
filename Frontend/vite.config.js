import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '192.168.0.197',  // binds to all network interfaces
    port: 5173        // optional; default Vite port
  }
})
