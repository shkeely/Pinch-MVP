import React, { useState, useCallback, useEffect, useRef } from 'react';
import AnimatedGreeting from '@/components/homepage/AnimatedGreeting';
import TopNav from '@/components/navigation/TopNav';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Calendar, Users, Check, ArrowRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ConversationModal } from '@/components/homepage/ConversationModal';
import { EscalatedQuestionModal } from '@/components/modals/EscalatedQuestionModal';
import { AISuggestionModal } from '@/components/modals/AISuggestionModal';
import { AnnouncementsReviewModal } from '@/components/modals/AnnouncementsReviewModal';
import { useFakeData } from '@/contexts/FakeDataContext';

export default function Homepage() {
  const { homepage, conversations: fakeConversations, upcomingAnnouncements } = useFakeData();
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [escalatedModalOpen, setEscalatedModalOpen] = useState(false);
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [announcementsModalOpen, setAnnouncementsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [handledExpanded, setHandledExpanded] = useState(false);
  const [attentionExpanded, setAttentionExpanded] = useState(false);
  const [announcementsExpanded, setAnnouncementsExpanded] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(0);
  const [showEndSection, setShowEndSection] = useState(false);
  const [greetingDone, setGreetingDone] = useState(false);
  const [skipClicked, setSkipClicked] = useState(false);
  const timeoutsRef = useRef<number[]>([]);

  // Count escalated vs suggestions
  const hasUrgent = homepage.needsAttention.some(item => item.urgent);

  // Stable callback for AnimatedGreeting
  const handleGreetingComplete = useCallback(() => {
    setGreetingDone(true);
  }, []);

  // Skip animation callback
  const handleSkip = useCallback(() => {
    // Clear any pending timeouts
    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];
    
    // Mark as skipped and complete greeting
    setSkipClicked(true);
    setGreetingDone(true);
  }, []);

  // One-time button reveal sequence after greeting completes
  useEffect(() => {
    if (!greetingDone) return;

    setShowButtons(true);

    const ids: number[] = [];
    
    if (skipClicked) {
      // Skip was clicked: show all buttons instantly, then end section after delay
      setVisibleButtons(3);
      ids.push(window.setTimeout(() => setShowEndSection(true), 300));
    } else {
      // Normal animation: reveal buttons one by one
      ids.push(window.setTimeout(() => setVisibleButtons(1), 150));
      ids.push(window.setTimeout(() => setVisibleButtons(2), 600));
      ids.push(window.setTimeout(() => setVisibleButtons(3), 1050));
      ids.push(window.setTimeout(() => setShowEndSection(true), 1400));
    }

    timeoutsRef.current = ids;

    return () => {
      timeoutsRef.current.forEach(id => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [greetingDone, skipClicked]);
  return <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Animated Greeting */}
        <AnimatedGreeting 
          userName={homepage.userName}
          handledCount={homepage.handledToday.length}
          attentionCount={homepage.needsAttention.length}
          announcementsCount={homepage.upcomingAnnouncements.length}
          onComplete={handleGreetingComplete}
          onSkip={handleSkip}
        />

        {/* Updates Section - All Collapsible */}
        {showButtons && (
          <div className="space-y-4">
          {/* Handled by Pinch - Collapsible */}
          <Collapsible 
            open={handledExpanded} 
            onOpenChange={setHandledExpanded} 
            className={`transition-opacity transition-transform duration-500 ease-out transform-gpu will-change-[transform,opacity] ${visibleButtons >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <div className={`w-full border-2 border-border hover:shadow-lg hover:border-primary/30 ${handledExpanded ? 'rounded-3xl bg-card transition-[background-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]' : 'rounded-full bg-background transition-[background-color,box-shadow,border-radius] duration-300 [transition-timing-function:cubic-bezier(0.7,0,0.84,0)] delay-200'}`}>
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
              <CollapsibleContent className="border-t border-border overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=open]:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-accordion-up data-[state=closed]:[animation-timing-function:cubic-bezier(0.7,0,0.84,0)]">
                <div className="px-6 py-4 flex items-center justify-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                    <Check className="w-3 h-3 mr-1" />
                    Handled by Pinch
                  </Badge>
                  
                </div>
                <div className="divide-y divide-border pb-4">
                  {homepage.handledToday.slice(0, 3).map((item, index) => {
                    const fullConversation = fakeConversations.find(
                      (conv) => conv.guestName === item.guestName
                    );
                    return (
                      <div
                        key={index}
                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-all duration-200 hover:translate-x-1"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => fullConversation && setSelectedConversation(fullConversation)}
                      >
                        <div className="text-foreground">
                          <span className="font-semibold">{item.guestName}</span>
                          <span className="text-muted-foreground"> asked about {item.question}</span>
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                          {item.timestamp}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Needs Attention - Collapsible with urgent indicator */}
          {homepage.needsAttention.length > 0 && (
          <Collapsible 
            open={attentionExpanded} 
            onOpenChange={setAttentionExpanded} 
            className={`transition-opacity transition-transform duration-500 ease-out transform-gpu will-change-[transform,opacity] ${visibleButtons >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
              <div className={`w-full border-2 border-destructive/50 hover:shadow-lg hover:border-destructive/70 ${attentionExpanded ? 'rounded-3xl bg-card transition-[background-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]' : 'rounded-full bg-background transition-[background-color,box-shadow,border-radius] duration-300 [transition-timing-function:cubic-bezier(0.7,0,0.84,0)] delay-200'}`}>
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
                <CollapsibleContent className="border-t border-border px-6 py-6 space-y-4 overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=open]:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-accordion-up data-[state=closed]:[animation-timing-function:cubic-bezier(0.7,0,0.84,0)]">
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
                      <div className="flex flex-col md:flex-row md:items-center items-start gap-3 md:gap-4">
                        <p className="text-muted-foreground flex-1">
                          {item.description}
                        </p>
                        <Button 
                          variant="outline" 
                          className={`rounded-full shrink-0 w-full md:w-auto !justify-start ${item.type === 'escalated' ? 'border-orange-400 text-orange-700 hover:bg-orange-50' : 'border-purple-400 text-purple-700 hover:bg-purple-50'}`}
                          onClick={() => {
                            setSelectedItem(item);
                            if (item.type === 'escalated') {
                              setEscalatedModalOpen(true);
                            } else {
                              setSuggestionModalOpen(true);
                            }
                          }}
                        >
                          Review
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>)}
                </CollapsibleContent>
              </div>
          </Collapsible>
          )}

          {/* Upcoming Announcements - Collapsible */}
          {homepage.upcomingAnnouncements.length > 0 && (
          <Collapsible 
            open={announcementsExpanded} 
            onOpenChange={setAnnouncementsExpanded} 
            className={`transition-opacity transition-transform duration-500 ease-out transform-gpu will-change-[transform,opacity] ${visibleButtons >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
              <div className={`w-full border-2 border-border hover:shadow-lg hover:border-primary/30 ${announcementsExpanded ? 'rounded-3xl bg-card transition-[background-color,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]' : 'rounded-full bg-background transition-[background-color,box-shadow,border-radius] duration-300 [transition-timing-function:cubic-bezier(0.7,0,0.84,0)] delay-200'}`}>
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
                <CollapsibleContent className="border-t border-border space-y-4 px-6 py-6 overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=open]:[animation-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-accordion-up data-[state=closed]:[animation-timing-function:cubic-bezier(0.7,0,0.84,0)]">
                  {homepage.upcomingAnnouncements.map((announcement, index) => <div key={announcement.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0" style={{
                animationDelay: `${index * 50}ms`
              }}>
                      <div className={`w-[5.6px] self-stretch min-h-20 rounded-full ${index === 0 ? 'bg-lavender' : 'bg-primary'}`} />
                      <div className="flex-1">
                        <Badge variant="outline" className="bg-background text-xs px-3 py-1 mb-2">
                          Scheduled
                        </Badge>
                        <h4 className="font-sans font-semibold text-foreground leading-[1.1] mb-0">{announcement.title}</h4>
                        <div className="flex flex-col md:flex-row md:items-center items-start gap-3 md:gap-4">
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`rounded-full shrink-0 w-full md:w-auto !justify-start ${index === 0 ? 'border-lavender text-lavender hover:bg-lavender/10' : 'border-primary text-primary hover:bg-primary/10'}`}
                            onClick={() => setAnnouncementsModalOpen(true)}
                          >
                            Review
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>)}
                </CollapsibleContent>
              </div>
          </Collapsible>
          )}
        </div>
        )}

        {/* End Message */}
        {showEndSection && <div className="text-center space-y-2 py-8 animate-in fade-in-0 duration-500">
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            That's all for today.
          </h2>
          <p className="text-muted-foreground">
            Want to change your notifications?
          </p>
        </div>}

        {/* Modals */}
        <ConversationModal 
          conversation={selectedConversation}
          isOpen={!!selectedConversation}
          onClose={() => setSelectedConversation(null)}
        />
        
        {selectedItem?.type === 'escalated' && (
          <EscalatedQuestionModal
            open={escalatedModalOpen}
            onClose={() => {
              setEscalatedModalOpen(false);
              setSelectedItem(null);
            }}
            guestName={selectedItem.guestName || ''}
            guestPhone={selectedItem.guestPhone || ''}
            question={selectedItem.question || ''}
            confidence={selectedItem.confidence || 0}
            aiAttemptedResponse={selectedItem.aiAttemptedResponse || ''}
            escalationReason={selectedItem.escalationReason || ''}
            timestamp={selectedItem.timestamp}
          />
        )}
        
        {selectedItem?.type === 'suggestion' && (
          <AISuggestionModal
            open={suggestionModalOpen}
            onClose={() => {
              setSuggestionModalOpen(false);
              setSelectedItem(null);
            }}
            title={selectedItem.title}
            suggestionContext={selectedItem.suggestionContext || ''}
            relatedQuestions={selectedItem.relatedQuestions || []}
            recommendedAction={selectedItem.recommendedAction || ''}
            timestamp={selectedItem.timestamp}
          />
        )}

        <AnnouncementsReviewModal
          open={announcementsModalOpen}
          onClose={() => setAnnouncementsModalOpen(false)}
          announcements={upcomingAnnouncements.filter(a => a.status === 'scheduled')}
        />
      </div>
    </div>;
}