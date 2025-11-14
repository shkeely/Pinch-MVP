import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReplyComposerModalProps {
  open: boolean;
  onClose: () => void;
  guestName: string;
  guestPhone: string;
  question: string;
}

const AI_DRAFTS = [
  "Hi Michael, thanks for reaching out! I'd be happy to help update your +1 information. We can definitely change it from Sarah to Alex. Just confirm Alex's full name and any dietary preferences, and we'll get that updated!",
  "Hi Michael! No problem at all - we can update your +1 from Sarah to Alex. Please send me Alex's full name and we'll make the change. Thanks!",
  "Hi Michael, thanks for letting us know! We can absolutely help you change your +1. To update from Sarah to Alex, I'll just need Alex's full name and to know if they have any dietary restrictions. Looking forward to celebrating with you both!"
];

export function ReplyComposerModal({
  open,
  onClose,
  guestName,
  guestPhone,
  question
}: ReplyComposerModalProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'scratch'>('ai');
  const [message, setMessage] = useState(AI_DRAFTS[0]);
  const [draftIndex, setDraftIndex] = useState(0);
  const [showSwitchWarning, setShowSwitchWarning] = useState(false);
  const [pendingTab, setPendingTab] = useState<'ai' | 'scratch'>('ai');
  const { toast } = useToast();

  const handleTabChange = (value: string) => {
    const newTab = value as 'ai' | 'scratch';
    
    // If there's unsaved content and switching tabs, show warning
    if (message.trim() && newTab !== activeTab) {
      setPendingTab(newTab);
      setShowSwitchWarning(true);
      return;
    }
    
    switchTab(newTab);
  };

  const switchTab = (newTab: 'ai' | 'scratch') => {
    setActiveTab(newTab);
    if (newTab === 'ai') {
      setMessage(AI_DRAFTS[draftIndex]);
    } else {
      setMessage('');
    }
  };

  const confirmSwitch = () => {
    switchTab(pendingTab);
    setShowSwitchWarning(false);
  };

  const handleRegenerate = () => {
    const nextIndex = (draftIndex + 1) % AI_DRAFTS.length;
    setDraftIndex(nextIndex);
    setMessage(AI_DRAFTS[nextIndex]);
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: `Your message was sent to ${guestName}.`,
    });
    
    onClose();
    // Reset state
    setTimeout(() => {
      setActiveTab('ai');
      setMessage(AI_DRAFTS[0]);
      setDraftIndex(0);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSend();
    }
  };

  const charCount = message.length;
  const getCharCountColor = () => {
    if (charCount > 320) return 'text-orange-600';
    if (charCount > 160) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  const getCharCountMessage = () => {
    if (charCount > 320) return `${charCount}/320 characters (${Math.ceil(charCount / 160)} SMS segments)`;
    if (charCount > 160) return `${charCount}/160 characters (2 SMS segments)`;
    return `${charCount}/160 characters`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] w-[100vw] sm:w-auto p-6 rounded-none sm:rounded-lg">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-2xl font-semibold text-foreground">
              Reply to {guestName}
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

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Draft with Pinch
              </TabsTrigger>
              <TabsTrigger value="scratch">
                Write from Scratch
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="AI-generated draft..."
                className="min-h-[200px] resize-none"
              />
            </TabsContent>

            <TabsContent value="scratch" className="space-y-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Type your message to ${guestName}...`}
                className="min-h-[200px] resize-none"
              />
            </TabsContent>
          </Tabs>

          <div className={`text-sm ${getCharCountColor()}`}>
            {getCharCountMessage()}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            {activeTab === 'ai' && (
              <Button 
                variant="outline"
                onClick={handleRegenerate}
                className="w-full sm:w-auto"
              >
                Regenerate
              </Button>
            )}
            <Button 
              onClick={handleSend}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSwitchWarning} onOpenChange={setShowSwitchWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch modes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your current draft will be cleared. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitch}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
