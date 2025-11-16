import { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TourPage } from '@/components/onboarding/TourPage';
import { TourTooltip } from '@/components/onboarding/TourTooltip';
import { useWedding } from '@/contexts/WeddingContext';
import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserPlus, Upload, Pencil, Settings } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
  const [multiSegmentMode, setMultiSegmentMode] = useState(false);
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const segments: Segment[] = ['All', 'Wedding Party', 'Out-of-Towners', 'Parents', 'Vendors'];
  const [selectedSegment, setSelectedSegment] = useState<Segment>('All');
  
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
          reminders: false,
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
      navigate('/onboarding/step-6-conversations-tour');
    }
  };

  const handleSkipTour = () => {
    updateWedding({ 
      onboardingStep: 11,
      tourProgress: { 
        homepage: true,
        conversations: true,
        guestPage: true,
        weddingInfo: true,
        chatbotSettings: true,
        reminders: true,
        analytics: true,
      }
    });
    navigate('/dashboard');
  };

  return (
    <TourPage
      stepNumber={7}
      title="Guest Management Tour"
      description="Learn how to manage your guest list"
      onNext={handleNext}
      onPrevious={handlePrevious}
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
                <Button variant="outline" size="sm" id="tour-import-btn">
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

            {/* Tooltip 1: Overview */}
            {currentTooltip === 1 && (
              <div className="fixed top-4 left-4 right-4 max-w-[calc(100vw-32px)] md:top-32 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:right-auto lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
                <TourTooltip
                  target="bottom"
                  title="Overview of Guest Page"
                  description="This is where you manage your guest list. Add guests so they can interact with Pinch via SMS. You can organize them into segments to send targeted messages."
                  step={currentTooltip}
                  totalSteps={6}
                  onNext={handleNext}
                  onPrev={currentTooltip > 1 ? handlePrevious : undefined}
                />
              </div>
            )}
          </div>

          {/* Segments Section */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Segments</h3>
                <Button variant="ghost" size="sm" id="tour-edit-segments-btn">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Segments
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 relative" id="tour-segments">
                {segments.map((segment) => (
                  <Button
                    key={segment}
                    variant={selectedSegment === segment ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSegment(segment)}
                  >
                    {segment}
                  </Button>
                ))}

                {/* Tooltip 2: Import CSV */}
                {currentTooltip === 2 && (
                  <div className="fixed top-[calc(theme(spacing.4)+60px)] left-4 right-4 max-w-[calc(100vw-32px)] md:left-1/2 md:-translate-x-1/2 md:top-32 md:max-w-md md:right-auto lg:absolute lg:top-0 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-full lg:-mt-4 z-50">
                    <TourTooltip
                      target="bottom"
                      title="Import Your Guest List"
                      description="Choose to upload your real guest list now, or use sample data to explore features first. You can always import your real list later."
                      step={currentTooltip}
                      totalSteps={6}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                      buttonText="Upload Your Guest List"
                      secondaryButton={{
                        text: "Use Fake Data (Tutorial Only)",
                        onClick: handleNext
                      }}
                    />
                  </div>
                )}

                {/* Tooltip 3: Segments */}
                {currentTooltip === 3 && (
                  <div className="fixed top-[calc(theme(spacing.4)+300px)] left-4 right-4 max-w-[calc(100vw-32px)] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:right-auto lg:absolute lg:top-full lg:left-1/2 lg:-translate-x-1/2 lg:mt-4 z-50">
                    <TourTooltip
                      target="bottom"
                      title="Review Segments"
                      description="Segments help you organize guests by category (Wedding Party, Out-of-Towners, Parents, Vendors, etc.). You can create custom segments too."
                      step={currentTooltip}
                      totalSteps={6}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </div>
                )}

                {/* Tooltip 4: Edit Segments */}
                {currentTooltip === 4 && (
                  <div className="fixed top-1/2 -translate-y-1/2 left-4 right-4 max-w-[calc(100vw-32px)] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:right-auto lg:absolute lg:top-0 lg:right-[calc(100%+16px)] lg:left-auto lg:-translate-y-full lg:-mt-4 lg:translate-x-0 z-50">
                    <TourTooltip
                      target="right"
                      title="Add or Edit Segments"
                      description="Click here to create new segments or modify existing ones. Segments make it easy to send specific messages to the right groups."
                      step={currentTooltip}
                      totalSteps={6}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons with Multi-Segment Toggle */}
          <div className="mb-4 space-y-3" id="tour-send-message-area">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Send Message to Guests
              </Button>
              <Button variant="outline" size="sm">
                Copy Chatbot Link
              </Button>
            </div>

            {/* Multi-Segment Toggle */}
            <div className="flex items-center space-x-2 relative" id="tour-multi-segment-toggle">
              <Switch 
                id="multi-segment"
                checked={multiSegmentMode}
                onCheckedChange={setMultiSegmentMode}
              />
              <Label htmlFor="multi-segment" className="text-sm cursor-pointer">
                Send to Multiple Segments
              </Label>

              {/* Tooltip 6: Multiple Segment Toggle */}
              {currentTooltip === 6 && (
                <div className="fixed bottom-[calc(100vh-400px)] left-4 right-4 max-w-[calc(100vw-32px)] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:right-auto lg:absolute lg:top-full lg:left-0 lg:mt-4 lg:translate-x-0 lg:translate-y-0 z-50">
                  <TourTooltip
                    target="top"
                    title="Multiple Segment Messaging"
                    description="Toggle this ON to send the same message to multiple segments at once. Great for announcements that go to several groups!"
                    step={currentTooltip}
                    totalSteps={6}
                    onNext={handleNext}
                    onPrev={handlePrevious}
                  />
                </div>
              )}
            </div>
          </div>

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
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Tooltip 5: Edit Guest */}
                {currentTooltip === 5 && (
                  <div className="fixed bottom-[calc(100vh-500px)] left-4 right-4 max-w-[calc(100vw-32px)] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:right-auto lg:absolute lg:top-8 lg:right-[calc(100%+16px)] lg:left-auto lg:translate-x-0 lg:translate-y-0 z-50">
                    <TourTooltip
                      target="right"
                      title="Try Changing a Guest's Segment"
                      description="Click the edit icon next to any guest to change their segment, contact info, or other details."
                      step={currentTooltip}
                      totalSteps={6}
                      onNext={handleNext}
                      onPrev={handlePrevious}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </main>
      </div>
    </TourPage>
  );
}
