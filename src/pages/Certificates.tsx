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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
      file: '/src/assets/certificates/AAA Print _ Udyam Registration Certificate (1) (2).pdf',
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Company Registration Certificate',
      description:
        'Official company registration documentation for Shisai Steel Industries, establishing our legal entity and operational authority.',
      file: '/src/assets/certificates/SHISAI STEEL INDUSTRIES (5) (2).pdf',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'ZED Certification',
      description:
        'Zero Defect Zero Effect certification demonstrating our commitment to quality manufacturing and environmental responsibility.',
      file: '/src/assets/certificates/Zed certificate (3) (2).pdf',
      icon: Award,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Trade License',
      description:
        'Authorized trade license from Znox Trademart validating our commercial operations and business legitimacy.',
      file: '/src/assets/certificates/znox trademart (2).pdf',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
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
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-6 animate-scale-in">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Certifications
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verified credentials and certifications that validate our commitment
            to quality, compliance, and excellence in manufacturing
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {certificates.map((cert, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in border-2 hover:border-primary/50"
              style={{ animationDelay: `${index * 0.15}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient Background Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`bg-gradient-to-br ${cert.color} p-3 rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <cert.icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`transition-all duration-300 ${
                      hoveredCard === index
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-4'
                    }`}
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      Verified
                    </span>
                  </div>
                </div>
                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {cert.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <CardDescription className="text-muted-foreground leading-relaxed min-h-[60px]">
                  {cert.description}
                </CardDescription>

                {/* Actual PDF Preview */}
                <div className="relative group/preview">
                  <div className="relative h-64 bg-white rounded-lg border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden shadow-inner">
                    {/* Loading State */}
                    {loadingStates[index] !== false && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                        <span className="text-sm font-medium text-muted-foreground">
                          Loading preview...
                        </span>
                      </div>
                    )}

                    {/* Error State */}
                    {errorStates[index] && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm z-10">
                        <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                        <span className="text-sm font-medium text-muted-foreground mb-2">
                          Preview unavailable
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Click to view or download
                        </span>
                      </div>
                    )}

                    {/* PDF Embed */}
                    <iframe
                      src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      className="w-full h-full border-0 pointer-events-none"
                      title={`${cert.title} Preview`}
                      onLoad={() => handleIframeLoad(index)}
                      onError={() => handleIframeError(index)}
                      style={{
                        transform: 'scale(0.8)',
                        transformOrigin: 'top left',
                        width: '125%',
                        height: '125%',
                      }}
                    />

                    {/* Interactive Overlay */}
                    <div
                      className="absolute inset-0 bg-transparent hover:bg-primary/5 transition-all duration-300 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100"
                      onClick={() => handlePreview(cert)}
                    >
                      <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg transform scale-75 hover:scale-100 transition-transform duration-300">
                        <Maximize2 className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Corner Actions */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
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
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handlePreview(cert)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    Full View
                  </button>
                  <button
                    onClick={() => handleDownload(cert.file, cert.title)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] font-medium border border-border group/download"
                  >
                    <Download className="h-4 w-4 group-hover/download:animate-bounce" />
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
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground rounded-2xl p-8 md:p-12 text-center animate-fade-in shadow-2xl">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted & Certified
            </h2>
            <p className="text-lg opacity-95 max-w-3xl mx-auto mb-8 leading-relaxed">
              At Shisai Steel Industries, we maintain the highest standards of
              quality and compliance. Our certifications reflect our dedication
              to excellence, regulatory adherence, and customer satisfaction.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-3xl font-bold mb-2">20+</h3>
                <p className="text-sm opacity-90">Years of Excellence</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-3xl font-bold mb-2">100%</h3>
                <p className="text-sm opacity-90">Verified Credentials</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-3xl font-bold mb-2">ISO</h3>
                <p className="text-sm opacity-90">Quality Standards</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15">
                <h3 className="text-3xl font-bold mb-2">ZED</h3>
                <p className="text-sm opacity-90">Certified Manufacturing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-muted-foreground text-sm">
            All certificates are authentic and can be verified with the
            respective issuing authorities. For verification inquiries, please
            contact us.
          </p>
        </div>

        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal-fade-in">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden animate-modal-scale-in">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {selectedCertificate.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCertificate.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleDownload(
                        selectedCertificate.file,
                        selectedCertificate.title,
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-muted rounded-lg transition-colors duration-300 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="relative h-[calc(90vh-120px)] bg-white">
                {/* Enhanced PDF Viewer */}
                <iframe
                  src={`${selectedCertificate.file}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  className="w-full h-full border-0"
                  title={selectedCertificate.title}
                />
              </div>

              {/* Mobile-friendly close area */}
              <div className="md:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={closePreview}
                  className="bg-background/90 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg hover:bg-muted transition-colors duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Click outside to close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={closePreview}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
