import { Upload, Settings, Bell, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard 1', path: '/dashboard1' },
  { label: 'Dashboard 1 Alt', path: '/dashboard1-alt' },
  { label: 'Messages', path: '/messages' },
  { label: 'Reminders', path: '/reminders' },
  { label: 'Chatbot', path: '/chatbot' },
  { label: 'Guests', path: '/guests' },
];

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Mobile: Hamburger Menu */}
        <div className="flex items-center gap-3 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card p-5">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        px-4 py-3 text-base font-medium rounded-lg transition-colors text-left
                        ${isActive 
                          ? 'bg-foreground text-background' 
                          : 'text-foreground hover:bg-foreground/10'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  );
                })}
                <div className="border-t border-border my-2" />
                <button
                  onClick={() => handleNavigation('/import')}
                  className="px-4 py-3 text-base font-medium rounded-lg transition-colors text-left text-foreground hover:bg-foreground/10"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Import
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - Centered on mobile, left on desktop */}
        <h1 className="absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 text-2xl md:text-2xl font-serif font-semibold tracking-tight">
          PINCH.
        </h1>

        {/* Desktop Navigation Pills - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-muted/50 p-1.5 shadow-sm">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  px-6 py-2 text-sm font-medium rounded-full transition-all duration-200
                  ${isActive 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }
                `}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex rounded-full">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden md:flex rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          
          <button className="flex items-center gap-2 rounded-full hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8 md:w-9 md:h-9 ring-2 ring-accent/30">
              <AvatarFallback className="bg-accent/20 text-accent-foreground font-medium text-xs md:text-sm">
                SP
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="hidden md:block w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
