import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, TrendingUp, Globe, Users2 } from "lucide-react";
import teamImage from "@/assets/team-machinery.jpg";

const About = () => {
  const machinery = [
    {
      name: "CNC Machine",
      purpose: "High-precision cutting and shaping of stainless steel components",
      benefit: "Exceptional dimensional accuracy and intricate designs",
    },
    {
      name: "Power Press Machine",
      purpose: "Cutting, bending, and forming stainless steel components",
      benefit: "Efficiently handles high-volume production with consistent output",
    },
    {
      name: "Hydraulic Press Machine",
      purpose: "Molding and forming components using controlled pressure",
      benefit: "Uniformity and accuracy for complex shaping needs",
    },
    {
      name: "Lathe Machine",
      purpose: "Shaping cylindrical parts through turning and cutting operations",
      benefit: "Smooth, precise finishes for various components",
    },
    {
      name: "Welding Unit",
      purpose: "Joining metal parts with seamless and durable connections",
      benefit: "Strong, leak-proof fittings suitable for pharmaceutical use",
    },
    {
      name: "Polishing Machine",
      purpose: "Smoothing and enhancing surface finishes of components",
      benefit: "Mirror-like polish ideal for high-standard applications",
    },
    {
      name: "Laser Marking Machine",
      purpose: "Engraving permanent markings like logos or serial numbers",
      benefit: "Clear, precise branding and traceability",
    },
    {
      name: "Bandsaw",
      purpose: "Cutting raw stainless steel material into precise sizes",
      benefit: "Efficiency and accuracy during initial production stages",
    },
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
              className="rounded-lg shadow-lg w-full h-auto"
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
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{machine.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-foreground">Purpose: </span>
                    <p className="text-sm text-muted-foreground">{machine.purpose}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Benefit: </span>
                    <p className="text-sm text-muted-foreground">{machine.benefit}</p>
                  </div>
                </CardContent>
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
