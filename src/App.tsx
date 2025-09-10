import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClientDashboard from "./pages/ClientDashboard";
import CommercialDashboard from "./pages/CommercialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Boutique from "./pages/Boutique";
import AdminImport from "./pages/AdminImport";
import PhoneAuth from "./pages/PhoneAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/admin/import" element={<AdminImport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
