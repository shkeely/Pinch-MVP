import React, { useState } from 'react';
import AnimatedGreeting from '@/components/homepage/AnimatedGreeting';
import UpdateCard from '@/components/homepage/UpdateCard';
import TopNav from '@/components/navigation/TopNav';
import { FAKE_DATA } from '@/data/fakeData';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Homepage() {
  const { homepage } = FAKE_DATA;
  const [handledExpanded, setHandledExpanded] = useState(false);
  const [attentionExpanded, setAttentionExpanded] = useState(false);
  const [announcementsExpanded, setAnnouncementsExpanded] = useState(false);

  // Determine status for greeting
  const getStatus = () => {
    const count = homepage.needsAttention.length;
    if (count === 0) return 'all-clear';
    if (count >= 3) return 'needs-attention';
    return 'normal';
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Animated Greeting */}
        <AnimatedGreeting userName={homepage.userName} status={getStatus()} />

        {/* Needs Attention Section - Show First */}
        {homepage.needsAttention.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Needs Your Attention
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {homepage.needsAttention.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <UpdateCard
                    type="attention"
                    summary={item.title}
                    details={[item.description]}
                    urgent={item.urgent}
                    timestamp={item.timestamp}
                    actionLabel={item.type === 'escalated' ? 'Respond' : 'Review'}
                    onAction={() => console.log('Navigate to', item.type)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Handled by Pinch Section - Collapsible */}
        <div className="space-y-4">
          <Collapsible open={handledExpanded} onOpenChange={setHandledExpanded}>
            <CollapsibleTrigger asChild>
              <button className="w-full rounded-full border-2 border-border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="flex-1 text-xl font-semibold text-foreground">
                    Pinch answered {homepage.handledToday.length} guest questions
                  </span>
                  {handledExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground ml-2" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground ml-2" />
                  )}
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3 animate-accordion-down">
              {homepage.handledToday.map((item, index) => (
                <div
                  key={`${item.guestName}-${item.timestamp}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <UpdateCard
                    type="handled"
                    summary={`${item.guestName} asked about ${item.question}`}
                    timestamp={item.timestamp}
                  />
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="default" className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send a Message
          </Button>
          <Button variant="secondary" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            View All Conversations
          </Button>
          <Button variant="secondary" className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Add to Chatbot Brain
          </Button>
        </div>

        {/* End Message */}
        <div className="text-center space-y-2 py-8">
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            That's all for today.
          </h2>
          <p className="text-muted-foreground">
            Want to change your notifications?
          </p>
        </div>

        {/* Quick Actions - Hidden by default, can be added later */}
        {/* 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="default" className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send a Message
          </Button>
          <Button variant="secondary" className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            View All Conversations
          </Button>
          <Button variant="secondary" className="w-full">
            <Brain className="w-4 h-4 mr-2" />
            Add to Chatbot Brain
          </Button>
        </div>
        */}
      </div>
    </div>
  );
}
