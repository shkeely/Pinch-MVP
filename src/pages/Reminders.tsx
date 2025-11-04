import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, MessageSquare, Send, Copy, Trash2, Users, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { useState } from 'react';
import { format, parse } from 'date-fns';
import EditReminderDialog from '@/components/reminders/EditReminderDialog';
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

const categoryColors: Record<ReminderCategory, string> = {
  'RSVP': 'border-l-purple-500',
  'Attendance': 'border-l-blue-500',
  'Info': 'border-l-green-500',
  'Thank You': 'border-l-orange-500',
  'Custom': 'border-l-pink-500',
};

const categoryBadgeColors: Record<ReminderCategory, string> = {
  'RSVP': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Attendance': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Info': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Thank You': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Custom': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

const statusColors: Record<ReminderStatus, string> = {
  'Scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Sent': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Draft': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
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
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const formatDateDisplay = (dateString: string) => {
    try {
      const date = parse(dateString, 'yyyy-MM-dd', new Date());
      return format(date, 'MMMM d yyyy');
    } catch {
      return dateString;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
    setEditingReminder(reminder);
    setIsEditDialogOpen(true);
  };

  const handleSaveReminder = (updatedReminder: Reminder) => {
    setReminders(reminders.map(r => r.id === updatedReminder.id ? updatedReminder : r));
  };

  const handleDelete = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
    setDeleteId(null);
    toast.success('Reminder deleted');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Guest Reminders</h1>
            <p className="text-muted-foreground">
              Schedule and manage automated text reminders for your guests
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Reminder
          </Button>
        </div>

        <div className="grid gap-4">
          {reminders.map((reminder) => {
            const isExpanded = expandedIds.has(reminder.id);
            
            return (
              <Card key={reminder.id} className={`border-l-4 ${categoryColors[reminder.category]} hover:shadow-md transition-all`}>
                <div className="p-5">
                  {/* Collapsed View */}
                  <div 
                    className="flex items-center justify-between gap-4 cursor-pointer"
                    onClick={() => toggleExpand(reminder.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold truncate">{reminder.title}</h3>
                        <Badge className={categoryBadgeColors[reminder.category]}>
                          {reminder.category}
                        </Badge>
                        <Badge className={statusColors[reminder.status]}>
                          {reminder.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDateDisplay(reminder.scheduledDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {reminder.scheduledTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {reminder.recipientCount} recipients
                        </span>
                      </div>
                    </div>
                    <button 
                      className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(reminder.id);
                      }}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="mt-6 animate-accordion-down">
                      <div className="flex flex-col lg:flex-row gap-6 mb-6">
                        {/* Left Side: Message Content */}
                        <div className="flex-1">
                          <div className="bg-muted/50 rounded-lg p-4 max-w-[85%]">
                            <div className="flex items-start gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <span className="text-xs font-medium text-muted-foreground uppercase">Message Preview</span>
                            </div>
                            <p className="text-sm leading-relaxed">{reminder.message}</p>
                          </div>
                        </div>

                        {/* Right Side: Schedule & Target Settings */}
                        <div className="lg:w-64 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">Scheduled: </span>
                                <span className="font-medium">{formatDateDisplay(reminder.scheduledDate)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">Time: </span>
                                <span className="font-medium">{reminder.scheduledTime}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground">Recipients: </span>
                                <span className="font-medium">{reminder.recipientCount}</span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Target:</span> {reminder.recipientSegment}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(reminder);
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendTest(reminder);
                          }}
                          disabled={reminder.status === 'Sent'}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Test
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicate(reminder);
                          }}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(reminder.id);
                          }}
                          className="text-destructive hover:text-destructive ml-auto"
                          disabled={reminder.status === 'Sent'}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {reminder.status === 'Scheduled' ? 'Cancel' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
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

        {/* Edit Reminder Dialog */}
        <EditReminderDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          reminder={editingReminder}
          onSave={handleSaveReminder}
        />
        
        {/* Create Reminder Dialog */}
        <EditReminderDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          reminder={null}
          onSave={(newReminder) => {
            setReminders([...reminders, { ...newReminder, id: Math.max(...reminders.map(r => r.id)) + 1 }]);
            toast.success('Reminder created successfully');
          }}
        />
      </main>
    </div>
  );
}
