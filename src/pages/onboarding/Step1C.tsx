import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useWedding } from '@/contexts/WeddingContext';
import { useToast } from '@/hooks/use-toast';
import { FAQ } from '@/types/wedding';

export default function Step1C() {
  const navigate = useNavigate();
  const { wedding, updateWedding } = useWedding();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    couple1: wedding?.couple1 || '',
    couple2: wedding?.couple2 || '',
    date: wedding?.date || '',
    time: wedding?.time || '',
    venue: wedding?.venue || '',
    venueAddress: wedding?.venueAddress || '',
    dressCode: wedding?.dressCode || '',
    parking: wedding?.parking || '',
    hotels: wedding?.hotels || '',
    registry: wedding?.registry || '',
    kidsPolicy: wedding?.kidsPolicy || '',
  });

  const [customFAQs, setCustomFAQs] = useState<FAQ[]>(wedding?.customFAQs || []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateWedding({ ...formData, customFAQs });
      toast({
        title: "Draft saved",
        description: "Your progress has been saved automatically.",
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, customFAQs]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addCustomFAQ = () => {
    setCustomFAQs([...customFAQs, { question: '', answer: '' }]);
  };

  const removeCustomFAQ = (index: number) => {
    setCustomFAQs(customFAQs.filter((_, i) => i !== index));
  };

  const updateCustomFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...customFAQs];
    updated[index][field] = value;
    setCustomFAQs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.couple1 || !formData.couple2 || !formData.date || !formData.time || !formData.venue || !formData.venueAddress) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      return;
    }

    // Save wedding via API
    await updateWedding({ ...formData, customFAQs, onboardingStep: 2 });
    navigate('/onboarding/step-2');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <OnboardingStepper currentStep={1} />

        <div className="text-center mb-12">
          <h1 className="text-[2.6rem] font-serif font-bold mb-4 leading-tight">
            Wedding Details
          </h1>
          <p className="text-[1.15rem] text-foreground leading-relaxed">
            Fill in your wedding information. We'll use this to power your AI concierge.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <Card className="p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
              <h2 className="text-2xl font-serif mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="couple1">Partner 1 Name *</Label>
                  <Input
                    id="couple1"
                    value={formData.couple1}
                    onChange={(e) => handleInputChange('couple1', e.target.value)}
                    required
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="couple2">Partner 2 Name *</Label>
                  <Input
                    id="couple2"
                    value={formData.couple2}
                    onChange={(e) => handleInputChange('couple2', e.target.value)}
                    required
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Wedding Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Ceremony Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    required
                    placeholder="e.g., Garden Grove Estate"
                  />
                </div>
                <div>
                  <Label htmlFor="venueAddress">Venue Address *</Label>
                  <Textarea
                    id="venueAddress"
                    value={formData.venueAddress}
                    onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                    required
                    placeholder="Full address including city and state"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            {/* Right Column - Additional Details */}
            <Card className="p-5 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
              <h2 className="text-2xl font-serif mb-6">Additional Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dressCode">Dress Code</Label>
                  <Input
                    id="dressCode"
                    value={formData.dressCode}
                    onChange={(e) => handleInputChange('dressCode', e.target.value)}
                    placeholder="e.g., Garden Party Attire"
                  />
                </div>
                <div>
                  <Label htmlFor="parking">Parking Information</Label>
                  <Textarea
                    id="parking"
                    value={formData.parking}
                    onChange={(e) => handleInputChange('parking', e.target.value)}
                    placeholder="Parking details for guests"
                    rows={2}
                    maxLength={500}
                  />
                </div>
                <div>
                  <Label htmlFor="hotels">Hotel Recommendations</Label>
                  <Textarea
                    id="hotels"
                    value={formData.hotels}
                    onChange={(e) => handleInputChange('hotels', e.target.value)}
                    placeholder="Nearby hotels or accommodation blocks"
                    rows={2}
                    maxLength={500}
                  />
                </div>
                <div>
                  <Label htmlFor="registry">Registry Information</Label>
                  <Textarea
                    id="registry"
                    value={formData.registry}
                    onChange={(e) => handleInputChange('registry', e.target.value)}
                    placeholder="Registry links or gift preferences"
                    rows={2}
                    maxLength={500}
                  />
                </div>
                <div>
                  <Label htmlFor="kidsPolicy">Kids Policy</Label>
                  <Textarea
                    id="kidsPolicy"
                    value={formData.kidsPolicy}
                    onChange={(e) => handleInputChange('kidsPolicy', e.target.value)}
                    placeholder="Are children invited?"
                    rows={2}
                    maxLength={500}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Custom FAQs */}
          <Card className="p-5 mt-8 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif">Custom Q&A</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomFAQ}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
            <div className="space-y-4">
              {customFAQs.map((faq, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Question</Label>
                    <Input
                      value={faq.question}
                      onChange={(e) => updateCustomFAQ(index, 'question', e.target.value)}
                      placeholder="e.g., Is there a gift deadline?"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label>Answer</Label>
                      <Input
                        value={faq.answer}
                        onChange={(e) => updateCustomFAQ(index, 'answer', e.target.value)}
                        placeholder="Your answer..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCustomFAQ(index)}
                      className="mt-6"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {customFAQs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No custom questions yet. Add one to handle specific guest inquiries.
                </p>
              )}
            </div>
          </Card>

          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              size="lg"
              className="rounded-xl h-11 px-8 font-medium [&:not(:disabled)]:hover:!bg-accent"
              style={{
                backgroundColor: '#5b6850',
                color: 'white'
              }}
            >
              Save Wedding Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
