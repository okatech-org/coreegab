// Script pour ajouter plus de pièces automobiles
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpxsyxbxbilqyikmyznf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZweHN5eGJ4YmlscXlpa215em5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0OTMxMjQsImV4cCI6MjA3MzA2OTEyNH0._FiLlN7wR9-A85SPPCS3jY1B2oFrBnTFbJFSDg_duWw';

const supabase = createClient(supabaseUrl, supabaseKey);

// Pièces supplémentaires pour enrichir la boutique
const additionalParts = [
  // Filtres supplémentaires
  { part_number: '28113-2E300', oem_number: '28113-2E301', name: 'Filtre à air haute performance', description: 'Filtre à air haute performance pour moteurs turbocompressés', brand: 'K&N', price_krw: 25000, stock_quantity: 15, image_url: '/src/assets/parts/air-filter.svg' },
  { part_number: '26300-35510', oem_number: '26300-35511', name: 'Filtre à huile longue durée', description: 'Filtre à huile longue durée 20 000 km', brand: 'Mann-Filter', price_krw: 12000, stock_quantity: 30, image_url: '/src/assets/parts/oil-filter.svg' },
  { part_number: '28113-2E400', oem_number: '28113-2E401', name: 'Filtre à carburant', description: 'Filtre à carburant haute pression', brand: 'Bosch', price_krw: 18000, stock_quantity: 20, image_url: '/src/assets/parts/air-filter.svg' },

  // Freinage supplémentaire
  { part_number: '58101-D3A10', oem_number: '58101-D3A11', name: 'Disques de frein arrière', description: 'Disques de frein arrière ventilés', brand: 'Brembo', price_krw: 75000, stock_quantity: 8, image_url: '/src/assets/parts/brake-pads.svg' },
  { part_number: '58101-D3A20', oem_number: '58101-D3A21', name: 'Étriers de frein', description: 'Étriers de frein avant 4 pistons', brand: 'Brembo', price_krw: 120000, stock_quantity: 4, image_url: '/src/assets/parts/brake-pads.svg' },
  { part_number: '58101-D3A30', oem_number: '58101-D3A31', name: 'Liquide de frein', description: 'Liquide de frein DOT 4 haute performance', brand: 'Motul', price_krw: 8000, stock_quantity: 25, image_url: '/src/assets/parts/brake-pads.svg' },

  // Allumage supplémentaire
  { part_number: '18890-2E010', oem_number: '18890-2E011', name: 'Bobine d\'allumage', description: 'Bobine d\'allumage haute tension', brand: 'NGK', price_krw: 35000, stock_quantity: 12, image_url: '/src/assets/parts/spark-plugs.svg' },
  { part_number: '18890-2E020', oem_number: '18890-2E021', name: 'Fils de bougies', description: 'Fils de bougies haute performance', brand: 'NGK', price_krw: 15000, stock_quantity: 18, image_url: '/src/assets/parts/spark-plugs.svg' },

  // Distribution supplémentaire
  { part_number: '24400-2E010', oem_number: '24400-2E011', name: 'Tendeur de courroie', description: 'Tendeur de courroie de distribution automatique', brand: 'Gates', price_krw: 28000, stock_quantity: 10, image_url: '/src/assets/parts/timing-belt.svg' },
  { part_number: '24400-2E020', oem_number: '24400-2E021', name: 'Galet tendeur', description: 'Galet tendeur de courroie de distribution', brand: 'Gates', price_krw: 22000, stock_quantity: 8, image_url: '/src/assets/parts/timing-belt.svg' },

  // Refroidissement supplémentaire
  { part_number: '21100-2E010', oem_number: '21100-2E011', name: 'Radiateur', description: 'Radiateur aluminium haute performance', brand: 'Koyo', price_krw: 85000, stock_quantity: 6, image_url: '/src/assets/parts/water-pump.svg' },
  { part_number: '21100-2E020', oem_number: '21100-2E021', name: 'Thermostat', description: 'Thermostat moteur 82°C', brand: 'Wahler', price_krw: 12000, stock_quantity: 15, image_url: '/src/assets/parts/water-pump.svg' },
  { part_number: '21100-2E030', oem_number: '21100-2E031', name: 'Ventilateur de radiateur', description: 'Ventilateur de radiateur électrique', brand: 'Valeo', price_krw: 45000, stock_quantity: 8, image_url: '/src/assets/parts/water-pump.svg' },

  // Électrique supplémentaire
  { part_number: '37300-2E010', oem_number: '37300-2E011', name: 'Régulateur de tension', description: 'Régulateur de tension alternateur', brand: 'Denso', price_krw: 18000, stock_quantity: 12, image_url: '/src/assets/parts/alternator.svg' },
  { part_number: '31100-2E010', oem_number: '31100-2E011', name: 'Solinéide de démarreur', description: 'Solinéide de démarreur haute performance', brand: 'Mitsubishi', price_krw: 25000, stock_quantity: 8, image_url: '/placeholder-parts.svg' },
  { part_number: 'BAT-2E010', oem_number: 'BAT-2E011', name: 'Batterie 12V 80Ah', description: 'Batterie haute capacité 12V 80Ah', brand: 'Varta', price_krw: 28000, stock_quantity: 10, image_url: '/src/assets/parts/battery.svg' },

  // Éclairage supplémentaire
  { part_number: '92101-2E010', oem_number: '92101-2E011', name: 'Phare antibrouillard', description: 'Phare antibrouillard LED', brand: 'Osram', price_krw: 35000, stock_quantity: 12, image_url: '/src/assets/parts/headlight.svg' },
  { part_number: '92111-2E010', oem_number: '92111-2E011', name: 'Feu de recul LED', description: 'Feu de recul LED haute luminosité', brand: 'Philips', price_krw: 15000, stock_quantity: 15, image_url: '/src/assets/parts/headlight.svg' },
  { part_number: '92101-2E020', oem_number: '92101-2E021', name: 'Clignotant LED', description: 'Clignotant LED dynamique', brand: 'Osram', price_krw: 12000, stock_quantity: 20, image_url: '/src/assets/parts/headlight.svg' },

  // Suspension supplémentaire
  { part_number: '54500-2E010', oem_number: '54500-2E011', name: 'Amortisseur arrière', description: 'Amortisseur arrière hydraulique', brand: 'Bilstein', price_krw: 85000, stock_quantity: 6, image_url: '/placeholder-parts.svg' },
  { part_number: '54500-2E020', oem_number: '54500-2E021', name: 'Ressort de suspension arrière', description: 'Ressort hélicoïdal pour suspension arrière', brand: 'Eibach', price_krw: 55000, stock_quantity: 8, image_url: '/placeholder-parts.svg' },
  { part_number: '54500-2E030', oem_number: '54500-2E031', name: 'Bras de suspension', description: 'Bras de suspension inférieur', brand: 'Lemförder', price_krw: 45000, stock_quantity: 10, image_url: '/placeholder-parts.svg' },

  // Transmission supplémentaire
  { part_number: '23200-2E010', oem_number: '23200-2E011', name: 'Disque d\'embrayage', description: 'Disque d\'embrayage haute performance', brand: 'Luk', price_krw: 65000, stock_quantity: 5, image_url: '/placeholder-parts.svg' },
  { part_number: '23200-2E020', oem_number: '23200-2E021', name: 'Mécanisme d\'embrayage', description: 'Mécanisme d\'embrayage complet', brand: 'Valeo', price_krw: 85000, stock_quantity: 4, image_url: '/placeholder-parts.svg' },

  // Climatisation supplémentaire
  { part_number: '97133-2E010', oem_number: '97133-2E011', name: 'Filtre habitacle HEPA', description: 'Filtre habitacle HEPA avec charbon actif', brand: 'Mann-Filter', price_krw: 18000, stock_quantity: 20, image_url: '/src/assets/parts/air-filter.svg' },
  { part_number: '97133-2E020', oem_number: '97133-2E021', name: 'Compresseur climatisation', description: 'Compresseur climatisation haute efficacité', brand: 'Denso', price_krw: 120000, stock_quantity: 3, image_url: '/src/assets/parts/air-filter.svg' },

  // Lubrifiants supplémentaires
  { part_number: 'OIL-0W20', oem_number: 'OIL-0W20-001', name: 'Huile moteur 0W-20', description: 'Huile moteur synthétique 0W-20', brand: 'Shell', price_krw: 28000, stock_quantity: 15, image_url: '/placeholder-parts.svg' },
  { part_number: 'OIL-5W40', oem_number: 'OIL-5W40-001', name: 'Huile moteur 5W-40', description: 'Huile moteur synthétique 5W-40', brand: 'Mobil', price_krw: 32000, stock_quantity: 12, image_url: '/placeholder-parts.svg' },
  { part_number: 'COOLANT-G13-PLUS', oem_number: 'COOLANT-G13-PLUS-001', name: 'Liquide de refroidissement G13+', description: 'Liquide de refroidissement G13+ longue durée', brand: 'Prestone', price_krw: 18000, stock_quantity: 20, image_url: '/placeholder-parts.svg' }
];

