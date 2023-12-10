import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:7000',
    }
  },

  base: "/DevelopmentOfInternetApplications_frontend/",
  plugins: [react()]
})