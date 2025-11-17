import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AIAssistButton } from "@/components/ai/AIAssistButton";
import { Plus } from "lucide-react";

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
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(['RSVP', 'Attendance', 'Info', 'Thank You', 'Custom']);
  const guestSegments = ['All Guests', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors', 'Family', 'Friends'];
  
  // Mock recipient counts per segment
  const segmentCounts: Record<string, number> = {
    'All Guests': 150,
    'Wedding Party': 12,
    'Out-of-Towners': 45,
    'Parents': 4,
    'Vendors': 8,
    'Family': 35,
    'Friends': 60
  };

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
    toast.success("Announcement updated successfully");
  };

  const handleSaveDraft = () => {
    if (!formData) return;
    
    const draftReminder = { ...formData, status: 'Draft' as const };
    onSave(draftReminder);
    onOpenChange(false);
    toast.success("Draft saved successfully");
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setFormData({ ...formData!, category: newCategory.trim() as ReminderCategory });
      setNewCategory('');
      setIsAddingCategory(false);
      toast.success("Category added");
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
          <DialogDescription>
            Update announcement details and schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Announcement title"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Category</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="h-auto py-1"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </Button>
            </div>
            {isAddingCategory && (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button type="button" size="sm" onClick={handleAddCategory}>Add</Button>
              </div>
            )}
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value as ReminderCategory })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Message</Label>
              <AIAssistButton
                currentText={formData.message}
                onAIGenerate={(text) => setFormData({ ...formData, message: text })}
                context={`reminder for ${formData.recipientSegment}`}
              />
            </div>
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
            <Select
              value={formData.recipientSegment}
              onValueChange={(value) => {
                const count = segmentCounts[value] || 0;
                setFormData({ ...formData, recipientSegment: value, recipientCount: count });
              }}
            >
              <SelectTrigger id="segment">
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                {guestSegments.map(segment => (
                  <SelectItem key={segment} value={segment}>
                    {segment} ({segmentCounts[segment] || 0} guests)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">Recipient Count</Label>
            <Input
              id="count"
              type="number"
              value={formData.recipientCount}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Auto-filled based on segment</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSave} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
