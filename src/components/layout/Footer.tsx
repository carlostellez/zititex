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

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/zititex',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/zititex',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987C.029 18.607 5.396 23.974 12.017 23.974s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.533l.002.002a4.821 4.821 0 01-1.226-3.235c0-2.672 2.167-4.839 4.839-4.839s4.839 2.167 4.839 4.839-2.167 4.839-4.839 4.839l-.41-.073zm7.718-1.533c-.757.937-1.908 1.533-3.205 1.533l-.41.073c-2.672 0-4.839-2.167-4.839-4.839s2.167-4.839 4.839-4.839 4.839 2.167 4.839 4.839a4.821 4.821 0 01-1.224 3.233z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: contactData.contactInfo.find(item => item.id === 'whatsapp')?.href || 'https://wa.me/+573027413967', // Usar el número real de WhatsApp de contactData
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:info@zititex.com',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-.904.732-1.636 1.636-1.636h1.831l8.533 6.364 8.533-6.364h1.831c.904 0 1.636.732 1.636 1.636z"/>
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
    value: 'Cl 19 sur 12g 45, Bogotá, Colombia',
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
      window.open(href, '_blank');
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
                <h3 className="responsive-text-2xl font-bold text-white mb-4">Zititex</h3>
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
