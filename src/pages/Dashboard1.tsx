import { Send, Bell, Download, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWedding } from '@/contexts/WeddingContext';
import { useFakeData } from '@/contexts/FakeDataContext';
import TopNav from '@/components/navigation/TopNav';
import StatsCard from '@/components/dashboard/StatsCard';
import AnimatedGreeting from '@/components/homepage/AnimatedGreeting';
export default function Dashboard1() {
  const {
    wedding,
    conversations
  } = useWedding();
  const { homepage } = useFakeData();
  return <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Animated Greeting */}
        <AnimatedGreeting 
          userName={wedding?.couple1 || "there"} 
          status={homepage.needsAttention.length > 0 ? 'needs-attention' : homepage.metrics.questionsToday === 0 ? 'all-clear' : 'normal'} 
        />

        {/* Daily Digest Section with Stats */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            {/* Daily Digest Summary */}
            <div className="flex-1">
              <p className="text-foreground leading-relaxed text-base md:text-[1.15rem]">
                <span className="font-semibold">{homepage.metrics.questionsToday} new messages today.</span> {homepage.metrics.questionsAnswered} questions answered automatically.
              </p>
            </div>

            {/* Stats Card - Aligned to the right */}
            <div className="flex-shrink-0">
              <StatsCard total={homepage.metrics.questionsToday} autoPercent={homepage.metrics.autoAnsweredPercent} />
            </div>
          </div>

          {/* Trending Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium" style={{
            backgroundColor: '#b7c4f1',
            color: '#2E2B27'
          }}>
              Trending: Parking
            </span>
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium" style={{
            backgroundColor: '#ccc1dd',
            color: '#2E2B27'
          }}>
              Trending: Kids Policy
            </span>
            <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium" style={{
            backgroundColor: '#c8deb9',
            color: '#2E2B27'
          }}>
              Trending: Registry
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[1.18fr_0.84fr_auto] md:gap-6 md:grid-rows-[auto]">

          {/* Your Concierge - Full width on mobile */}
          <Card className="w-full md:col-start-3 md:row-start-1 p-5 bg-gradient-to-b from-[#ccc1dd] via-[#b7c4f1] to-[#c8deb9] text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col min-h-[400px] md:min-h-0 md:justify-self-end md:w-[368px]">
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
          <div className="w-full md:col-start-1 md:row-start-1 md:w-auto space-y-4">
            <h2 className="text-2xl font-serif text-foreground mb-4">
              Needs Your Attention
            </h2>
            
            {/* Dynamic Needs Attention Cards */}
            {homepage.needsAttention.map((item) => {
              const borderColor = item.type === 'escalated' 
                ? 'border-amber-500' 
                : item.type === 'suggestion' 
                ? 'border-purple-500' 
                : 'border-green-500';
              
              return (
                <Card key={item.id} className={`p-4 bg-card border-l-4 ${borderColor} hover:shadow-md transition-shadow rounded-lg`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.type === 'escalated' ? 'Escalated' : item.type === 'suggestion' ? 'Suggestion' : 'Insight'}
                        </Badge>
                        {item.urgent && (
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                    </div>
                    <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Button variant="ghost" size="sm" className="w-fit mt-2 text-xs">
                      {item.type === 'escalated' ? 'Respond →' : 'Review →'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions - Full width on mobile */}
          <Card className="w-full md:col-start-2 md:row-start-1 p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] md:w-auto">
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

        {/* Handled Today Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-serif text-foreground mb-4">
            Handled Today
          </h2>
          <Card className="p-4 bg-card/50 border-border-subtle rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                ✓ Handled by Pinch
              </Badge>
              <span className="text-xs text-muted-foreground">
                {homepage.handledToday.length} questions answered
              </span>
            </div>
            <div className="space-y-2">
              {homepage.handledToday.map((item, index) => (
                <div key={index} className="py-2 hover:bg-muted/30 rounded px-2 -mx-2 transition-colors">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{item.guestName}</span>
                      <span className="text-muted-foreground"> asked about </span>
                      <span className="text-muted-foreground">{item.question}</span>
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>;
}