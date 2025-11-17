import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, MessageCircle } from 'lucide-react';

interface AISuggestionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  suggestionContext: string;
  relatedQuestions: string[];
  recommendedAction: string;
  timestamp: string;
}

export function AISuggestionModal({
  open,
  onClose,
  title,
  suggestionContext,
  relatedQuestions,
  recommendedAction,
  timestamp
}: AISuggestionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[100vw] sm:w-auto p-6 animate-in fade-in-0 zoom-in-95 rounded-none sm:rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <DialogTitle className="text-2xl font-semibold text-foreground">
              AI Suggestion
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
          {/* Suggestion Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">
                Suggestion
              </Badge>
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">{timestamp}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Context */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Why Pinch suggests this:</p>
            <p className="text-base text-foreground leading-relaxed">
              {suggestionContext}
            </p>
          </div>

          {/* Pattern Detected */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Questions that triggered this suggestion:
            </p>
            <div className="space-y-2">
              {relatedQuestions.map((question, index) => (
                <div 
                  key={index} 
                  className="bg-muted/50 rounded-lg p-3 border border-border"
                >
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Recommended Action:</p>
            <p className="text-base text-foreground leading-relaxed">
              {recommendedAction}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Pro Tip
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Adding this information to your concierge brain will help Pinch answer similar questions automatically in the future.
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
            className="w-full sm:w-auto"
          >
            Not Now
          </Button>
          <Button 
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Add to Concierge Brain
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
