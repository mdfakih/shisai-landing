import { ArrowRight, CheckCircle, Factory, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Home = () => {
  const industries = [
    "Pharmaceutical Manufacturing",
    "Food & Beverage Processing",
    "Dairy Production",
    "Biotechnology",
    "Cosmetics & Personal Care",
    "Water Treatment Systems",
  ];

  const features = [
    {
      icon: Factory,
      title: "Advanced Manufacturing",
      description: "State-of-the-art machinery ensuring precision and quality in every product.",
    },
    {
      icon: Award,
      title: "Quality Standards",
      description: "Meeting global standards with superior performance and sanitary compliance.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Skilled professionals with over two decades of industry expertise.",
    },
    {
      icon: TrendingUp,
      title: "Continuous Innovation",
      description: "Investing in cutting-edge technologies and sustainable practices.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] -z-10" />
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Precision Engineering in
              <span className="text-primary"> Hygienic Fittings</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Manufacturing high-quality stainless steel pipe fittings since 2001. Trusted by pharmaceutical, food & beverage, and biotechnology industries worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="group">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
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
              <p className="text-muted-foreground mb-6">
                Since 2001, Shisai Steel Industries has been at the forefront of manufacturing high-quality hygienic stainless steel pipe fittings. With over two decades of expertise, we have established ourselves as a trusted name in the industry, catering to the stringent demands of the pharmaceutical, food, beverage, and other hygiene-critical sectors.
              </p>
              <p className="text-muted-foreground">
                We specialize in the production of precision-engineered stainless steel fittings, including ferrules, elbows, tees, tri-clamps, and more. Our products are designed to meet global standards, ensuring superior performance, durability, and compliance with sanitary regulations.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-fade-in-right">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <feature.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
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
              We serve industries that demand the highest standards of hygiene and precision
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience Excellence?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Partner with us for precision-engineered hygienic fittings that meet the highest global standards
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="group">
              Contact Us Today
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
