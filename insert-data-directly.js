// Script pour insérer les données directement via l'API Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Données des véhicules
const vehicles = [
  { make: 'Hyundai', model: 'Tucson', year_start: 2019, year_end: 2021, engine: '2.0L 4-Cyl' },
  { make: 'Hyundai', model: 'Tucson', year_start: 2022, year_end: 2024, engine: '2.5L 4-Cyl' },
  { make: 'Hyundai', model: 'Elantra', year_start: 2020, year_end: 2023, engine: '2.0L 4-Cyl' },
  { make: 'Hyundai', model: 'Sonata', year_start: 2020, year_end: 2024, engine: '2.5L 4-Cyl' },
  { make: 'Hyundai', model: 'Santa Fe', year_start: 2019, year_end: 2023, engine: '2.4L 4-Cyl' },
  { make: 'Kia', model: 'Sportage', year_start: 2020, year_end: 2022, engine: '2.4L 4-Cyl' },
  { make: 'Kia', model: 'Sportage', year_start: 2023, year_end: 2024, engine: '2.5L 4-Cyl' },
  { make: 'Kia', model: 'Sorento', year_start: 2020, year_end: 2023, engine: '2.5L 4-Cyl' },
  { make: 'Kia', model: 'Forte', year_start: 2019, year_end: 2023, engine: '2.0L 4-Cyl' },
  { make: 'Kia', model: 'Telluride', year_start: 2020, year_end: 2024, engine: '3.8L V6' }
];

