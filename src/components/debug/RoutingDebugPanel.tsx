import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// Duplicate getDefaultRoute logic for display
const computeDefaultRoute = () => {
  try {
    const hash = window.location?.hash?.toLowerCase?.() || '';
    if (hash === '#onboarding-step-5') return '/onboarding/step-5 (from hash)';
    
    const stored = localStorage.getItem('preferredPreviewRoute');
    const lsRoute = stored?.toLowerCase();
    const match = document.cookie.split('; ').find(c => c.startsWith('preferredPreviewRoute='));
    const ckRoute = match ? decodeURIComponent(match.split('=')[1] || '').toLowerCase() : null;
    
    if (lsRoute && lsRoute.startsWith('/')) return `${lsRoute} (from localStorage)`;
    if (ckRoute && ckRoute.startsWith('/')) return `${ckRoute} (from cookie)`;
    return '/homepage (fallback)';
  } catch (e) {
    return `Error: ${e}`;
  }
};

export default function RoutingDebugPanel() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selfTest, setSelfTest] = useState({ localStorage: '', cookie: '' });

  useEffect(() => {
    // Check for ?debugRouting=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('debugRouting') === '1') {
      setIsOpen(true);
    }

    // Alt+D hotkey
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Run self-tests
    const timestamp = Date.now().toString();
    
    // localStorage test
    try {
      localStorage.setItem('routing_self_test', timestamp);
      const readBack = localStorage.getItem('routing_self_test');
      setSelfTest(prev => ({ 
        ...prev, 
        localStorage: readBack === timestamp ? '✅ Working' : '❌ Read mismatch' 
      }));
    } catch (e) {
      setSelfTest(prev => ({ ...prev, localStorage: `❌ Error: ${e}` }));
    }

    // Cookie test
    try {
      document.cookie = `routing_self_test=${timestamp}; SameSite=Lax; Path=/`;
      const match = document.cookie.split('; ').find(c => c.startsWith('routing_self_test='));
      const readBack = match ? match.split('=')[1] : null;
      setSelfTest(prev => ({ 
        ...prev, 
        cookie: readBack === timestamp ? '✅ Working' : '❌ Read mismatch' 
      }));
    } catch (e) {
      setSelfTest(prev => ({ ...prev, cookie: `❌ Error: ${e}` }));
    }
  }, [isOpen]);

  const getPreferredRoute = () => {
    try {
      return localStorage.getItem('preferredPreviewRoute') || '(empty)';
    } catch {
      return '(error)';
    }
  };

  const getRouteCookie = () => {
    try {
      const match = document.cookie.split('; ').find(c => c.startsWith('preferredPreviewRoute='));
      return match ? decodeURIComponent(match.split('=')[1] || '') : '(empty)';
    } catch {
      return '(error)';
    }
  };

  const handleSetRoute = () => {
    const path = location.pathname;
    try {
      localStorage.setItem('preferredPreviewRoute', path);
      document.cookie = `preferredPreviewRoute=${encodeURIComponent(path)}; Max-Age=604800; Path=/; SameSite=Lax`;
      toast.success(`Set preferred route to ${path}`);
    } catch (e) {
      toast.error(`Failed to set route: ${e}`);
    }
  };

  const handleClearRoute = () => {
    try {
      localStorage.removeItem('preferredPreviewRoute');
      document.cookie = 'preferredPreviewRoute=; Max-Age=0; Path=/';
      toast.success('Cleared preferred route');
    } catch (e) {
      toast.error(`Failed to clear route: ${e}`);
    }
  };

  const handleOpenInNewTab = () => {
    const url = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
    window.open(url, '_blank', 'noopener');
    toast.success('Opened in new tab');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-[9999] shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        🐛 Debug Routing
      </Button>
    );
  }

  const isTopWindow = window.top === window.self;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[500px] max-h-[80vh] overflow-auto bg-card border-2 border-primary/20 rounded-lg shadow-2xl p-4 text-xs font-mono">
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <h3 className="font-bold text-sm">🐛 Routing Debug Panel</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Environment */}
        <section>
          <h4 className="font-semibold text-primary mb-1">Environment</h4>
          <div className="space-y-1 pl-2">
            <div className="flex justify-between">
              <span>Origin:</span>
              <code className="text-primary">{window.location.origin}</code>
            </div>
            <div className="flex justify-between">
              <span>Host:</span>
              <code className="text-primary">{window.location.host}</code>
            </div>
            <div className="flex justify-between">
              <span>Is Top Window:</span>
              <code className="text-primary">{isTopWindow ? 'Yes' : 'No (iframe)'}</code>
            </div>
            <div className="flex justify-between">
              <span>Cookies Enabled:</span>
              <code className="text-primary">{navigator.cookieEnabled ? 'Yes' : 'No'}</code>
            </div>
            <div className="flex justify-between">
              <span>Referrer:</span>
              <code className="text-primary">{document.referrer ? `${document.referrer.slice(0, 30)}...` : '(none)'}</code>
            </div>
          </div>
        </section>

        {/* Current Location */}
        <section>
          <h4 className="font-semibold text-primary mb-1">Current Location</h4>
          <div className="space-y-1 pl-2">
            <div className="flex justify-between gap-2">
              <span>pathname:</span>
              <code className="text-primary break-all">{location.pathname}</code>
            </div>
            <div className="flex justify-between gap-2">
              <span>search:</span>
              <code className="text-primary">{location.search || '(empty)'}</code>
            </div>
            <div className="flex justify-between gap-2">
              <span>hash:</span>
              <code className="text-primary">{location.hash || '(empty)'}</code>
            </div>
          </div>
        </section>

        {/* Storage Values */}
        <section>
          <h4 className="font-semibold text-primary mb-1">Storage Values</h4>
          <div className="space-y-1 pl-2">
            <div className="flex justify-between gap-2">
              <span>localStorage:</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => copyToClipboard(getPreferredRoute())}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <code className="block text-primary pl-4 break-all">{getPreferredRoute()}</code>
            
            <div className="flex justify-between gap-2">
              <span>cookie:</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => copyToClipboard(getRouteCookie())}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <code className="block text-primary pl-4 break-all">{getRouteCookie()}</code>

            <div className="flex justify-between gap-2">
              <span>Raw cookie string:</span>
            </div>
            <code className="block text-primary pl-4 break-all text-[10px]">
              {document.cookie || '(empty)'}
            </code>
          </div>
        </section>

        {/* Self Tests */}
        <section>
          <h4 className="font-semibold text-primary mb-1">Storage Self-Tests</h4>
          <div className="space-y-1 pl-2">
            <div className="flex justify-between">
              <span>localStorage:</span>
              <code className="text-primary">{selfTest.localStorage}</code>
            </div>
            <div className="flex justify-between">
              <span>Cookie:</span>
              <code className="text-primary">{selfTest.cookie}</code>
            </div>
          </div>
        </section>

        {/* Computed Default Route */}
        <section>
          <h4 className="font-semibold text-primary mb-1">Computed Default Route</h4>
          <code className="block text-primary pl-2 break-all">{computeDefaultRoute()}</code>
        </section>

        {/* Actions */}
        <section className="space-y-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleSetRoute}
          >
            Set preferred route to current path
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleClearRoute}
          >
            Clear preferred route
          </Button>
          <Button
            variant="default"
            size="sm"
            className="w-full text-xs"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Open current page in new tab
          </Button>
        </section>
      </div>
    </div>
  );
}
