'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { contactData } from '@/data/contactData';

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

interface FooterProps {
  className?: string;
}

// Normaliza el enlace de WhatsApp para evitar 404 detrás de S3/CloudFront
const getNormalizedWhatsAppHref = (): string => {
  const candidate = contactData.contactInfo.find(item => item.id === 'whatsapp')?.href || 'https://wa.me/573027413967';
  try {
    // Si ya es api.whatsapp.com, devolver tal cual
    if (candidate.includes('api.whatsapp.com')) return candidate;
    // Extraer número desde wa.me/NNN (eliminar '+')
    const match = candidate.match(/wa\.me\/(\+?\d+)/);
    const phone = match?.[1]?.replace(/^\+/, '') || '573027413967';
    return `https://api.whatsapp.com/send?phone=${phone}`;
  } catch {
    return 'https://api.whatsapp.com/send?phone=573027413967';
  }
};

const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/ziti.tex?utm_source=qr&igsh=ejRjZWFhdTVrbWt4',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5z"/>
        <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/>
        <circle cx="17.5" cy="6.5" r="1.25" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@zititex?_t=ZS-90nWzWgkenc&_r=1',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.7 3.001c.39 2.018 1.756 3.458 3.75 3.61v2.27c-1.328-.037-2.538-.42-3.75-1.19v5.71c0 5.13-5.585 6.7-8.15 3.01-.94-1.29-.79-3.08.35-4.16 1.38-1.31 3.19-.97 3.19-.97v2.28c-.52-.16-1.08-.08-1.53.21-.78.52-.99 1.63-.47 2.41.98 1.46 3.83 1.13 3.83-1.5V3h2.78z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/zititex/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.983 3.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5zM3 9h4v12H3V9zm7 0h3.8v1.65h.05c.53-.95 1.83-1.95 3.76-1.95C21.21 8.7 22 11 22 14.2V21H18v-6c0-1.43-.03-3.27-2-3.27-2 0-2.31 1.56-2.31 3.17V21H10V9z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: getNormalizedWhatsAppHref(),
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.01 0C5.39 0 .02 5.37.02 11.99c0 2.11.55 4.19 1.6 6.02L0 24l6.07-1.59a11.96 11.96 0 0 0 5.94 1.58h.01c6.62 0 11.99-5.37 11.99-11.99a11.9 11.9 0 0 0-3.49-8.52zM12 22.03h-.01a10.02 10.02 0 0 1-5.1-1.4l-.36-.21-3.74.98.99-3.65-.24-.37a10 10 0 1 1 18.55-5.77 10.03 10.03 0 0 1-10.09 10.42z"/>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/>
      </svg>
    ),
  },
];

const quickLinks: FooterLink[] = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Contacto', href: '#contacto' },
];

const legalLinks: FooterLink[] = [
  { label: 'Política de Privacidad', href: '#privacidad' },
  { label: 'Términos de Uso', href: '#terminos' },
  { label: 'Cookies', href: '#cookies' },
];

const contactInfo: ContactInfo[] = [
  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    label: 'Ubicación',
    value: 'Cl 18 Sur # 12G - 45, Bogotá, Colombia',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    label: 'Email',
    value: 'zititex@gmail.com',
    href: 'mailto:zititex@gmail.com',
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
    label: 'Teléfono',
    value: '+57 302 741 3967',
    href: 'tel:+573027413967',
  },
];

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (href: string, external = false) => {
    if (external || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('https://') || href.startsWith('http://')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };

  return (
    <footer className={`bg-gray-900 dark:bg-gray-950 text-white ${className}`}>
      <div className="container">
        {/* Main Footer Content */}
        <div className="section border-b border-gray-800 dark:border-gray-700">
          <div className="responsive-grid responsive-grid-2 responsive-grid-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="mb-4">
                  <img 
                    src="/static/logo/zititex.png" 
                    alt="Zititex - Etiquetas y Marquillas" 
                    className="h-12 md:h-24 w-auto"
                    onClick={() => handleLinkClick('/#inicio', false)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <p className="responsive-text-base text-gray-400 dark:text-gray-300 mb-6 leading-relaxed max-w-md">
                  Especialistas en etiquetas y marquillas de calidad premium para la industria textil. 
                  Soluciones personalizadas que reflejan la excelencia de tu marca.
                </p>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="responsive-text-base font-semibold text-white mb-4">Síguenos</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleLinkClick(link.href, true)}
                      className="p-3 rounded-full bg-gray-800 dark:bg-gray-700 text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-200 transform hover:scale-110"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="responsive-text-lg font-semibold text-white mb-6">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleLinkClick(link.href, link.external)}
                      className="responsive-text-sm text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="responsive-text-lg font-semibold text-white mb-6">Contacto</h4>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-gray-800 dark:bg-gray-700 rounded-lg text-gray-400">
                      {info.icon}
                    </div>
                    <div>
                      <h5 className="responsive-text-sm font-medium text-white">{info.label}</h5>
                      {info.href ? (
                        <button
                          onClick={() => handleLinkClick(info.href!, true)}
                          className="responsive-text-sm text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200 text-left"
                        >
                          {info.value}
                        </button>
                      ) : (
                        <p className="responsive-text-sm text-gray-400 dark:text-gray-300">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-6 p-4 bg-gray-800 dark:bg-gray-700 rounded-lg">
                <h5 className="responsive-text-sm font-semibold text-white mb-3">Horarios de Atención</h5>
                <div className="space-y-1 responsive-text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lun - Vie</span>
                    <span className="text-white">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sábado</span>
                    <span className="text-white">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Domingo</span>
                    <span className="text-white">Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0" style={{ justifyContent: 'center' }}>
            {/* Copyright */}
            <div className="text-center md:text-center">
              <p className="responsive-text-sm text-gray-400 dark:text-gray-300">
                © {currentYear} Zititex. Todos los derechos reservados.
              </p>
            </div>

            {/* Legal Links 
            <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
              {legalLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href, link.external)}
                  className="responsive-text-sm text-gray-400 dark:text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </button>
              ))}
            </div>*/}
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-gray-800 dark:border-gray-700 text-center">
            <p className="responsive-text-xs text-gray-500 dark:text-gray-400">
              Diseñado y desarrollado con ❤️ para la industria textil colombiana
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