// Données des pièces
const parts = [
  { part_number: '28113-2E100', oem_number: '28113-2E000', name: 'Filtre à air', description: 'Filtre à air pour moteur 2.0L et 2.4L', brand: 'Hyundai Genuine', price_krw: 15000, stock_quantity: 25, image_url: '/src/assets/parts/air-filter.svg' },
  { part_number: '26300-35505', oem_number: '26300-35504', name: 'Filtre à huile', description: 'Filtre à huile standard', brand: 'Kia Genuine', price_krw: 8000, stock_quantity: 50, image_url: '/src/assets/parts/oil-filter.svg' },
  { part_number: '58101-D3A01', oem_number: '58101-D3A00', name: 'Plaquettes de frein avant', description: 'Plaquettes de frein avant céramique', brand: 'Hyundai Mobis', price_krw: 45000, stock_quantity: 15, image_url: '/src/assets/parts/brake-pads.svg' },
  { part_number: '18890-2E000', oem_number: '18890-2E001', name: 'Bougies d\'allumage', description: 'Bougies d\'allumage iridium', brand: 'NGK', price_krw: 12000, stock_quantity: 30, image_url: '/src/assets/parts/spark-plugs.svg' },
  { part_number: '24400-2E000', oem_number: '24400-2E001', name: 'Courroie de distribution', description: 'Courroie de distribution renforcée', brand: 'Gates', price_krw: 35000, stock_quantity: 8, image_url: '/src/assets/parts/timing-belt.svg' },
  { part_number: '21100-2E000', oem_number: '21100-2E001', name: 'Pompe à eau', description: 'Pompe à eau avec joint', brand: 'Hyundai Genuine', price_krw: 28000, stock_quantity: 12, image_url: '/src/assets/parts/water-pump.svg' },
  { part_number: '37300-2E000', oem_number: '37300-2E001', name: 'Alternateur', description: 'Alternateur 120A', brand: 'Denso', price_krw: 65000, stock_quantity: 6, image_url: '/src/assets/parts/alternator.svg' },
  { part_number: '31100-2E000', oem_number: '31100-2E001', name: 'Démarreur', description: 'Démarreur haute performance', brand: 'Mitsubishi', price_krw: 42000, stock_quantity: 8, image_url: '/placeholder-parts.svg' },
  { part_number: 'BAT-2E000', oem_number: 'BAT-2E001', name: 'Batterie', description: 'Batterie 12V 60Ah', brand: 'Varta', price_krw: 18000, stock_quantity: 20, image_url: '/src/assets/parts/battery.svg' },
  { part_number: '92101-2E000', oem_number: '92101-2E001', name: 'Phare avant LED', description: 'Phare avant LED avec DRL', brand: 'Hyundai Genuine', price_krw: 85000, stock_quantity: 4, image_url: '/src/assets/parts/headlight.svg' },
  { part_number: '28113-2E200', oem_number: '28113-2E201', name: 'Filtre à air habitacle', description: 'Filtre à air pour système de climatisation', brand: 'Hyundai Genuine', price_krw: 12000, stock_quantity: 30, image_url: '/src/assets/parts/air-filter.svg' },
  { part_number: '58101-D3A02', oem_number: '58101-D3A03', name: 'Plaquettes de frein arrière', description: 'Plaquettes de frein arrière céramique', brand: 'Hyundai Mobis', price_krw: 38000, stock_quantity: 20, image_url: '/src/assets/parts/brake-pads.svg' },
  { part_number: '58101-D3A03', oem_number: '58101-D3A04', name: 'Disques de frein avant', description: 'Disques de frein avant ventilés', brand: 'Hyundai Mobis', price_krw: 85000, stock_quantity: 8, image_url: '/src/assets/parts/brake-pads.svg' },
  { part_number: '18890-2E001', oem_number: '18890-2E002', name: 'Bougies d\'allumage haute performance', description: 'Bougies d\'allumage iridium pour moteurs 2.5L', brand: 'NGK', price_krw: 15000, stock_quantity: 25, image_url: '/src/assets/parts/spark-plugs.svg' },
  { part_number: '24400-2E001', oem_number: '24400-2E002', name: 'Courroie de distribution 2.5L', description: 'Courroie de distribution pour moteurs 2.5L', brand: 'Gates', price_krw: 42000, stock_quantity: 6, image_url: '/src/assets/parts/timing-belt.svg' },
  { part_number: '21100-2E001', oem_number: '21100-2E002', name: 'Pompe à eau 2.5L', description: 'Pompe à eau pour moteurs 2.5L', brand: 'Hyundai Genuine', price_krw: 32000, stock_quantity: 10, image_url: '/src/assets/parts/water-pump.svg' },
  { part_number: '37300-2E001', oem_number: '37300-2E002', name: 'Alternateur 150A', description: 'Alternateur haute performance 150A', brand: 'Denso', price_krw: 75000, stock_quantity: 4, image_url: '/src/assets/parts/alternator.svg' },
  { part_number: '31100-2E001', oem_number: '31100-2E002', name: 'Démarreur haute performance', description: 'Démarreur pour moteurs 2.5L', brand: 'Mitsubishi', price_krw: 48000, stock_quantity: 6, image_url: '/placeholder-parts.svg' },
  { part_number: 'BAT-2E001', oem_number: 'BAT-2E002', name: 'Batterie 12V 70Ah', description: 'Batterie haute capacité 12V 70Ah', brand: 'Varta', price_krw: 22000, stock_quantity: 15, image_url: '/src/assets/parts/battery.svg' },
  { part_number: '92111-2E000', oem_number: '92111-2E001', name: 'Feu arrière LED', description: 'Feu arrière LED avec clignotant', brand: 'Hyundai Genuine', price_krw: 45000, stock_quantity: 8, image_url: '/src/assets/parts/headlight.svg' },
  { part_number: '54500-2E000', oem_number: '54500-2E001', name: 'Amortisseur avant', description: 'Amortisseur avant hydraulique', brand: 'Sachs', price_krw: 75000, stock_quantity: 6, image_url: '/placeholder-parts.svg' },
  { part_number: '54500-2E001', oem_number: '54500-2E002', name: 'Ressort de suspension', description: 'Ressort hélicoïdal pour suspension avant', brand: 'Sachs', price_krw: 45000, stock_quantity: 8, image_url: '/placeholder-parts.svg' },
  { part_number: '23200-2E000', oem_number: '23200-2E001', name: 'Kit embrayage', description: 'Kit embrayage complet', brand: 'Luk', price_krw: 120000, stock_quantity: 3, image_url: '/placeholder-parts.svg' },
  { part_number: '97133-2E000', oem_number: '97133-2E001', name: 'Filtre habitacle', description: 'Filtre habitacle avec charbon actif', brand: 'Hyundai Genuine', price_krw: 12000, stock_quantity: 25, image_url: '/src/assets/parts/air-filter.svg' },
  { part_number: 'OIL-5W30', oem_number: 'OIL-5W30-001', name: 'Huile moteur 5W-30', description: 'Huile moteur synthétique 5W-30', brand: 'Shell', price_krw: 25000, stock_quantity: 20, image_url: '/placeholder-parts.svg' },
  { part_number: 'COOLANT-G12', oem_number: 'COOLANT-G12-001', name: 'Liquide de refroidissement', description: 'Liquide de refroidissement G12+', brand: 'Hyundai Genuine', price_krw: 15000, stock_quantity: 18, image_url: '/placeholder-parts.svg' }
];

