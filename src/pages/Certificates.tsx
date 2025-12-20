import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  Download,
  X,
  Award,
  Shield,
  Eye,
  ExternalLink,
  Maximize2,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<{
    title: string;
    file: string;
    description: string;
  } | null>(null);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [errorStates, setErrorStates] = useState<{ [key: number]: boolean }>(
    {},
  );

  const certificates = [
    {
      title: 'Udyam Registration Certificate',
      description:
        'Official MSME registration certificate validating our business credentials and compliance with government standards.',
      file: '/certificates/AAA Print _ Udyam Registration Certificate (1) (2).pdf',
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Company Registration Certificate',
      description:
        'Official company registration documentation for Shisai Steel Industries, establishing our legal entity and operational authority.',
      file: '/certificates/SHISAI STEEL INDUSTRIES (5) (2).pdf',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'ZED Certification',
      description:
        'Zero Defect Zero Effect certification demonstrating our commitment to quality manufacturing and environmental responsibility.',
      file: '/certificates/Zed certificate (3) (2).pdf',
      icon: Award,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Trade License',
      description:
        'Authorized trade license from Znox Trademart validating our commercial operations and business legitimacy.',
      file: '/certificates/znox trademart (2).pdf',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Tri Clover Trademark Certificate',
      description:
        'Official trademark registration certificate for Tri Clover brand, protecting our intellectual property and brand identity.',
      file: '/certificates/tri clover trademark certificate (3).pdf',
      icon: Award,
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  // Keyboard support for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedCertificate) {
        closePreview();
      }
    };

    if (selectedCertificate) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedCertificate]);

  // Initialize loading states
  useEffect(() => {
    const initialLoadingStates: { [key: number]: boolean } = {};
    certificates.forEach((_, index) => {
      initialLoadingStates[index] = true;
    });
    setLoadingStates(initialLoadingStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleDownload = (file: string, title: string) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (cert: {
    title: string;
    file: string;
    description: string;
  }) => {
    setSelectedCertificate(cert);
  };

  const closePreview = () => {
    setSelectedCertificate(null);
  };

  const handleIframeLoad = (index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
  };

  const handleIframeError = (index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: false }));
    setErrorStates((prev) => ({ ...prev, [index]: true }));
  };

  const openInNewTab = (file: string) => {
    window.open(file, '_blank');
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 md:mb-6 animate-scale-in">
            <Shield className="h-7 w-7 md:h-8 md:w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4 px-4">
            Our Certifications
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
            Verified credentials and certifications that validate our commitment
            to quality, compliance, and excellence in manufacturing
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-8 mb-10 md:mb-16">
          {certificates.map((cert, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 md:hover:-translate-y-2 animate-scale-in border-2 hover:border-primary/50"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Gradient Background Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <CardHeader className="relative pb-3 md:pb-6">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div
                    className={`bg-gradient-to-br ${cert.color} p-2.5 md:p-3 rounded-lg md:rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <cert.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div
                    className={`transition-all duration-300 md:opacity-0 md:translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0`}
                  >
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      Verified
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg md:text-xl text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                  {cert.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative space-y-3 md:space-y-4 pt-0">
                <CardDescription className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {cert.description}
                </CardDescription>

                {/* PDF Preview */}
                <div className="relative group/preview">
                  <div className="relative h-48 md:h-64 bg-white rounded-lg border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-inner">
                    {/* Loading State */}
                    {loadingStates[index] !== false && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
                        <div className="animate-spin rounded-full h-7 w-7 md:h-8 md:w-8 border-b-2 border-primary mb-2 md:mb-3"></div>
                        <span className="text-xs md:text-sm font-medium text-muted-foreground">
                          Loading preview...
                        </span>
                      </div>
                    )}

                    {/* Error State */}
                    {errorStates[index] && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm z-10">
                        <FileText className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-2 md:mb-3" />
                        <span className="text-xs md:text-sm font-medium text-muted-foreground mb-1 md:mb-2">
                          Preview unavailable
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Click to view or download
                        </span>
                      </div>
                    )}

                    {/* PDF Embed - Fixed for mobile */}
                    <iframe
                      src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=50`}
                      className="w-full h-full border-0 pointer-events-none bg-white"
                      title={`${cert.title} Preview`}
                      onLoad={() => handleIframeLoad(index)}
                      onError={() => handleIframeError(index)}
                      style={{
                        // transform: 'scale(0.7)',
                        // transformOrigin: 'top left',
                        // width: '142%',
                        // height: '142%',
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                    />

                    {/* Interactive Overlay */}
                    <div
                      className="absolute inset-0 bg-transparent active:bg-primary/10 md:hover:bg-primary/5 transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 active:opacity-100 md:hover:opacity-100"
                      onClick={() => handlePreview(cert)}
                    >
                      <div className="bg-primary text-primary-foreground p-2.5 md:p-3 rounded-full shadow-lg transform scale-75 hover:scale-100 transition-transform duration-300">
                        <Maximize2 className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                    </div>

                    {/* Corner Actions - Hidden on mobile, shown on hover on desktop */}
                    <div className="hidden md:flex absolute top-2 right-2 gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInNewTab(cert.file);
                        }}
                        className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg hover:bg-muted transition-colors duration-300"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(cert.file, cert.title);
                        }}
                        className="bg-background/90 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg hover:bg-muted transition-colors duration-300"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 md:gap-3 pt-1 md:pt-2">
                  <button
                    onClick={() => handlePreview(cert)}
                    className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-95 transition-all duration-300 md:hover:shadow-lg md:hover:scale-[1.02] font-medium text-sm md:text-base"
                  >
                    <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Full View</span>
                    <span className="sm:hidden">View</span>
                  </button>
                  <button
                    onClick={() => handleDownload(cert.file, cert.title)}
                    className="flex-1 flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 active:scale-95 transition-all duration-300 md:hover:shadow-lg md:hover:scale-[1.02] font-medium border border-border group/download text-sm md:text-base"
                  >
                    <Download className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover/download:animate-bounce" />
                    Download
                  </button>
                </div>
              </CardContent>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
            </Card>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground rounded-xl md:rounded-2xl p-6 md:p-12 text-center animate-fade-in shadow-2xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Trusted & Certified
            </h2>
            <p className="text-sm md:text-base lg:text-lg opacity-95 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed px-2">
              At Shisai Steel Industries, we maintain the highest standards of
              quality and compliance. Our certifications reflect our dedication
              to excellence, regulatory adherence, and customer satisfaction.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-6 md:mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 transform hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                  15+
                </h3>
                <p className="text-xs md:text-sm opacity-90">
                  Years of Excellence
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 transform hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                  100%
                </h3>
                <p className="text-xs md:text-sm opacity-90">
                  Verified Credentials
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 transform hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                  ISO
                </h3>
                <p className="text-xs md:text-sm opacity-90">
                  Quality Standards
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 transform hover:scale-105 active:scale-95 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
                  ZED
                </h3>
                <p className="text-xs md:text-sm opacity-90">
                  Certified Manufacturing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 md:mt-12 text-center animate-fade-in px-4">
          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
            All certificates are authentic and can be verified with the
            respective issuing authorities. For verification inquiries, please
            contact us.
          </p>
        </div>

        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-modal-fade-in">
            <div className="relative w-full h-full md:max-w-6xl md:max-h-[90vh] md:h-auto bg-background md:rounded-2xl shadow-2xl overflow-hidden animate-modal-scale-in">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-muted/30">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground truncate">
                    {selectedCertificate.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 md:line-clamp-none">
                    {selectedCertificate.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                  <button
                    onClick={() =>
                      handleDownload(
                        selectedCertificate.file,
                        selectedCertificate.title,
                      )
                    }
                    className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-95 transition-all duration-300 md:hover:scale-105 font-medium text-sm md:text-base"
                  >
                    <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="relative h-[calc(100vh-80px)] md:h-[calc(90vh-120px)] bg-white">
                {/* Enhanced PDF Viewer */}
                <iframe
                  src={`${selectedCertificate.file}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  className="w-full h-full border-0"
                  title={selectedCertificate.title}
                />
              </div>

              {/* Mobile-friendly close area - Only show if header close button is not easily accessible */}
              <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg text-xs text-muted-foreground">
                  Swipe down or tap × to close
                </div>
              </div>
            </div>

            {/* Click outside to close - Only on desktop */}
            <div
              className="hidden md:block absolute inset-0 -z-10"
              onClick={closePreview}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
