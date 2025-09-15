// Configuration Supabase pour COREEGAB
export const supabaseConfig = {
  url: 'https://vpxsyxbxbilqyikmyznf.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw',
  databaseUrl: 'postgres://postgres:[YOUR-PASSWORD]@db.vpxsyxbxbilqyikmyznf.supabase.co:6543/postgres?pgbouncer=true',
  directUrl: 'postgres://postgres:[YOUR-PASSWORD]@db.vpxsyxbxbilqyikmyznf.supabase.co:5432/postgres'
};

// Configuration de production
export const appConfig = {
  name: 'COREEGAB',
  version: '1.0.2',
  url: 'https://coreegab.com',
  environment: 'production'
};
