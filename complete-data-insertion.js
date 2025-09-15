// Script pour compléter l'insertion des données
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Données des produits génériques (sans stock_quantity)
const products = [
  { name: 'Samsung Galaxy S24', description: 'Smartphone Samsung Galaxy S24 128GB', price_krw: 1200000, category: 'smartphones', image_url: '/samsung-galaxy-s24.jpg' },
  { name: 'MacBook Pro M3', description: 'MacBook Pro 14" avec puce M3', price_krw: 2800000, category: 'electronics', image_url: '/macbook-pro-m3.jpg' },
  { name: 'LG Réfrigérateur', description: 'Réfrigérateur LG 500L', price_krw: 1500000, category: 'appliances', image_url: '/lg-refrigerator.jpg' }
];

async function completeDataInsertion() {
  console.log('🚀 Complétion de l\'insertion des données...\n');

  try {
    // 1. Insérer les produits
    console.log('📦 Insertion des produits...');
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (productsError) {
      console.error('❌ Erreur produits:', productsError.message);
    } else {
      console.log(`✅ ${insertedProducts.length} produits insérés`);
    }

    // 2. Récupérer les véhicules et pièces existants
    console.log('📋 Récupération des données existantes...');
    const { data: vehicles } = await supabase.from('vehicles').select('*');
    const { data: parts } = await supabase.from('parts').select('*');

    if (!vehicles || !parts) {
      console.error('❌ Impossible de récupérer les véhicules ou pièces');
      return;
    }

    console.log(`📊 ${vehicles.length} véhicules et ${parts.length} pièces trouvés`);

    // 3. Créer les relations de compatibilité
    console.log('🔗 Création des relations de compatibilité...');
    const relations = [];

    // Relations pour les pièces communes (compatible avec tous les véhicules)
    const commonParts = parts.filter(p => 
      ['28113-2E200', 'BAT-2E001', '97133-2E000', 'OIL-5W30', 'COOLANT-G12'].includes(p.part_number)
    );

    commonParts.forEach(part => {
      vehicles.forEach(vehicle => {
        relations.push({
          part_id: part.id,
          vehicle_id: vehicle.id
        });
      });
    });

    // Relations spécifiques par modèle
    parts.forEach(part => {
      if (part.part_number === '58101-D3A02' || part.part_number === '58101-D3A03') {
        // Plaquettes et disques pour Tucson et Sportage
        vehicles.forEach(vehicle => {
          if (vehicle.model === 'Tucson' || vehicle.model === 'Sportage') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '18890-2E001' || part.part_number === '24400-2E001' || part.part_number === '21100-2E001' || part.part_number === '31100-2E001') {
        // Pièces pour moteurs 2.5L
        vehicles.forEach(vehicle => {
          if (vehicle.engine?.includes('2.5L') || vehicle.model === 'Telluride') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '37300-2E001') {
        // Alternateur pour véhicules récents
        vehicles.forEach(vehicle => {
          if (vehicle.year_start >= 2022) {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '92111-2E000') {
        // Feu arrière pour véhicules récents
        vehicles.forEach(vehicle => {
          if (vehicle.year_start >= 2022) {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '54500-2E000' || part.part_number === '54500-2E001') {
        // Suspension pour Tucson et Sportage
        vehicles.forEach(vehicle => {
          if (vehicle.model === 'Tucson' || vehicle.model === 'Sportage') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '23200-2E000') {
        // Embrayage pour Elantra et Forte
        vehicles.forEach(vehicle => {
          if (vehicle.model === 'Elantra' || vehicle.model === 'Forte') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else {
        // Pièces de base pour tous les véhicules
        vehicles.forEach(vehicle => {
          relations.push({
            part_id: part.id,
            vehicle_id: vehicle.id
          });
        });
      }
    });

    // Insérer les relations par lots pour éviter les limites
    console.log(`📝 Insertion de ${relations.length} relations...`);
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < relations.length; i += batchSize) {
      const batch = relations.slice(i, i + batchSize);
      const { error: batchError } = await supabase
        .from('part_vehicle_fitment')
        .insert(batch);

      if (batchError) {
        console.error(`❌ Erreur batch ${Math.floor(i/batchSize) + 1}:`, batchError.message);
      } else {
        insertedCount += batch.length;
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: ${batch.length} relations insérées`);
      }
    }

    console.log(`✅ Total: ${insertedCount} relations insérées`);

    // 4. Vérification finale
    console.log('\n🔍 Vérification finale...');
    const { data: finalVehicles } = await supabase.from('vehicles').select('*');
    const { data: finalParts } = await supabase.from('parts').select('*');
    const { data: finalRelations } = await supabase.from('part_vehicle_fitment').select('*');
    const { data: finalProducts } = await supabase.from('products').select('*');

    console.log(`✅ Véhicules: ${finalVehicles?.length || 0}/10`);
    console.log(`✅ Pièces: ${finalParts?.length || 0}/26`);
    console.log(`✅ Relations: ${finalRelations?.length || 0}/50+`);
    console.log(`✅ Produits: ${finalProducts?.length || 0}/3`);

    if ((finalVehicles?.length || 0) >= 10 && (finalParts?.length || 0) >= 20 && (finalRelations?.length || 0) >= 50) {
      console.log('\n🎉 Base de données correctement peuplée !');
      console.log('🔄 Rechargez l\'application pour voir les données.');
      console.log('\n📱 Testez maintenant:');
      console.log('1. Allez dans la Boutique');
      console.log('2. Sélectionnez un véhicule: Hyundai → Tucson → 2019');
      console.log('3. Cliquez "Chercher les pièces"');
      console.log('4. Vous devriez voir les pièces avec images !');
    } else {
      console.log('\n⚠️  Base de données partiellement peuplée.');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

completeDataInsertion();
