import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, UserPlus, Database, Settings2 } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeBaseDialog } from '@/components/chatbot/KnowledgeBaseDialog';
import { NotificationPreferencesDialog } from '@/components/settings/NotificationPreferencesDialog';

export default function Settings() {
  const { wedding, updateWedding } = useWedding();
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [selectedNotificationType, setSelectedNotificationType] = useState<'escalated' | 'daily' | 'reminders'>('escalated');
  
  const [coupleNames, setCoupleNames] = useState(`${wedding.couple1} & ${wedding.couple2}` || '');
  const [weddingDate, setWeddingDate] = useState(wedding.date || '');
  const [venueName, setVenueName] = useState(wedding.venue || '');
  const [location, setLocation] = useState(wedding.venueAddress || '');
  const [plannerEmail, setPlannerEmail] = useState('planner@example.com');
  
  const [plannerAccessEnabled, setPlannerAccessEnabled] = useState(false);
  const [escalatedMessages, setEscalatedMessages] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [reminderConfirmations, setReminderConfirmations] = useState(true);

  const handleEditNotification = (type: 'escalated' | 'daily' | 'reminders') => {
    setSelectedNotificationType(type);
    setNotificationDialogOpen(true);
  };

  const handleSaveChanges = () => {
    const [couple1, couple2] = coupleNames.split('&').map(name => name.trim());
    updateWedding({
      couple1: couple1 || '',
      couple2: couple2 || '',
      date: weddingDate,
      venue: venueName,
      venueAddress: location,
    });
    toast.success('Wedding details updated successfully');
  };

  const handleInvitePlanner = () => {
    toast.success('Invitation sent to planner');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-semibold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your wedding details and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Wedding Details */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-1">Wedding Details</h2>
                <p className="text-sm text-muted-foreground">Basic information about your celebration</p>
              </div>
              <Button 
                onClick={() => setKnowledgeBaseOpen(true)}
                variant="outline"
                className="gap-2"
              >
                <Database className="w-4 h-4" />
                Chatbot Brain
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="coupleNames">Couple Names</Label>
                <Input
                  id="coupleNames"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="Sarah & James"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueName">Venue Name</Label>
                <Input
                  id="venueName"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="The Grove Estate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Napa Valley, CA"
                />
              </div>
            </div>

            <Button 
              onClick={handleSaveChanges}
              className="mt-6 bg-indigo-400 hover:bg-indigo-500 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </Card>

          {/* Planner Access */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold mb-1">Planner Access</h2>
              <p className="text-sm text-muted-foreground">Give your wedding planner access to manage messages and settings</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 mb-4">
              <div>
                <h3 className="font-medium mb-1">Enable Planner Access</h3>
                <p className="text-sm text-muted-foreground">Your planner can view and respond to messages</p>
              </div>
              <Switch
                checked={plannerAccessEnabled}
                onCheckedChange={setPlannerAccessEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plannerEmail">Planner Email</Label>
              <div className="flex gap-3">
                <Input
                  id="plannerEmail"
                  type="email"
                  value={plannerEmail}
                  onChange={(e) => setPlannerEmail(e.target.value)}
                  placeholder="planner@example.com"
                  className="flex-1"
                />
                <Button 
                  onClick={handleInvitePlanner}
                  className="bg-indigo-400 hover:bg-indigo-500 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold mb-1">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">Control when and how you receive alerts</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Escalated Messages</h3>
                  <p className="text-sm text-muted-foreground">Get notified when a message needs your attention</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNotification('escalated')}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={escalatedMessages}
                    onCheckedChange={setEscalatedMessages}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Daily Digest</h3>
                  <p className="text-sm text-muted-foreground">Morning summary of new questions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNotification('daily')}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={dailyDigest}
                    onCheckedChange={setDailyDigest}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Reminder Confirmations</h3>
                  <p className="text-sm text-muted-foreground">Confirm when automated reminders are sent</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNotification('reminders')}
                  >
                    <Settings2 className="w-4 h-4" />
                  </Button>
                  <Switch
                    checked={reminderConfirmations}
                    onCheckedChange={setReminderConfirmations}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <KnowledgeBaseDialog 
        open={knowledgeBaseOpen} 
        onOpenChange={setKnowledgeBaseOpen}
      />
      
      <NotificationPreferencesDialog
        open={notificationDialogOpen}
        onOpenChange={setNotificationDialogOpen}
        notificationType={selectedNotificationType}
      />
    </div>
  );
}
