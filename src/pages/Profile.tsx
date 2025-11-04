import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Save, Upload, Mail, Phone, MapPin, Plus, Trash2 } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface PartnerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  plannerAccess: boolean;
}

export default function Profile() {
  const { wedding } = useWedding();
  const [location, setLocation] = useState('San Francisco, CA');
  const [partnerAccounts, setPartnerAccounts] = useState<PartnerAccount[]>([
    {
      id: '1',
      name: wedding.couple1,
      email: `${wedding.couple1.toLowerCase().replace(' ', '.')}@wedding.app`,
      phone: '+1 (555) 123-4567',
      plannerAccess: true
    },
    {
      id: '2',
      name: wedding.couple2,
      email: `${wedding.couple2.toLowerCase().replace(' ', '.')}@wedding.app`,
      phone: '+1 (555) 987-6543',
      plannerAccess: false
    }
  ]);

  const getInitials = () => {
    const first = wedding.couple1.charAt(0).toUpperCase();
    const second = wedding.couple2.charAt(0).toUpperCase();
    return first && second ? `${first}${second}` : "SP";
  };

  const handleSaveChanges = () => {
    toast.success('Profile updated successfully');
  };

  const handleChangePhoto = () => {
    toast.info('Photo upload coming soon');
  };

  const handleUpdatePartner = (id: string, field: keyof PartnerAccount, value: string | boolean) => {
    setPartnerAccounts(prev => prev.map(partner => 
      partner.id === id ? { ...partner, [field]: value } : partner
    ));
  };

  const handleAddPartner = () => {
    const newPartner: PartnerAccount = {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      plannerAccess: false
    };
    setPartnerAccounts(prev => [...prev, newPartner]);
    toast.success('New partner account added');
  };

  const handleRemovePartner = (id: string) => {
    if (partnerAccounts.length <= 1) {
      toast.error('You must have at least one partner account');
      return;
    }
    setPartnerAccounts(prev => prev.filter(partner => partner.id !== id));
    toast.success('Partner account removed');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-semibold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-semibold mb-6">Profile Photo</h2>
            
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <Button 
                  onClick={handleChangePhoto}
                  variant="outline"
                  className="mb-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>
          </Card>

          {/* Partner Accounts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold">Partner Accounts</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage partner profiles and wedding planner access
                </p>
              </div>
              <Button 
                onClick={handleAddPartner}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            </div>
            
            <div className="space-y-6">
              {partnerAccounts.map((partner, index) => (
                <div key={partner.id} className="p-4 rounded-lg bg-muted/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Partner {index + 1}</h3>
                    {partnerAccounts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePartner(partner.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${partner.id}`}>Name</Label>
                      <Input
                        id={`name-${partner.id}`}
                        value={partner.name}
                        onChange={(e) => handleUpdatePartner(partner.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`email-${partner.id}`}>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id={`email-${partner.id}`}
                          type="email"
                          value={partner.email}
                          onChange={(e) => handleUpdatePartner(partner.id, 'email', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`phone-${partner.id}`}>Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          id={`phone-${partner.id}`}
                          type="tel"
                          value={partner.phone}
                          onChange={(e) => handleUpdatePartner(partner.id, 'phone', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`planner-${partner.id}`}>Wedding Planner Access</Label>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                        <span className="text-sm">
                          {partner.plannerAccess ? 'Enabled' : 'Disabled'}
                        </span>
                        <Switch
                          id={`planner-${partner.id}`}
                          checked={partner.plannerAccess}
                          onCheckedChange={(checked) => handleUpdatePartner(partner.id, 'plannerAccess', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="location">Wedding Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSaveChanges}
              className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </Card>

          {/* Security Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-semibold mb-6">Security</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <h3 className="font-medium mb-1">Password</h3>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Password change coming soon')}
                >
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <h3 className="font-medium mb-1">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Not enabled</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('2FA setup coming soon')}
                >
                  Enable
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
