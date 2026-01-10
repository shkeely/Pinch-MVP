import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { WeddingProvider } from "@/contexts/WeddingContext";
import { FakeDataProvider } from "@/contexts/FakeDataContext";
import Index from "./pages/Index";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import Step1A from "./pages/onboarding/Step1A";
import Step1B from "./pages/onboarding/Step1B";
import Step1C from "./pages/onboarding/Step1C";
import Step2 from "./pages/onboarding/Step2";
import Step3 from "./pages/onboarding/Step3";
import Step4 from "./pages/onboarding/Step4";
import Step5NavigationBar from "./pages/onboarding/Step5NavigationBar";
import Step6ChatbotSetup from "./pages/onboarding/Step6ChatbotSetup";
import Step7GuestPageTour from "./pages/onboarding/Step7GuestPageTour";
import Step8MessagesPage from "./pages/onboarding/Step8MessagesPage";
import Step9Homepage from "./pages/onboarding/Step9Homepage";
import Step10Finish from "./pages/onboarding/Step10Finish";
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

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

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
      /\b(\/auth)\b/i,
      
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

    // Default: send everyone to landing page
    console.log('Using default: /landing');
    return '/landing';
  } catch (e) {
    console.log('Route error:', e);
    return '/landing';
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
    <AuthProvider>
      <WeddingProvider>
        <FakeDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<DefaultRouteNavigator />} />
              <Route path="/landing" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Onboarding - protected */}
              <Route path="/onboarding/step-1a" element={<ProtectedRoute><Step1A /></ProtectedRoute>} />
              <Route path="/onboarding/step-1b" element={<ProtectedRoute><Step1B /></ProtectedRoute>} />
              <Route path="/onboarding/step-1c" element={<ProtectedRoute><Step1C /></ProtectedRoute>} />
              <Route path="/onboarding/step-2" element={<ProtectedRoute><Step2 /></ProtectedRoute>} />
              <Route path="/onboarding/step-3" element={<ProtectedRoute><Step3 /></ProtectedRoute>} />
              <Route path="/onboarding/step-4" element={<ProtectedRoute><Step4 /></ProtectedRoute>} />
              <Route path="/onboarding/step-5" element={<ProtectedRoute><Step5NavigationBar /></ProtectedRoute>} />
              <Route path="/onboarding/step-6" element={<ProtectedRoute><Step6ChatbotSetup /></ProtectedRoute>} />
              <Route path="/onboarding/step-7" element={<ProtectedRoute><Step7GuestPageTour /></ProtectedRoute>} />
              <Route path="/onboarding/step-8" element={<ProtectedRoute><Step8MessagesPage /></ProtectedRoute>} />
              <Route path="/onboarding/step-9" element={<ProtectedRoute><Step9Homepage /></ProtectedRoute>} />
              <Route path="/onboarding/step-10" element={<ProtectedRoute><Step10Finish /></ProtectedRoute>} />
              
              {/* Main app - protected */}
              <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
              <Route path="/dashboard1" element={<ProtectedRoute><Dashboard1 /></ProtectedRoute>} />
              <Route path="/dashboard1-alt" element={<ProtectedRoute><Dashboard1Alt /></ProtectedRoute>} />
              <Route path="/dashboard-alt" element={<ProtectedRoute><DashboardAlt /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
              <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wedding-details" element={<ProtectedRoute><WeddingDetails /></ProtectedRoute>} />
              <Route path="/help-support" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </FakeDataProvider>
      </WeddingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
