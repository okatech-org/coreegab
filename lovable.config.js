// Configuration Lovable pour déploiement automatique
export default {
  name: 'COREEGAB',
  version: '1.0.2',
  description: 'Architecture unifiée COREEGAB - Boutique simplifiée et optimisée',
  url: 'https://coreegab.lovable.app/',
  
  deployment: {
    force: true,
    trigger: 'LOVABLE_DEPLOY_TRIGGER',
    timestamp: '2025-01-15T21:15:00Z',
    status: 'READY_FOR_DEPLOYMENT'
  },
  
  architecture: {
    type: 'unified',
    boutique: {
      lines: 150,
      previous: 1178,
      optimization: '87.3%'
    },
    services: 'unified',
    hooks: 'optimized',
    fallback: 'mock_data'
  },
  
  performance: {
    console_errors: 0,
    infinite_renders: false,
    build_time: '4.25s',
    bundle_size: '507.12 kB',
    optimization: 'terser'
  },
  
  cleanup: {
    files_deleted: 20,
    components_removed: 6,
    services_unified: 3,
    hooks_optimized: 4
  },
  
  features: {
    boutique: 'simplified_stable',
    search: 'functional',
    filters: 'category_based',
    products: 'vehicles_parts_electronics',
    responsive: true,
    pwa: 'enabled'
  }
};
