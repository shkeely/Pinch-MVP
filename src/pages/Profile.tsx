import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Save, Upload, Mail, Phone, MapPin } from 'lucide-react';
import { useWedding } from '@/contexts/WeddingContext';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Profile() {
  const { wedding } = useWedding();
  const [email, setEmail] = useState('account@wedding.app');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [location, setLocation] = useState('San Francisco, CA');

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

          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-semibold mb-6">Personal Information</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couple1">First Name</Label>
                  <Input
                    id="couple1"
                    value={wedding.couple1}
                    readOnly
                    className="bg-muted/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="couple2">Partner Name</Label>
                  <Input
                    id="couple2"
                    value={wedding.couple2}
                    readOnly
                    className="bg-muted/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
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
