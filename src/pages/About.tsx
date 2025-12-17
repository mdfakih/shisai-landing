import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, TrendingUp, Globe, Users2 } from 'lucide-react';
import { useState } from 'react';

// Import company album images
import machineryImg1 from '@/assets/aboutUs/119264350-location-1650277650595-500x500-photoutils-com--1000x1000.jpg';
import teamImg from '@/assets/aboutUs/wirn13mf-1000x1000.png';
import certificationImg from '@/assets/aboutUs/screenshot-2024-03-04-133102-1000x1000.png';
import registrationImg from '@/assets/aboutUs/3-1000x1000.jpeg';
import warehouseImg from '@/assets/aboutUs/119264350-location-1650277598370-500x500-photoutils-com--1000x1000.jpg';
import manufacturingImg from '@/assets/aboutUs/119264350-location-1653469114346-500x500-photoutils-com--1000x1000.jpeg';
import locationImg1 from '@/assets/aboutUs/119264350-location-1653469118790-1000x1000.jpg';
import locationImg2 from '@/assets/aboutUs/119264350-location-1653469114346-1000x1000.jpg';
import locationImg3 from '@/assets/aboutUs/119264350-location-1655279259456-1000x1000.jpg';

const About = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const companyAlbum = [
    { src: machineryImg1, alt: 'Our Machinery' },
    { src: teamImg, alt: 'Infrastructure Team' },
    { src: certificationImg, alt: 'Our Certifications' },
    { src: registrationImg, alt: 'Certificate of Registration' },
    { src: warehouseImg, alt: 'Our Warehouse' },
    { src: manufacturingImg, alt: 'Manufacturing Unit' },
    { src: locationImg1, alt: 'Company Location' },
    { src: locationImg2, alt: 'Company Facility' },
    { src: locationImg3, alt: 'Company Premises' },
  ];

  const machinery = [
    'CNC Machine',
    'Power Press Machine',
    'Hydraulic Press Machine',
    'Lathe Machine',
    'Welding Unit',
    'Polishing Machine',
    'Laser Marking Machine',
    'Bandsaw',
  ];

  const values = [
    {
      icon: Settings,
      title: 'Innovation',
      description:
        'Investing in cutting-edge technologies and sustainable manufacturing practices',
    },
    {
      icon: TrendingUp,
      title: 'Excellence',
      description:
        'Committed to delivering superior quality products that exceed expectations',
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description:
        'Meeting international compliance requirements across all product lines',
    },
    {
      icon: Users2,
      title: 'Customer Focus',
      description: 'Tailored solutions designed to meet specific client needs',
    },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Shisai Steel Industries
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 mb-3">
            Empowering precision, delivering excellence since 2009
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="text-primary"
            >
              <path
                d="M8,0a8,8,0,1,0,8,8A8.024,8.024,0,0,0,8,0ZM6.4,12l-4-4L3.528,6.872,6.4,9.736l6.072-6.072L13.6,4.8Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                GST Verified:
              </span>{' '}
              27DBFPP0939E1ZM
            </span>
          </div>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center mb-12 sm:mb-16 md:mb-20">
          <div className="animate-fade-in-left order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              About Our Company
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
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
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
              Through the years the company has created a niche customer base
              through its large network of branches across India and by striving
              to achieve total customer satisfaction. We specialize in
              precision-engineered stainless steel fittings, including ferrules,
              elbows, tees, tri-clamps, and more.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
              Our products are designed to meet global standards, ensuring
              superior performance, durability, and compliance with sanitary
              regulations for pharmaceutical, food & beverage, dairy,
              biotechnology, and other hygiene-critical sectors.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Under the valuable guidance of our mentor,{' '}
              <strong>Mr. Raju Purohit (CEO)</strong>, we are growing with a
              notable rate in the market. He has spent long years in the
              industry to have rich industrial experience enabling us to
              understand the varied requirements of our clients.
            </p>
          </div>
          <div className="animate-fade-in-right order-1 md:order-2">
            <img
              src={teamImg}
              alt="Shisai Steel Industries Infrastructure Team"
              className="rounded-lg shadow-lg w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in px-4">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="bg-primary/10 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <value.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Album */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-3 sm:mb-4 animate-fade-in px-4">
            Company Album
          </h2>
          <p className="text-sm sm:text-base text-center text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            A glimpse into our state-of-the-art facilities, certifications, and
            infrastructure
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {companyAlbum.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                  <p className="text-white font-medium text-sm sm:text-base">
                    {image.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machinery */}
        <div className="mb-12 sm:mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-3 sm:mb-4 px-4">
            Advanced Machinery
          </h2>
          <p className="text-sm sm:text-base text-center text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            Our skilled professionals work with state-of-the-art equipment to
            ensure precision and quality in every product
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {machinery.map((machine, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <CardHeader className="py-4 sm:py-5 md:py-6">
                  <CardTitle className="text-base sm:text-lg text-foreground">
                    {machine}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Future Plans */}
        <div className="bg-primary text-primary-foreground rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 text-center">
            Our Future Plans
          </h2>
          <p className="text-sm sm:text-base md:text-lg opacity-90 max-w-3xl mx-auto text-center leading-relaxed">
            Looking ahead, Shisai Steel Industries is committed to expanding our
            global footprint by enhancing our product portfolio and
            strengthening partnerships with industry leaders. We aim to invest
            in cutting-edge technologies, sustainable manufacturing practices,
            and skill development to continue delivering excellence. Our vision
            is to be the preferred partner for hygienic stainless steel
            solutions worldwide, driving innovation and supporting the evolving
            needs of our customers.
          </p>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-5xl">
            <button
              className="absolute -top-8 sm:-top-10 md:-top-12 right-0 text-white text-xl sm:text-2xl md:text-3xl hover:text-gray-300 transition-colors w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close modal"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Company Album"
              className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] md:max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
