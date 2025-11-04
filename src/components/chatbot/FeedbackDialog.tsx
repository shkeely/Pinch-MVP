import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, ThumbsUp, ThumbsDown, Edit3, Smile, Briefcase, Heart } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageContent: string;
  onApplyChanges?: (newContent: string, tone?: string) => void;
}

export function FeedbackDialog({ open, onOpenChange, messageContent, onApplyChanges }: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState<'like' | 'dislike' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [rewriteRequest, setRewriteRequest] = useState('');
  const [updateKnowledgeBase, setUpdateKnowledgeBase] = useState(false);

  const tones = [
    { id: 'warm', name: 'More Warm', icon: Heart },
    { id: 'formal', name: 'More Formal', icon: Briefcase },
    { id: 'fun', name: 'More Fun', icon: Smile },
    { id: 'less-warm', name: 'Less Warm', icon: Heart },
    { id: 'less-formal', name: 'Less Formal', icon: Briefcase },
    { id: 'less-fun', name: 'Less Fun', icon: Smile }
  ];

  const handleRewrite = () => {
    if (!rewriteRequest.trim() && !selectedTone) {
      toast.error("Please select a tone or describe changes");
      return;
    }

    // Simulate rewrite
    const rewrittenContent = `${messageContent} (Rewritten with ${selectedTone || 'custom changes'})`;
    onApplyChanges?.(rewrittenContent, selectedTone);
    toast.success("Message rewritten successfully");
    onOpenChange(false);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim() && !feedbackType) {
      toast.error("Please provide feedback");
      return;
    }

    toast.success(
      updateKnowledgeBase 
        ? "Feedback submitted! Knowledge base will be updated." 
        : "Feedback submitted successfully"
    );
    
    // Reset form
    setFeedbackType(null);
    setFeedbackText('');
    setSelectedTone('');
    setRewriteRequest('');
    setUpdateKnowledgeBase(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Provide Feedback on AI Response
          </DialogTitle>
          <DialogDescription>
            Help improve AI responses by sharing what you liked or didn't like
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Original Message */}
          <div className="bg-muted/50 rounded-lg p-4">
            <Label className="text-sm font-medium text-muted-foreground">AI Response</Label>
            <p className="text-sm mt-2 leading-relaxed">{messageContent}</p>
          </div>

          {/* Like/Dislike */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-3">
              <Button
                variant={feedbackType === 'like' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFeedbackType('like')}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button
                variant={feedbackType === 'dislike' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setFeedbackType('dislike')}
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Dislike
              </Button>
            </div>
          </div>

          {/* Tone Adjustment */}
          <div className="space-y-2">
            <Label>Adjust Tone (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {tones.map(tone => {
                const Icon = tone.icon;
                return (
                  <Button
                    key={tone.id}
                    variant={selectedTone === tone.id ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setSelectedTone(tone.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tone.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Rewrite Request */}
          <div className="space-y-2">
            <Label htmlFor="rewrite">Request Rewrite (Optional)</Label>
            <Textarea
              id="rewrite"
              value={rewriteRequest}
              onChange={(e) => setRewriteRequest(e.target.value)}
              placeholder="Describe how you'd like the response rewritten..."
              className="min-h-[80px]"
            />
            {(rewriteRequest.trim() || selectedTone) && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleRewrite}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Apply Rewrite
              </Button>
            )}
          </div>

          {/* General Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Feedback</Label>
            <Textarea
              id="feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share specific callouts, what you liked or didn't like..."
              className="min-h-[100px]"
            />
          </div>

          {/* Update Knowledge Base */}
          <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
            <input
              type="checkbox"
              id="update-kb"
              checked={updateKnowledgeBase}
              onChange={(e) => setUpdateKnowledgeBase(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="update-kb" className="cursor-pointer">
              Update knowledge base with this feedback
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
