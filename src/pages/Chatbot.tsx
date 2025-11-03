import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Settings, Zap, Sparkles } from 'lucide-react';

export default function Chatbot() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">AI Chatbot</h1>
          <p className="text-muted-foreground">
            Configure your AI wedding concierge
          </p>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Chatbot Status</h3>
                  <p className="text-sm text-muted-foreground">Your AI concierge is active and responding</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>

          {/* Settings Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Response Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">Response Tone</h4>
                  <p className="text-sm text-muted-foreground">How should your AI respond to guests?</p>
                </div>
                <Badge variant="outline" className="text-accent border-accent">
                  Warm & Friendly
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">Auto-Reply</h4>
                  <p className="text-sm text-muted-foreground">Respond to messages automatically</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          {/* Knowledge Base Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Knowledge Base</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Wedding Details</p>
                    <p className="text-sm text-muted-foreground">Location, timing, dress code</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Custom FAQs</p>
                    <p className="text-sm text-muted-foreground">Your specific Q&A pairs</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              Update Knowledge Base
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
