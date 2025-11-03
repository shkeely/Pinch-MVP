import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Bell, Pencil, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Reminder = {
  id: number;
  title: string;
  description: string;
  daysUntil: number;
  category: string;
  done: boolean;
};

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'Final headcount due',
      description: 'Submit final guest count to venue',
      daysUntil: 14,
      category: 'Venue',
      done: false,
    },
    {
      id: 2,
      title: 'Send rehearsal dinner invites',
      description: 'Email invitations to wedding party',
      daysUntil: 21,
      category: 'Planning',
      done: false,
    },
    {
      id: 3,
      title: 'Confirm transportation',
      description: 'Verify shuttle bus arrangements',
      daysUntil: 28,
      category: 'Logistics',
      done: false,
    },
  ]);

  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleMarkDone = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, done: !r.done } : r
    ));
    const reminder = reminders.find(r => r.id === id);
    toast.success(reminder?.done ? 'Reminder marked as incomplete' : 'Reminder marked as done');
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingReminder) return;
    setReminders(reminders.map(r => 
      r.id === editingReminder.id ? editingReminder : r
    ));
    setIsEditDialogOpen(false);
    toast.success('Reminder updated');
  };

  const handleDelete = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
    setDeleteId(null);
    toast.success('Reminder deleted');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Reminders</h1>
            <p className="text-muted-foreground">
              Stay on top of your wedding timeline
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        <div className="grid gap-6">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className={`p-6 hover:shadow-lg transition-all ${reminder.done ? 'opacity-50 bg-muted/30' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${reminder.done ? 'bg-muted' : 'bg-accent/10'}`}>
                    {reminder.done ? (
                      <Check className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <Bell className="w-6 h-6 text-accent" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg font-semibold ${reminder.done ? 'line-through text-muted-foreground' : ''}`}>
                        {reminder.title}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {reminder.category}
                      </span>
                    </div>
                    <p className={`mb-3 ${reminder.done ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>
                      {reminder.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{reminder.daysUntil} days</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(reminder)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={reminder.done ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleMarkDone(reminder.id)}
                    className={reminder.done ? '' : 'bg-green-500 hover:bg-green-600 text-white'}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {reminder.done ? 'Undo' : 'Mark Done'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {reminders.length === 0 && (
          <Card className="p-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No upcoming reminders</h3>
            <p className="text-muted-foreground mb-4">
              Create reminders to stay organized
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create First Reminder
            </Button>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-card">
            <DialogHeader>
              <DialogTitle>Edit Reminder</DialogTitle>
              <DialogDescription>
                Update reminder details
              </DialogDescription>
            </DialogHeader>
            
            {editingReminder && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editingReminder.title}
                    onChange={(e) => setEditingReminder({ ...editingReminder, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingReminder.description}
                    onChange={(e) => setEditingReminder({ ...editingReminder, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Days Until</label>
                  <Input
                    type="number"
                    value={editingReminder.daysUntil}
                    onChange={(e) => setEditingReminder({ ...editingReminder, daysUntil: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={editingReminder.category}
                    onChange={(e) => setEditingReminder({ ...editingReminder, category: e.target.value })}
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setDeleteId(editingReminder.id);
                      setIsEditDialogOpen(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this reminder? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
