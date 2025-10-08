'use client';

import { useState, useEffect } from 'react';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { heroData, heroCarouselConfig, heroFallback } from '@/data/heroData';
import { useTheme } from '@/contexts/ThemeContext';
import type { HeroSlide } from '@/data/heroData';

interface HeroProps {
  className?: string;
}

export function Hero({ className = '' }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Usar tema de forma segura para evitar errores de hidratación
  let theme = 'light';

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Si no hay contexto disponible, usar tema por defecto
  }

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get current slide data
  const getCurrentSlide = (): HeroSlide => {
    if (heroData.length === 0) {
      return {
        id: 'fallback',
        src: '',
        alt: '',
        ...heroFallback,
        textPosition: 'center',
        overlay: 'gradient'
      };
    }
    return heroData[currentSlide] || heroData[0];
  };

  const slide = getCurrentSlide();

  // Handle smooth scrolling for buttons
  const handleButtonClick = (link: string) => {
    if (link.startsWith('#')) {
      const element = document.querySelector(link);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.open(link, '_blank');
    }
  };

  // Get overlay classes - always dark overlay for better text contrast with white text
  const getOverlayClass = (overlay: string) => {
    switch (overlay) {
      case 'light':
        return 'bg-black/25 backdrop-blur-sm';
      case 'dark':
        return 'bg-black/50 backdrop-blur-sm';
      case 'gradient':
      default:
        return 'bg-gradient-to-r from-black/60 via-black/40 to-black/20 backdrop-blur-sm';
    }
  };

  // Get text position classes
  const getTextPositionClass = (position: string) => {
    switch (position) {
      case 'left':
        return 'text-left items-start';
      case 'right':
        return 'text-right items-end';
      case 'center':
      default:
        return 'text-center items-center';
    }
  };

  return (
    <section id="inicio" className={`relative w-full h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full">
        {heroData.length > 0 ? (
          <ImageCarousel
            images={heroData}
            {...heroCarouselConfig}
            className="w-full h-full"
            imageClassName="scale-105 hover:scale-100 transition-transform duration-[10s]"
            aspectRatio="screen"
            onImageChange={setCurrentSlide}
          />
        ) : (
          // Fallback background when no images - theme aware
          <div className={`w-full h-full flex items-center justify-center ${
            mounted && theme === 'light' 
              ? 'bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-300' 
              : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
          }`}>
            <div className={`text-9xl font-bold ${
              mounted && theme === 'light' ? 'text-blue-600/20' : 'text-white/20'
            }`}>
              Zititex
            </div>
          </div>
        )}
      </div>

      {/* Content Overlay */}
      <div className={`absolute inset-0 ${getOverlayClass(slide.overlay || 'gradient')}`}>
        <div className="container h-full flex items-center">
          <div className={`w-full max-w-4xl mx-auto flex flex-col ${getTextPositionClass(slide.textPosition || 'center')} space-y-6`}>
            
            {/* Subtitle */}
            {slide.subtitle && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <span className="inline-block px-4 py-2 backdrop-blur-sm text-sm font-medium rounded-full border bg-white/10 text-white/95 border-white/30">
                  {slide.subtitle}
                </span>
              </div>
            )}

            {/* Title */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h1 className="responsive-text-5xl font-bold mb-4 leading-tight text-white drop-shadow-lg">
                {slide.title || heroFallback.title}
              </h1>
            </div>

            {/* Description */}
            {slide.description && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <p className="responsive-text-xl max-w-2xl leading-relaxed text-white/95 drop-shadow-md">
                  {slide.description}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-4 pt-4" style={{ animationDelay: '0.8s' }}>
              {/* Primary Button */}
              {slide.buttonText && slide.buttonLink && (
                <button
                  onClick={() => handleButtonClick(slide.buttonLink!)}
                  className="responsive-btn border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                >
                  {slide.buttonText}
                </button>
              )}

              {/* Secondary Button */}
              {slide.secondaryButtonText && slide.secondaryButtonLink && (
                <button
                  onClick={() => handleButtonClick(slide.secondaryButtonLink!)}
                  className="responsive-btn bg-transparent border-2 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm text-white border-white/40 hover:bg-white/15 hover:border-white/60"
                >
                  {slide.secondaryButtonText}
                </button>
              )}
            </div>

            {/* Scroll Indicator */}
            <div className="animate-fade-in-up absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ animationDelay: '1s' }}>
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-medium text-white/80">
                  Descubre más
                </span>
                <div className="animate-bounce">
                  <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles for Animations and Responsive Hero */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        /* Ensure full screen coverage on all devices */
        section {
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height for mobile browsers */
        }

        /* Mobile specific adjustments */
        @media (max-width: 640px) {
          section {
            min-height: 100vh;
            min-height: 100dvh;
          }
        }

        /* Tablet landscape adjustments */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          section {
            height: 100vh;
          }
        }

        /* Large screens and TVs */
        @media (min-width: 1920px) {
          section {
            height: 100vh;
          }
        }
      `}</style>
    </section>
  );
}
