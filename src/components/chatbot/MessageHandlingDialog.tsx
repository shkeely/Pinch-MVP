import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Save } from "lucide-react";
import { useState } from "react";
import { useWedding } from "@/contexts/WeddingContext";
import { toast } from "sonner";

interface MessageHandlingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PartnerNotification {
  enabled: boolean;
  email: boolean;
  sms: boolean;
}

export function MessageHandlingDialog({ open, onOpenChange }: MessageHandlingDialogProps) {
  const { wedding } = useWedding();
  
  // Get partners from context
  const partners = wedding.partners?.length > 0 
    ? wedding.partners 
    : [
        { id: '1', name: wedding.couple1 },
        { id: '2', name: wedding.couple2 }
      ].filter(p => p.name);

  const [partnerPreferences, setPartnerPreferences] = useState<Record<string, PartnerNotification>>(() => {
    const initial: Record<string, PartnerNotification> = {};
    partners.forEach(p => { 
      initial[p.id] = { enabled: true, email: true, sms: false }; 
    });
    return initial;
  });

  const updatePartnerPref = (partnerId: string, field: keyof PartnerNotification, value: boolean) => {
    setPartnerPreferences(prev => ({
      ...prev,
      [partnerId]: {
        ...prev[partnerId],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    toast.success('Message handling preferences updated');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-tour-id="message-handling-dialog">
        <DialogHeader>
          <DialogTitle>Message Handling Preferences</DialogTitle>
          <DialogDescription>
            Control how and to whom message notifications are sent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Partner Notifications */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Partner Notifications</Label>
            
            <div className="space-y-3">
              {partners.map((partner) => {
                const prefs = partnerPreferences[partner.id] || { enabled: true, email: true, sms: false };
                return (
                  <div key={partner.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                    {/* Partner enable/disable checkbox */}
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`partner-${partner.id}`}
                        checked={prefs.enabled}
                        onCheckedChange={(checked) => 
                          updatePartnerPref(partner.id, 'enabled', checked as boolean)
                        }
                      />
                      <Label htmlFor={`partner-${partner.id}`} className="cursor-pointer font-medium">
                        {partner.name || `Partner ${partner.id}`}
                      </Label>
                    </div>
                    
                    {/* Individual notification method toggles */}
                    {prefs.enabled && (
                      <div className="flex gap-4 ml-7">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`partner-${partner.id}-email`}
                            checked={prefs.email}
                            onCheckedChange={(checked) => 
                              updatePartnerPref(partner.id, 'email', checked as boolean)
                            }
                          />
                          <Label htmlFor={`partner-${partner.id}-email`} className="text-sm cursor-pointer">
                            Email
                          </Label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`partner-${partner.id}-sms`}
                            checked={prefs.sms}
                            onCheckedChange={(checked) => 
                              updatePartnerPref(partner.id, 'sms', checked as boolean)
                            }
                          />
                          <Label htmlFor={`partner-${partner.id}-sms`} className="text-sm cursor-pointer">
                            SMS
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
