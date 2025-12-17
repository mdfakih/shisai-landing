import {
  ArrowRight,
  CheckCircle,
  Factory,
  Users,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Home = () => {
  const industries = [
    'Pharmaceutical Manufacturing',
    'Food & Beverage Processing',
    'Dairy Production',
    'Biotechnology',
    'Cosmetics & Personal Care',
    'Water Treatment Systems',
  ];

  const features = [
    {
      icon: Factory,
      title: 'Advanced Manufacturing',
      description:
        'State-of-the-art machinery ensuring precision and quality in every product.',
    },
    {
      icon: Award,
      title: 'Quality Standards',
      description:
        'Meeting global standards with superior performance and sanitary compliance.',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description:
        'Skilled professionals with over two decades of industry expertise.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description:
        'Investing in cutting-edge technologies and sustainable practices.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden group">
        {/* Multi-layer Gradient Background with hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8 transition-all duration-1000 group-hover:from-primary/12 group-hover:to-accent/12 -z-10" />

        {/* Animated mesh gradient overlay */}
        <div
          className="absolute inset-0 opacity-30 dark:opacity-20 transition-opacity duration-1000 group-hover:opacity-50 dark:group-hover:opacity-30 -z-10"
          style={{
            backgroundImage: `
              radial-gradient(at 0% 0%, hsl(var(--primary) / 0.1) 0px, transparent 50%),
              radial-gradient(at 100% 0%, hsl(var(--accent) / 0.08) 0px, transparent 50%),
              radial-gradient(at 100% 100%, hsl(var(--primary) / 0.12) 0px, transparent 50%),
              radial-gradient(at 0% 100%, hsl(var(--accent) / 0.1) 0px, transparent 50%)
            `,
          }}
        />

        {/* Geometric Pattern Overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06] transition-opacity duration-700 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Large Animated Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl transition-all duration-1000 group-hover:scale-125 group-hover:from-primary/15 -z-10" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl transition-all duration-1000 group-hover:scale-125 group-hover:from-accent/15 -z-10" />

        {/* Middle floating orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-primary/5 to-transparent rounded-full blur-2xl transition-all duration-1000 group-hover:scale-150 group-hover:from-primary/8 -z-10" />

        {/* Subtle Grid Lines */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.04] transition-opacity duration-700 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Diagonal lines pattern */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03] transition-all duration-700 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, hsl(var(--primary)) 0px, hsl(var(--primary)) 1px, transparent 1px, transparent 60px)`,
          }}
        />

        <div className="container mx-auto relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight transition-all duration-300 hover:scale-[1.02]">
              Precision Engineering in
              <span className="text-primary transition-colors duration-300 hover:text-primary/80">
                {' '}
                Hygienic Fittings
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed transition-all duration-300 hover:text-foreground">
              Manufacturing high-quality stainless steel pipe fittings since
              2009. Trusted by pharmaceutical, food & beverage, and
              biotechnology industries worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button
                  size="lg"
                  className="group shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Who We Are
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Established in the year <strong>2009</strong> at Vasai, we "
                <strong>ShiSai Steel Industries</strong>" are engaged as the
                foremost <strong>Manufacturer</strong>,{' '}
                <strong>Wholesaler</strong> and <strong>Trader</strong> of{' '}
                <strong>
                  Stainless Steel Bend, Tri Clover Clamp, Pipe Holding Clamp,
                  Stainless Steel Elbow, Stainless Steel Cross Tee
                </strong>{' '}
                and many more.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Through the years the company has created a niche customer base
                through its large network of branches across India and by
                striving to achieve total customer satisfaction. We specialize
                in precision-engineered stainless steel fittings, including
                ferrules, elbows, tees, tri-clamps, and more.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our products are designed to meet global standards, ensuring
                superior performance, durability, and compliance with sanitary
                regulations for pharmaceutical, food & beverage, dairy,
                biotechnology, and other hygiene-critical sectors.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-fade-in-right">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 group"
                >
                  <CardContent className="p-6">
                    <feature.icon className="h-10 w-10 text-primary mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                    <h3 className="font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Industries We Serve
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We serve industries that demand the highest standards of hygiene
              and precision
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg bg-card border border-border hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-scale-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <span className="text-foreground transition-colors duration-300 group-hover:text-primary">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl transition-transform duration-1000 hover:scale-150" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl transition-transform duration-1000 hover:scale-150" />
        </div>

        <div className="container mx-auto text-center animate-fade-in relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 transition-all duration-300 hover:scale-105">
            Ready to Experience Excellence?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto transition-all duration-300 hover:opacity-100">
            Partner with us for precision-engineered hygienic fittings that meet
            the highest global standards
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              variant="secondary"
              className="group hover:scale-110 hover:shadow-2xl transition-all duration-300"
            >
              Contact Us Today
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
