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
import Step6ConversationsTour from "./pages/onboarding/Step6ConversationsTour";
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
    const fullUrl = window.location.href;
    console.log('Full URL:', fullUrl);
    
    // Method 1: Current path
    const currentPath = window.location.pathname;
    if (currentPath && currentPath !== '/' && currentPath.startsWith('/')) {
      console.log('Using current path:', currentPath);
      return currentPath;
    }

    // Method 2: Extract route from URL using patterns
    // Matches: /onboarding/step-2, /messages, /reminders, etc.
    const routePatterns = [
      // Onboarding pages (already working)
      /\/(onboarding\/step-\d+[a-z]?)\b/i,
      
      // Main pages - match the word boundaries exactly
      /\b(\/messages)\b/i,
      /\b(\/reminders)\b/i,
      /\b(\/chatbot)\b/i,
      /\b(\/guests)\b/i,
      /\b(\/homepage)\b/i,
      /\b(\/landing)\b/i,
      /\b(\/settings)\b/i,
      /\b(\/profile)\b/i,
      
      // Hyphenated pages
      /\b(\/wedding-details)\b/i,
      /\b(\/help-support)\b/i,
      
      // Dashboard variants
      /\b(\/dashboard[^\/\s]*)\b/i
    ];

    for (const pattern of routePatterns) {
      const match = fullUrl.match(pattern);
      if (match && match[1]) {
        let route = match[1];
        // Ensure route starts with /
        if (!route.startsWith('/')) {
          route = '/' + route;
        }
        // Remove any trailing junk
        route = route.split(/[?#\s]/)[0];
        console.log('Extracted and cleaned route:', route);
        return route;
      }
    }

    // Method 3: URL parameters
    const url = new URL(fullUrl);
    const params = url.searchParams;
    for (const key of ['route', 'path', 'preview']) {
      const val = params.get(key);
      if (val && val.startsWith('/')) {
        console.log('Using URL param:', val);
        return val;
      }
    }

    // Method 4: LocalStorage fallback
    const stored = localStorage.getItem('preferredPreviewRoute');
    if (stored && stored.startsWith('/')) {
      console.log('Using localStorage:', stored);
      return stored;
    }

    console.log('Using default: /homepage');
    return '/homepage';
  } catch (e) {
    console.log('Route error:', e);
    return '/homepage';
  }
};

const RouteWatcher = () => {
  return null;
};

const DefaultRouteNavigator = () => {
  const route = getDefaultRoute();
  console.log('[DefaultRouteNavigator] Navigating to:', route);
  return <Navigate to={route} replace />;
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
            <Route path="/" element={<DefaultRouteNavigator />} />
            <Route path="/landing" element={<Index />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/onboarding/step-1a" element={<Step1A />} />
            <Route path="/onboarding/step-1b" element={<Step1B />} />
            <Route path="/onboarding/step-1c" element={<Step1C />} />
            <Route path="/onboarding/step-2" element={<Step2 />} />
            <Route path="/onboarding/step-3" element={<Step3 />} />
            <Route path="/onboarding/step-4" element={<Step4 />} />
            <Route path="/onboarding/step-5" element={<Step5HomepageTour />} />
            <Route path="/onboarding/step-6" element={<Step6ConversationsTour />} />
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
