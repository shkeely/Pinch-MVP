import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TopNav from '@/components/navigation/TopNav';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { TourPage } from '@/components/onboarding/TourPage';
import { useWedding } from '@/contexts/WeddingContext';
import { FAKE_DATA } from '@/data/fakeData';

export default function Step8MessagesPage() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [tooltipTop, setTooltipTop] = useState(0);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const conversations = FAKE_DATA.recentConversations;
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

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
    if (currentTooltip < 3) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      updateWedding({ onboardingStep: 9 });
      navigate('/onboarding/step-9');
    }
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
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
    }
  };

  const current = tooltipContent[currentTooltip as keyof typeof tooltipContent];

  return (
    <TourPage
      stepNumber={8}
      title="Guest Conversations"
      description="See how Pinch handles your guest messages"
      onNext={currentTooltip === 3 ? handleNext : undefined}
      onPrevious={handlePrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      <div className="relative w-full h-full">

        {/* Messages Page Content */}
        <div className="min-h-screen bg-background">
          <TopNav />
          
          <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Messages
              </h1>
              <p className="text-muted-foreground text-base">
                Guest conversations & AI responses
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="default" size="sm">All</Button>
              <Button variant="outline" size="sm">Auto-Answered</Button>
              <Button variant="outline" size="sm">Escalated</Button>
              <Button variant="outline" size="sm">Risky</Button>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Conversation List */}
              <Card className="p-6 relative" id="conversation-list">
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10"
                      disabled
                    />
                  </div>

                  {/* Conversation Items */}
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedConversation.id === conv.id
                            ? 'bg-accent border-primary'
                            : 'hover:bg-accent/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{conv.guestName}</p>
                            <p className="text-xs text-muted-foreground">{conv.phoneNumber}</p>
                          </div>
                          <Badge
                            variant={conv.status === 'escalated' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {conv.status === 'auto' ? 'Auto' : 'Escalated'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {conv.question}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {conv.timestamp} • {conv.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </Card>

              {/* Right Panel - Conversation Detail */}
              <Card className={`p-6 relative ${currentTooltip === 2 ? 'z-50' : ''}`} id="conversation-thread">
                <div className="space-y-4">
                  {/* Guest Info Header */}
                  <div className="flex items-start justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {selectedConversation.guestName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.phoneNumber}
                      </p>
                    </div>
                  </div>

                  {/* Conversation Thread */}
                  <div className="space-y-4 min-h-[400px]">
                    {/* Guest Message */}
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm text-foreground">
                          {selectedConversation.question}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedConversation.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* AI Response (if auto-answered) */}
                    {selectedConversation.status === 'auto' && (
                      <div className="flex justify-end">
                        <div className="bg-primary/10 rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center gap-2 mb-2" id="confidence-indicator">
                            <Badge 
                              className={`text-xs ${getConfidenceBadgeColor(selectedConversation.confidence)}`}
                            >
                              {selectedConversation.confidencePercent}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Pinch</span>
                          </div>
                          <p className="text-sm text-foreground">
                            {selectedConversation.answer}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedConversation.timestamp}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Escalated Notice */}
                    {selectedConversation.status === 'escalated' && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-800">
                          ⚠️ This conversation needs your attention
                        </p>
                      </div>
                    )}
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
          <div className="relative max-w-md p-6 bg-white rounded-xl shadow-2xl pointer-events-auto" style={{ border: '4px solid #9333EA' }}>
            {/* Arrow - only show when not dragged */}
            {!tooltipPosition && (
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
                  Tour: Step 4 of 6 • Step {currentTooltip} of 3
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
                    {currentTooltip < 3 ? 'Next' : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TourPage>
  );
}
