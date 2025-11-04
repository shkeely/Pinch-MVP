import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type ReminderCategory = 'RSVP' | 'Attendance' | 'Info' | 'Thank You' | 'Custom';

type Reminder = {
  id: number;
  title: string;
  category: ReminderCategory;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  recipientSegment: string;
  recipientCount: number;
  status: 'Scheduled' | 'Sent' | 'Draft';
};

interface EditReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: Reminder | null;
  onSave: (reminder: Reminder) => void;
}

export default function EditReminderDialog({ open, onOpenChange, reminder, onSave }: EditReminderDialogProps) {
  const [formData, setFormData] = useState<Reminder | null>(null);

  useEffect(() => {
    if (reminder) {
      setFormData({ ...reminder });
    }
  }, [reminder]);

  const handleSave = () => {
    if (!formData) return;

    if (!formData.title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    onSave(formData);
    onOpenChange(false);
    toast.success("Reminder updated successfully");
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
          <DialogDescription>
            Update reminder details and schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Reminder title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value as ReminderCategory })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RSVP">RSVP</SelectItem>
                <SelectItem value="Attendance">Attendance</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
                <SelectItem value="Thank You">Thank You</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Message content"
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Scheduled Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Scheduled Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.scheduledTime.replace(/\s*[AP]M$/i, '')}
                onChange={(e) => {
                  const time = e.target.value;
                  const [hours, minutes] = time.split(':');
                  const hour = parseInt(hours);
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                  setFormData({ ...formData, scheduledTime: `${displayHour}:${minutes} ${ampm}` });
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment">Recipient Segment</Label>
            <Input
              id="segment"
              value={formData.recipientSegment}
              onChange={(e) => setFormData({ ...formData, recipientSegment: e.target.value })}
              placeholder="e.g., All guests, Wedding Party"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">Recipient Count</Label>
            <Input
              id="count"
              type="number"
              value={formData.recipientCount}
              onChange={(e) => setFormData({ ...formData, recipientCount: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
