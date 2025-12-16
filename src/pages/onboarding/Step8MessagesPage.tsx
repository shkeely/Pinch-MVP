import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GripVertical, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import TopNav from '@/components/navigation/TopNav';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { TourPage } from '@/components/onboarding/TourPage';
import { useWedding } from '@/contexts/WeddingContext';
import { FAKE_DATA } from '@/data/fakeData';
import { AIAssistButton } from '@/components/ai/AIAssistButton';
import GiveFeedbackDialog from '@/components/feedback/GiveFeedbackDialog';
import SendMessageDialog from '@/components/messages/SendMessageDialog';

export default function Step8MessagesPage() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [tooltipTop, setTooltipTop] = useState(0);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const conversations = FAKE_DATA.recentConversations;
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'auto' | 'escalated' | 'risky'>('all');
  const [draftResponse, setDraftResponse] = useState('');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false);
  const segments = ['All', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors'];
  
  // AI Assist demo state (for Step 4 interactive demo)
  const [aiAssistDemoGenerated, setAiAssistDemoGenerated] = useState(false);
  const [aiAssistDemoOption, setAiAssistDemoOption] = useState<'rewrite' | 'expand' | 'friendlier' | null>(null);

  // Draggable tooltip state
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.location.hash = '#step-8';
  }, []);

  useLayoutEffect(() => {
    const updatePosition = () => {
      const conversationList = document.getElementById('conversation-list');
      if (conversationList) {
        const rect = conversationList.getBoundingClientRect();
        setTooltipTop(rect.top + window.scrollY);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentTooltip]);

  const handleNext = () => {
    // Reset AI assist demo when leaving step 4
    if (currentTooltip === 4) {
      setAiAssistDemoGenerated(false);
      setAiAssistDemoOption(null);
    }

    // Special logic for Step 4: if viewing auto-answered message, skip to step 5
    if (currentTooltip === 4 && selectedConversation.status === 'auto') {
      setCurrentTooltip(5);
      return;
    }

    if (currentTooltip < 6) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      updateWedding({ onboardingStep: 9 });
      navigate('/onboarding/step-9');
    }
  };

  // Function to handle AI Assist demo for Step 4
  const handleAiAssistDemo = () => {
    if (!aiAssistDemoGenerated) {
      setAiAssistDemoGenerated(true);
      setAiAssistDemoOption(null);
      toast("Response Generated!", {
        description: "Now choose how to refine it: Rewrite, Improve & Expand, or Make Friendlier.",
        duration: 4000,
      });
    }
  };

  const handleAiAssistDemoOption = (option: 'rewrite' | 'expand' | 'friendlier') => {
    setAiAssistDemoOption(option);
    const messages = {
      rewrite: "New version generated! Feel free to try another style.",
      expand: "Expanded version created! Adding more context and detail.",
      friendlier: "Friendlier tone applied! Much warmer and more personal now."
    };
    toast(`${option === 'rewrite' ? 'Rewritten' : option === 'expand' ? 'Improved & Expanded' : 'Made Friendlier'}`, {
      description: messages[option],
      duration: 3000,
    });
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      updateWedding({ onboardingStep: 7 });
      navigate('/onboarding/step-7');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 10,
      onboardingComplete: true,
      tourMode: false 
    });
    navigate('/homepage');
  };

  // Footer navigation - goes to next/previous step page directly
  const handleFooterNext = () => navigate('/onboarding/step-9');
  const handleFooterPrevious = () => navigate('/onboarding/step-7');

  // Drag handlers for tooltip
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const tooltipWidth = 400;
    const tooltipHeight = 300;
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - tooltipWidth));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - tooltipHeight));
    
    setTooltipPosition({ x: constrainedX, y: constrainedY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    setTooltipPosition(null);
  }, [currentTooltip]);

  const getTooltipPosition = () => {
    if (tooltipPosition) {
      return {
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        transform: 'none'
      };
    }

    // Smart positioning based on step
    let position = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    
    if (currentTooltip === 4) {
      // Step 4: Position to left of AI Assist button
      const aiButton = document.getElementById('ai-assist-button');
      if (aiButton) {
        const rect = aiButton.getBoundingClientRect();
        position = {
          left: `${rect.left - 450}px`,
          top: `${rect.top + window.scrollY + rect.height / 2}px`,
          transform: 'translateY(-50%)'
        };
      }
    } else if (currentTooltip === 5) {
      // Step 5: Position below Send Message button
      const sendButton = document.getElementById('send-message-header-button');
      if (sendButton) {
        const rect = sendButton.getBoundingClientRect();
        position = {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.bottom + window.scrollY + 20}px`,
          transform: 'translateX(-50%)'
        };
      }
    } else if (currentTooltip === 6) {
      // Step 6: Position directly above Give Feedback button
      const feedbackButton = document.getElementById('give-feedback-button');
      if (feedbackButton) {
        const rect = feedbackButton.getBoundingClientRect();
        position = {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.top + window.scrollY - 220}px`,
          transform: 'translateX(-50%)'
        };
      }
    }

    return position;
  };

  const tooltipContent = {
    1: {
      title: "All Guest Conversations",
      description: "Every SMS conversation with your guests appears here. See who's asking what in real-time."
    },
    2: {
      title: "Conversation Thread",
      description: "See the full back-and-forth with each guest. Pinch's responses are marked with confidence levels."
    },
    3: {
      title: "Auto vs Escalated",
      description: "Tags show if Pinch auto-answered confidently ('Auto') or escalated to you for review ('Escalated'). Escalated messages need your input to draft or send a response."
    },
    4: {
      title: "Drafting Responses with AI",
      description: "Try it! Click the AI Assist button to generate a response. Then pick how you'd like to refine it - rewrite for a different approach, expand for more detail, or make it friendlier in tone."
    },
    5: {
      title: "Send Message to All Guests",
      description: "At any time, you can send a message to your entire guest list or specific segments. Use this to send reminders, updates, or announcements."
    },
    6: {
      title: "Help Pinch Learn",
      description: "If you think Pinch's response could have been better, tell us! Your feedback helps train the system to improve over time."
    }
  };

  const current = tooltipContent[currentTooltip as keyof typeof tooltipContent];

  return (
    <TourPage
      stepNumber={8}
      title="Guest Conversations"
      description="See how Pinch handles your guest messages"
      onNext={handleFooterNext}
      onPrevious={handleFooterPrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      <div className="relative w-full h-full">

        {/* Messages Page Content */}
        <div className="min-h-screen bg-background">
          <TopNav />
          
          <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                  Messages
                </h1>
                <p className="text-muted-foreground text-base">
                  Guest conversations & AI responses
                </p>
              </div>
              <Button 
                id="send-message-header-button"
                className={`rounded-full px-6 text-white bg-indigo-400 hover:bg-indigo-300 ${currentTooltip === 5 ? 'ring-[3px] ring-purple-600 ring-offset-2' : ''}`}
                onClick={() => {
                  if (currentTooltip > 0) {
                    toast("Available After Onboarding", {
                      description: "You'll be able to send messages to guests once you complete the tour!",
                      duration: 3000,
                    });
                  } else {
                    setIsSendMessageDialogOpen(true);
                  }
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message to Guests
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-[#ccc1dd] text-foreground">
                All
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white border border-border text-foreground hover:bg-muted/50">
                Auto
              </button>
              <button className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-white border border-border text-foreground hover:bg-muted/50">
                Escalated
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
              {/* Left Panel - Conversation List */}
              <Card className="p-5 bg-card border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] h-fit lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto" id="conversation-list">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 bg-background border-border rounded-full"
                    disabled
                  />
                </div>

                {/* Conversation List */}
                <div className="space-y-3">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full text-left p-4 rounded-2xl transition-colors border ${
                        selectedConversation.id === conv.id
                          ? 'bg-muted/50 border-border'
                          : 'bg-white border-border hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-foreground">{conv.guestName}</p>
                        <Badge
                          variant={conv.status === 'escalated' ? 'destructive' : 'secondary'}
                          className={`text-xs rounded-full px-2.5 py-0.5 ${
                            conv.status === 'auto' ? 'bg-[#c8deb9] text-foreground' : 'text-destructive-foreground bg-red-500'
                          } ${currentTooltip === 3 ? 'ring-[3px] ring-purple-600 ring-offset-2 animate-pulse' : ''}`}
                        >
                          {conv.status === 'auto' ? 'Auto' : 'Escalated'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-2">
                        {conv.question}
                      </p>
                      <p className="text-xs text-muted-foreground">{conv.date}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Right Panel - Conversation Detail */}
              <Card className={`p-6 bg-card border-border shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col ${currentTooltip === 2 ? 'z-30 ring-[3px] ring-purple-600 ring-offset-2' : ''}`} id="conversation-thread">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-1">
                      {selectedConversation.guestName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.date}, {selectedConversation.timestamp}
                    </p>
                  </div>
                  <Badge
                    variant={selectedConversation.status === 'escalated' ? 'destructive' : 'secondary'}
                    className={`text-xs rounded-full px-3 py-1 ${
                      selectedConversation.status === 'auto' ? 'bg-[#c8deb9] text-foreground' : 'text-destructive-foreground bg-red-500'
                    }`}
                  >
                    {selectedConversation.status === 'auto' ? 'Auto' : 'Escalated'}
                  </Badge>
                </div>

                <Separator className="mb-6" />

                {/* Messages */}
                <div className="space-y-4 mb-6 flex-1">
                  {/* Guest Question - Left aligned */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl p-5 bg-muted/50">
                      <p className="font-semibold text-foreground mb-2">
                        {selectedConversation.question}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* AI Response - Right aligned */}
                  {selectedConversation.status === 'auto' && selectedConversation.answer && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl p-5 bg-[#e8f5e9]">
                        <p className="text-foreground mb-3 leading-relaxed">
                          {selectedConversation.answer}
                        </p>
                        {selectedConversation.confidencePercent && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-white/60 text-xs">
                              AI Response
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              • {selectedConversation.confidencePercent}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* No Response Yet - Escalated */}
                  {selectedConversation.status === 'escalated' && (
                    <div className="bg-muted/30 rounded-2xl p-5 border border-dashed border-border">
                      <p className="text-muted-foreground text-center">
                        This message needs your attention. Draft a response below.
                      </p>
                    </div>
                  )}
                </div>

                {/* Draft Response for Escalated Messages */}
                {!selectedConversation.answer && selectedConversation.status === 'escalated' && <div 
                  id="draft-response-section"
                  className={`mb-6 ${currentTooltip === 4 ? 'ring-[3px] ring-purple-600 ring-offset-2 rounded-lg' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Draft Response</h3>
                    {currentTooltip === 4 ? (
                      // Demo mode for Step 4
                      <div className="flex gap-2">
                        {!aiAssistDemoGenerated ? (
                          <button
                            id="ai-assist-button"
                            onClick={handleAiAssistDemo}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors ring-[3px] ring-purple-600 ring-offset-2"
                          >
                            Generate with AI
                          </button>
                        ) : (
                          <div id="ai-assist-button" className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleAiAssistDemoOption('rewrite')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                aiAssistDemoOption === 'rewrite'
                                  ? 'bg-purple-600 text-white'
                                  : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                              }`}
                            >
                              Rewrite
                            </button>
                            <button
                              onClick={() => handleAiAssistDemoOption('expand')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                aiAssistDemoOption === 'expand'
                                  ? 'bg-purple-600 text-white'
                                  : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                              }`}
                            >
                              Improve & Expand
                            </button>
                            <button
                              onClick={() => handleAiAssistDemoOption('friendlier')}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                aiAssistDemoOption === 'friendlier'
                                  ? 'bg-purple-600 text-white'
                                  : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                              }`}
                            >
                              Make Friendlier
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Normal mode outside Step 4
                      <AIAssistButton 
                        id="ai-assist-button"
                        currentText={draftResponse}
                        onAIGenerate={setDraftResponse}
                        context={`in response to: "${selectedConversation.question}"`}
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Type your response..." 
                      value={draftResponse}
                      onChange={(e) => setDraftResponse(e.target.value)}
                      className="min-h-[120px] border-border"
                      disabled={currentTooltip > 0}
                    />
                    <div className="flex justify-end">
                      <Button 
                        className="rounded-full px-6 gap-2" 
                        style={{
                          backgroundColor: '#5b6850',
                          color: 'white'
                        }}
                        disabled={currentTooltip > 0}
                      >
                        <Send className="w-4 h-4" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                </div>}

                {/* Follow-up Message for Auto-Answered Messages */}
                {selectedConversation.answer && selectedConversation.status === 'auto' && <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">Send Follow-up Message</h3>
                    <AIAssistButton 
                      id="ai-assist-button"
                      currentText={draftResponse}
                      onAIGenerate={setDraftResponse}
                      context={`follow-up message to ${selectedConversation.guestName} regarding: "${selectedConversation.question}"`}
                    />
                  </div>
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Type a follow-up message..." 
                      value={draftResponse}
                      onChange={(e) => setDraftResponse(e.target.value)}
                      className="min-h-[120px] border-border"
                      disabled={currentTooltip > 0}
                    />
                    <div className="flex justify-end">
                      <Button 
                        className="rounded-full px-6 gap-2" 
                        style={{
                          backgroundColor: '#5b6850',
                          color: 'white'
                        }}
                        disabled={currentTooltip > 0}
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>}

                {/* Bottom Section */}
                <div className="mt-auto">
                  <Separator className="mb-6" />

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      id="give-feedback-button"
                      variant="outline" 
                      className={`rounded-full px-6 gap-2 hover:bg-muted/50 ${currentTooltip === 6 ? 'ring-[3px] ring-purple-600 ring-offset-2' : ''}`}
                      onClick={() => {
                        if (currentTooltip > 0) {
                          toast("Available After Onboarding", {
                            description: "You can give feedback on responses once you complete the tour!",
                            duration: 3000,
                          });
                        } else {
                          setIsFeedbackDialogOpen(true);
                        }
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Give Feedback
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Centered Draggable Tooltip */}
        <div 
          className="fixed z-[60] pointer-events-none"
          style={{
            ...getTooltipPosition(),
            transition: isDragging ? 'none' : 'all 0.3s ease-out'
          }}
        >
          <div className={`relative p-6 bg-white rounded-xl shadow-2xl pointer-events-auto ${currentTooltip === 5 ? 'max-w-lg' : 'max-w-md'}`} style={{ border: '4px solid #9333EA' }}>
            {/* Arrow - dynamic position based on step */}
            {!tooltipPosition && currentTooltip === 4 && (
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderLeft: '10px solid #9333EA',
                }}
              />
            )}
            {!tooltipPosition && currentTooltip === 6 && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #9333EA',
                }}
              />
            )}
            {!tooltipPosition && currentTooltip !== 4 && currentTooltip !== 6 && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 -top-3"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: '10px solid #9333EA',
                }}
              />
            )}
            
            {/* Tooltip content */}
            <div className="space-y-4">
                <div 
                  className="flex items-center justify-between gap-3 -mx-2 -mt-2 px-2 pt-2"
                >
                  <h3 className="text-xl font-semibold text-foreground flex-1">{current.title}</h3>
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-purple-50 transition-colors"
                    onMouseDown={handleDragStart}
                  >
                    <GripVertical className="w-4 h-6 text-purple-600 flex-shrink-0" />
                  </div>
                </div>
              <p className="text-muted-foreground">{current.description}</p>
              
              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Step {currentTooltip} of 6
                </div>
                <div className="flex gap-2">
                  {currentTooltip > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {currentTooltip < 6 ? 'Next' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog Components */}
        <GiveFeedbackDialog 
          open={isFeedbackDialogOpen}
          onOpenChange={setIsFeedbackDialogOpen}
          messageContext={selectedConversation.question}
        />

        <SendMessageDialog
          open={isSendMessageDialogOpen}
          onOpenChange={setIsSendMessageDialogOpen}
          segments={segments}
        />
      </div>
    </TourPage>
  );
}
