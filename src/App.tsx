
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pro from "./pages/Pro";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contacts from "./pages/Contacts";
import CatAnalysis from "./pages/CatAnalysis";
import DogAnalysis from "./pages/DogAnalysis";
import AboutUs from "./pages/AboutUs";
import ScopriPetScanPro from "./pages/ScopriPetScanPro";
import InserisciProd from "./pages/InserisciProd";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pro" element={<Pro />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/analisi-gatto" element={<CatAnalysis />} />
          <Route path="/analisi-cane" element={<DogAnalysis />} />
          <Route path="/chi-ce-dietro" element={<AboutUs />} />
          <Route path="/scopri-petscan-pro" element={<ScopriPetScanPro />} />
          <Route path="/inserisci-prod" element={<InserisciProd />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
