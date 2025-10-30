'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { contactData } from '@/data/contactData';

interface FloatingWhatsAppProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showTooltip?: boolean;
  autoHide?: boolean; // Auto hide after scroll
}

export function FloatingWhatsApp({ 
  className = '',
  position = 'bottom-right',
  showTooltip = true,
  autoHide = false
}: FloatingWhatsAppProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Usar tema de forma segura para evitar errores de hidratación
  let theme = 'light';
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Si no hay contexto disponible, usar valor por defecto
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !autoHide) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, mounted, autoHide]);

  // Show tooltip after component mounts and delay
  useEffect(() => {
    if (!mounted || !showTooltip) return;

    const timer = setTimeout(() => {
      setShowTooltipState(true);
    }, 2000);

    // Auto hide tooltip after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltipState(false);
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [mounted, showTooltip]);

  const handleWhatsAppClick = () => {
    const whatsappContact = contactData.contactInfo.find(item => item.id === 'whatsapp');
    const baseHref = whatsappContact?.href || 'https://wa.me/573027413967';

    // Normalizar a api.whatsapp.com/send?phone=NNN
    let phone = '573027413967';
    const match = baseHref.match(/wa\.me\/(\+?\d+)/);
    if (match?.[1]) phone = match[1].replace(/^\+/, '');
    const message = encodeURIComponent('¡Hola! Me interesa conocer más sobre sus etiquetas y marquillas para textiles. ¿Podrían brindarme información sobre sus productos y servicios?');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      case 'bottom-right':
      default:
        return 'bottom-6 right-6';
    }
  };

  const getTooltipPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-full mb-2 left-0';
      case 'top-right':
        return 'top-full mt-2 right-0';
      case 'top-left':
        return 'top-full mt-2 left-0';
      case 'bottom-right':
      default:
        return 'bottom-full mb-2 right-0';
    }
  };

  if (!mounted) return null;

  return (
    <div 
      className={`
        fixed z-50 transition-all duration-300 ease-in-out
        ${getPositionClasses()}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
        ${className}
      `}
    >
      {/* Tooltip */}
      {showTooltip && showTooltipState && (
        <div 
          className={`
            absolute ${getTooltipPositionClasses()}
            px-4 py-2 rounded-lg shadow-lg text-sm font-medium
            transition-all duration-300 ease-in-out
            ${mounted && theme === 'light' 
              ? 'bg-gray-900 text-white' 
              : 'bg-white text-gray-900'
            }
            whitespace-nowrap
            animate-pulse
          `}
        >
          ¡Chatea con nosotros!
          
          {/* Tooltip arrow */}
          <div 
            className={`
              absolute w-0 h-0
              ${position.includes('bottom') 
                ? 'top-full border-l-4 border-r-4 border-t-4 border-transparent' 
                : 'bottom-full border-l-4 border-r-4 border-b-4 border-transparent'
              }
              ${position.includes('right') ? 'right-4' : 'left-4'}
              ${mounted && theme === 'light' 
                ? position.includes('bottom') ? 'border-t-gray-900' : 'border-b-gray-900'
                : position.includes('bottom') ? 'border-t-white' : 'border-b-white'
              }
            `}
          />
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
        className={`
          group relative w-14 h-14 md:w-16 md:h-16 
          bg-green-500 hover:bg-green-600 
          text-white rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out
          transform hover:scale-110 active:scale-95
          flex items-center justify-center
          animate-bounce hover:animate-none
        `}
        aria-label="Chatear por WhatsApp"
        title="Contactar por WhatsApp"
      >
        {/* WhatsApp Icon */}
        <svg 
          className="w-7 h-7 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-75 animate-ping" />
      </button>

      {/* Online indicator */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full animate-pulse" />
    </div>
  );
}
