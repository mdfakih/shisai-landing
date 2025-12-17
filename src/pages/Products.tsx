import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// Import product images
import bend5inch1 from '@/assets/products/sanitary-elbow-90-degree-500x500.jpg';
import bend5inch2 from '@/assets/products/5-inch-stainless-steel-bend-500x500.jpg';
import bend5inch3 from '@/assets/products/stainless-steel-elbow-dairy-bend-500x500.jpg';

import bend4inch1 from '@/assets/products/4-inch-stainless-steel-bend-500x500.jpg';
import bend4inch2 from '@/assets/products/4-inch-stainless-steel-bend-500x500(1).jpg';
import bend4inch3 from '@/assets/products/4-inch-stainless-steel-bend-500x500(2).jpg';

import bend3inch1 from '@/assets/products/3-inch-stainless-steel-bend-500x500.jpg';
import bend3inch2 from '@/assets/products/3-inch-stainless-steel-bend-500x500(1).jpg';
import bend3inch3 from '@/assets/products/stainless-steel-tee-500x500.jpg';

import tcBend1 from '@/assets/products/tc-end-dairy-band-500x500.jpg';
import tcBend2 from '@/assets/products/stainless-steel-tc-bend-500x500.jpg';
import tcBend3 from '@/assets/products/stainless-steel-tc-bend-500x500(1).jpg';

import bend15inch1 from '@/assets/products/1-5-inch-stainless-steel-bend-500x500.jpg';
import bend15inch2 from '@/assets/products/1-5-inch-stainless-steel-bend-500x500(1).jpg';

import ferrule5inch1 from '@/assets/products/img-20220418-wa0007-jpg-500x500.jpg';
import ferruleSocket1 from '@/assets/products/ss-socket-weld-tc-ferrule-500x500.jpeg';
import ferruleSocket2 from '@/assets/products/ss-socket-weld-tc-ferrule-500x500(1).jpeg';
import ferruleOrbital1 from '@/assets/products/stainless-steel-tc-ferrule-500x500.jpeg';
import ferruleOrbital2 from '@/assets/products/stainless-steel-tc-ferrule-500x500(1).jpeg';

import elbow4inch1 from '@/assets/products/4-inch-90-degree-stainless-steel-elbow-500x500.jpg';
import elbow4inch2 from '@/assets/products/4-inch-90-degree-stainless-steel-elbow-500x500(1).jpg';
import elbow3inch1 from '@/assets/products/sanitary-elbow-45-degree-500x500.jpg';
import elbow3inch2 from '@/assets/products/3-inch-90-degree-stainless-steel-elbow-500x500.jpg';

import clamp4inch1 from '@/assets/products/stainless-steel-tri-clover-clamp-500x500.jpg';
import clamp4inch2 from '@/assets/products/stainless-steel-tri-clover-clamp-500x500(1).jpg';
import clamp3inch1 from '@/assets/products/stainless-steel-tri-clover-clamps-tc-clamp-500x500.jpg';
import clamp3inch2 from '@/assets/products/3-inch-stainless-steel-tri-clover-clamp-500x500.jpg';

import pipeClamp3inch1 from '@/assets/products/sanitary-pipe-holding-clamp-500x500.jpg';
import pipeClamp3inch2 from '@/assets/products/3-inch-stainless-steel-pipe-holding-clamp-500x500.jpg';
import pipeClamp4inch1 from '@/assets/products/base-plate-500x500.jpg';
import pipeClamp4inch2 from '@/assets/products/4-inch-stainless-steel-pipe-holding-clamp-500x500.jpeg';

import tee2inch1 from '@/assets/products/sanitary-equal-tee-500x500.jpg';
import tee2inch2 from '@/assets/products/stainless-steel-tee-500x500(1).jpg';
import tcTee1 from '@/assets/products/2-inch-tri-clamp-tee-500x500.jpg';
import tcTee2 from '@/assets/products/stainless-steel-tc-tee-500x500.jpg';

import tee4inch1 from '@/assets/products/img-20220418-wa0010-jpg-500x500.jpg';
import tee4inch2 from '@/assets/products/stainless-steel-tri-clover-end-tee-ss-tc-tee-500x500.jpg';

