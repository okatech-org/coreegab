import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les grosses librairies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],
          // Séparer les pages
          'admin-pages': [
            './src/pages/AdminDashboard.tsx',
            './src/pages/AdminImport.tsx',
          ],
          'dashboard-pages': [
            './src/pages/ClientDashboard.tsx',
            './src/pages/CommercialDashboard.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false, // Désactiver les sourcemaps en production
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [], // Supprimer console.log en production
  },
}));
