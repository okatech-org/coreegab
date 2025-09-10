import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";
import { PWAProvider } from '@/components/PWAProvider';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <PWAProvider>
      <MobileOptimizedLayout showDeviceInfo={false}>
        <App />
      </MobileOptimizedLayout>
    </PWAProvider>
  </HelmetProvider>
);
