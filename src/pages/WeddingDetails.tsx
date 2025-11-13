import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Calendar, MapPin, Users, DollarSign, Database } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { KnowledgeBaseDialog } from '@/components/chatbot/KnowledgeBaseDialog';

export default function WeddingDetails() {
  const { wedding, updateWedding } = useWedding();
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  
  const [coupleNames, setCoupleNames] = useState(`${wedding.couple1} & ${wedding.couple2}` || '');
  const [weddingDate, setWeddingDate] = useState(wedding.date || '');
  const [venueName, setVenueName] = useState(wedding.venue || '');
  const [venueAddress, setVenueAddress] = useState(wedding.venueAddress || '');
  const [guestCount, setGuestCount] = useState('150');
  const [budget, setBudget] = useState('$50,000');
  const [theme, setTheme] = useState('Rustic Garden');
  const [description, setDescription] = useState('An intimate celebration of love surrounded by nature and close family and friends.');

  const handleSaveChanges = () => {
    const [couple1, couple2] = coupleNames.split('&').map(name => name.trim());
    updateWedding({
      couple1: couple1 || '',
      couple2: couple2 || '',
      date: weddingDate,
      venue: venueName,
      venueAddress: venueAddress,
    });
    toast.success('Wedding details updated successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-semibold mb-2">Wedding Details</h1>
            <p className="text-muted-foreground">Manage your wedding information and chatbot brain</p>
          </div>
          <Button 
            onClick={() => setKnowledgeBaseOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Database className="w-4 h-4" />
            Chatbot Brain
          </Button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold mb-1">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Essential details about your celebration</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="coupleNames">Couple Names</Label>
                <Input
                  id="coupleNames"
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="Sarah & James"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="weddingDate"
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount">Expected Guest Count</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="guestCount"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    placeholder="150"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="$50,000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="theme">Wedding Theme</Label>
                <Input
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Rustic Garden, Modern Elegant, etc."
                />
              </div>
            </div>
          </Card>

          {/* Venue Details */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold mb-1">Venue Details</h2>
              <p className="text-sm text-muted-foreground">Information about your wedding location</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venueName">Venue Name</Label>
                <Input
                  id="venueName"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="The Grove Estate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueAddress">Venue Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="venueAddress"
                    value={venueAddress}
                    onChange={(e) => setVenueAddress(e.target.value)}
                    placeholder="123 Wedding Lane, Napa Valley, CA 94558"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Details */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold mb-1">Additional Details</h2>
              <p className="text-sm text-muted-foreground">Tell your story</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Wedding Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share details about your special day..."
                rows={4}
              />
            </div>
          </Card>

          <Button 
            onClick={handleSaveChanges}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </main>

      <KnowledgeBaseDialog 
        open={knowledgeBaseOpen} 
        onOpenChange={setKnowledgeBaseOpen}
      />
    </div>
  );
}