import spool5inch1 from '@/assets/products/stainless-steel-tri-clover-spools-tc-spools-500x500.jpg';
import spool5inch2 from '@/assets/products/stainless-steel-spools-500x500.jpg';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<{
    categoryId: string;
    productIndex: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productCategories = [
    {
      id: 'bends',
      name: 'Stainless Steel Bends',
      description:
        'High-quality stainless steel bends for directional changes in piping systems',
      products: [
        {
          name: '5 Inch Stainless Steel Bend',
          sizes: '5"',
          grades: 'SS304, SS316',
          finish: 'MATT, MIRROR',
          price: '₹ 250 / Piece',
          description:
            'Premium quality 5 inch stainless steel bend for smooth directional changes in sanitary piping systems.',
          images: [bend5inch1, bend5inch2, bend5inch3],
        },
        {
          name: '4 Inch Stainless Steel Bend',
          sizes: '4"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: '₹ 200 / Piece',
          description:
            '4 inch stainless steel bend designed for high-pressure sanitary piping applications.',
          images: [bend4inch1, bend4inch2, bend4inch3],
        },
        {
          name: '3 Inch Stainless Steel Bend',
          sizes: '3"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: '₹ 290 / Piece',
          description:
            'Precision-engineered 3 inch stainless steel bend for pharmaceutical and food processing industries.',
          images: [bend3inch1, bend3inch2, bend3inch3],
        },
        {
          name: 'Stainless Steel TC Bend',
          sizes: '1/2" TO 6"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            'TC end dairy bend with tri-clamp connections for easy installation and maintenance.',
          images: [tcBend1, tcBend2, tcBend3],
        },
        {
          name: '1.5 Inch Stainless Steel Bend',
          sizes: '1.5"',
          grades: 'SS304, SS316',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            'Compact 1.5 inch stainless steel bend ideal for smaller diameter piping systems.',
          images: [bend15inch1, bend15inch2],
        },
      ],
    },
    {
      id: 'ferrules',
      name: 'Stainless Steel Ferrules',
      description:
        'Precision-engineered ferrules for secure, sanitary pipe connections',
      products: [
        {
          name: '5 Inch Stainless Steel Ferrule',
          sizes: '5"',
          grades: 'SS304, SS316',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            'High-quality 5 inch stainless steel ferrule for leak-proof sanitary connections.',
          images: [ferrule5inch1],
        },
        {
          name: 'SS Socket Weld TC Ferrule',
          sizes: '1/2" TO 20"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, GLOSSY',
          price: 'Get Best Quote',
          description:
            'Socket weld ferrule allowing secure, weldable connections in sanitary piping systems.',
          images: [ferruleSocket1, ferruleSocket2],
        },
        {
          name: 'Stainless Steel Orbital TC Ferrule',
          sizes: '1/2" TO 20"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            'Orbital weld ferrule enabling precise, weld-ready connections for high-purity applications.',
          images: [ferruleOrbital1, ferruleOrbital2],
        },
      ],
    },
    {
      id: 'elbows',
      name: 'Stainless Steel Elbows',
      description: '90-degree elbows for directional changes in piping systems',
      products: [
        {
          name: '4 Inch 90 Degree Stainless Steel Elbow',
          sizes: '4"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            '4 inch 90-degree elbow for smooth directional changes with tri-clamp connections.',
          images: [elbow4inch1, elbow4inch2],
        },
        {
          name: '3 Inch 90 Degree Stainless Steel Elbow',
          sizes: '3"',
          grades: 'SS304, SS316',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            '3 inch 90-degree elbow designed for permanent, secure connections in piping systems.',
          images: [elbow3inch1, elbow3inch2],
        },
      ],
    },
    {
      id: 'clamps',
      name: 'Tri Clover Clamps',
      description:
        'Essential tri-clamp connectors for secure, sanitary pipe connections',
      products: [
        {
          name: '4 Inch Stainless Steel Tri Clover Clamp',
          sizes: '4"',
          grades: 'SS304, SS316',
          finish: 'MATT, GLOSSY',
          price: 'Get Best Quote',
          description:
            '4 inch tri-clover clamp ensuring secure, leak-proof seals in sanitary piping systems.',
          images: [clamp4inch1, clamp4inch2],
        },
        {
          name: '3 Inch Stainless Steel Tri Clover Clamp',
          sizes: '3"',
          grades: 'SS304, SS316',
          finish: 'MATT, GLOSSY',
          price: 'Get Best Quote',
          description:
            '3 inch tri-clover clamp providing reliable connections for pharmaceutical applications.',
          images: [clamp3inch1, clamp3inch2],
        },
      ],
    },
    {
      id: 'pipe-clamps',
      name: 'Pipe Holding Clamps',
      description: 'Support clamps for stabilizing pipes in sanitary systems',
      products: [
        {
          name: '3 Inch Stainless Steel Pipe Holding Clamp',
          sizes: '3"',
          grades: 'SS304, SS316',
          finish: 'POLISHED',
          price: 'Get Best Quote',
          description:
            '3 inch pipe holding clamp securely supporting and stabilizing pipes in sanitary systems.',
          images: [pipeClamp3inch1, pipeClamp3inch2],
        },
        {
          name: '4 Inch Stainless Steel Pipe Holding Clamp',
          sizes: '4"',
          grades: 'SS304, SS316',
          finish: 'POLISHED',
          price: 'Get Best Quote',
          description:
            '4 inch pipe holding clamp with base plate for industrial piping systems.',
          images: [pipeClamp4inch1, pipeClamp4inch2],
        },
      ],
    },
    {
      id: 'tees',
      name: 'Stainless Steel Tees',
      description:
        'Flow distribution fittings for splitting or combining flow directions',
      products: [
        {
          name: '2 Inch Stainless Steel Dairy Tee',
          sizes: '2"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            '2 inch dairy tee evenly splitting or combining flow in sanitary piping systems.',
          images: [tee2inch1, tee2inch2],
        },
        {
          name: 'Stainless Steel TC Tee',
          sizes: '1/2" TO 4"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            'TC end tee with tri-clamp connections for easy assembly and maintenance.',
          images: [tcTee1, tcTee2],
        },
        {
          name: '4 Inch Stainless Steel Tri Clover Tee',
          sizes: '4"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            '4 inch tri-clover tee featuring tri-clamp connections on all three equal-sized ends.',
          images: [tee4inch1, tee4inch2],
        },
      ],
    },
    {
      id: 'spools',
      name: 'Stainless Steel Spools',
      description:
        'Precision spools for extending pipe lengths in sanitary systems',
      products: [
        {
          name: '5 Inch Stainless Steel Spools',
          sizes: '5"',
          grades: 'SS304, SS316, SS316L',
          finish: 'MATT, MIRROR',
          price: 'Get Best Quote',
          description:
            '5 inch tri-clover spools for extending pipe lengths with easy tri-clamp connections.',
          images: [spool5inch1, spool5inch2],
        },
      ],
    },
  ];

  const handleProductClick = (categoryId: string, productIndex: number) => {
    setSelectedProduct({ categoryId, productIndex });
    setIsModalOpen(true);
  };

  const selectedCategoryData = selectedProduct
    ? productCategories.find((cat) => cat.id === selectedProduct.categoryId)
    : null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive range of hygienic fittings engineered to meet global
            standards
          </p>
        </div>

        {/* Tabs for Categories */}
        <Tabs
          defaultValue={productCategories[0].id}
          className="w-full"
        >
          <TabsList className="w-full flex flex-wrap justify-start h-auto gap-2 bg-muted/50 p-2 mb-8">
            {productCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-1 min-w-[140px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {productCategories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="mt-6"
            >
              {/* Category Description */}
              <div className="mb-6 text-center">
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.products.map((product, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                    onClick={() => handleProductClick(category.id, index)}
                  >
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base leading-tight">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 text-xs mb-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-medium">{product.sizes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Grade:</span>
                          <span className="font-medium text-xs">
                            {product.grades}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {product.price}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Product Detail Modal with Carousel */}
        <Dialog
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        >
          <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden mx-auto p-0">
            <div className="overflow-y-auto max-h-[90vh] px-4 sm:px-6 py-4">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg sm:text-2xl">
                  {selectedCategoryData?.name}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-base">
                  {selectedCategoryData?.description}
                </DialogDescription>
              </DialogHeader>

              {selectedCategoryData && selectedProduct && (
                <Carousel
                  className="w-full relative"
                  opts={{
                    startIndex: selectedProduct.productIndex,
                    loop: true,
                  }}
                >
                  <CarouselContent className="-ml-2 sm:-ml-4">
                    {selectedCategoryData.products.map((product, index) => (
                      <CarouselItem
                        key={index}
                        className="pl-2 sm:pl-4"
                      >
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 pb-4">
                          {/* Product Images Carousel */}
                          <div className="w-full lg:w-1/2 flex-shrink-0">
                            <Carousel className="w-full">
                              <CarouselContent>
                                {product.images.map((image, imgIndex) => (
                                  <CarouselItem key={imgIndex}>
                                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                                      <img
                                        src={image}
                                        alt={`${product.name} - Image ${
                                          imgIndex + 1
                                        }`}
                                        className="w-full h-full object-contain p-4 sm:p-6"
                                      />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              {product.images.length > 1 && (
                                <>
                                  <CarouselPrevious className="left-2" />
                                  <CarouselNext className="right-2" />
                                </>
                              )}
                            </Carousel>
                          </div>

                          {/* Product Details */}
                          <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4">
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                {product.name}
                              </h3>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {product.description}
                              </p>
                            </div>

                            <div className="border-t border-border pt-4 space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    Size Range
                                  </span>
                                  <p className="text-sm sm:text-base font-medium text-foreground">
                                    {product.sizes}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                    Grade
                                  </span>
                                  <p className="text-sm sm:text-base font-medium text-foreground">
                                    {product.grades}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                  Finish
                                </span>
                                <p className="text-sm sm:text-base font-medium text-foreground">
                                  {product.finish}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                  Price
                                </span>
                                <p className="text-lg sm:text-xl font-bold text-primary">
                                  {product.price}
                                </p>
                              </div>
                            </div>

                            <div className="pt-4">
                              <Link to="/contact">
                                <button className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base font-medium">
                                  Request Quote
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-1 sm:left-2 h-8 w-8 sm:h-10 sm:w-10" />
                  <CarouselNext className="right-1 sm:right-2 h-8 w-8 sm:h-10 sm:w-10" />
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
              Contact us for specialized fittings tailored to your specific
              requirements
            </p>
            <Link to="/contact">
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                Request a Quote
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
