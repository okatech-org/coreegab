import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Import dynamique pour le module ESM lovable-tagger
const loadLovableTagger = async () => {
  try {
    const { componentTagger } = await import("lovable-tagger");
    return componentTagger;
  } catch (error) {
    console.warn("lovable-tagger could not be loaded:", error);
    return null;
  }
};

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Charger le plugin de manière asynchrone seulement en développement
  const componentTagger = mode === "development" ? await loadLovableTagger() : null;
  
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        port: 8080,
        host: "localhost"
      }
    },
    plugins: [
      react(),
      // Ajouter le plugin seulement s'il est disponible
      componentTagger && componentTagger()
    ].filter(Boolean),
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
      chunkSizeWarningLimit: 1000, // Augmenter la limite pour la production
      sourcemap: false, // Désactiver les sourcemaps en production
      minify: 'terser', // Utiliser terser pour une meilleure compression
      target: 'es2020', // Cibler ES2020 pour de meilleures performances
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [], // Supprimer console.log en production
    },
  };
});
