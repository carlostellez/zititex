'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ParallaxSectionProps {
  backgroundImage: string;
  children: React.ReactNode;
  speed?: number; // Velocidad del parallax (0.1 - 1.0)
  height?: string; // Altura de la sección
  overlay?: 'light' | 'dark' | 'gradient' | 'none';
  className?: string;
}

export function ParallaxSection({
  backgroundImage,
  children,
  speed = 0.5,
  height = 'min-h-screen',
  overlay = 'dark',
  className = ''
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.bottom >= 0 && rect.top <= window.innerHeight;
      
      if (isInView) {
        setIsVisible(true);
        // Calcular offset basado en la posición de la sección
        const scrolled = window.pageYOffset;
        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.offsetHeight;
        
        // Solo aplicar parallax cuando la sección está visible
        if (scrolled + window.innerHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
          const yPos = -(scrolled - sectionTop) * speed;
          setOffsetY(yPos);
        }
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [speed]);

  // Get overlay classes
  const getOverlayClass = () => {
    switch (overlay) {
      case 'light':
        return 'bg-white/30 backdrop-blur-sm';
      case 'dark':
        return 'bg-black/50 backdrop-blur-sm';
      case 'gradient':
        return 'bg-gradient-to-r from-black/70 via-black/40 to-transparent backdrop-blur-sm';
      case 'none':
        return '';
      default:
        return 'bg-black/50 backdrop-blur-sm';
    }
  };

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${height} ${className}`}
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${offsetY}px)`,
          transition: isVisible ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <div className="relative w-full h-[120%]"> {/* Extra height for parallax effect */}
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover object-center"
            quality={85}
            priority={false}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Overlay */}
      {overlay !== 'none' && (
        <div className={`absolute inset-0 ${getOverlayClass()}`} />
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
