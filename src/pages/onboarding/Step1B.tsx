import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useWedding } from '@/contexts/WeddingContext';

export default function Step1B() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateWedding } = useWedding();

  const handleScan = async () => {
    if (!url) return;

    setLoading(true);
    setError('');

    // Simulate scanning
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock: 80% success rate
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      // Mock extracted data
      updateWedding({
        websiteUrl: url,
        couple1: 'Sarah',
        couple2: 'Michael',
        date: '2025-06-15',
        time: '4:00 PM',
        venue: 'Garden Grove Estate',
        venueAddress: '123 Bloom Street, San Francisco, CA 94102',
        dressCode: 'Garden Party Attire',
      });

      setSuccess(true);
      setLoading(false);

      // Auto-advance after showing success
      setTimeout(() => {
        navigate('/onboarding/step-2');
      }, 1500);
    } else {
      setError("We couldn't scan that URL. The site might be private or the format isn't supported.");
      setLoading(false);
    }
  };

  const handleManualFallback = () => {
    navigate('/onboarding/step-1c');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <OnboardingStepper currentStep={1} />

        <div className="text-center mb-12">
          <h1 className="text-[2.6rem] font-serif font-bold mb-4 leading-tight">
            Import from Website
          </h1>
          <p className="text-[1.15rem] text-foreground leading-relaxed">
            Paste your wedding website URL and we'll automatically extract all your details.
          </p>
        </div>

        <Card className="p-8 bg-card border-border-subtle shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px]">
          <div className="space-y-6">
            <div>
              <label htmlFor="website-url" className="block text-sm font-medium mb-2">
                Wedding Website URL
              </label>
              <div className="flex gap-3">
                <Input
                  id="website-url"
                  type="url"
                  placeholder="https://yourwedding.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading || success}
                  className="flex-1"
                />
                <Button
                  onClick={handleScan}
                  disabled={!url || loading || success}
                  className="rounded-xl font-medium [&:not(:disabled)]:hover:!bg-accent"
                  style={{
                    backgroundColor: '#5b6850',
                    color: 'white'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Success!
                    </>
                  ) : (
                    'Scan Website'
                  )}
                </Button>
              </div>
            </div>

            {success && (
              <div className="flex items-start gap-3 p-4 bg-mint/10 border border-mint/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-mint-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-mint-foreground">Successfully scanned!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We found your wedding details. Redirecting to tone selection...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Scan failed</p>
                    <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleManualFallback}
                  className="w-full"
                >
                  Try Manual Entry Instead
                </Button>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[0.86rem] font-medium mr-1" style={{
                  backgroundColor: '#F7F5F3',
                  color: '#2E2B27'
                }}>
                  MOCKED
                </span>
                This feature is simulated for demo purposes
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
