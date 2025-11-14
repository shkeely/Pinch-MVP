import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Phone, AlertCircle, Lightbulb } from 'lucide-react';
import { ReplyComposerModal } from './ReplyComposerModal';

interface EscalatedQuestionModalProps {
  open: boolean;
  onClose: () => void;
  guestName: string;
  guestPhone: string;
  question: string;
  confidence: number;
  aiAttemptedResponse: string;
  escalationReason: string;
  timestamp: string;
}

export function EscalatedQuestionModal({
  open,
  onClose,
  guestName,
  guestPhone,
  question,
  confidence,
  aiAttemptedResponse,
  escalationReason,
  timestamp
}: EscalatedQuestionModalProps) {
  const [replyModalOpen, setReplyModalOpen] = useState(false);

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500/10 text-green-700 border-green-500/20';
    if (confidence >= 50) return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
    return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
  };

  const handleReplyManually = () => {
    setReplyModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[100vw] sm:w-auto p-6 animate-in fade-in-0 zoom-in-95 rounded-none sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <DialogTitle className="text-2xl font-semibold text-foreground">
              Escalated Question
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guest Info */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">{guestName}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{guestPhone}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`flex items-center gap-1.5 px-3 py-1 border ${getConfidenceBadgeColor(confidence)}`}>
                <span className="font-semibold">{confidence}%</span>
                <span className="text-xs">confidence</span>
              </Badge>
              <span className="text-sm text-muted-foreground">{timestamp}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Question Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Guest Question:</p>
            <p className="text-base text-foreground leading-relaxed">
              {question}
            </p>
          </div>

          {/* Pinch's Attempted Response */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pinch's Attempted Response:</p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-base text-foreground leading-relaxed">
                {aiAttemptedResponse}
              </p>
            </div>
          </div>

          {/* Reason for Escalation */}
          <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Reason for Escalation
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  {escalationReason}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-6">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Dismiss
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Add to Chatbot Brain
          </Button>
          <Button 
            onClick={handleReplyManually}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          >
            Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ReplyComposerModal
      open={replyModalOpen}
      onClose={() => setReplyModalOpen(false)}
      guestName={guestName}
      guestPhone={guestPhone}
      question={question}
    />
    </>
  );
}
