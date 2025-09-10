import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index";
import ClientDashboard from "./pages/ClientDashboard";
import CommercialDashboard from "./pages/CommercialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Boutique from "./pages/Boutique";
import AdminImport from "./pages/AdminImport";
import PhoneAuth from "./pages/PhoneAuth";
import NotFound from "./pages/NotFound";
import Calculator from "./pages/Calculator";
import AISearch from "./pages/AISearch";
import CommercialChat from "./pages/CommercialChat";
import ChatbotWidget from "./components/ChatbotWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <LanguageProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<PhoneAuth />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/commercial-dashboard" element={<CommercialDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/search" element={<AISearch />} />
          <Route path="/chat" element={<CommercialChat />} />
          <Route path="/admin/import" element={<AdminImport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* Widget de chat disponible sur toutes les pages */}
        <ChatbotWidget />
      </BrowserRouter>
    </TooltipProvider>
    </LanguageProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
