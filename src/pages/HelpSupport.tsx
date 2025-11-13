import TopNav from '@/components/navigation/TopNav';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageCircle, BookOpen, Mail, Phone, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function HelpSupport() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Support ticket submitted successfully');
    setSubject('');
    setMessage('');
  };

  const faqs = [
    {
      question: 'How do I add guests to my list?',
      answer: 'Navigate to the Guests page and click the "Add Guest" button. You can also import guests in bulk using a CSV file by clicking "Import CSV".'
    },
    {
      question: 'How does the AI chatbot work?',
      answer: 'The chatbot uses your wedding details and custom chatbot brain to automatically answer guest questions. You can update the chatbot brain anytime from the Chatbot page.'
    },
    {
      question: 'Can I customize automated messages?',
      answer: 'Yes! Go to Settings to configure notification preferences and customize message templates for reminders and announcements.'
    },
    {
      question: 'How do I export guest data?',
      answer: 'On the Guests page, click "Export CSV" to download your guest list with all current information including segments and RSVP status.'
    },
    {
      question: 'What happens to my data after the wedding?',
      answer: 'Your data remains accessible for 90 days after your wedding date. You can export all data before account closure. Contact support for data retention options.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-semibold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">Get answers and assistance for your wedding planning</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Contact Support Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-semibold mb-1">Contact Support</h2>
                <p className="text-sm text-muted-foreground">Send us a message and we'll get back to you within 24 hours</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question in detail..."
                    rows={6}
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </Card>

            {/* FAQs */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-semibold mb-1">Frequently Asked Questions</h2>
                <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Quick Links & Contact Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Documentation coming soon')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Video tutorials coming soon')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Video Tutorials
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email Support</p>
                    <a 
                      href="mailto:support@wedding.app" 
                      className="text-sm text-accent hover:underline"
                    >
                      support@wedding.app
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone Support</p>
                    <a 
                      href="tel:+15551234567" 
                      className="text-sm text-accent hover:underline"
                    >
                      +1 (555) 123-4567
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mon-Fri, 9am-6pm EST
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-accent/5 border-accent/20">
              <h3 className="text-lg font-semibold mb-2">Need urgent help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For time-sensitive issues during your event, contact our emergency support line.
              </p>
              <Button 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => toast.info('Emergency support: +1 (555) 999-0000')}
              >
                Emergency Support
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
