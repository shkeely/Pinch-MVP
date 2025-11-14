import React, { useState } from 'react';
import AnimatedGreeting from '@/components/homepage/AnimatedGreeting';
import TopNav from '@/components/navigation/TopNav';
import { FAKE_DATA } from '@/data/fakeData';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calendar, Users, Check, ArrowRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
export default function Homepage() {
  const {
    homepage
  } = FAKE_DATA;
  const [handledExpanded, setHandledExpanded] = useState(false);
  const [attentionExpanded, setAttentionExpanded] = useState(false);
  const [announcementsExpanded, setAnnouncementsExpanded] = useState(true);

  // Determine status for greeting
  const getStatus = () => {
    const count = homepage.needsAttention.length;
    if (count === 0) return 'all-clear';
    if (count >= 3) return 'needs-attention';
    return 'normal';
  };

  // Count escalated vs suggestions
  const hasUrgent = homepage.needsAttention.some(item => item.urgent);
  return <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Animated Greeting */}
        <AnimatedGreeting userName={homepage.userName} status={getStatus()} />

        {/* Updates Section - All Collapsible */}
        <div className="space-y-4">
          {/* Handled by Pinch - Collapsible */}
          <Collapsible open={handledExpanded} onOpenChange={setHandledExpanded}>
            <div className={`w-full border-2 border-border transition-[border-radius,background-color,box-shadow] duration-300 ease-in-out hover:shadow-lg hover:border-primary/30 ${handledExpanded ? 'rounded-3xl bg-card' : 'rounded-full bg-background delay-200'}`}>
              <CollapsibleTrigger asChild>
                <button className="w-full p-6 text-center transition-all hover:border-primary/50">
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-xl font-semibold text-foreground">
                      Pinch answered {homepage.handledToday.length} guest questions
                    </span>
                    {handledExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground ml-2" /> : <ChevronDown className="w-5 h-5 text-muted-foreground ml-2" />}
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t border-border overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="px-6 py-4 flex items-center justify-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                    <Check className="w-3 h-3 mr-1" />
                    Handled by Pinch
                  </Badge>
                  
                </div>
                <div className="divide-y divide-border pb-4">
                  {homepage.handledToday.slice(0, 3).map((item, index) => <div key={index} className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors" style={{
                  animationDelay: `${index * 50}ms`
                }}>
                      <div className="text-foreground">
                        <span className="font-semibold">{item.guestName}</span>
                        <span className="text-muted-foreground"> asked about {item.question}</span>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                        {item.timestamp}
                      </span>
                    </div>)}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Needs Attention - Collapsible with urgent indicator */}
          {homepage.needsAttention.length > 0 && <Collapsible open={attentionExpanded} onOpenChange={setAttentionExpanded}>
              <div className={`w-full border-2 border-destructive/50 transition-[border-radius,background-color,box-shadow] duration-300 ease-in-out hover:shadow-lg hover:border-destructive/70 ${attentionExpanded ? 'rounded-3xl bg-card' : 'rounded-full bg-background delay-200'}`}>
                <CollapsibleTrigger asChild>
                  <button className="w-full p-6 text-center transition-all hover:border-destructive">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 text-xl font-semibold text-foreground">
                        {homepage.needsAttention.length} things need your attention.
                      </span>
                      <div className="flex items-center gap-2 ml-2">
                        {hasUrgent && <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />}
                        {attentionExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                      </div>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t border-border px-6 py-6 space-y-4 overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  {homepage.needsAttention.map(item => <div key={item.id} className={`relative rounded-2xl p-6 border-2 ${item.type === 'escalated' ? 'border-orange-200 bg-orange-50/15' : 'border-purple-200 bg-purple-50/15'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-background">
                            {item.type === 'escalated' ? 'Escalated' : 'Suggestion'}
                          </Badge>
                          {item.urgent && <span className="h-2 w-2 rounded-full bg-destructive" />}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.timestamp}
                        </span>
                      </div>
                      <h4 className="font-sans font-semibold text-foreground text-lg mb-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-4">
                        <p className="text-muted-foreground flex-1">
                          {item.description}
                        </p>
                        <Button variant="outline" className={`rounded-full shrink-0 ${item.type === 'escalated' ? 'border-orange-400 text-orange-700 hover:bg-orange-50' : 'border-purple-400 text-purple-700 hover:bg-purple-50'}`}>
                          Review
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>)}
                </CollapsibleContent>
              </div>
            </Collapsible>}

          {/* Upcoming Announcements - Collapsible */}
          {homepage.upcomingAnnouncements.length > 0 && <Collapsible open={announcementsExpanded} onOpenChange={setAnnouncementsExpanded}>
              <div className={`w-full border-2 border-border transition-[border-radius,background-color,box-shadow] duration-300 ease-in-out hover:shadow-lg hover:border-primary/30 ${announcementsExpanded ? 'rounded-3xl bg-card' : 'rounded-full bg-background delay-200'}`}>
                <CollapsibleTrigger asChild>
                  <button className="w-full p-6 text-center transition-all hover:border-primary/50">
                    <div className="flex items-center justify-between">
                      <span className="flex-1 text-xl font-semibold text-foreground">
                        {homepage.upcomingAnnouncements.length} upcoming guest announcements
                      </span>
                      {announcementsExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground ml-2" /> : <ChevronDown className="w-5 h-5 text-muted-foreground ml-2" />}
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t border-border space-y-4 px-6 py-6 overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  {homepage.upcomingAnnouncements.map((announcement, index) => <div key={announcement.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0" style={{
                animationDelay: `${index * 50}ms`
              }}>
                      <div className={`w-[5.6px] self-stretch min-h-20 rounded-full ${index === 0 ? 'bg-lavender' : 'bg-primary'}`} />
                      <div className="flex-1">
                        <Badge variant="outline" className="bg-background text-xs px-3 py-1 mb-2">
                          Scheduled
                        </Badge>
                        <h4 className="font-sans font-semibold text-foreground leading-[1.1] mb-0">{announcement.title}</h4>
                        <div className="flex items-center justify-between gap-4">
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
                          <Button variant="outline" size="sm" className={`rounded-full shrink-0 ${index === 0 ? 'border-lavender text-lavender hover:bg-lavender/10' : 'border-primary text-primary hover:bg-primary/10'}`}>
                            Review
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </CollapsibleContent>
              </div>
            </Collapsible>}
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
      </div>
    </div>;
}