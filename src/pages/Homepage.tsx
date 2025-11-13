import React, { useState } from 'react';
import AnimatedGreeting from '@/components/homepage/AnimatedGreeting';
import TopNav from '@/components/navigation/TopNav';
import { FAKE_DATA } from '@/data/fakeData';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Brain, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
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

        {/* Updates Section */}
        <div className="space-y-4">
          {/* Handled by Pinch - Collapsible */}
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
            <CollapsibleContent className="mt-4 space-y-2 px-6 animate-accordion-down">
              {homepage.handledToday.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="text-foreground"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="font-medium text-primary underline">{item.guestName}</span>
                  <span className="text-muted-foreground"> asked about {item.question}</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Needs Attention - Collapsible with urgent indicator */}
          {homepage.needsAttention.length > 0 && (
            <Collapsible open={attentionExpanded} onOpenChange={setAttentionExpanded}>
              <CollapsibleTrigger asChild>
                <button className="w-full rounded-full border-2 border-destructive/50 bg-card p-6 text-center transition-all hover:border-destructive hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-xl font-semibold text-foreground">
                      {homepage.needsAttention.length} things need your attention.
                    </span>
                    <div className="flex items-center gap-2 ml-2">
                      {homepage.needsAttention.some(item => item.urgent) && (
                        <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      )}
                      {attentionExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-3 px-6 animate-accordion-down">
                {homepage.needsAttention.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 pb-3 border-b border-border last:border-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.urgent && (
                          <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                        )}
                        <span className="font-medium text-foreground">{item.type === 'escalated' ? '1 Escalated Question' : '2 Suggestions'}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">
                      Review all
                    </Button>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Upcoming Announcements - Collapsible */}
          {homepage.upcomingAnnouncements.length > 0 && (
            <Collapsible open={announcementsExpanded} onOpenChange={setAnnouncementsExpanded}>
              <CollapsibleTrigger asChild>
                <button className="w-full rounded-full border-2 border-border bg-card p-6 text-center transition-all hover:border-primary/50 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-xl font-semibold text-foreground">
                      {homepage.upcomingAnnouncements.length} upcoming guest announcements
                    </span>
                    {announcementsExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground ml-2" />
                    )}
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 px-6 animate-accordion-down">
                {homepage.upcomingAnnouncements.map((announcement, index) => (
                  <div
                    key={announcement.id}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`w-1 h-16 rounded-full ${index === 0 ? 'bg-lavender' : 'bg-primary'}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">{announcement.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {announcement.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {announcement.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {announcement.guests} guests
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {announcement.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
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
