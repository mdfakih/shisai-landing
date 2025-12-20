import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

const ImageCarousel = ({
  images,
  productName,
  className = '',
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (images.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  if (images.length === 0) return null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image Container */}
      <div
        className="relative aspect-square overflow-hidden rounded-lg bg-muted group cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <img
          src={images[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-contain p-2 sm:p-4 lg:p-6 transition-opacity duration-300 select-none"
          draggable={false}
        />

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-1 sm:left-2 bottom-8 sm:bottom-10 lg:bottom-12 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-1.5 lg:p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-1 sm:right-2 bottom-8 sm:bottom-10 lg:bottom-12 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-1.5 lg:p-2 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex justify-center mt-2 sm:mt-3 lg:mt-4 space-x-1.5 sm:space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary scale-110 shadow-sm'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black/50 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
