import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Bell } from 'lucide-react';

export default function Reminders() {
  const upcomingReminders = [
    {
      id: 1,
      title: 'Final headcount due',
      description: 'Submit final guest count to venue',
      daysUntil: 14,
      category: 'Venue',
    },
    {
      id: 2,
      title: 'Send rehearsal dinner invites',
      description: 'Email invitations to wedding party',
      daysUntil: 21,
      category: 'Planning',
    },
    {
      id: 3,
      title: 'Confirm transportation',
      description: 'Verify shuttle bus arrangements',
      daysUntil: 28,
      category: 'Logistics',
    },
  ];

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
          {upcomingReminders.map((reminder) => (
            <Card key={reminder.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-accent" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{reminder.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {reminder.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{reminder.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{reminder.daysUntil} days</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  Mark Done
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {upcomingReminders.length === 0 && (
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
      </main>
    </div>
  );
}
