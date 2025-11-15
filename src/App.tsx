import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { WeddingProvider } from "@/contexts/WeddingContext";
import { FakeDataProvider } from "@/contexts/FakeDataContext";
import Index from "./pages/Index";
import Homepage from "./pages/Homepage";
import Step1A from "./pages/onboarding/Step1A";
import Step1B from "./pages/onboarding/Step1B";
import Step1C from "./pages/onboarding/Step1C";
import Step2 from "./pages/onboarding/Step2";
import Step3 from "./pages/onboarding/Step3";
import Step4 from "./pages/onboarding/Step4";
import Step5HomepageTour from "./pages/onboarding/Step5HomepageTour";
import Dashboard1 from "./pages/Dashboard1";
import Dashboard1Alt from "./pages/Dashboard1Alt";
import Dashboard1AltSimplified from "./pages/Dashboard1Alt-Simplified";
import DashboardAlt from "./pages/DashboardAlt";
import Messages from "./pages/Messages";
import Reminders from "./pages/Reminders";
import Chatbot from "./pages/Chatbot";
import Guests from "./pages/Guests";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import WeddingDetails from "./pages/WeddingDetails";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Cookie helper for debugging
const getRouteCookie = (): string | null => {
  try {
    const match = document.cookie.split('; ').find(c => c.startsWith('preferredPreviewRoute='));
    if (!match) return null;
    const val = decodeURIComponent(match.split('=')[1] || '');
    return val || null;
  } catch (e) {
    return null;
  }
};

const getDefaultRoute = () => {
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const paramNames = ['route', 'path', 'to', 'r', 'preview', 'previewRoute', 'preferredPreviewRoute'];
    let paramRoute: string | null = null;
    for (const key of paramNames) {
      const val = params.get(key);
      if (val && val.startsWith('/')) {
        paramRoute = val;
        break;
      }
    }

    const hashRaw = window.location.hash || '';
    const hash = hashRaw.toLowerCase();
    const stored = localStorage.getItem('preferredPreviewRoute');
    const cookie = getRouteCookie();
    const currentPath = window.location.pathname;
    
    console.log('=== PREVIEW ROUTE DEBUG ===');
    console.log('Search params:', url.search);
    console.log('Param route:', paramRoute);
    console.log('Hash:', hash);
    console.log('LocalStorage raw:', stored);
    console.log('Cookie raw:', cookie);
    console.log('Current path:', currentPath);
    console.log('========================');

    if (paramRoute) {
      console.log('Using URL param route:', paramRoute);
      return paramRoute;
    }

    if (hash === '#onboarding-step-5') {
      return '/onboarding/step-5';
    }

    if (hashRaw.startsWith('#/')) {
      const fromHash = hashRaw.slice(1);
      if (fromHash.startsWith('/')) {
        console.log('Using hash path:', fromHash);
        return fromHash;
      }
    }

    if (currentPath && currentPath !== '/' && currentPath.startsWith('/')) {
      console.log('Using current path:', currentPath);
      return currentPath;
    }

    const lsRoute = stored?.toLowerCase();
    const ckRoute = cookie?.toLowerCase();

    if (lsRoute && lsRoute.startsWith('/')) {
      console.log('Using localStorage route:', lsRoute);
      return lsRoute;
    }
    if (ckRoute && ckRoute.startsWith('/')) {
      console.log('Using cookie route:', ckRoute);
      return ckRoute;
    }

    console.log('Using default: /homepage');
    return '/homepage';
  } catch (e) {
    console.log('[routing] getDefaultRoute error', e);
    return '/homepage';
  }
};

const RouteWatcher = () => {
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WeddingProvider>
      <FakeDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
            <Route path="/landing" element={<Index />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/onboarding/step-1a" element={<Step1A />} />
            <Route path="/onboarding/step-1b" element={<Step1B />} />
            <Route path="/onboarding/step-1c" element={<Step1C />} />
            <Route path="/onboarding/step-2" element={<Step2 />} />
            <Route path="/onboarding/step-3" element={<Step3 />} />
            <Route path="/onboarding/step-4" element={<Step4 />} />
            <Route path="/onboarding/step-5" element={<Step5HomepageTour />} />
            <Route path="/onboarding/Step-5" element={<Step5HomepageTour />} />
            <Route path="/onboarding/step-6" element={<Homepage />} />
            <Route path="/dashboard1" element={<Dashboard1 />} />
            <Route path="/dashboard1-alt" element={<Dashboard1Alt />} />
            <Route path="/dashboard-alt" element={<DashboardAlt />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wedding-details" element={<WeddingDetails />} />
            <Route path="/help-support" element={<HelpSupport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </FakeDataProvider>
    </WeddingProvider>
  </QueryClientProvider>
);

export default App;
