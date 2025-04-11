
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "@/pages/Index";
import Navigation from "@/pages/Navigation";
import Help from "@/pages/Help";
import Training from "@/pages/Training";
import RouteRecording from "@/pages/RouteRecording";
import NotFound from "@/pages/NotFound";
import LanguageSelector from "@/components/LanguageSelector";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <NavigationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/navigation" element={<Navigation />} />
              <Route path="/help" element={<Help />} />
              <Route path="/training" element={<Training />} />
              <Route path="/recording" element={<RouteRecording />} />
              <Route path="/language" element={<LanguageSelector />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NavigationProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;