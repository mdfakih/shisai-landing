import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, TrendingUp, Globe, Users2 } from "lucide-react";
import teamImage from "@/assets/team-machinery.jpg";

const About = () => {
  const machinery = [
    "CNC Machine",
    "Power Press Machine", 
    "Hydraulic Press Machine",
    "Lathe Machine",
    "Welding Unit",
    "Polishing Machine",
    "Laser Marking Machine",
    "Bandsaw",
  ];

  const values = [
    {
      icon: Settings,
      title: "Innovation",
      description: "Investing in cutting-edge technologies and sustainable manufacturing practices",
    },
    {
      icon: TrendingUp,
      title: "Excellence",
      description: "Committed to delivering superior quality products that exceed expectations",
    },
    {
      icon: Globe,
      title: "Global Standards",
      description: "Meeting international compliance requirements across all product lines",
    },
    {
      icon: Users2,
      title: "Customer Focus",
      description: "Tailored solutions designed to meet specific client needs",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empowering precision, delivering excellence since 2001
          </p>
        </div>

        {/* Company Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in-left">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Since 2001, Shisai Steel Industries has been at the forefront of manufacturing high-quality hygienic stainless steel pipe fittings. With over two decades of expertise, we have established ourselves as a trusted name in the industry.
            </p>
            <p className="text-muted-foreground mb-4">
              We specialize in precision-engineered stainless steel fittings, including ferrules, elbows, tees, tri-clamps, and more. Our products are designed to meet global standards, ensuring superior performance, durability, and compliance with sanitary regulations.
            </p>
            <p className="text-muted-foreground">
              With advanced manufacturing technologies and a customer-centric approach, we deliver solutions tailored to the specific needs of pharmaceutical, food & beverage, dairy, biotechnology, and other hygiene-critical sectors.
            </p>
          </div>
          <div className="animate-fade-in-right">
            <img
              src={teamImage}
              alt="Shisai Steel Industries Team"
              className="rounded-lg shadow-lg w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12 animate-fade-in">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Machinery */}
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            Advanced Machinery
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our skilled professionals work with state-of-the-art equipment to ensure precision and quality in every product
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machinery.map((machine, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{machine}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Future Plans */}
        <div className="mt-20 bg-primary text-primary-foreground rounded-lg p-8 md:p-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Future Plans</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto text-center">
            Looking ahead, Shisai Steel Industries is committed to expanding our global footprint by enhancing our product portfolio and strengthening partnerships with industry leaders. We aim to invest in cutting-edge technologies, sustainable manufacturing practices, and skill development to continue delivering excellence. Our vision is to be the preferred partner for hygienic stainless steel solutions worldwide, driving innovation and supporting the evolving needs of our customers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
