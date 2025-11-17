import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareChatbotDialog({ open, onOpenChange }: ShareChatbotDialogProps) {
  const [copied, setCopied] = useState(false);
  const chatbotUrl = `${window.location.origin}/landing`;

  const handleCopy = () => {
    navigator.clipboard.writeText(chatbotUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLink = () => {
    window.open(chatbotUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Your AI Concierge</DialogTitle>
          <DialogDescription>
            Share this link with your guests so they can ask questions about your wedding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="chatbot-url">Concierge Link</Label>
            <div className="flex gap-2">
              <Input
                id="chatbot-url"
                value={chatbotUrl}
                readOnly
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30 space-y-2">
            <p className="text-sm font-medium">How to use:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Share this link in your wedding invitations</li>
              <li>Add it to your wedding website</li>
              <li>Send it via email or text to your guests</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={handleOpenLink}
            className="bg-indigo-400 hover:bg-indigo-500 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
