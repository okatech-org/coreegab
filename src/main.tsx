import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PWAProvider } from '@/components/PWAProvider';

createRoot(document.getElementById("root")!).render(
  <PWAProvider>
    <App />
  </PWAProvider>
);
