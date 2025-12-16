import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Users, Sparkles } from "lucide-react";
import { AIAssistButton } from "@/components/ai/AIAssistButton";

type Segment = 'All' | 'Wedding Party' | 'Out-of-Towners' | 'Parents' | 'Vendors' | string;

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segments: Segment[];
  tourMode?: boolean;
}

export default function SendMessageDialog({ open, onOpenChange, segments, tourMode = false }: SendMessageDialogProps) {
  const [message, setMessage] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<Segment>('All');
  const [recipientCount, setRecipientCount] = useState(150);
  const [showRefinementButtons, setShowRefinementButtons] = useState(false);

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    toast.success(`Message sent to ${recipientCount} guests in "${selectedSegment}" segment`);
    setMessage('');
    setSelectedSegment('All');
    onOpenChange(false);
  };

  const handleSegmentChange = (segment: Segment) => {
    setSelectedSegment(segment);
    // Simulate different recipient counts based on segment
    const counts: Record<string, number> = {
      'All': 150,
      'Wedding Party': 12,
      'Out-of-Towners': 45,
      'Parents': 8,
      'Vendors': 15
    };
    setRecipientCount(counts[segment] || 20);
  };

  const handleAIGenerate = (text: string) => {
    setMessage(text);
    setShowRefinementButtons(true);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    if (newMessage.trim().length > 0) {
      setShowRefinementButtons(true);
    } else {
      setShowRefinementButtons(false);
    }
  };

  const handleRefinement = (type: 'rewrite' | 'expand' | 'friendlier') => {
    const refinements = {
      rewrite: "Hello everyone! We wanted to share some important updates about our celebration. Please review and let us know if you have any questions.",
      expand: message + "\n\nWe truly appreciate your understanding and can't wait to see you there! Feel free to reach out if you need anything else.",
      friendlier: message + " 😊 We're so excited to celebrate with you!"
    };
    setMessage(refinements[type]);
    toast.success(`Message ${type === 'rewrite' ? 'rewritten' : type === 'expand' ? 'expanded' : 'made friendlier'}!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Message to Guests
          </DialogTitle>
          <DialogDescription>
            {tourMode 
              ? "Segments let you target specific groups of guests. Try selecting different segments below to see how many recipients are in each group!"
              : "Compose and send a message to your selected guest segment"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="segment">Select Segment</Label>
            <Select value={selectedSegment} onValueChange={handleSegmentChange}>
              <SelectTrigger id="segment" className={tourMode ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white animate-pulse' : ''}>
                <SelectValue placeholder="Choose guest segment" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment} value={segment}>
                    {segment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{recipientCount} recipients will receive this message</span>
            </div>
            {tourMode && (
              <p className="text-xs text-purple-600 font-medium">
                👆 Try selecting different segments to see how targeting works!
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Label htmlFor="message">Message</Label>
              <div className="flex items-center gap-2 flex-wrap">
                {showRefinementButtons && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefinement('rewrite')}
                      className={`gap-1 text-xs ${tourMode ? 'border-purple-300 text-purple-700 hover:bg-purple-50' : ''}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Rewrite
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefinement('expand')}
                      className={`gap-1 text-xs ${tourMode ? 'border-purple-300 text-purple-700 hover:bg-purple-50' : ''}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Improve & Expand
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefinement('friendlier')}
                      className={`gap-1 text-xs ${tourMode ? 'border-purple-300 text-purple-700 hover:bg-purple-50' : ''}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Make Friendlier
                    </Button>
                  </>
                )}
                <AIAssistButton 
                  currentText={message}
                  onAIGenerate={handleAIGenerate}
                  context={`for ${selectedSegment} guests`}
                />
              </div>
            </div>
            <Textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type your message here..."
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              Character count: {message.length} / 500
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
