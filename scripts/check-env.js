#!/usr/bin/env node

/**
 * Script de vérification des variables d'environnement
 * Vérifie que toutes les variables nécessaires sont configurées
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_URL'
];

const optionalEnvVars = [
  'VITE_SUPABASE_DB_URL',
  'VITE_SUPABASE_DIRECT_URL',
  'NETLIFY_AUTH_TOKEN',
  'NETLIFY_SITE_ID'
];

function checkEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = readFileSync(filePath, 'utf8');
    return content.split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.split('=')[0]);
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔍 Vérification de la configuration d\'environnement...\n');
  
  // Vérifier les fichiers d'environnement
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  let foundEnvVars = [];
  
  for (const envFile of envFiles) {
    const vars = checkEnvFile(envFile);
    if (vars) {
      foundEnvVars = [...foundEnvVars, ...vars];
      console.log(`✅ ${envFile} trouvé`);
    }
  }
  
  // Vérifier les variables requises
  console.log('\n📋 Variables d\'environnement requises:');
  let allRequired = true;
  
  for (const envVar of requiredEnvVars) {
    if (foundEnvVars.includes(envVar) || process.env[envVar]) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`❌ ${envVar} - MANQUANTE`);
      allRequired = false;
    }
  }
  
  // Vérifier les variables optionnelles
  console.log('\n📋 Variables d\'environnement optionnelles:');
  
  for (const envVar of optionalEnvVars) {
    if (foundEnvVars.includes(envVar) || process.env[envVar]) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`⚠️  ${envVar} - Non configurée (optionnelle)`);
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé:');
  if (allRequired) {
    console.log('✅ Toutes les variables requises sont configurées!');
    console.log('🚀 Vous pouvez démarrer le développement avec: npm run dev');
  } else {
    console.log('❌ Certaines variables requises sont manquantes.');
    console.log('📝 Créez un fichier .env.local avec les variables manquantes.');
    console.log('📖 Consultez env.example pour un exemple de configuration.');
    process.exit(1);
  }
  
  // Vérifier la configuration Supabase
  console.log('\n🔗 Configuration Supabase:');
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vpxsyxbxbilqyikmyznf.supabase.co';
  console.log(`URL: ${supabaseUrl}`);
  
  const projectRef = supabaseUrl.split('//')[1].split('.')[0];
  console.log(`Project Ref: ${projectRef}`);
  
  console.log('\n✨ Configuration terminée!');
}

main();
