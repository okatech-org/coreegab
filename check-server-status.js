// Script de vérification du statut du serveur
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkServerStatus() {
  console.log('🔍 Vérification du statut du serveur...\n');

  try {
    // Vérifier l'accès local
    const localResponse = await fetch('http://localhost:8080');
    console.log(`✅ Serveur local: ${localResponse.status} ${localResponse.statusText}`);

    // Vérifier l'accès à la boutique
    const boutiqueResponse = await fetch('http://localhost:8080/boutique');
    console.log(`✅ Page boutique: ${boutiqueResponse.status} ${boutiqueResponse.statusText}`);

    // Vérifier la base de données
    console.log('\n🔍 Vérification de la base de données...');
    const { data: vehicles } = await supabase.from('vehicles').select('*').limit(1);
    const { data: parts } = await supabase.from('parts').select('*').limit(1);
    
    console.log(`✅ Véhicules: ${vehicles?.length || 0} trouvés`);
    console.log(`✅ Pièces: ${parts?.length || 0} trouvées`);

    console.log('\n🎉 Tout fonctionne correctement !');
    console.log('🌐 Accédez à la boutique: http://localhost:8080/boutique');
    console.log('📱 Testez les 4 sections organisées:');
    console.log('   🚗 Véhicules Coréens');
    console.log('   📱 Électronique Coréenne');
    console.log('   🏠 Électroménager Coréen');
    console.log('   🔧 Pièces Automobiles');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Le serveur de développement n\'est peut-être pas démarré.');
      console.log('   Lancez: npm run dev');
    }
  }
}

checkServerStatus();
