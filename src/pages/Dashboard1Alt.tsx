import { Send, Bell, Download, Eye, TrendingUp, MessageSquare, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';
import StatsCard from '@/components/dashboard/StatsCard';
export default function Dashboard1Alt() {
  const {
    wedding,
    conversations
  } = useWedding();
  const totalQuestions = 47;
  const autoAnswerRate = 37;
  const newMessages = 12;
  const generalQuestions = 8;
  return <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        {/* Daily Digest Section with Stats */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            {/* Daily Digest Content - Left Column */}
            <div className="flex-1 space-y-5">
              {/* Title and Description */}
              <div>
                <h2 className="text-3xl md:text-[2.6rem] font-serif font-bold mb-4 text-foreground leading-tight">
                  Daily Digest
                </h2>
                <p className="text-foreground leading-relaxed text-base md:text-[1.15rem]">
                  <span className="font-semibold">{newMessages} new messages today.</span> {generalQuestions} general questions (parking, timing).
                </p>
              </div>

              {/* Stats Card - Compact and integrated */}
              <div className="w-fit">
                <StatsCard total={totalQuestions} autoPercent={autoAnswerRate} />
              </div>

              {/* Trending Tags */}
              <div className="flex flex-wrap gap-2">
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

            {/* Quick Actions - Right Column */}
            <div className="flex-shrink-0 w-full md:w-[500px] flex md:justify-center">
              <Card className="w-full md:w-[326px] p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
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
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[1fr_auto] md:gap-5 md:grid-rows-[auto]">

          {/* Your Concierge - Full width on mobile */}
          <Card className="w-full md:col-start-2 md:row-start-1 p-5 bg-gradient-to-b from-[#ccc1dd] via-[#b7c4f1] to-[#c8deb9] text-primary-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col min-h-[400px] md:min-h-0 md:justify-self-end md:w-[500px]">
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
                <div className="bg-muted text-foreground rounded-3xl rounded-tr-md px-4 py-2.5 shadow-sm max-w-xs">
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
          <div className="w-full md:col-start-1 md:row-start-1 space-y-4">
            <h2 className="text-2xl font-serif text-foreground mb-4">
              Needs Your Attention
            </h2>
            
            {/* Card 1: Guests asking about parking */}
            <Card className="p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-serif text-foreground mb-2">
                    Guests are asking about parking
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This question came up 8 times this week. Would you like me to draft a message?
                  </p>
                  <Button className="rounded-full px-6" style={{
                  backgroundColor: '#5b6850',
                  color: 'white'
                }}>
                    Draft message
                  </Button>
                </div>
              </div>
            </Card>

            {/* Card 2: New questions */}
            <Card className="p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-serif text-foreground">You received 1 escalated questions</h3>
                    <Badge className="bg-[#e85d5d] hover:bg-[#e85d5d] text-white px-3 py-1 text-xs rounded-full">
                      Escalated
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    The question is about cancellation
                  </p>
                  <Button className="rounded-full px-6" style={{
                  backgroundColor: '#5b6850',
                  color: 'white'
                }}>
                    Review all
                  </Button>
                </div>
              </div>
            </Card>

            {/* Card 3: Suggestion */}
            <Card className="p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-serif text-foreground mb-2">
                    Suggestion: Add shuttle info
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Common question: 'Is there a shuttle?' — Consider adding this to your FAQ.
                  </p>
                  <Button className="rounded-full px-6" style={{
                  backgroundColor: '#5b6850',
                  color: 'white'
                }}>
                    Add answer
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}