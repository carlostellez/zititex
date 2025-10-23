'use client';

import { useState, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  showLoader?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * OptimizedImage Component
 * 
 * Optimized image component for static export with:
 * - Automatic lazy loading for non-priority images
 * - Loading states
 * - Error handling with fallback
 * - Responsive behavior
 * 
 * @example
 * <OptimizedImage
 *   src="/image.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 *   priority={false} // lazy load
 * />
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fallbackSrc,
  showLoader = true,
  priority = false,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}>
      {showLoader && isLoading && !hasError && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={priority ? 'high' : 'low'}
        className={`
          w-full h-full object-cover
          transition-all duration-700
          ${isLoading ? 'scale-110 blur-md opacity-0' : 'scale-100 blur-0 opacity-100'}
          ${hasError ? 'opacity-50 grayscale' : ''}
        `}
        {...props}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center p-4">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Image failed to load
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * LazyImage Component
 * 
 * Simple wrapper for below-the-fold images with native lazy loading
 * Use this for simple images that don't need advanced features
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function LazyImage({ src, alt, className = '', ...props }: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`transition-opacity duration-300 ${className}`}
      {...props}
    />
  );
}

