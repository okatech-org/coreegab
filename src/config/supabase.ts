// Configuration Supabase pour COREEGAB
// Variables d'environnement avec fallback pour le développement
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  projectRef: 'vpxsyxbxbilqyikmyznf',
  // URLs de base de données (à configurer avec les vraies credentials)
  databaseUrl: import.meta.env.VITE_SUPABASE_DB_URL || 'postgres://postgres:[YOUR-PASSWORD]@db.vpxsyxbxbilqyikmyznf.supabase.co:6543/postgres?pgbouncer=true',
  directUrl: import.meta.env.VITE_SUPABASE_DIRECT_URL || 'postgres://postgres:[YOUR-PASSWORD]@db.vpxsyxbxbilqyikmyznf.supabase.co:5432/postgres'
};

// Configuration de l'application avec détection d'environnement
export const appConfig = {
  name: 'COREEGAB',
  version: '1.0.5',
  environment: import.meta.env.MODE || 'development',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  // URLs de production
  production: {
    main: 'https://coreegab.com',
    lovable: 'https://coreegab.lovable.app',
    netlify: 'https://coreegab.netlify.app'
  }
};

// Configuration pour différents environnements
export const environmentConfig = {
  development: {
    apiUrl: 'http://localhost:5173',
    debug: true,
    logLevel: 'debug'
  },
  production: {
    apiUrl: 'https://coreegab.com',
    debug: false,
    logLevel: 'error'
  }
};

// Fonction utilitaire pour obtenir la configuration actuelle
export const getCurrentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return {
    ...appConfig,
    ...environmentConfig[env as keyof typeof environmentConfig],
    supabase: supabaseConfig
  };
};
