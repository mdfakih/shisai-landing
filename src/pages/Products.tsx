import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Products = () => {
  const products = [
    {
      name: "TC Clamp (Cast)",
      sizes: '1/2" TO 12"',
      grades: "SS304, SS316",
      finish: "MATT, GLOSSY",
      description: "A TC Clamp is a stainless steel connector ensuring a secure, leak-proof seal in sanitary piping systems.",
    },
    {
      name: "TC Clamp (Indian)",
      sizes: '3" TO 20"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, GLOSSY",
      description: "Enhanced strength and durability for secure connections in high-pressure sanitary piping systems.",
    },
    {
      name: "Orbital Weld Ferrule",
      sizes: '1/2" TO 20"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Enables precise, weld-ready connections in sanitary piping systems for high-purity applications.",
    },
    {
      name: "Socket Weld Ferrule",
      sizes: '1/2" TO 20"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, GLOSSY",
      description: "Allows secure, weldable connections in sanitary piping systems for high-strength applications.",
    },
    {
      name: "Blind Ferrule",
      sizes: '1/2" TO 20"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Used to securely cap off unused sanitary piping ports in hygienic systems.",
    },
    {
      name: "Pipe Clamp (PHC)",
      sizes: '1/2" TO 12"',
      grades: "SS304, SS316",
      finish: "POLISHED",
      description: "Securely supports and stabilizes pipes in sanitary and industrial piping systems.",
    },
    {
      name: "Equal Tee",
      sizes: '1/2" TO 6"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Evenly splits or combines flow in sanitary piping systems with three equally sized outlets.",
    },
    {
      name: "TC End Equal Tee",
      sizes: '1/2" TO 4"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Evenly splits or combines flow in sanitary systems, featuring tri-clamp connections on all three equal-sized ends.",
    },
    {
      name: "Unequal Tee",
      sizes: '3/4" TO 6"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Distributes or combines flow in sanitary piping systems with outlets of different sizes.",
    },
    {
      name: "TC End 90° Elbow (1D, 1.5D)",
      sizes: '1/2" TO 6"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Allows for smooth directional changes in sanitary piping systems, featuring tri-clamp connections at both ends.",
    },
    {
      name: "TC End Concentric Reducer",
      sizes: '3/4" TO 4"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Seamlessly transitions between different pipe sizes in sanitary systems with tri-clamp connections.",
    },
    {
      name: "Eccentric Reducer",
      sizes: '3/4" TO 4"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Reduces pipe diameter while maintaining a flat underside, preventing air pockets and ensuring smooth flow.",
    },
    {
      name: "TC End Manifolds",
      sizes: '1/2" TO 4"',
      grades: "SS304, SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Allows multiple pipe connections from a single point, using tri-clamp connections for easy assembly.",
    },
    {
      name: "Diaphragm Valve",
      sizes: '1/2" TO 2"',
      grades: "SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Uses a flexible diaphragm to control fluid flow, offering tight shutoff and precise flow regulation.",
    },
    {
      name: "Zero Dead Leg Valve",
      sizes: '1/2" TO 2"',
      grades: "SS316, SS316L",
      finish: "MATT, MIRROR",
      description: "Designed to minimize stagnant areas in the flow path, preventing contamination and ensuring hygienic conditions.",
    },
    {
      name: "Tri Clamp Gaskets",
      sizes: '1/2" TO 12"',
      grades: "SILICON, EPDM, PTFE",
      finish: "WHITE, RED, TRANSPARENT",
      description: "Sealing component used with Tri Clamp fittings to create a leak-proof, sanitary connection.",
    },
    {
      name: "Flanges",
      sizes: '1/2" TO 12"',
      grades: "SS304, SS316, SS316L",
      finish: "E-TABLE, SLIP-ON, LAP-JOINT, BLIND, WELD NECK",
      description: "Flat, circular connectors used to join pipe sections or equipment, providing secure, leak-proof seals.",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive range of hygienic fittings engineered to meet global standards
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl text-foreground">{product.name}</CardTitle>
                <CardDescription className="text-sm">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Size: {product.sizes}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">Grade: </span>
                  <span className="text-sm text-muted-foreground">{product.grades}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">Finish: </span>
                  <span className="text-sm text-muted-foreground">{product.finish}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center animate-fade-in">
          <div className="bg-muted/50 rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Contact us for specialized fittings tailored to your specific requirements
            </p>
            <a href="/contact">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                Request a Quote
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
