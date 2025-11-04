import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

interface GiveFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageContext?: string;
}

export default function GiveFeedbackDialog({ open, onOpenChange, messageContext }: GiveFeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    // Here we would update the knowledge base
    toast.success("Feedback submitted! Knowledge base will be updated.");
    setFeedback('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Give Feedback
          </DialogTitle>
          <DialogDescription>
            Help improve AI responses by providing feedback. This will update the chatbot's knowledge base.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {messageContext && (
            <div className="bg-muted/50 rounded-lg p-4">
              <Label className="text-sm font-medium text-muted-foreground">Message Context</Label>
              <p className="text-sm mt-1">{messageContext}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe what should be improved or corrected in the AI response..."
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              This feedback will be used to improve future responses
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
