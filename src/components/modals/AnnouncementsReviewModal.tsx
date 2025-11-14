import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Edit, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { AnnouncementPreviewModal } from './AnnouncementPreviewModal';
import { toast } from 'sonner';

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

interface AnnouncementsReviewModalProps {
  open: boolean;
  onClose: () => void;
  announcements: Announcement[];
}

export function AnnouncementsReviewModal({ open, onClose, announcements }: AnnouncementsReviewModalProps) {
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const handlePreview = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setPreviewModalOpen(true);
  };

  const handleEdit = () => {
    toast.info('Navigate to Announcements page to edit');
  };

  const handleCancel = (title: string) => {
    toast.success(`Cancelled: ${title}`);
  };

  const handleViewAll = () => {
    toast.info('Navigate to Announcements page');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              📢 Upcoming Guest Announcements
            </DialogTitle>
            <DialogDescription>
              You have {announcements.length} scheduled announcement{announcements.length !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {announcements.map((announcement) => (
              <div 
                key={announcement.id}
                className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header with icon and title */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-foreground" />
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Scheduled
                  </Badge>
                </div>

                {/* Schedule info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-foreground" />
                    <span>Scheduled: {announcement.scheduledDate} at {announcement.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-foreground" />
                    <span>Recipients: {announcement.recipients} ({announcement.recipientCount} people)</span>
                  </div>
                </div>

                {/* Message preview */}
                <div className="bg-muted/50 rounded-md p-3 mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.message.length > 100 
                      ? `${announcement.message.substring(0, 100)}...` 
                      : announcement.message}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleCancel(announcement.title)}
                    className="text-sm text-destructive hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="rounded-full"
                    >
                      <Edit className="w-4 h-4 mr-1 text-foreground" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(announcement)}
                      className="rounded-full"
                    >
                      <Eye className="w-4 h-4 mr-1 text-foreground" />
                      Preview
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleViewAll} className="bg-primary text-primary-foreground">
              View All Announcements
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested preview modal */}
      {selectedAnnouncement && (
        <AnnouncementPreviewModal
          open={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          announcement={selectedAnnouncement}
        />
      )}
    </>
  );
}
