import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, MessageSquare, Send, Copy, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";

type ReminderCategory = 'RSVP' | 'Attendance' | 'Info' | 'Thank You' | 'Custom';
type ReminderStatus = 'Scheduled' | 'Sent' | 'Draft';

type Reminder = {
  id: number;
  title: string;
  category: ReminderCategory;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  recipientSegment: string;
  recipientCount: number;
  status: ReminderStatus;
};

const statusColors: Record<ReminderStatus, string> = {
  'Scheduled': 'text-blue-600 dark:text-blue-400',
  'Sent': 'text-green-600 dark:text-green-400',
  'Draft': 'text-muted-foreground',
};

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'RSVP Deadline Reminder',
      category: 'RSVP',
      message: 'Hi! Just a friendly reminder to RSVP for Sarah & John\'s wedding by March 15th. We can\'t wait to celebrate with you! Reply YES or NO to confirm.',
      scheduledDate: '2025-03-10',
      scheduledTime: '10:00 AM',
      recipientSegment: 'Guests who haven\'t RSVP\'d',
      recipientCount: 23,
      status: 'Scheduled',
    },
    {
      id: 2,
      title: 'Day-Of Reminder',
      category: 'Attendance',
      message: 'Today\'s the day! The ceremony starts at 4 PM at Riverside Gardens. See you soon! 🎉',
      scheduledDate: '2025-04-15',
      scheduledTime: '9:00 AM',
      recipientSegment: 'All attending guests',
      recipientCount: 127,
      status: 'Scheduled',
    },
    {
      id: 3,
      title: 'Parking Update',
      category: 'Info',
      message: 'Quick update: Free parking is available in Lot B (behind the venue). Shuttle service runs every 15 mins from the overflow lot.',
      scheduledDate: '2025-04-10',
      scheduledTime: '2:00 PM',
      recipientSegment: 'All guests',
      recipientCount: 150,
      status: 'Sent',
    },
    {
      id: 4,
      title: 'Thank You Message',
      category: 'Thank You',
      message: 'Thank you so much for celebrating our special day with us! Your presence meant the world. With love, Sarah & John ❤️',
      scheduledDate: '2025-04-20',
      scheduledTime: '12:00 PM',
      recipientSegment: 'All attending guests',
      recipientCount: 127,
      status: 'Draft',
    },
  ]);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleSendTest = (reminder: Reminder) => {
    toast.success(`Test message sent for "${reminder.title}"`);
  };

  const handleDuplicate = (reminder: Reminder) => {
    const newReminder = {
      ...reminder,
      id: Math.max(...reminders.map(r => r.id)) + 1,
      title: `${reminder.title} (Copy)`,
      status: 'Draft' as ReminderStatus,
    };
    setReminders([...reminders, newReminder]);
    toast.success('Reminder duplicated');
  };

  const handleEdit = (reminder: Reminder) => {
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
    setDeleteId(null);
    toast.success('Reminder deleted');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">SMS Reminders</h1>
            <p className="text-muted-foreground">
              Schedule and manage automated text reminders for your guests
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Reminder
          </Button>
        </div>

        <div className="space-y-6">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="hover:shadow-md transition-shadow">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">{reminder.title}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{reminder.category}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className={`font-medium ${statusColors[reminder.status]}`}>
                        {reminder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reminder.message}
                  </p>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{reminder.scheduledDate} at {reminder.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{reminder.recipientCount} recipients</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {reminder.recipientSegment}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEdit(reminder)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSendTest(reminder)}
                    disabled={reminder.status === 'Sent'}
                  >
                    Send Test
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDuplicate(reminder)}
                  >
                    Duplicate
                  </Button>
                  <div className="flex-1"></div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDeleteId(reminder.id)}
                    className="text-muted-foreground hover:text-destructive"
                    disabled={reminder.status === 'Sent'}
                  >
                    {reminder.status === 'Scheduled' ? 'Cancel' : 'Delete'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {reminders.length === 0 && (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scheduled reminders</h3>
            <p className="text-muted-foreground mb-4">
              Start scheduling SMS reminders to keep your guests informed
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule First Reminder
            </Button>
          </Card>
        )}

        {/* Delete/Cancel Confirmation */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {reminders.find(r => r.id === deleteId)?.status === 'Scheduled' 
                  ? 'Cancel Scheduled Reminder' 
                  : 'Delete Reminder'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {reminders.find(r => r.id === deleteId)?.status === 'Scheduled'
                  ? 'Are you sure you want to cancel this scheduled reminder? It will not be sent to guests.'
                  : 'Are you sure you want to delete this reminder? This action cannot be undone.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteId && handleDelete(deleteId)} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {reminders.find(r => r.id === deleteId)?.status === 'Scheduled' ? 'Cancel Reminder' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
