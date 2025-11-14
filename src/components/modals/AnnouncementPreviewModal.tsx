import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  recipients: string;
  recipientCount: number;
  status: 'scheduled' | 'draft' | 'sent';
  category: 'reminder' | 'update' | 'announcement';
}

interface AnnouncementPreviewModalProps {
  open: boolean;
  onClose: () => void;
  announcement: Announcement;
}

export function AnnouncementPreviewModal({ open, onClose, announcement }: AnnouncementPreviewModalProps) {
  const charCount = announcement.message.length;
  
  // Determine color based on character count (SMS segments)
  const getCharCountColor = () => {
    if (charCount <= 160) return 'text-green-600';
    if (charCount <= 320) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md z-[60]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            📱 Message Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Announcement title */}
          <div>
            <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is how your message will appear:
            </p>
          </div>

          {/* SMS-style bubble */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-4 max-w-[85%] shadow-sm">
            <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
              {announcement.message}
            </p>
            <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">
              Sent by: Pinch (Sarah & Mike's Wedding)
            </p>
          </div>

          {/* Character count */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Character count:</span>
            <span className={`font-semibold ${getCharCountColor()}`}>
              {charCount} characters
              {charCount > 160 && ` (${Math.ceil(charCount / 160)} SMS segments)`}
            </span>
          </div>

          {/* Metadata */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Will be sent to: <span className="font-medium text-foreground">{announcement.recipientCount} guests</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                On: <span className="font-medium text-foreground">{announcement.scheduledDate} at {announcement.scheduledTime}</span>
              </span>
            </div>
          </div>

          {/* Close button */}
          <Button onClick={onClose} className="w-full">
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
