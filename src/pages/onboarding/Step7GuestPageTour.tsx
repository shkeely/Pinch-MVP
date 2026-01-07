import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Upload, Pencil, Settings, GripVertical, Plus, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ImportGuestsDialog from '@/components/guests/ImportGuestsDialog';
import EditGuestDialog from '@/components/guests/EditGuestDialog';

type Segment = 'All' | 'Wedding Party' | 'Out-of-Towners' | 'Parents' | 'Vendors';

interface Guest {
  id: number;
  name: string;
  phone: string;
  segment: Segment;
  status: string;
}

export default function Step7GuestPageTour() {
  const [currentTooltip, setCurrentTooltip] = useState(1);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditGuestDialogOpen, setIsEditGuestDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  
  const segments: Segment[] = ['All', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors'];
  const [segmentsList, setSegmentsList] = useState<Segment[]>(segments);
  const [selectedSegment, setSelectedSegment] = useState<Segment>('All');
  const [newSegmentName, setNewSegmentName] = useState('');
  const [editingSegment, setEditingSegment] = useState<{
    old: Segment;
    new: string;
  } | null>(null);
  
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  // Draggable tooltip state
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const guestsList: Guest[] = [
    { id: 1, name: 'Emily Thompson', phone: '+1 555-0101', segment: 'Wedding Party', status: 'Active' },
    { id: 2, name: 'Michael Chen', phone: '+1 555-0102', segment: 'Out-of-Towners', status: 'Active' },
    { id: 3, name: 'Jessica Martinez', phone: '+1 555-0103', segment: 'All', status: 'Active' },
    { id: 4, name: 'David Park', phone: '+1 555-0104', segment: 'Wedding Party', status: 'Active' },
    { id: 5, name: 'Rachel Green', phone: '+1 555-0105', segment: 'Out-of-Towners', status: 'Active' },
    { id: 6, name: 'Tom Anderson', phone: '+1 555-0106', segment: 'Parents', status: 'Active' },
  ];

  const filteredGuests = selectedSegment === 'All' ? guestsList : guestsList.filter(g => g.segment === selectedSegment);

  // Set preferred preview route
  useEffect(() => {
    const targetHash = '#onboarding-step-7';
    const current = window.location?.hash?.toLowerCase?.() || '';
    if (current !== targetHash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${targetHash}`);
    }
    return () => {
      if ((window.location?.hash?.toLowerCase?.() || '') === targetHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    };
  }, []);

  const handleNext = () => {
    if (currentTooltip < 6) {
      setCurrentTooltip(currentTooltip + 1);
    } else {
      // Last tooltip - advance to Step 8
      updateWedding({ 
        onboardingStep: 8,
        tourProgress: { 
          homepage: true,
          conversations: true,
          guestPage: true,
          weddingInfo: false,
          chatbotSettings: false,
          analytics: false,
        }
      });
      navigate('/onboarding/step-8');
    }
  };

  const handlePrevious = () => {
    if (currentTooltip > 1) {
      setCurrentTooltip(currentTooltip - 1);
    } else {
      // Go back to Step 6
      updateWedding({ onboardingStep: 6 });
      navigate('/onboarding/step-6');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 10,
      tourProgress: { 
        homepage: true,
        conversations: true,
        guestPage: true,
        weddingInfo: true,
        chatbotSettings: true,
        analytics: true,
      }
    });
    navigate('/dashboard');
  };

  // Footer navigation - goes to next/previous step page directly
  const handleFooterNext = () => navigate('/onboarding/step-8');
  const handleFooterPrevious = () => navigate('/onboarding/step-6');

  const handleImportGuests = (guests: Omit<Guest, 'id'>[]) => {
    console.log('Importing guests:', guests);
    setImportDialogOpen(false);
  };

  const handleAddSegment = () => {
    if (!newSegmentName.trim()) {
      toast.error("Segment name cannot be empty");
      return;
    }
    if (segmentsList.includes(newSegmentName as Segment)) {
      toast.error("Segment already exists");
      return;
    }
    setSegmentsList([...segmentsList, newSegmentName as Segment]);
    setNewSegmentName('');
    toast.success(`Added segment: ${newSegmentName}`);
  };

  const handleRemoveSegment = (segment: Segment) => {
    if (segment === 'All') {
      toast.error("Cannot remove 'All' segment");
      return;
    }
    setSegmentsList(segmentsList.filter(s => s !== segment));
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
    if (segmentsList.includes(editingSegment.new as Segment) && editingSegment.new !== editingSegment.old) {
      toast.error("Segment name already exists");
      return;
    }
    setSegmentsList(segmentsList.map(s => s === editingSegment.old ? editingSegment.new as Segment : s));
    toast.success(`Renamed segment from "${editingSegment.old}" to "${editingSegment.new}"`);
    setEditingSegment(null);
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsEditGuestDialogOpen(true);
  };

  const handleSaveGuest = (updatedGuest: Guest) => {
    console.log('Guest updated:', updatedGuest);
    setIsEditGuestDialogOpen(false);
    setSelectedGuest(null);
  };

  // Drag handlers for tooltip
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const tooltipWidth = 400;
    const tooltipHeight = 300;
    const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - tooltipWidth));
    const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - tooltipHeight));
    
    setTooltipPosition({ x: constrainedX, y: constrainedY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    setTooltipPosition(null);
  }, [currentTooltip]);

  const getTooltipPosition = () => {
    if (tooltipPosition) {
      return {
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        transform: 'none'
      };
    }
    
    // Position tooltip above the edit icon for step 5
    if (currentTooltip === 5) {
      const editBtn = document.getElementById('tour-edit-guest-btn');
      if (editBtn) {
        const rect = editBtn.getBoundingClientRect();
        return {
          left: `${rect.left + rect.width / 2}px`,
          top: `${rect.top - 20}px`,
          transform: 'translate(-50%, -100%)'
        };
      }
    }
    
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    };
  };

  const tooltipContent = {
    1: {
      title: "Overview of Guest Page",
      description: "This is where you manage your guest list. Add guests so they can interact with Pinch via SMS. You can organize them into segments to send targeted messages."
    },
    2: {
      title: "Import Your Guest List",
      description: "Choose to upload your real guest list now, or use sample data to explore features first. You can always import your real list later."
    },
    3: {
      title: "Review Segments",
      description: "Segments help you organize guests by category (Wedding Party, Out-of-Towners, Parents, Vendors, etc.). You can create custom segments too."
    },
    4: {
      title: "Add or Edit Segments",
      description: "Click here to create new segments or modify existing ones. Segments make it easy to send specific messages to the right groups."
    },
    5: {
      title: "Try Changing a Guest's Segment",
      description: "Click the edit icon next to any guest to change their segment, contact info, or other details."
    },
    6: {
      title: "Multiple Segment Messaging",
      description: "Toggle this ON to send the same message to multiple segments at once. Great for announcements that go to several groups!"
    }
  };

  const current = tooltipContent[currentTooltip as keyof typeof tooltipContent];

  return (
    <TourPage
      stepNumber={7}
      title="Guest Management Tour"
      description="Learn how to manage your guest list"
      onNext={handleFooterNext}
      onPrevious={handleFooterPrevious}
      onSkipTour={handleSkipTour}
      showSkipButton={true}
    >
      <div className="relative min-h-screen bg-background">
        <TopNav />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 relative" id="tour-header">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Guest Management</h1>
                <p className="text-muted-foreground">
                  Total Guests: {guestsList.length} | Active: {guestsList.filter(g => g.status === 'Active').length}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  id="tour-import-btn"
                  onClick={() => setImportDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Guest
                </Button>
              </div>
            </div>
          </div>

          {/* Segments Section */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Segments</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  id="tour-edit-segments-btn"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Segments
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 relative" id="tour-segments">
                {segmentsList.map((segment) => (
                  <Button
                    key={segment}
                    variant={selectedSegment === segment ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSegment(segment)}
                  >
                    {segment}
                  </Button>
                ))}
              </div>
            </div>
          </Card>


          {/* Guests Table */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedSegment === 'All' ? 'All Guests' : `${selectedSegment} Guests`}
              </h3>
              
              <div className="relative">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.map((guest, index) => (
                      <TableRow 
                        key={guest.id}
                        id={index === 0 ? 'tour-first-guest' : undefined}
                        className={currentTooltip === 5 && index === 0 ? 'relative z-40' : ''}
                      >
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell>{guest.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{guest.segment}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={guest.status === 'Active' ? 'default' : 'secondary'}>
                            {guest.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            id={index === 0 ? 'tour-edit-guest-btn' : undefined}
                            onClick={() => handleEditGuest(guest)}
                            className={currentTooltip === 5 && index === 0 ? 'ring-[3px] ring-purple-600 ring-offset-2' : ''}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </main>

        {/* Centered Draggable Tooltip */}
        <div 
          className={`fixed pointer-events-none ${isEditDialogOpen ? 'z-40' : 'z-50'}`}
          style={{
            ...getTooltipPosition(),
            transition: isDragging ? 'none' : 'all 0.3s ease-out'
          }}
        >
          <div className={`relative p-6 bg-white rounded-xl shadow-2xl pointer-events-auto ${currentTooltip === 5 ? 'max-w-xl' : 'max-w-md'}`} style={{ border: '4px solid #9333EA' }}>
            {/* Arrow - only show when not dragged */}
            {!tooltipPosition && currentTooltip !== 5 && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 -top-3"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderBottom: '10px solid #9333EA',
                }}
              />
            )}
            {/* Downward arrow for step 5 */}
            {!tooltipPosition && currentTooltip === 5 && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 -bottom-3"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid #9333EA',
                }}
              />
            )}
            
            {/* Tooltip content */}
            <div className="space-y-4">
                <div 
                  className="flex items-center justify-between gap-3 -mx-2 -mt-2 px-2 pt-2"
                >
                  <h3 className="text-xl font-semibold text-foreground flex-1">{current.title}</h3>
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-purple-50 transition-colors"
                    onMouseDown={handleDragStart}
                  >
                    <GripVertical className="w-4 h-6 text-purple-600 flex-shrink-0" />
                  </div>
                </div>
              <p className="text-muted-foreground">{current.description}</p>
              
              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Step {currentTooltip} of 6
                </div>
                <div className="flex gap-2">
                  {currentTooltip > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={currentTooltip === 2 ? () => setImportDialogOpen(true) : handleNext}
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {currentTooltip === 2 ? 'Upload Your Guest List' : currentTooltip < 6 ? 'Next' : 'Continue'}
                  </button>
                </div>
              </div>
              
              {/* Secondary button for step 2 */}
              {currentTooltip === 2 && (
                <button
                  onClick={handleNext}
                  className="w-full px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-accent transition-colors"
                >
                  Use Fake Data (Tutorial Only)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Import Guests Dialog */}
      <ImportGuestsDialog 
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportGuests}
      />

      {/* Edit Segments Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                {segmentsList.map(segment => (
                  <div key={segment} className="flex items-center gap-2 p-2 rounded-md border bg-background">
                    {editingSegment?.old === segment ? (
                      <>
                        <Input 
                          value={editingSegment.new} 
                          onChange={e => setEditingSegment({
                            old: segment,
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
                        {segment !== 'All' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setEditingSegment({
                                old: segment,
                                new: segment
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
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Guest Dialog */}
      <EditGuestDialog
        open={isEditGuestDialogOpen}
        onOpenChange={setIsEditGuestDialogOpen}
        guest={selectedGuest}
        segments={segmentsList.filter(s => s !== 'All')}
        onSave={handleSaveGuest}
      />
    </TourPage>
  );
}
