import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages base path - only apply during build, not dev
  base: command === 'build' ? '/festive-feast-pro1/' : '/',
  
  server: {
    host: "0.0.0.0", // Allow external connections
    port: 8080,
    hmr: {
      overlay: false,
      port: 8080
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".ngrok.io",
      ".ngrok-free.app",
      ".ngrok.app"
    ],
    cors: true, // Enable CORS for ngrok
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
  },
  
  plugins: [
    react(),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
}));