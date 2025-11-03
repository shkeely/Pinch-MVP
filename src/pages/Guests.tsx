import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Download, Users, CheckCircle, XCircle } from 'lucide-react';

export default function Guests() {
  const guests = [
    {
      id: 1,
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      rsvp: 'confirmed',
      messagesCount: 3,
    },
    {
      id: 2,
      name: 'Michael Chen',
      phone: '+1 (555) 234-5678',
      rsvp: 'confirmed',
      messagesCount: 1,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      phone: '+1 (555) 345-6789',
      rsvp: 'pending',
      messagesCount: 0,
    },
    {
      id: 4,
      name: 'David Kim',
      phone: '+1 (555) 456-7890',
      rsvp: 'confirmed',
      messagesCount: 5,
    },
    {
      id: 5,
      name: 'Jessica Martinez',
      phone: '+1 (555) 567-8901',
      rsvp: 'declined',
      messagesCount: 2,
    },
  ];

  const stats = {
    total: guests.length,
    confirmed: guests.filter(g => g.rsvp === 'confirmed').length,
    pending: guests.filter(g => g.rsvp === 'pending').length,
    declined: guests.filter(g => g.rsvp === 'declined').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Guest List</h1>
            <p className="text-muted-foreground">
              Manage your wedding guests and RSVPs
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Guests</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.declined}</p>
                <p className="text-sm text-muted-foreground">Declined</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search guests by name or phone..." 
              className="pl-10"
            />
          </div>
        </div>

        {/* Guests Table */}
        <Card>
          <div className="divide-y">
            {guests.map((guest) => (
              <div key={guest.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{guest.name}</h3>
                    <p className="text-sm text-muted-foreground">{guest.phone}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                      <p className="text-sm text-muted-foreground">Messages</p>
                      <p className="font-medium">{guest.messagesCount}</p>
                    </div>
                    
                    <Badge 
                      variant={
                        guest.rsvp === 'confirmed' ? 'default' : 
                        guest.rsvp === 'pending' ? 'secondary' : 
                        'outline'
                      }
                      className={
                        guest.rsvp === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        guest.rsvp === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-muted text-muted-foreground'
                      }
                    >
                      {guest.rsvp.charAt(0).toUpperCase() + guest.rsvp.slice(1)}
                    </Badge>
                    
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
