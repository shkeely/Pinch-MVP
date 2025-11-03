import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Upload } from 'lucide-react';
import { useState } from 'react';

type Segment = 'All' | 'Wedding Party' | 'Out-of-Towners' | 'Parents' | 'Vendors';

export default function Guests() {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('All');

  const guests = [
    {
      id: 1,
      name: 'Emily Thompson',
      phone: '+1 555-0101',
      segment: 'Wedding Party' as Segment,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Michael Chen',
      phone: '+1 555-0102',
      segment: 'Out-of-Towners' as Segment,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Jessica Martinez',
      phone: '+1 555-0103',
      segment: 'All' as Segment,
      status: 'Active',
    },
    {
      id: 4,
      name: 'David Park',
      phone: '+1 555-0104',
      segment: 'Wedding Party' as Segment,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Rachel Green',
      phone: '+1 555-0105',
      segment: 'Out-of-Towners' as Segment,
      status: 'Active',
    },
    {
      id: 6,
      name: 'Tom Anderson',
      phone: '+1 555-0106',
      segment: 'Parents' as Segment,
      status: 'Active',
    },
  ];

  const segments: Segment[] = ['All', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors'];
  
  const filteredGuests = selectedSegment === 'All' 
    ? guests 
    : guests.filter(g => g.segment === selectedSegment);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Guest Management</h1>
            <p className="text-muted-foreground">
              {guests.length} guests • {filteredGuests.length} in current view
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Segments Section */}
        <Card className="p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">Segments</h2>
            <p className="text-sm text-muted-foreground">Filter guests by category</p>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {segments.map((segment) => (
              <Button
                key={segment}
                variant={selectedSegment === segment ? "default" : "outline"}
                onClick={() => setSelectedSegment(segment)}
                className={selectedSegment === segment ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
              >
                {segment}
                {segment === 'All' && (
                  <Badge variant="secondary" className="ml-2 bg-background/50">
                    {guests.length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Announcement
            </Button>
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Chatbot Link
            </Button>
          </div>
        </Card>

        {/* Guests Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Phone</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Segment</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 font-medium">{guest.name}</td>
                    <td className="py-4 px-4 text-muted-foreground">{guest.phone}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-muted">
                        {guest.segment}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-green-600 font-medium">{guest.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
