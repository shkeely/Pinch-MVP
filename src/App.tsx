import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeddingProvider } from "@/contexts/WeddingContext";
import Index from "./pages/Index";
import Step1A from "./pages/onboarding/Step1A";
import Step1B from "./pages/onboarding/Step1B";
import Step1C from "./pages/onboarding/Step1C";
import Step2 from "./pages/onboarding/Step2";
import Step3 from "./pages/onboarding/Step3";
import Step4 from "./pages/onboarding/Step4";
import Dashboard1 from "./pages/Dashboard1";
import Dashboard1Alt from "./pages/Dashboard1Alt";
import DashboardAlt from "./pages/DashboardAlt";
import Messages from "./pages/Messages";
import Reminders from "./pages/Reminders";
import Chatbot from "./pages/Chatbot";
import Guests from "./pages/Guests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WeddingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding/step-1a" element={<Step1A />} />
            <Route path="/onboarding/step-1b" element={<Step1B />} />
            <Route path="/onboarding/step-1c" element={<Step1C />} />
            <Route path="/onboarding/step-2" element={<Step2 />} />
            <Route path="/onboarding/step-3" element={<Step3 />} />
            <Route path="/onboarding/step-4" element={<Step4 />} />
            <Route path="/dashboard1" element={<Dashboard1 />} />
            <Route path="/dashboard1-alt" element={<Dashboard1Alt />} />
            <Route path="/dashboard-alt" element={<DashboardAlt />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/guests" element={<Guests />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WeddingProvider>
  </QueryClientProvider>
);

export default App;
