import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Save, Upload, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PartnerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  plannerAccess: boolean;
}

const getInitialPartners = (wedding: any): PartnerAccount[] => {
  if (!wedding) {
    return [
      { id: '1', name: '', email: '', phone: '', plannerAccess: true },
      { id: '2', name: '', email: '', phone: '', plannerAccess: false }
    ];
  }
  if (wedding.partners && wedding.partners.length > 0) {
    return wedding.partners.map((p: any, index: number) => ({
      id: p.id,
      name: p.name,
      email: p.email || '',
      phone: p.phone || '',
      plannerAccess: index === 0,
    }));
  }
  return [
    {
      id: '1',
      name: wedding.couple1 || '',
      email: '',
      phone: '',
      plannerAccess: true
    },
    {
      id: '2',
      name: wedding.couple2 || '',
      email: '',
      phone: '',
      plannerAccess: false
    }
  ];
};

export default function Profile() {
  const { wedding, updateWedding } = useWedding();
  const [partnerAccounts, setPartnerAccounts] = useState<PartnerAccount[]>(() => 
    getInitialPartners(wedding)
  );

  // Sync partner accounts when wedding context changes
  useEffect(() => {
    if (wedding?.partners && wedding.partners.length > 0) {
      setPartnerAccounts(wedding.partners.map((p, index) => ({
        id: p.id,
        name: p.name,
        email: p.email || '',
        phone: p.phone || '',
        plannerAccess: index === 0,
      })));
    }
  }, [wedding?.partners]);

  const getInitials = () => {
    const first = (wedding?.couple1 || '').charAt(0).toUpperCase();
    const second = (wedding?.couple2 || '').charAt(0).toUpperCase();
    return first && second ? `${first}${second}` : "SP";
  };

  const handleSaveChanges = () => {
    updateWedding({
      couple1: partnerAccounts[0]?.name || wedding?.couple1 || '',
      couple2: partnerAccounts[1]?.name || wedding?.couple2 || '',
      partners: partnerAccounts.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
      })),
    });
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
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-4xl">
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
                disabled={partnerAccounts.length >= 4}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Partner ({partnerAccounts.length}/4)
              </Button>
            </div>
            
            <div className="space-y-6">
              {partnerAccounts.map((partner, index) => (
                <div key={partner.id} className="p-4 rounded-lg border border-border space-y-4">
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

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${partner.id}`}>Name</Label>
                      <Input
                        id={`name-${partner.id}`}
                        value={partner.name}
                        onChange={(e) => handleUpdatePartner(partner.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
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
                    </div>
                  </div>
                </div>
              ))}
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
