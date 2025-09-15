// Script pour corriger les produits
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Données des produits avec catégories valides
const products = [
  { name: 'Samsung Galaxy S24', description: 'Smartphone Samsung Galaxy S24 128GB', price_krw: 1200000, category: 'electronics', image_url: '/samsung-galaxy-s24.jpg' },
  { name: 'MacBook Pro M3', description: 'MacBook Pro 14" avec puce M3', price_krw: 2800000, category: 'electronics', image_url: '/macbook-pro-m3.jpg' },
  { name: 'LG Réfrigérateur', description: 'Réfrigérateur LG 500L', price_krw: 1500000, category: 'appliances', image_url: '/lg-refrigerator.jpg' }
];

async function fixProducts() {
  console.log('🔧 Correction des produits...\n');

  try {
    // Insérer les produits avec les bonnes catégories
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (productsError) {
      console.error('❌ Erreur produits:', productsError.message);
    } else {
      console.log(`✅ ${insertedProducts.length} produits insérés`);
    }

    // Vérification finale
    const { data: finalProducts } = await supabase.from('products').select('*');
    console.log(`✅ Produits: ${finalProducts?.length || 0}/3`);

    if ((finalProducts?.length || 0) >= 3) {
      console.log('\n🎉 Tous les produits sont maintenant disponibles !');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

fixProducts();