// Données des produits génériques
const products = [
  { name: 'Samsung Galaxy S24', description: 'Smartphone Samsung Galaxy S24 128GB', price_krw: 1200000, category: 'smartphones', image_url: '/samsung-galaxy-s24.jpg', stock_quantity: 10 },
  { name: 'MacBook Pro M3', description: 'MacBook Pro 14" avec puce M3', price_krw: 2800000, category: 'electronics', image_url: '/macbook-pro-m3.jpg', stock_quantity: 5 },
  { name: 'LG Réfrigérateur', description: 'Réfrigérateur LG 500L', price_krw: 1500000, category: 'appliances', image_url: '/lg-refrigerator.jpg', stock_quantity: 3 }
];

async function insertData() {
  console.log('🚀 Insertion des données dans la base COREGAB...\n');

  try {
    // 1. Nettoyer les données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await supabase.from('part_vehicle_fitment').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('parts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('vehicles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insérer les véhicules
    console.log('🚗 Insertion des véhicules...');
    const { data: insertedVehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .insert(vehicles)
      .select();

    if (vehiclesError) {
      console.error('❌ Erreur véhicules:', vehiclesError.message);
      return;
    }
    console.log(`✅ ${insertedVehicles.length} véhicules insérés`);

    // 3. Insérer les pièces
    console.log('🔧 Insertion des pièces...');
    const { data: insertedParts, error: partsError } = await supabase
      .from('parts')
      .insert(parts)
      .select();

    if (partsError) {
      console.error('❌ Erreur pièces:', partsError.message);
      return;
    }
    console.log(`✅ ${insertedParts.length} pièces insérées`);

    // 4. Insérer les produits
    console.log('📦 Insertion des produits...');
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (productsError) {
      console.error('❌ Erreur produits:', productsError.message);
      return;
    }
    console.log(`✅ ${insertedProducts.length} produits insérés`);

    // 5. Créer les relations de compatibilité
    console.log('🔗 Création des relations de compatibilité...');
    const relations = [];

    // Relations pour les pièces communes (compatible avec tous les véhicules)
    const commonParts = insertedParts.filter(p => 
      ['28113-2E200', 'BAT-2E001', '97133-2E000', 'OIL-5W30', 'COOLANT-G12'].includes(p.part_number)
    );

    commonParts.forEach(part => {
      insertedVehicles.forEach(vehicle => {
        relations.push({
          part_id: part.id,
          vehicle_id: vehicle.id
        });
      });
    });

    // Relations spécifiques par modèle
    insertedParts.forEach(part => {
      if (part.part_number === '58101-D3A02' || part.part_number === '58101-D3A03') {
        // Plaquettes et disques pour Tucson et Sportage
        insertedVehicles.forEach(vehicle => {
          if (vehicle.model === 'Tucson' || vehicle.model === 'Sportage') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '18890-2E001' || part.part_number === '24400-2E001' || part.part_number === '21100-2E001' || part.part_number === '31100-2E001') {
        // Pièces pour moteurs 2.5L
        insertedVehicles.forEach(vehicle => {
          if (vehicle.engine?.includes('2.5L') || vehicle.model === 'Telluride') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '37300-2E001') {
        // Alternateur pour véhicules récents
        insertedVehicles.forEach(vehicle => {
          if (vehicle.year_start >= 2022) {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '92111-2E000') {
        // Feu arrière pour véhicules récents
        insertedVehicles.forEach(vehicle => {
          if (vehicle.year_start >= 2022) {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '54500-2E000' || part.part_number === '54500-2E001') {
        // Suspension pour Tucson et Sportage
        insertedVehicles.forEach(vehicle => {
          if (vehicle.model === 'Tucson' || vehicle.model === 'Sportage') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else if (part.part_number === '23200-2E000') {
        // Embrayage pour Elantra et Forte
        insertedVehicles.forEach(vehicle => {
          if (vehicle.model === 'Elantra' || vehicle.model === 'Forte') {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          }
        });
      } else {
        // Pièces de base pour tous les véhicules
        insertedVehicles.forEach(vehicle => {
          relations.push({
            part_id: part.id,
            vehicle_id: vehicle.id
          });
        });
      }
    });

    // Insérer les relations
    const { error: relationsError } = await supabase
      .from('part_vehicle_fitment')
      .insert(relations);

    if (relationsError) {
      console.error('❌ Erreur relations:', relationsError.message);
      return;
    }
    console.log(`✅ ${relations.length} relations créées`);

    // 6. Vérification finale
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
    } else {
      console.log('\n⚠️  Base de données partiellement peuplée.');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

insertData();
