import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, Clock } from 'lucide-react';
import landingBg from '@/assets/landing-bg.png';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${landingBg})` }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">AI Wedding Concierge</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-balance">
            Never Answer Another
            <br />
            <span className="text-accent">Guest Question</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
            Set it up once, and let your AI concierge handle guest Q&A 24/7 via SMS
          </p>

          <Button
            size="lg"
            onClick={() => navigate('/onboarding/step-1a')}
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-12 py-6 h-auto"
          >
            Get Started Free
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Smart Q&A</h3>
            <p className="text-muted-foreground">
              Answers timing, location, dress code, parking, and custom questions automatically
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">Your Voice, Your Tone</h3>
            <p className="text-muted-foreground">
              Choose warm, formal, or fun — responses match your wedding style
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-mint-foreground" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-3">5-Minute Setup</h3>
            <p className="text-muted-foreground">
              Import from your website or enter details manually — live in minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
