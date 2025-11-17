import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Sparkles, Check, X, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface GiveFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageContext?: string;
}

export default function GiveFeedbackDialog({ open, onOpenChange, messageContext }: GiveFeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const generateRecommendations = () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty");
      return;
    }

    // Simulate AI-generated chatbot brain recommendations
    const generatedRecs = [
      `Add FAQ: "${messageContext}" with improved answer based on feedback`,
      `Update tone guidelines to be more ${feedback.includes('friendly') ? 'friendly' : 'professional'}`,
      `Add context about guest expectations and common concerns`
    ];
    
    setRecommendations(generatedRecs);
    setShowRecommendations(true);
  };

  const handleApproveAll = () => {
    toast.success("Concierge Brain updated successfully!");
    setFeedback('');
    setShowRecommendations(false);
    setRecommendations([]);
    onOpenChange(false);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(recommendations[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...recommendations];
      updated[editingIndex] = editText;
      setRecommendations(updated);
      setEditingIndex(null);
      setEditText('');
    }
  };

  const handleRemove = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setFeedback('');
    setShowRecommendations(false);
    setRecommendations([]);
    setEditingIndex(null);
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
            Help improve AI responses by providing feedback. This will update the concierge's brain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {messageContext && (
            <div className="bg-muted/50 rounded-lg p-4">
              <Label className="text-sm font-medium text-muted-foreground">Message Context</Label>
              <p className="text-sm mt-1">{messageContext}</p>
            </div>
          )}

          {!showRecommendations ? (
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
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Recommended Concierge Brain Changes</h3>
              </div>
              
              {recommendations.map((rec, idx) => (
                <Card key={idx} className="p-4">
                  {editingIndex === idx ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm flex-1">{rec}</p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(idx)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemove(idx)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {recommendations.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  All recommendations removed. Add feedback to generate new ones.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {!showRecommendations ? (
            <Button onClick={generateRecommendations} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Recommendations
            </Button>
          ) : (
            <Button 
              onClick={handleApproveAll} 
              disabled={recommendations.length === 0}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve & Update
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
