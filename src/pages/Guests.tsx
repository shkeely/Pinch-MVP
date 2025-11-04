import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Upload, Pencil, Settings, Plus, X, Download } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import EditGuestDialog from '@/components/guests/EditGuestDialog';
import ImportGuestsDialog from '@/components/guests/ImportGuestsDialog';
import SendMessageDialog from '@/components/messages/SendMessageDialog';
type Segment = 'All' | 'Wedding Party' | 'Out-of-Towners' | 'Parents' | 'Vendors' | string;

interface Guest {
  id: number;
  name: string;
  phone: string;
  segment: Segment;
  status: string;
}

export default function Guests() {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('All');
  const [segments, setSegments] = useState<Segment[]>(['All', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors']);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditGuestDialogOpen, setIsEditGuestDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [editingSegment, setEditingSegment] = useState<{
    old: Segment;
    new: string;
  } | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [guestsList, setGuestsList] = useState<Guest[]>([{
    id: 1,
    name: 'Emily Thompson',
    phone: '+1 555-0101',
    segment: 'Wedding Party',
    status: 'Active'
  }, {
    id: 2,
    name: 'Michael Chen',
    phone: '+1 555-0102',
    segment: 'Out-of-Towners',
    status: 'Active'
  }, {
    id: 3,
    name: 'Jessica Martinez',
    phone: '+1 555-0103',
    segment: 'All',
    status: 'Active'
  }, {
    id: 4,
    name: 'David Park',
    phone: '+1 555-0104',
    segment: 'Wedding Party',
    status: 'Active'
  }, {
    id: 5,
    name: 'Rachel Green',
    phone: '+1 555-0105',
    segment: 'Out-of-Towners',
    status: 'Active'
  }, {
    id: 6,
    name: 'Tom Anderson',
    phone: '+1 555-0106',
    segment: 'Parents',
    status: 'Active'
  }]);
  const filteredGuests = selectedSegment === 'All' ? guestsList : guestsList.filter(g => g.segment === selectedSegment);
  const handleAddSegment = () => {
    if (!newSegmentName.trim()) {
      toast.error("Segment name cannot be empty");
      return;
    }
    if (segments.includes(newSegmentName as Segment)) {
      toast.error("Segment already exists");
      return;
    }
    setSegments([...segments, newSegmentName as Segment]);
    setNewSegmentName('');
    toast.success(`Added segment: ${newSegmentName}`);
  };
  const handleRemoveSegment = (segment: Segment) => {
    if (segment === 'All') {
      toast.error("Cannot remove 'All' segment");
      return;
    }
    setSegments(segments.filter(s => s !== segment));
    if (selectedSegment === segment) {
      setSelectedSegment('All');
    }
    toast.success(`Removed segment: ${segment}`);
  };
  const handleRenameSegment = () => {
    if (!editingSegment || !editingSegment.new.trim()) {
      toast.error("Segment name cannot be empty");
      return;
    }
    if (editingSegment.old === 'All') {
      toast.error("Cannot rename 'All' segment");
      return;
    }
    if (segments.includes(editingSegment.new as Segment) && editingSegment.new !== editingSegment.old) {
      toast.error("Segment name already exists");
      return;
    }
    setSegments(segments.map(s => s === editingSegment.old ? editingSegment.new as Segment : s));
    if (selectedSegment === editingSegment.old) {
      setSelectedSegment(editingSegment.new as Segment);
    }
    toast.success(`Renamed segment from "${editingSegment.old}" to "${editingSegment.new}"`);
    setEditingSegment(null);
  };
  const handleExportCSV = () => {
    const csvContent = [['Name', 'Phone', 'Segment', 'Status'], ...filteredGuests.map(g => [g.name, g.phone, g.segment, g.status])].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `guests-${selectedSegment}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredGuests.length} guests`);
  };

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest);
    setIsEditGuestDialogOpen(true);
  };

  const handleSaveGuest = (updatedGuest: Guest) => {
    setGuestsList(guestsList.map(g => g.id === updatedGuest.id ? updatedGuest : g));
  };

  const handleImportGuests = (importedGuests: Omit<Guest, 'id'>[]) => {
    const newGuests = importedGuests.map((g, index) => ({
      ...g,
      id: Math.max(...guestsList.map(guest => guest.id), 0) + index + 1
    }));
    setGuestsList([...guestsList, ...newGuests]);
  };
  return <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Guest Management</h1>
            <p className="text-muted-foreground">
              {guestsList.length} guests • {filteredGuests.length} in current view
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="w-full sm:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={handleExportCSV} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Segments Section */}
        <Card className="p-6 mb-6 bg-[#f7f5f3]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Segments</h2>
              <p className="text-sm text-muted-foreground">Filter guests by category</p>
            </div>
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Segments
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card">
                <DialogHeader>
                  <DialogTitle>Manage Segments</DialogTitle>
                  <DialogDescription>
                    Add, remove, or rename guest segments
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Add New Segment */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add New Segment</label>
                    <div className="flex gap-2">
                      <Input placeholder="Enter segment name" value={newSegmentName} onChange={e => setNewSegmentName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSegment()} />
                      <Button onClick={handleAddSegment} size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Existing Segments */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Existing Segments</label>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {segments.map(segment => <div key={segment} className="flex items-center gap-2 p-2 rounded-md border bg-background">
                          {editingSegment?.old === segment ? <>
                              <Input value={editingSegment.new} onChange={e => setEditingSegment({
                          old: segment,
                          new: e.target.value
                        })} onKeyDown={e => {
                          if (e.key === 'Enter') handleRenameSegment();
                          if (e.key === 'Escape') setEditingSegment(null);
                        }} className="flex-1" autoFocus />
                              <Button size="sm" onClick={handleRenameSegment}>
                                Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingSegment(null)}>
                                Cancel
                              </Button>
                            </> : <>
                              <span className="flex-1 font-medium">{segment}</span>
                              {segment !== 'All' && <>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingSegment({
                            old: segment,
                            new: segment
                          })}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleRemoveSegment(segment)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>}
                            </>}
                        </div>)}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {segments.map(segment => <Button key={segment} variant={selectedSegment === segment ? "default" : "outline"} onClick={() => setSelectedSegment(segment)} className={selectedSegment === segment ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}>
                {segment}
                {segment === 'All' && <Badge variant="secondary" className="ml-2 bg-background/50">
                    {guestsList.length}
                  </Badge>}
              </Button>)}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="rounded-lg p-4 mb-6 border border-accent/10 bg-white/[0.31]">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-violet-100 w-full sm:w-auto"
              onClick={() => setIsSendMessageDialogOpen(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send Message to Guests
            </Button>
            <Button variant="outline" size="sm" className="bg-violet-100 w-full sm:w-auto">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Chatbot Link
            </Button>
          </div>
        </div>

        {/* Guests Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Phone</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Segment</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Status</th>
                  <th className="w-16 bg-[#f7f5f3]"></th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map(guest => <tr key={guest.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
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
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="icon" onClick={() => handleEditGuest(guest)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <EditGuestDialog
        open={isEditGuestDialogOpen}
        onOpenChange={setIsEditGuestDialogOpen}
        guest={editingGuest}
        segments={segments}
        onSave={handleSaveGuest}
      />

      <ImportGuestsDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportGuests}
      />

      <SendMessageDialog
        open={isSendMessageDialogOpen}
        onOpenChange={setIsSendMessageDialogOpen}
        segments={segments}
      />
    </div>;
}