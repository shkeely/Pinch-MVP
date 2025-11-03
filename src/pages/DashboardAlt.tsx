import { Send, Bell, Download, Eye, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';

export default function DashboardAlt() {
  const {
    wedding,
    conversations
  } = useWedding();

  return <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Mobile: Stacked Layout | Desktop: Grid Layout */}
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[1fr_1fr] md:justify-items-start md:gap-y-5 md:gap-x-6 md:grid-rows-[auto_auto]">
          
          {/* Daily Digest - Stats for last 7 days */}
          <div className="w-full md:col-start-1 md:row-start-1 md:justify-self-start md:max-w-[480px] md:pt-6 md:pb-0">
            <h2 className="text-3xl md:text-[2.6rem] font-serif font-bold mb-2 text-foreground leading-tight">
              Daily Digest
            </h2>
            <p className="text-sm text-muted-foreground mb-6 uppercase tracking-wide">
              Last 7 Days
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-semibold text-foreground">47</div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-semibold text-foreground">37%</div>
                <p className="text-sm text-muted-foreground">Auto-Answered</p>
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-semibold text-foreground">12</div>
                <p className="text-sm text-muted-foreground">New Messages</p>
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-semibold text-foreground">8</div>
                <p className="text-sm text-muted-foreground">General Questions</p>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Trending Topics
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium" style={{
                  backgroundColor: '#b7c4f1',
                  color: '#2E2B27'
                }}>
                  Parking
                </span>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium" style={{
                  backgroundColor: '#ccc1dd',
                  color: '#2E2B27'
                }}>
                  Kids Policy
                </span>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium" style={{
                  backgroundColor: '#c8deb9',
                  color: '#2E2B27'
                }}>
                  Registry
                </span>
              </div>
            </div>
          </div>

          {/* Your Concierge - Full width on mobile */}
          <Card className="w-full md:col-start-2 md:row-start-1 md:row-span-2 p-5 bg-gradient-to-b from-[#ccc1dd] via-[#b7c4f1] to-[#c8deb9] text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col min-h-[400px] md:min-h-0">
            <h2 className="font-sans mb-4 text-white text-xl font-medium">
              Your Concierge
            </h2>
            
            <div className="space-y-3 flex-1 mb-4">
              <div className="flex justify-start">
                <div className="bg-white text-foreground rounded-3xl rounded-tl-md px-4 py-2.5 shadow-sm max-w-xs">
                  <p className="text-sm">what time is the wedding</p>
                  <p className="text-xs text-muted-foreground mt-1">01:17 PM</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-[#D8C9E3] text-foreground rounded-3xl rounded-tr-md px-4 py-2.5 shadow-sm max-w-xs">
                  <p className="text-sm">We'd love to see you there! the scheduled time.</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">01:17 PM</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 items-center p-2 bg-white rounded-full">
              <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:bg-muted flex-shrink-0">
                <span className="text-lg">+</span>
              </Button>
              <Input placeholder="Type your message..." className="flex-1 border-0 bg-transparent text-foreground placeholder:text-muted-foreground h-10 focus-visible:ring-0 focus-visible:ring-offset-0" />
              <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:bg-muted flex-shrink-0" aria-label="Send message">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Needs Your Attention - Full width on mobile */}
          <Card className="w-full md:col-start-1 md:row-start-2 md:justify-self-start p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] md:max-w-[480px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif text-foreground">
                Needs Your Attention
              </h2>
              
            </div>
            
            <div className="space-y-2.5">
              {/* Guest Messages */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                    Guest Messages
                  </p>
                  <div className="flex items-center gap-2">
                    
                    
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-2xl border border-border-subtle">
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="font-semibold text-sm text-foreground">David Park</p>
                    <Badge variant="destructive" className="text-xs rounded-full px-3 py-1 text-destructive-foreground bg-red-500">Escalated</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2.5">
                    I might need to cancel - what should I do?
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-sm font-medium">A</span>
                    <Input placeholder="conts bapre" className="flex-1 h-9 text-sm bg-background rounded-full border-border" />
                    <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 flex-shrink-0 hover:bg-muted">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button className="w-full rounded-xl h-10 font-medium" style={{
                  backgroundColor: '#5b6850',
                  color: 'white'
                }}>
                    Send
                  </Button>
                </div>
              </div>

              {/* Smart Suggestions */}
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1.5">
                  Smart Suggestions
                </p>
                <div className="p-3 bg-muted/30 rounded-2xl border border-border-subtle">
                  <p className="text-sm text-foreground mb-2.5">
                    Common question: "Is there a shuttle?"
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 rounded-xl h-9 text-sm font-medium" style={{
                    backgroundColor: '#5b6850',
                    color: 'white'
                  }}>
                      Add Answer
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl h-9 text-sm" style={{
                    borderColor: '#5b6850'
                  }}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions - Full width on mobile */}
          <Card className="w-full md:col-span-2 md:row-start-3 md:justify-self-center p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] md:max-w-[480px]">
            <h2 className="text-2xl font-serif mb-1 text-foreground">
              Quick Actions
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage things efficiently
            </p>
            
            <div className="space-y-1.5">
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 rounded-full transition-colors hover:bg-muted/50 border-border" style={{
              backgroundColor: 'white',
              color: '#2E2B27'
            }}>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <span className="text-[15px] font-medium">Send a Message to Guests</span>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 rounded-full transition-colors hover:bg-muted/50 border-border" style={{
              backgroundColor: 'white',
              color: '#2E2B27'
            }}>
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  <span className="text-[15px] font-medium">Schedule Follow-up</span>
                </div>
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 rounded-full transition-colors hover:bg-muted/50 border-border" style={{
              backgroundColor: 'white',
              color: '#2E2B27'
            }}>
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  <span className="text-[15px] font-medium">Export Guest List</span>
                </div>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>;
}