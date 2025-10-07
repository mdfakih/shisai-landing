import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import productsImage1 from "@/assets/products-1.png";
import productsImage2 from "@/assets/products-2.jpg";
import { ArrowRight } from "lucide-react";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productCategories = [
    {
      id: "clamps-ferrules",
      name: "Clamps & Ferrules",
      description: "Essential connectors and end fittings for secure, sanitary pipe connections",
      image: productsImage1,
      products: [
        {
          name: "TC Clamp (Cast)",
          sizes: '1/2" TO 12"',
          grades: "SS304, SS316",
          finish: "MATT, GLOSSY",
          description: "A TC Clamp is a stainless steel connector ensuring a secure, leak-proof seal in sanitary piping systems.",
          image: productsImage1,
        },
        {
          name: "TC Clamp (Indian)",
          sizes: '3" TO 20"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, GLOSSY",
          description: "Enhanced strength and durability for secure connections in high-pressure sanitary piping systems.",
          image: productsImage1,
        },
        {
          name: "Orbital Weld Ferrule",
          sizes: '1/2" TO 20"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Enables precise, weld-ready connections in sanitary piping systems for high-purity applications.",
          image: productsImage1,
        },
        {
          name: "Socket Weld Ferrule",
          sizes: '1/2" TO 20"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, GLOSSY",
          description: "Allows secure, weldable connections in sanitary piping systems for high-strength applications.",
          image: productsImage1,
        },
        {
          name: "Blind Ferrule",
          sizes: '1/2" TO 20"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Used to securely cap off unused sanitary piping ports in hygienic systems.",
          image: productsImage1,
        },
        {
          name: "Pipe Clamp (PHC)",
          sizes: '1/2" TO 12"',
          grades: "SS304, SS316",
          finish: "POLISHED",
          description: "Securely supports and stabilizes pipes in sanitary and industrial piping systems.",
          image: productsImage1,
        },
      ],
    },
    {
      id: "tees",
      name: "Tees",
      description: "Flow distribution fittings for splitting or combining flow directions",
      image: productsImage2,
      products: [
        {
          name: "Equal Tee",
          sizes: '1/2" TO 6"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Evenly splits or combines flow in sanitary piping systems with three equally sized outlets.",
          image: productsImage2,
        },
        {
          name: "TC End Equal Tee",
          sizes: '1/2" TO 4"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Evenly splits or combines flow in sanitary systems, featuring tri-clamp connections on all three equal-sized ends.",
          image: productsImage2,
        },
        {
          name: "Unequal Tee",
          sizes: '3/4" TO 6"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Distributes or combines flow in sanitary piping systems with outlets of different sizes.",
          image: productsImage2,
        },
        {
          name: "TC End Unequal Tee",
          sizes: '3/4" TO 4"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Combines or redirects flow in sanitary systems with tri-clamp connections and different-sized ends.",
          image: productsImage2,
        },
      ],
    },
    {
      id: "elbows-reducers",
      name: "Elbows & Reducers",
      description: "Directional change and pipe size transition fittings",
      image: productsImage2,
      products: [
        {
          name: "TC End 90° Elbow (1D, 1.5D)",
          sizes: '1/2" TO 6"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Allows for smooth directional changes in sanitary piping systems with tri-clamp connections at both ends.",
          image: productsImage2,
        },
        {
          name: "90° Elbow (1D, 1.5D)",
          sizes: '1/2" TO 6"',
          grades: "SS304, SS316",
          finish: "MATT, MIRROR",
          description: "Allows for directional changes in piping systems, welded for a permanent, secure connection.",
          image: productsImage2,
        },
        {
          name: "TC End Concentric Reducer",
          sizes: '3/4" TO 4"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Seamlessly transitions between different pipe sizes with tri-clamp connections for easy installation.",
          image: productsImage2,
        },
        {
          name: "Concentric Reducer",
          sizes: '3/4" TO 4"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Connects pipes of different diameters, welded for a secure, permanent connection.",
          image: productsImage2,
        },
        {
          name: "Eccentric Reducer",
          sizes: '3/4" TO 4"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Reduces pipe diameter while maintaining a flat underside, preventing air pockets.",
          image: productsImage2,
        },
      ],
    },
    {
      id: "valves-manifolds",
      name: "Valves & Manifolds",
      description: "Flow control and distribution systems for hygienic applications",
      image: productsImage2,
      products: [
        {
          name: "TC End Manifolds",
          sizes: '1/2" TO 4"',
          grades: "SS304, SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Allows multiple pipe connections from a single point with tri-clamp connections for easy assembly.",
          image: productsImage2,
        },
        {
          name: "Diaphragm Valve",
          sizes: '1/2" TO 2"',
          grades: "SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Uses a flexible diaphragm to control fluid flow, offering tight shutoff and precise flow regulation.",
          image: productsImage2,
        },
        {
          name: "Zero Dead Leg Valve",
          sizes: '1/2" TO 2"',
          grades: "SS316, SS316L",
          finish: "MATT, MIRROR",
          description: "Designed to minimize stagnant areas in the flow path, preventing contamination.",
          image: productsImage2,
        },
      ],
    },
    {
      id: "gaskets-flanges",
      name: "Gaskets & Flanges",
      description: "Sealing components and connection hardware for leak-proof systems",
      image: productsImage1,
      products: [
        {
          name: "Tri Clamp Gaskets",
          sizes: '1/2" TO 12"',
          grades: "SILICON, EPDM, PTFE",
          finish: "WHITE, RED, TRANSPARENT",
          description: "Sealing component used with Tri Clamp fittings to create a leak-proof, sanitary connection.",
          image: productsImage1,
        },
        {
          name: "Flanges",
          sizes: '1/2" TO 12"',
          grades: "SS304, SS316, SS316L",
          finish: "E-TABLE, SLIP-ON, LAP-JOINT, BLIND, WELD NECK",
          description: "Flat, circular connectors used to join pipe sections or equipment, providing secure, leak-proof seals.",
          image: productsImage1,
        },
      ],
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
  };

  const selectedCategoryData = productCategories.find((cat) => cat.id === selectedCategory);

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

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((category, index) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in overflow-hidden group"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl text-foreground">
                  {category.name}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </CardTitle>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-xs">
                  {category.products.length} Products
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Product Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[90vw] sm:max-w-4xl max-h-[90vh] overflow-hidden mx-auto p-0">
            <div className="overflow-y-auto max-h-[90vh] px-4 sm:px-6 py-4">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg sm:text-2xl">{selectedCategoryData?.name}</DialogTitle>
                <DialogDescription className="text-xs sm:text-base">{selectedCategoryData?.description}</DialogDescription>
              </DialogHeader>
              
              {selectedCategoryData && (
                <Carousel className="w-full relative">
                  <CarouselContent className="-ml-4">
                    {selectedCategoryData.products.map((product, index) => (
                      <CarouselItem key={index} className="pl-4">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          {/* Product Image - Properly sized for mobile */}
                          <div className="w-full sm:w-1/2 flex-shrink-0">
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-2 sm:p-4"
                              />
                            </div>
                          </div>
                          
                          {/* Product Content */}
                          <div className="w-full sm:w-1/2 space-y-2 sm:space-y-4">
                            <h3 className="text-base sm:text-xl font-semibold text-foreground leading-tight">{product.name}</h3>
                            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pt-2 sm:pt-4">
                              <div className="space-y-1">
                                <span className="text-xs sm:text-sm font-semibold text-foreground">Size Range</span>
                                <p className="text-xs sm:text-sm text-muted-foreground break-words">{product.sizes}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs sm:text-sm font-semibold text-foreground">Grade</span>
                                <p className="text-xs sm:text-sm text-muted-foreground break-words">{product.grades}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-xs sm:text-sm font-semibold text-foreground">Finish</span>
                                <p className="text-xs sm:text-sm text-muted-foreground break-words">{product.finish}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 sm:left-2 h-8 w-8 translate-x-0" />
                  <CarouselNext className="right-0 sm:right-2 h-8 w-8 translate-x-0" />
                </Carousel>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
