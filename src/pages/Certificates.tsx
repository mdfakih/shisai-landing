import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle, Shield, FileCheck } from "lucide-react";

const Certificates = () => {
  const certifications = [
    {
      icon: Award,
      title: "ISO 9001:2015 Certified",
      description: "Quality Management System certification ensuring consistent product quality and customer satisfaction.",
      status: "Certified",
    },
    {
      icon: Shield,
      title: "FDA Compliant",
      description: "Our products meet FDA requirements for pharmaceutical and food processing applications.",
      status: "Compliant",
    },
    {
      icon: FileCheck,
      title: "3A Sanitary Standards",
      description: "Conforming to 3A standards for hygienic equipment design in dairy and food processing.",
      status: "Certified",
    },
    {
      icon: CheckCircle,
      title: "CE Marking",
      description: "Products meet EU safety, health, and environmental protection requirements.",
      status: "Certified",
    },
  ];

  const standards = [
    "ASME BPE (Bioprocessing Equipment)",
    "DIN 11850 / DIN 11851",
    "BS 4825 / ISO 2852",
    "SMS 1145 Standards",
    "IDF (International Dairy Federation)",
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Certifications & Standards
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Committed to excellence through rigorous quality standards and international certifications
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {certifications.map((cert, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <cert.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">{cert.title}</CardTitle>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-2">
                        {cert.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {cert.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Standards Compliance */}
        <div className="animate-fade-in">
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground mb-2">
                International Standards Compliance
              </CardTitle>
              <CardDescription>
                Our products are manufactured to meet or exceed the following global standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {standards.map((standard, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{standard}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Commitment */}
        <div className="mt-16 bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Our Quality Commitment</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto mb-6">
            At Shisai Steel Industries, we are committed to maintaining the highest quality standards through continuous improvement, advanced manufacturing technologies, and rigorous testing procedures. Every product undergoes strict quality control to ensure it meets international standards and customer expectations.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-primary-foreground/10 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">20+</h3>
              <p className="text-sm opacity-90">Years of Experience</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">100%</h3>
              <p className="text-sm opacity-90">Quality Tested</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-2">Global</h3>
              <p className="text-sm opacity-90">Standards Compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;
