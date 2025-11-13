import { Send, Bell, Download, Eye, TrendingUp, MessageSquare, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWedding } from '@/contexts/WeddingContext';
import { useFakeData } from '@/contexts/FakeDataContext';
import TopNav from '@/components/navigation/TopNav';
import StatsCard from '@/components/dashboard/StatsCard';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AIAssistButton } from "@/components/ai/AIAssistButton";
import AnimatedGreeting from '@/components/homepage/AnimatedGreeting';

export default function Dashboard1Alt() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    wedding,
    conversations
  } = useWedding();
  const { homepage } = useFakeData();
  
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [draftMessageDialogOpen, setDraftMessageDialogOpen] = useState(false);
  const [addAnswerDialogOpen, setAddAnswerDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  return <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto lg:px-6 py-6 lg:py-8 max-w-7xl px-[20px]">
        {/* Daily Digest Section with Stats */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
            {/* Daily Digest Content - Left Column */}
            <div className="flex-1 space-y-6">
              {/* Animated Greeting */}
              <AnimatedGreeting 
                userName={wedding?.couple1 || "there"} 
                status={homepage.needsAttention.length > 0 ? 'needs-attention' : homepage.metrics.questionsToday === 0 ? 'all-clear' : 'normal'} 
              />
              
              {/* Daily Summary */}
              <div>
                <p className="text-foreground leading-relaxed text-base lg:text-[1.15rem]">
                  <span className="font-semibold">{homepage.metrics.questionsToday} new messages today.</span> {homepage.metrics.questionsAnswered} questions answered automatically.
                </p>
              </div>

              {/* Stats Card - Compact and integrated */}
              <div className="w-fit">
                <StatsCard total={homepage.metrics.questionsToday} autoPercent={homepage.metrics.autoAnsweredPercent} />
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
            <div className="flex-shrink-0 w-full lg:w-[500px] flex lg:justify-center">
              <Card className="w-full lg:w-[326px] p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
              <h2 className="text-2xl font-serif font-medium mb-1 text-foreground">
                Quick Actions
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Manage things efficiently
              </p>
              
              <div className="space-y-1.5">
                <Button 
                  variant="outline" 
                  onClick={() => setMessageDialogOpen(true)}
                  className="w-full justify-start h-auto py-3 px-4 rounded-full transition-colors bg-white text-[#2E2B27] hover:bg-indigo-400 hover:text-white border-border"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <span className="text-[15px] font-medium">Send a Message to Guests</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setFollowUpDialogOpen(true)}
                  className="w-full justify-start h-auto py-3 px-4 rounded-full transition-colors bg-white text-[#2E2B27] hover:bg-indigo-400 hover:text-white border-border"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5" />
                    <span className="text-[15px] font-medium">Schedule Follow-up</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/guests')}
                  className="w-full justify-start h-auto py-3 px-4 rounded-full transition-colors bg-white text-[#2E2B27] hover:bg-indigo-400 hover:text-white border-border"
                >
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
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_auto] lg:gap-5 lg:grid-rows-[auto]">

          {/* Needs Your Attention - Full width on mobile/tablet, left column on desktop */}
          <div className="w-full lg:col-start-1 lg:row-start-1 space-y-4">
            <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
              Needs Your Attention
            </h2>
            
            {/* Dynamic Needs Attention Cards */}
            {homepage.needsAttention.map((item) => (
              <Card key={item.id} className="p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                    {item.type === 'escalated' ? (
                      <MessageSquare className="w-6 h-6 text-foreground" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-serif text-foreground">{item.title}</h3>
                      {item.urgent && (
                        <Badge className="bg-[#e85d5d] hover:bg-[#e85d5d] text-white px-3 py-1 text-xs rounded-full">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <Button 
                      onClick={() => item.type === 'escalated' ? navigate('/messages') : setAddAnswerDialogOpen(true)}
                      className="rounded-full px-6 bg-[#5b6850] text-white hover:bg-indigo-400"
                    >
                      {item.type === 'escalated' ? 'Review all' : 'Add answer'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Your Concierge - Full width on mobile/tablet, right column on desktop */}
          <Card className="w-full lg:col-start-2 lg:row-start-1 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] flex flex-col min-h-[400px] lg:min-h-0 lg:justify-self-end lg:w-[500px] p-0">
            {/* Header Section */}
            <div className="bg-card px-5 pt-5 pb-4">
              <h2 className="text-2xl font-serif font-medium text-foreground">
                Your Concierge
              </h2>
            </div>
            
            {/* Chat Area with Gradient */}
            <div className="bg-gradient-to-b from-[#ccc1dd] via-[#b7c4f1] to-[#c8deb9] flex-1 px-5 pt-4 pb-4 flex flex-col">
              <div className="space-y-3 flex-1 mb-4">
                <div className="flex justify-start">
                  <div className="bg-white text-foreground rounded-3xl rounded-tl-md px-4 py-2.5 shadow-sm max-w-xs">
                    <p className="text-sm">what time is the wedding</p>
                    <p className="text-xs text-muted-foreground mt-1">01:17 PM</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="text-foreground rounded-3xl rounded-tr-md px-4 py-2.5 shadow-sm max-w-xs bg-blue-50">
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
            </div>
          </Card>
        </div>
      </div>

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Message to Guests</DialogTitle>
            <DialogDescription>
              Compose a message to send to all your guests
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Message</label>
              <AIAssistButton 
                currentText={messageContent}
                onAIGenerate={setMessageContent}
                context="regarding your upcoming wedding celebration"
              />
            </div>
            <Textarea 
              placeholder="Type your message here..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Message sent!",
                  description: "Your message has been sent to all guests.",
                });
                setMessageDialogOpen(false);
                setMessageContent('');
              }}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Follow-up</DialogTitle>
            <DialogDescription>
              Set a reminder to follow up with guests
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Follow-up message</label>
              <Textarea 
                placeholder="What would you like to follow up about?"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">When?</label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowUpDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Follow-up scheduled!",
                  description: "We'll remind you to follow up at the scheduled time.",
                });
                setFollowUpDialogOpen(false);
              }}
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draft Message Dialog */}
      <Dialog open={draftMessageDialogOpen} onOpenChange={setDraftMessageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Draft Message About Parking</DialogTitle>
            <DialogDescription>
              AI-generated message based on your wedding details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Message about parking</label>
              <AIAssistButton 
                currentText={draftContent}
                onAIGenerate={setDraftContent}
                context="There's a parking lot at the venue with plenty of spaces"
              />
            </div>
            <Textarea 
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraftMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Message sent!",
                  description: "Your message about parking has been sent to guests.",
                });
                setDraftMessageDialogOpen(false);
              }}
            >
              Send to Guests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Answer Dialog */}
      <Dialog open={addAnswerDialogOpen} onOpenChange={setAddAnswerDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add FAQ Answer</DialogTitle>
            <DialogDescription>
              Question: "Is there a shuttle?"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Your answer</label>
              <AIAssistButton 
                currentText={faqAnswer}
                onAIGenerate={setFaqAnswer}
                context="regarding shuttle service availability at the wedding venue"
              />
            </div>
            <Textarea 
              placeholder="Type your answer here..."
              value={faqAnswer}
              onChange={(e) => setFaqAnswer(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAnswerDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Answer added!",
                  description: "The answer has been added to your FAQ.",
                });
                setAddAnswerDialogOpen(false);
              }}
            >
              Add to FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
}