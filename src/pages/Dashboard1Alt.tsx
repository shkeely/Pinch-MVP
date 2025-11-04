import { Send, Bell, Download, Eye, TrendingUp, MessageSquare, Sparkles, Calendar, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWedding } from '@/contexts/WeddingContext';
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

export default function Dashboard1Alt() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    wedding,
    conversations
  } = useWedding();
  
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [draftMessageDialogOpen, setDraftMessageDialogOpen] = useState(false);
  const [addAnswerDialogOpen, setAddAnswerDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const totalQuestions = 47;
  const autoAnswerRate = 37;
  const newMessages = 12;
  const generalQuestions = 8;
  return <div className="min-h-screen bg-background">
      <TopNav />

      <div className="container mx-auto lg:px-6 py-6 lg:py-8 max-w-7xl px-[20px]">
        {/* Daily Digest Section with Stats */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
            {/* Daily Digest Content - Left Column */}
            <div className="flex-1 space-y-6">
              {/* Title and Description */}
              <div>
                <h2 className="text-3xl lg:text-[2.6rem] font-serif font-bold mb-2 text-foreground leading-tight">
                  Daily Digest
                </h2>
                <p className="text-foreground leading-relaxed text-base lg:text-[1.15rem]">
                  <span className="font-semibold">{newMessages} new messages today.</span> {generalQuestions} general questions (parking, timing).
                </p>
              </div>

              {/* Stats Card - Compact and integrated */}
              <div className="w-fit">
                <StatsCard total={totalQuestions} autoPercent={autoAnswerRate} />
              </div>

              {/* Trending Tags */}
              <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium bg-purple-100 text-foreground">
                  Trending: Parking
                </span>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium bg-blue-100 text-foreground">
                  Trending: Kids Policy
                </span>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 text-[0.86rem] font-medium bg-green-100 text-foreground">
                  Trending: Registry
                </span>
              </div>
            </div>

            {/* Right Column - Quick Actions (centered) */}
            <div className="w-full lg:w-[326px] flex justify-center">
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
                  onClick={() => {
                    const chatbotUrl = `${window.location.origin}/chatbot-embed`;
                    navigator.clipboard.writeText(chatbotUrl);
                    toast({
                      title: "Link copied!",
                      description: "Chatbot link has been copied to clipboard.",
                    });
                  }}
                  className="w-full justify-start h-auto py-3 px-4 rounded-full transition-colors bg-white text-[#2E2B27] hover:bg-indigo-400 hover:text-white border-border"
                >
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5" />
                    <span className="text-[15px] font-medium">Share Chatbot</span>
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
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_500px] lg:gap-8 lg:grid-rows-[auto]">

          {/* Needs Your Attention - Full width on mobile/tablet, left column on desktop */}
          <div className="w-full lg:col-start-1 lg:row-start-1 space-y-4">
            <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
              Needs Your Attention
            </h2>
            
            {/* Card 1: Escalated questions */}
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
                  <Button 
                    onClick={() => navigate('/messages')}
                    className="rounded-full px-6 bg-[#5b6850] text-white hover:bg-indigo-400"
                  >
                    Review all
                  </Button>
                </div>
              </div>
            </Card>

            {/* Card 2: Guests asking about parking */}
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
                  <Button 
                    onClick={() => setDraftMessageDialogOpen(true)}
                    className="rounded-full px-6 bg-[#5b6850] text-white hover:bg-indigo-400"
                  >
                    Draft message
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
                  <Button 
                    onClick={() => setAddAnswerDialogOpen(true)}
                    className="rounded-full px-6 bg-[#5b6850] text-white hover:bg-indigo-400"
                  >
                    Add answer
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Reminders */}
          <Card className="w-full lg:col-start-2 lg:row-start-1 lg:w-[500px] p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
            <h2 className="text-2xl font-serif font-medium mb-1 text-foreground">
              Upcoming Reminders
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Next scheduled messages
            </p>
            
            <div className="space-y-2">
              {/* Reminder 1 */}
              <div className="border border-border rounded-lg p-2 border-l-4 border-l-purple-500">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium text-foreground">RSVP Deadline Reminder</h3>
                  <div className="flex gap-1.5">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Scheduled</Badge>
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">RSVP</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(2025, 10, 15), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>9:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>120 guests</span>
                  </div>
                </div>
              </div>

              {/* Reminder 2 */}
              <div className="border border-border rounded-lg p-2 border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium text-foreground">Day-Of Reminder</h3>
                  <div className="flex gap-1.5">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Scheduled</Badge>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs">Attendance</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(2025, 3, 15), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>9:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>127 guests</span>
                  </div>
                </div>
              </div>

              {/* Reminder 3 */}
              <div className="border border-border rounded-lg p-2 border-l-4 border-l-orange-500">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium text-foreground">Thank You Message</h3>
                  <div className="flex gap-1.5">
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-xs">Draft</Badge>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">Thank You</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(2025, 3, 20), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>12:00 PM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>127 guests</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={() => navigate('/reminders')}
              className="w-full mt-4 rounded-full"
            >
              View All Reminders
            </Button>
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