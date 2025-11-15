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
import RoutingDebugPanel from "@/components/debug/RoutingDebugPanel";

const queryClient = new QueryClient();

// Cookie helpers for cross-context route persistence
const setRouteCookie = (path: string) => {
  try {
    if (!path || !path.startsWith('/')) return;
    document.cookie = `preferredPreviewRoute=${encodeURIComponent(path)}; Max-Age=604800; Path=/; SameSite=Lax`;
    console.log('[routing] cookie set preferredPreviewRoute', path);
  } catch (e) {
    console.log('[routing] cookie set error', e);
  }
};

const getRouteCookie = (): string | null => {
  try {
    const match = document.cookie.split('; ').find(c => c.startsWith('preferredPreviewRoute='));
    if (!match) return null;
    const val = decodeURIComponent(match.split('=')[1] || '');
    return val || null;
  } catch (e) {
    console.log('[routing] cookie read error', e);
    return null;
  }
};

const getDefaultRoute = () => {
  try {
    const hash = window.location?.hash?.toLowerCase?.() || '';
    console.log('[routing] getDefaultRoute env:', {
      origin: window.location.origin,
      pathname: window.location.pathname,
      hash,
      isTopWindow: window.top === window.self,
      cookieEnabled: navigator.cookieEnabled
    });
    
    if (hash === '#onboarding-step-5') {
      console.log('[routing] hash indicates onboarding step 5');
      return '/onboarding/step-5';
    }
    
    let lsRoute = null;
    let ckRoute = null;
    
    try {
      const stored = localStorage.getItem('preferredPreviewRoute');
      lsRoute = stored?.toLowerCase();
    } catch (lsError) {
      console.log('[routing] localStorage read error:', lsError);
    }
    
    try {
      ckRoute = getRouteCookie()?.toLowerCase();
    } catch (ckError) {
      console.log('[routing] cookie read error:', ckError);
    }
    
    console.log('[routing] preferredPreviewRoute:', lsRoute, 'cookie:', ckRoute, 'hash:', hash);
    
    if (lsRoute && lsRoute.startsWith('/')) return lsRoute;
    if (ckRoute && ckRoute.startsWith('/')) return ckRoute;
    return '/homepage';
  } catch (e) {
    console.log('[routing] getDefaultRoute error', e);
    return '/homepage';
  }
};

const RouteWatcher = () => {
  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    console.log('[routing] RouteWatcher path:', path);
    if (path === '/onboarding/step-5') {
      console.log('[routing] setting preferredPreviewRoute to /onboarding/step-5');
      localStorage.setItem('preferredPreviewRoute', '/onboarding/step-5');
      setRouteCookie('/onboarding/step-5');
    } else if (!path.startsWith('/onboarding') && path !== '/') {
      console.log('[routing] updating preferredPreviewRoute to', path);
      localStorage.setItem('preferredPreviewRoute', path);
      setRouteCookie(path);
    }
  }, [location.pathname]);
  
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
        <RouteWatcher />
        <RoutingDebugPanel />
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
