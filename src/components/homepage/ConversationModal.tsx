import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Shirt, Gift, MapPin, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Conversation {
  id: number;
  guestName: string;
  category: string;
  question: string;
  answer: string | null;
  timestamp: string;
}

interface ConversationModalProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Parking': <Car className="w-3.5 h-3.5" />,
  'Dress Code': <Shirt className="w-3.5 h-3.5" />,
  'Registry': <Gift className="w-3.5 h-3.5" />,
  'Venue': <MapPin className="w-3.5 h-3.5" />,
  'Timing': <Clock className="w-3.5 h-3.5" />,
  'RSVP Changes': <Clock className="w-3.5 h-3.5" />,
  'Attire': <Shirt className="w-3.5 h-3.5" />,
};

export function ConversationModal({ conversation, isOpen, onClose }: ConversationModalProps) {
  const navigate = useNavigate();

  if (!conversation) return null;

  const handleViewFullConversation = () => {
    navigate('/messages');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-6 animate-in fade-in-0 zoom-in-95">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-semibold text-foreground">
            {conversation.guestName}
          </DialogTitle>
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
          {/* Category and Timestamp */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
              {categoryIcons[conversation.category] || <Clock className="w-3.5 h-3.5" />}
              <span>{conversation.category}</span>
            </Badge>
            <span className="text-sm text-muted-foreground">{conversation.timestamp}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Question Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Guest Question:</p>
            <p className="text-base text-foreground leading-relaxed">
              {conversation.question}
            </p>
          </div>

          {/* Answer Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pinch Response:</p>
            {conversation.answer ? (
              <p className="text-base text-foreground leading-relaxed">
                {conversation.answer}
              </p>
            ) : (
              <p className="text-base text-muted-foreground italic">
                This question was escalated and needs your attention
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-6">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button 
            onClick={handleViewFullConversation}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
          >
            View Full Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
