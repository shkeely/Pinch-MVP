import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notificationType: 'escalated' | 'daily' | 'reminders';
}

export function NotificationPreferencesDialog({ 
  open, 
  onOpenChange,
  notificationType 
}: NotificationPreferencesDialogProps) {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [notifyPartner1, setNotifyPartner1] = useState(true);
  const [notifyPartner2, setNotifyPartner2] = useState(true);

  const notificationTitles = {
    escalated: 'Escalated Messages',
    daily: 'Daily Digest',
    reminders: 'Reminder Confirmations'
  };

  const handleSave = () => {
    toast.success('Notification preferences updated');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Customize {notificationTitles[notificationType]}</DialogTitle>
          <DialogDescription>
            Choose how and to whom notifications are sent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notification Method */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Notification Method</Label>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Label htmlFor="email" className="cursor-pointer">Email Notifications</Label>
              </div>
              <Switch
                id="email"
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Label htmlFor="sms" className="cursor-pointer">SMS Notifications</Label>
              </div>
              <Switch
                id="sms"
                checked={smsEnabled}
                onCheckedChange={setSmsEnabled}
              />
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Send Notifications To</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <Checkbox
                  id="partner1"
                  checked={notifyPartner1}
                  onCheckedChange={(checked) => setNotifyPartner1(checked as boolean)}
                />
                <Label htmlFor="partner1" className="cursor-pointer flex-1">
                  Partner 1
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                <Checkbox
                  id="partner2"
                  checked={notifyPartner2}
                  onCheckedChange={(checked) => setNotifyPartner2(checked as boolean)}
                />
                <Label htmlFor="partner2" className="cursor-pointer flex-1">
                  Partner 2
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-indigo-400 hover:bg-indigo-500 text-white">
            <Save className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
