import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";
import { PWAProvider } from '@/components/PWAProvider';
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <PWAProvider>
      <MobileOptimizedLayout showDeviceInfo={process.env.NODE_ENV === 'development'}>
        <App />
      </MobileOptimizedLayout>
    </PWAProvider>
  </HelmetProvider>
);
