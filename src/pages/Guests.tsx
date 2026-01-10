import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Upload, Pencil, Settings, Plus, X, Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import EditGuestDialog from '@/components/guests/EditGuestDialog';
import ImportGuestsDialog from '@/components/guests/ImportGuestsDialog';
import { useWedding } from '@/contexts/WeddingContext';
import { useGuests, useCreateGuest, useUpdateGuest, useDeleteGuest, apiToLocalGuest, localToApiGuest } from '@/hooks/useGuestsApi';
import { useSegments, useCreateSegment, useUpdateSegment, useDeleteSegment } from '@/hooks/useSegmentsApi';

type Segment = 'All' | string;

interface Guest {
  id: string;
  name: string;
  phone: string;
  segments: string[];
  status: string;
}

export default function Guests() {
  const { weddingId } = useWedding();
  const [selectedSegment, setSelectedSegment] = useState<Segment>('All');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditGuestDialogOpen, setIsEditGuestDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [editingSegment, setEditingSegment] = useState<{
    old: string;
    new: string;
    id: string;
  } | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [page, setPage] = useState(1);

  // API hooks
  const { data: guestsData, isLoading: guestsLoading, error: guestsError } = useGuests({
    weddingId: weddingId || '',
    page,
    segment: selectedSegment !== 'All' ? selectedSegment : undefined,
  });

  const { data: segmentsData, isLoading: segmentsLoading } = useSegments(weddingId);
  
  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();
  const deleteGuest = useDeleteGuest();
  const createSegment = useCreateSegment();
  const updateSegmentMutation = useUpdateSegment();
  const deleteSegmentMutation = useDeleteSegment();

  // Convert API data to local format
  const guestsList: Guest[] = (guestsData?.guests || []).map(g => ({
    id: g.id,
    name: g.name,
    phone: g.phone || '',
    segments: g.segments || [],
    status: g.status,
  }));

  const segments: Segment[] = ['All', ...(segmentsData || []).map(s => s.name)];
  const segmentIdMap = new Map((segmentsData || []).map(s => [s.name, s.id]));

  const filteredGuests = selectedSegment === 'All' 
    ? guestsList 
    : guestsList.filter(g => g.segments.includes(selectedSegment));

  const handleAddSegment = async () => {
    if (!newSegmentName.trim()) {
      toast.error("Segment name cannot be empty");
      return;
    }
    if (segments.includes(newSegmentName)) {
      toast.error("Segment already exists");
      return;
    }
    if (!weddingId) {
      toast.error("No wedding selected");
      return;
    }

    try {
      await createSegment.mutateAsync({ wedding_id: weddingId, name: newSegmentName });
      setNewSegmentName('');
      toast.success(`Added segment: ${newSegmentName}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to add segment");
    }
  };

  const handleRemoveSegment = async (segment: Segment) => {
    if (segment === 'All') {
      toast.error("Cannot remove 'All' segment");
      return;
    }

    const segmentId = segmentIdMap.get(segment);
    if (!segmentId) return;

    try {
      await deleteSegmentMutation.mutateAsync(segmentId);
      if (selectedSegment === segment) {
        setSelectedSegment('All');
      }
      toast.success(`Removed segment: ${segment}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove segment");
    }
  };

  const handleRenameSegment = async () => {
    if (!editingSegment || !editingSegment.new.trim()) {
      toast.error("Segment name cannot be empty");
      return;
    }
    if (editingSegment.old === 'All') {
      toast.error("Cannot rename 'All' segment");
      return;
    }
    if (segments.includes(editingSegment.new) && editingSegment.new !== editingSegment.old) {
      toast.error("Segment name already exists");
      return;
    }

    try {
      await updateSegmentMutation.mutateAsync({ 
        id: editingSegment.id, 
        data: { name: editingSegment.new } 
      });
      if (selectedSegment === editingSegment.old) {
        setSelectedSegment(editingSegment.new);
      }
      toast.success(`Renamed segment from "${editingSegment.old}" to "${editingSegment.new}"`);
      setEditingSegment(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to rename segment");
    }
  };

  const handleExportCSV = () => {
    const csvContent = [['Name', 'Phone', 'Segments', 'Status'], ...filteredGuests.map(g => [g.name, g.phone, g.segments.join('; '), g.status])].map(row => row.join(',')).join('\n');
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

  const handleSaveGuest = async (updatedGuest: Guest) => {
    try {
      await updateGuest.mutateAsync({
        id: updatedGuest.id,
        data: {
          name: updatedGuest.name,
          phone: updatedGuest.phone || null,
          segments: updatedGuest.segments,
          status: updatedGuest.status,
        }
      });
      toast.success("Guest updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update guest");
    }
  };

  const handleImportGuests = async (importedGuests: Omit<Guest, 'id'>[]) => {
    if (!weddingId) {
      toast.error("No wedding selected");
      return;
    }

    try {
      for (const guest of importedGuests) {
        await createGuest.mutateAsync(localToApiGuest(guest, weddingId));
      }
      toast.success(`Imported ${importedGuests.length} guests`);
    } catch (err: any) {
      toast.error(err.message || "Failed to import guests");
    }
  };

  const handleAddGuest = async () => {
    if (!weddingId) {
      toast.error("No wedding selected");
      return;
    }

    const name = prompt("Enter guest name:");
    if (!name) return;

    const phone = prompt("Enter phone number (optional):");

    try {
      await createGuest.mutateAsync({
        wedding_id: weddingId,
        name,
        phone: phone || null,
        email: null,
        segments: [],
        status: 'Active',
        notes: null,
      });
      toast.success(`Added guest: ${name}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to add guest");
    }
  };

  if (!weddingId) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please complete onboarding first.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">Guest Management</h1>
            <p className="text-muted-foreground">
              {guestsData?.pagination?.total || 0} guests • {filteredGuests.length} in current view
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
            <Button 
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
              onClick={handleAddGuest}
              disabled={createGuest.isPending}
            >
              {createGuest.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Add Guest
            </Button>
          </div>
        </div>

        {/* Segments Section */}
        <Card className="p-6 mb-6 bg-white dark:bg-card">
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
                      <Input 
                        placeholder="Enter segment name" 
                        value={newSegmentName} 
                        onChange={e => setNewSegmentName(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleAddSegment()} 
                      />
                      <Button onClick={handleAddSegment} size="sm" disabled={createSegment.isPending}>
                        {createSegment.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Segments */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Existing Segments</label>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {segments.map(segment => {
                        const segmentId = segmentIdMap.get(segment);
                        return (
                          <div key={segment} className="flex items-center gap-2 p-2 rounded-md border bg-background">
                            {editingSegment?.old === segment ? (
                              <>
                                <Input 
                                  value={editingSegment.new} 
                                  onChange={e => setEditingSegment({
                                    ...editingSegment,
                                    new: e.target.value
                                  })} 
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') handleRenameSegment();
                                    if (e.key === 'Escape') setEditingSegment(null);
                                  }} 
                                  className="flex-1" 
                                  autoFocus 
                                />
                                <Button size="sm" onClick={handleRenameSegment}>
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingSegment(null)}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="flex-1 font-medium">{segment}</span>
                                {segment !== 'All' && segmentId && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => setEditingSegment({
                                        old: segment,
                                        new: segment,
                                        id: segmentId
                                      })}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => handleRemoveSegment(segment)}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {segmentsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              segments.map(segment => (
                <Button 
                  key={segment} 
                  variant={selectedSegment === segment ? "default" : "outline"} 
                  onClick={() => setSelectedSegment(segment)} 
                  className={selectedSegment === segment ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                >
                  {segment}
                  {segment === 'All' && (
                    <Badge variant="secondary" className="ml-2 bg-background/50">
                      {guestsData?.pagination?.total || 0}
                    </Badge>
                  )}
                </Button>
              ))
            )}
          </div>
        </Card>


        {/* Guests Table */}
        <Card>
          <div className="overflow-x-auto">
            {guestsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : guestsError ? (
              <div className="text-center py-12 text-destructive">
                Failed to load guests. Please try again.
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No guests found. Add your first guest to get started.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Phone</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Segments</th>
                    <th className="text-left py-4 px-4 font-semibold text-muted-foreground bg-[#f7f5f3]">Status</th>
                    <th className="w-16 bg-[#f7f5f3]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map(guest => (
                    <tr key={guest.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-medium">{guest.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{guest.phone}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {guest.segments.map((segment) => (
                            <Badge key={segment} variant="secondary" className="bg-muted">
                              {segment}
                            </Badge>
                          ))}
                        </div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {guestsData?.pagination && guestsData.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Page {guestsData.pagination.page} of {guestsData.pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= guestsData.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
    </div>
  );
}
