import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const contactFormRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent!',
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToForm = () => {
    contactFormRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const contactInfo = {
    address: {
      icon: MapPin,
      title: 'Address',
      details: [
        'UNIT NO 13, SINGH INDUSTRIAL ESTATE',
        'NR. KALIMATA MANDIR, KHERPADA',
        'WALIV, VASAI-EAST, PALGHAR',
        'Maharashtra, 401208',
      ],
      mapLink: 'https://www.google.co.in/maps/dir//19.42259000,72.85411000',
    },
    phone: {
      icon: Phone,
      title: 'Phone',
      details: ['+91 9082780156'],
    },
    email: {
      icon: Mail,
      title: 'Email',
      details: ['triclover.india@gmail.com', 'shisaisteel@gmail.com'],
    },
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card
            ref={contactFormRef}
            className="animate-fade-in-left"
          >
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground block mb-2"
                  >
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground block mb-2"
                  >
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground block mb-2"
                  >
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 1234567890"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-foreground block mb-2"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your requirements..."
                    rows={5}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full group"
                >
                  Send Message
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 animate-fade-in-right">
            {/* Consolidated Contact Info Card */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Get in touch with us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <contactInfo.address.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">
                      {contactInfo.address.title}
                    </h4>
                    {contactInfo.address.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-muted-foreground text-sm"
                      >
                        {detail}
                      </p>
                    ))}
                    <a
                      href={contactInfo.address.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-sm text-primary hover:underline mt-2 font-medium"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>Get Directions</span>
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <contactInfo.phone.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {contactInfo.phone.title}
                    </h4>
                    {contactInfo.phone.details.map((detail, idx) => (
                      <a
                        key={idx}
                        href={`tel:${detail}`}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors block"
                      >
                        {detail}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                    <contactInfo.email.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {contactInfo.email.title}
                    </h4>
                    {contactInfo.email.details.map((detail, idx) => (
                      <a
                        key={idx}
                        href={`mailto:${detail}`}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors block"
                      >
                        {detail}
                      </a>
                    ))}
                  </div>
                </div>

                {/* GST Number */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="text-primary flex-shrink-0"
                    >
                      <path
                        d="M8,0a8,8,0,1,0,8,8A8.024,8.024,0,0,0,8,0ZM6.4,12l-4-4L3.528,6.872,6.4,9.736l6.072-6.072L13.6,4.8Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div>
                      <span className="text-sm font-semibold text-foreground">
                        GST Verified:{' '}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        27DBFPP0939E1ZM
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-xl">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold">Closed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 animate-fade-in">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground">
                Find Us on Map
              </CardTitle>
              <CardDescription>
                Located in Vasai, Palghar - Easy to reach from Mumbai and
                surrounding areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps?q=19.42259,72.85411&hl=en&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shisai Steel Industries Location"
                  className="w-full h-full"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Our facility is equipped with state-of-the-art machinery and a
                  dedicated team ready to serve your needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={scrollToForm}
                  >
                    Schedule a Visit
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    asChild
                  >
                    <a
                      href="https://www.google.co.in/maps/dir//19.42259000,72.85411000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
