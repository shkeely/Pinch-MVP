import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedSegments, setSelectedSegments] = useState<Segment[]>([]);
  const [showRefinementButtons, setShowRefinementButtons] = useState(false);

  // Calculate recipient count based on selected segments
  const getRecipientCount = () => {
    const counts: Record<string, number> = {
      'All': 150,
      'Wedding Party': 12,
      'Out-of-Towners': 45,
      'Parents': 8,
      'Vendors': 15
    };
    
    if (selectedSegments.includes('All')) return 150;
    
    return selectedSegments.reduce((total, segment) => {
      return total + (counts[segment] || 20);
    }, 0);
  };

  const recipientCount = getRecipientCount();

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (selectedSegments.length === 0) {
      toast.error("Please select at least one segment");
      return;
    }

    toast.success(`Message sent to ${selectedSegments.length} segment${selectedSegments.length !== 1 ? 's' : ''}`);
    setMessage('');
    setSelectedSegments([]);
    onOpenChange(false);
  };

  const handleSegmentToggle = (segment: Segment, checked: boolean) => {
    if (checked) {
      setSelectedSegments([...selectedSegments, segment]);
    } else {
      setSelectedSegments(selectedSegments.filter(s => s !== segment));
    }
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
              ? "Segments let you target specific groups of guests. Try selecting multiple segments below to send to different groups at once!"
              : "Compose and send a message to one or more guest segments"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Send To</Label>
            <p className="text-xs text-muted-foreground">Select one or more segments</p>
            <div className={`space-y-2 bg-muted/30 p-3 rounded-md max-h-[200px] overflow-y-auto ${tourMode ? 'ring-2 ring-purple-500 ring-offset-2 animate-pulse' : ''}`}>
              {segments.map((segment) => (
                <div key={segment} className="flex items-center gap-2">
                  <Checkbox
                    id={`send-segment-${segment}`}
                    checked={selectedSegments.includes(segment)}
                    onCheckedChange={(checked) => handleSegmentToggle(segment, checked as boolean)}
                  />
                  <label
                    htmlFor={`send-segment-${segment}`}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {segment}
                  </label>
                </div>
              ))}
            </div>
            
            {selectedSegments.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-md p-3 text-sm">
                <p className="font-medium text-purple-900 mb-2">Selected Segments:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSegments.map((segment) => (
                    <Badge key={segment} className="bg-purple-600 text-white">
                      {segment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{recipientCount} recipients will receive this message</span>
            </div>
            {tourMode && (
              <p className="text-xs text-purple-600 font-medium">
                👆 Try selecting multiple segments to see how multi-targeting works!
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
                  context={`for ${selectedSegments.length > 0 ? selectedSegments.join(', ') : 'selected'} guests`}
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
          <Button 
            onClick={handleSend} 
            disabled={!message.trim() || selectedSegments.length === 0}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            Send to {selectedSegments.length} {selectedSegments.length === 1 ? 'Segment' : 'Segments'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
