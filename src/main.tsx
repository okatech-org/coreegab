import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";
import { PWAProvider } from '@/components/PWAProvider';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { initMonitoring, PerformanceMonitor } from './lib/monitoring';

// Initialiser le monitoring
initMonitoring();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <PWAProvider>
      <MobileOptimizedLayout showDeviceInfo={false}>
        <PerformanceMonitor>
          <App />
        </PerformanceMonitor>
      </MobileOptimizedLayout>
    </PWAProvider>
  </HelmetProvider>
);
