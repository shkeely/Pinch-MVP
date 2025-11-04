import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Users } from "lucide-react";
import { AIAssistButton } from "@/components/ai/AIAssistButton";

type Segment = 'All' | 'Wedding Party' | 'Out-of-Towners' | 'Parents' | 'Vendors' | string;

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segments: Segment[];
}

export default function SendMessageDialog({ open, onOpenChange, segments }: SendMessageDialogProps) {
  const [message, setMessage] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<Segment>('All');
  const [recipientCount, setRecipientCount] = useState(150);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Message to Guests
          </DialogTitle>
          <DialogDescription>
            Compose and send a message to your selected guest segment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="segment">Select Segment</Label>
            <Select value={selectedSegment} onValueChange={handleSegmentChange}>
              <SelectTrigger id="segment">
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
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Message</Label>
              <AIAssistButton 
                currentText={message}
                onAIGenerate={setMessage}
                context={`for ${selectedSegment} guests`}
              />
            </div>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
