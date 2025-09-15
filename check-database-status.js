// Script pour vérifier le statut de la base de données
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStatus() {
  console.log('🔍 Vérification du statut de la base de données...\n');

  try {
    // Vérifier les véhicules
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*');
    
    if (vehiclesError) {
      console.error('❌ Erreur véhicules:', vehiclesError.message);
    } else {
      console.log(`✅ Véhicules: ${vehicles.length} trouvés`);
      if (vehicles.length > 0) {
        console.log(`   - Exemple: ${vehicles[0].make} ${vehicles[0].model} ${vehicles[0].year_start}`);
      }
    }

    // Vérifier les pièces
    const { data: parts, error: partsError } = await supabase
      .from('parts')
      .select('*');
    
    if (partsError) {
      console.error('❌ Erreur pièces:', partsError.message);
    } else {
      console.log(`✅ Pièces: ${parts.length} trouvées`);
      if (parts.length > 0) {
        console.log(`   - Exemple: ${parts[0].name} (${parts[0].part_number})`);
      }
    }

    // Vérifier les relations
    const { data: relations, error: relationsError } = await supabase
      .from('part_vehicle_fitment')
      .select('*');
    
    if (relationsError) {
      console.error('❌ Erreur relations:', relationsError.message);
    } else {
      console.log(`✅ Relations: ${relations.length} trouvées`);
    }

    // Vérifier les produits
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.error('❌ Erreur produits:', productsError.message);
    } else {
      console.log(`✅ Produits: ${products.length} trouvés`);
    }

    console.log('\n🎯 Résumé:');
    console.log(`- Véhicules: ${vehicles?.length || 0}/10`);
    console.log(`- Pièces: ${parts?.length || 0}/20+`);
    console.log(`- Relations: ${relations?.length || 0}/50+`);
    console.log(`- Produits: ${products?.length || 0}`);

    if ((vehicles?.length || 0) >= 10 && (parts?.length || 0) >= 20 && (relations?.length || 0) >= 50) {
      console.log('\n🎉 Base de données correctement configurée !');
    } else {
      console.log('\n⚠️  Base de données incomplète. Exécutez le script SQL.');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

checkDatabaseStatus();