async function addMoreParts() {
  console.log('🚀 Ajout de pièces supplémentaires à la boutique...\n');

  try {
    // Vérifier le nombre actuel de pièces
    const { data: currentParts } = await supabase
      .from('parts')
      .select('*');

    console.log(`📦 ${currentParts?.length || 0} pièces actuelles`);

    if ((currentParts?.length || 0) >= 50) {
      console.log('✅ Suffisamment de pièces déjà présentes');
      return;
    }

    // Insérer les nouvelles pièces
    console.log('🔧 Insertion des pièces supplémentaires...');
    const { data: insertedParts, error: partsError } = await supabase
      .from('parts')
      .insert(additionalParts)
      .select();

    if (partsError) {
      console.error('❌ Erreur pièces:', partsError.message);
      return;
    }

    console.log(`✅ ${insertedParts.length} pièces supplémentaires insérées`);

    // Récupérer les véhicules pour créer des relations
    const { data: vehicles } = await supabase.from('vehicles').select('*');
    
    if (vehicles && vehicles.length > 0) {
      console.log('🔗 Création des relations de compatibilité...');
      
      // Créer des relations pour les nouvelles pièces
      const relations = [];
      
      insertedParts.forEach(part => {
        // Relations basées sur le type de pièce
        if (part.part_number.includes('28113') || part.part_number.includes('26300') || part.part_number.includes('OIL') || part.part_number.includes('COOLANT')) {
          // Pièces universelles - compatibles avec tous les véhicules
          vehicles.forEach(vehicle => {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          });
        } else if (part.part_number.includes('58101') || part.part_number.includes('54500')) {
          // Pièces de freinage et suspension - compatibles avec Tucson et Sportage
          vehicles.forEach(vehicle => {
            if (vehicle.model === 'Tucson' || vehicle.model === 'Sportage') {
              relations.push({
                part_id: part.id,
                vehicle_id: vehicle.id
              });
            }
          });
        } else {
          // Autres pièces - compatibles avec la plupart des véhicules
          vehicles.forEach(vehicle => {
            relations.push({
              part_id: part.id,
              vehicle_id: vehicle.id
            });
          });
        }
      });

      // Insérer les relations par lots
      const batchSize = 50;
      let insertedRelations = 0;

      for (let i = 0; i < relations.length; i += batchSize) {
        const batch = relations.slice(i, i + batchSize);
        const { error: batchError } = await supabase
          .from('part_vehicle_fitment')
          .insert(batch);

        if (!batchError) {
          insertedRelations += batch.length;
        }
      }

      console.log(`✅ ${insertedRelations} relations créées`);
    }

    // Vérification finale
    console.log('\n🔍 Vérification finale...');
    const { data: finalParts } = await supabase.from('parts').select('*');
    const { data: finalRelations } = await supabase.from('part_vehicle_fitment').select('*');

    console.log(`✅ Pièces totales: ${finalParts?.length || 0}`);
    console.log(`✅ Relations totales: ${finalRelations?.length || 0}`);

    if ((finalParts?.length || 0) >= 50) {
      console.log('\n🎉 Boutique de pièces automobiles complète !');
      console.log('🔄 Rechargez l\'application pour voir toutes les pièces.');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

addMoreParts();
