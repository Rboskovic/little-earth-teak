import {useState, useCallback, useEffect, useRef} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {X, ChevronLeft, ChevronRight, ZoomIn} from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  selectedVariantImage?: ProductVariantFragment['image'] | null;
  productTitle: string;
}

export function ProductGallery({
  images,
  selectedVariantImage,
  productTitle,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Prioritize variant image if different from current
  const allImages = selectedVariantImage
    ? [
        selectedVariantImage,
        ...images.filter((img) => img.id !== selectedVariantImage.id),
      ]
    : images;

  // Reset to first image when variant changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedVariantImage?.id]);

  const openModal = useCallback((index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  const goToModalPrevious = useCallback(() => {
    setModalIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToModalNext = useCallback(() => {
    setModalIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      goToNext();
    } else if (diff < -threshold) {
      goToPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToModalPrevious();
      if (e.key === 'ArrowRight') goToModalNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, goToModalPrevious, goToModalNext]);

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 flex items-center justify-center">
        <span className="text-neutral-400">No image available</span>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Carousel */}
      <div className="lg:hidden">
        <div
          className="relative aspect-square overflow-hidden bg-neutral-50 rounded-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => openModal(activeIndex)}
            className="w-full h-full cursor-zoom-in"
            aria-label="Open image gallery"
          >
            <Image
              data={allImages[activeIndex]}
              aspectRatio="1/1"
              sizes="100vw"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2">
            <ZoomIn className="w-5 h-5 text-neutral-600" />
          </div>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-neutral-700" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {allImages.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex
                    ? 'bg-neutral-800'
                    : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop 2x2 Grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-3">
          {allImages.slice(0, 4).map((image, index) => (
            <button
              key={image.id}
              onClick={() => openModal(index)}
              className="group relative aspect-square overflow-hidden bg-neutral-50 rounded-lg cursor-zoom-in"
              aria-label={`View ${productTitle} image ${index + 1}`}
            >
              <Image
                data={image}
                aspectRatio="1/1"
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-1.5">
                <ZoomIn className="w-4 h-4 text-neutral-600" />
              </div>
            </button>
          ))}
        </div>

        {/* Additional images below if more than 4 */}
        {allImages.length > 4 && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            {allImages.slice(4).map((image, index) => (
              <button
                key={image.id}
                onClick={() => openModal(index + 4)}
                className="group relative aspect-square overflow-hidden bg-neutral-50 rounded-lg cursor-zoom-in"
                aria-label={`View ${productTitle} image ${index + 5}`}
              >
                <Image
                  data={image}
                  aspectRatio="1/1"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-1.5">
                  <ZoomIn className="w-4 h-4 text-neutral-600" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery modal"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm">
            {modalIndex + 1} / {allImages.length}
          </div>

          {/* Previous button */}
          {allImages.length > 1 && (
            <button
              onClick={goToModalPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Main image */}
          <div className="max-w-5xl max-h-[85vh] w-full mx-16">
            <Image
              data={allImages[modalIndex]}
              sizes="90vw"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Next button */}
          {allImages.length > 1 && (
            <button
              onClick={goToModalNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 pb-2">
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setModalIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                    index === modalIndex
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === modalIndex ? 'true' : 'false'}
                >
                  <Image
                    data={image}
                    aspectRatio="1/1"
                    sizes="64px"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeModal}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}