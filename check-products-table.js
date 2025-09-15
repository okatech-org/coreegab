// Script pour vérifier la structure de la table products
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductsTable() {
  console.log('🔍 Vérification de la table products...\n');

  try {
    // Vérifier la structure de la table
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erreur table products:', error.message);
      
      // Essayer de voir les colonnes disponibles
      console.log('\n🔍 Tentative de récupération des colonnes...');
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: 'products' });
      
      if (columnsError) {
        console.error('❌ Impossible de récupérer les colonnes:', columnsError.message);
      } else {
        console.log('📋 Colonnes disponibles:', columns);
      }
    } else {
      console.log('✅ Table products accessible');
      console.log(`📦 ${products?.length || 0} produits trouvés`);
      
      if (products && products.length > 0) {
        console.log('📋 Structure du premier produit:');
        console.log(JSON.stringify(products[0], null, 2));
      }
    }

    // Vérifier les autres tables
    console.log('\n🔍 Vérification des autres tables...');
    
    const { data: vehicles } = await supabase.from('vehicles').select('*').limit(1);
    console.log(`✅ Véhicules: ${vehicles?.length || 0} trouvés`);
    
    const { data: parts } = await supabase.from('parts').select('*').limit(1);
    console.log(`✅ Pièces: ${parts?.length || 0} trouvées`);

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

checkProductsTable();
