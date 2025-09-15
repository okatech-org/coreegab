// Script pour ajouter les produits manquants à la boutique
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Produits manquants pour la boutique
const products = [
  // Véhicules
  {
    name: 'Hyundai Tucson 2023',
    description: 'SUV Hyundai Tucson 2023, moteur 2.5L, transmission automatique',
    price_krw: 35000000,
    category: 'vehicles',
    image_url: '/src/assets/hyundai-tucson.jpg',
    weight: 1650
  },
  {
    name: 'Kia Sportage 2023',
    description: 'SUV Kia Sportage 2023, moteur 2.4L, transmission automatique',
    price_krw: 32000000,
    category: 'vehicles',
    image_url: '/src/assets/hyundai-tucson.jpg', // Utilise la même image pour la démo
    weight: 1600
  },
  {
    name: 'Hyundai Elantra 2023',
    description: 'Berline Hyundai Elantra 2023, moteur 2.0L, transmission automatique',
    price_krw: 25000000,
    category: 'vehicles',
    image_url: '/src/assets/hyundai-tucson.jpg',
    weight: 1300
  },
  {
    name: 'Kia Sorento 2023',
    description: 'SUV 7 places Kia Sorento 2023, moteur 2.5L, transmission automatique',
    price_krw: 38000000,
    category: 'vehicles',
    image_url: '/src/assets/hyundai-tucson.jpg',
    weight: 1800
  },

  // Électronique
  {
    name: 'Samsung Galaxy S24',
    description: 'Smartphone Samsung Galaxy S24 128GB, écran 6.2", Android 14',
    price_krw: 1200000,
    category: 'electronics',
    image_url: '/src/assets/samsung-galaxy-s24.jpg',
    weight: 0.2
  },
  {
    name: 'MacBook Pro M3',
    description: 'MacBook Pro 14" avec puce M3, 16GB RAM, 512GB SSD',
    price_krw: 2800000,
    category: 'electronics',
    image_url: '/src/assets/macbook-pro-m3.jpg',
    weight: 1.6
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone Samsung Galaxy S24 Ultra 256GB, écran 6.8", S Pen inclus',
    price_krw: 1800000,
    category: 'electronics',
    image_url: '/src/assets/samsung-galaxy-s24.jpg',
    weight: 0.23
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'iPad Pro 12.9" avec puce M2, 128GB, Wi-Fi + Cellular',
    price_krw: 1500000,
    category: 'electronics',
    image_url: '/src/assets/macbook-pro-m3.jpg',
    weight: 0.68
  },

  // Électroménager
  {
    name: 'LG Réfrigérateur 500L',
    description: 'Réfrigérateur LG 500L, technologie Inverter, classe énergétique A+++',
    price_krw: 1500000,
    category: 'appliances',
    image_url: '/src/assets/lg-refrigerator.jpg',
    weight: 85
  },
  {
    name: 'Samsung Lave-linge 9kg',
    description: 'Lave-linge Samsung 9kg, technologie EcoBubble, 1400 tours/min',
    price_krw: 800000,
    category: 'appliances',
    image_url: '/src/assets/lg-refrigerator.jpg',
    weight: 65
  },
  {
    name: 'LG Lave-vaisselle 14 couverts',
    description: 'Lave-vaisselle LG 14 couverts, technologie TrueSteam, classe A+++',
    price_krw: 600000,
    category: 'appliances',
    image_url: '/src/assets/lg-refrigerator.jpg',
    weight: 45
  },
  {
    name: 'Samsung Four micro-ondes 25L',
    description: 'Four micro-ondes Samsung 25L, technologie Grill, 900W',
    price_krw: 200000,
    category: 'appliances',
    image_url: '/src/assets/lg-refrigerator.jpg',
    weight: 15
  }
];

async function addMissingProducts() {
  console.log('🚀 Ajout des produits manquants à la boutique...\n');

  try {
    // Vérifier d'abord s'il y a déjà des produits
    const { data: existingProducts } = await supabase
      .from('products')
      .select('*');

    if (existingProducts && existingProducts.length > 0) {
      console.log(`📦 ${existingProducts.length} produits existants trouvés`);
      console.log('✅ Les produits sont déjà présents dans la boutique');
      return;
    }

    // Insérer les nouveaux produits
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

    // Vérification finale
    console.log('\n🔍 Vérification finale...');
    const { data: finalProducts } = await supabase.from('products').select('*');
    const { data: finalVehicles } = await supabase.from('vehicles').select('*');
    const { data: finalParts } = await supabase.from('parts').select('*');

    console.log(`✅ Produits: ${finalProducts?.length || 0}/12`);
    console.log(`✅ Véhicules: ${finalVehicles?.length || 0}/10`);
    console.log(`✅ Pièces: ${finalParts?.length || 0}/26`);

    if ((finalProducts?.length || 0) >= 12) {
      console.log('\n🎉 Tous les produits sont maintenant disponibles !');
      console.log('🔄 Rechargez l\'application pour voir les véhicules et produits.');
      console.log('\n📱 Testez maintenant:');
      console.log('1. Allez dans la Boutique');
      console.log('2. Vous devriez voir les véhicules, électronique et électroménager');
      console.log('3. Sélectionnez un véhicule pour voir les pièces compatibles');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

addMissingProducts();
