// Script pour peupler automatiquement la base de données
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateDatabase() {
  console.log('🚀 Peuplement de la base de données COREGAB...\n');

  try {
    // Lire le script SQL
    const sqlContent = fs.readFileSync('complete_database_setup.sql', 'utf8');
    
    // Diviser le script en requêtes individuelles
    const queries = sqlContent
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));

    console.log(`📝 Exécution de ${queries.length} requêtes SQL...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      
      if (query.includes('DO $$')) {
        // Gérer les blocs DO $$ séparément
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: query });
          if (error) {
            console.error(`❌ Erreur requête ${i + 1}:`, error.message);
            errorCount++;
          } else {
            console.log(`✅ Requête ${i + 1} exécutée`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Erreur requête ${i + 1}:`, err.message);
          errorCount++;
        }
      } else if (query.trim().length > 0) {
        try {
          // Exécuter les requêtes simples
          const { error } = await supabase.rpc('exec_sql', { sql: query });
          if (error) {
            console.error(`❌ Erreur requête ${i + 1}:`, error.message);
            errorCount++;
          } else {
            console.log(`✅ Requête ${i + 1} exécutée`);
            successCount++;
          }
        } catch (err) {
          console.error(`❌ Erreur requête ${i + 1}:`, err.message);
          errorCount++;
        }
      }
    }

    console.log(`\n📊 Résumé de l'exécution:`);
    console.log(`✅ Succès: ${successCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);

    // Vérifier le résultat
    console.log('\n🔍 Vérification des données...');
    
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*');
    
    const { data: parts, error: partsError } = await supabase
      .from('parts')
      .select('*');
    
    const { data: relations, error: relationsError } = await supabase
      .from('part_vehicle_fitment')
      .select('*');
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    console.log(`✅ Véhicules: ${vehicles?.length || 0}/10`);
    console.log(`✅ Pièces: ${parts?.length || 0}/20+`);
    console.log(`✅ Relations: ${relations?.length || 0}/50+`);
    console.log(`✅ Produits: ${products?.length || 0}/3`);

    if ((vehicles?.length || 0) >= 10 && (parts?.length || 0) >= 20 && (relations?.length || 0) >= 50) {
      console.log('\n🎉 Base de données correctement peuplée !');
      console.log('🔄 Rechargez l\'application pour voir les données.');
    } else {
      console.log('\n⚠️  Base de données partiellement peuplée.');
      console.log('💡 Essayez d\'exécuter le script SQL manuellement dans Supabase.');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    console.log('\n💡 Solution alternative:');
    console.log('1. Ouvrez complete_database_setup.sql');
    console.log('2. Copiez le contenu dans l\'éditeur SQL de Supabase');
    console.log('3. Cliquez sur "Run"');
  }
}

populateDatabase();
