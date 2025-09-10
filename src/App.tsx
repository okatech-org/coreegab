import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/components/NotificationSystem";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ClientDashboard from "./pages/ClientDashboard";
import CommercialDashboard from "./pages/CommercialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Boutique from "./pages/Boutique";
import Checkout from "./pages/Checkout";
import AdminImport from "./pages/AdminImport";
import PhoneAuth from "./pages/PhoneAuth";
import NotFound from "./pages/NotFound";
import Calculator from "./pages/Calculator";
import AISearch from "./pages/AISearch";
import CommercialChat from "./pages/CommercialChat";
import ChatbotWidget from "./components/ChatbotWidget";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<PhoneAuth />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/search" element={<AISearch />} />
            <Route path="/ai-search" element={<Navigate to="/search" replace />} />
            <Route path="/commercial-chat" element={<Navigate to="/chat" replace />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route path="/signin" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />
            <Route path="/register" element={<Navigate to="/auth" replace />} />
            
            {/* Route de checkout protégée */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            
            {/* Routes protégées par rôle */}
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commercial-dashboard" 
              element={
                <ProtectedRoute requiredRole="commercial">
                  <CommercialDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <CommercialChat />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/import" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminImport />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Widget de chat disponible sur toutes les pages */}
          <ChatbotWidget />
        </BrowserRouter>
        </TooltipProvider>
        </LanguageProvider>
        </CurrencyProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
