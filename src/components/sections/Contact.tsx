'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ContactForm } from '@/components/ui/ContactForm';
// import { GoogleMap } from '@/components/ui/GoogleMap';
import { contactData, contactConfig } from '@/data/contactData';
import type { ContactInfo, BusinessHours } from '@/data/contactData';

interface ContactProps {
  className?: string;
}

export function Contact({ className = '' }: ContactProps) {
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

  // Componente de información de contacto
  const ContactInfoCard = ({ info }: { info: ContactInfo }) => (
    <div className={`p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${
      mounted && theme === 'light' 
        ? 'bg-white shadow-md hover:shadow-xl' 
        : 'bg-gray-800 shadow-lg hover:shadow-2xl'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 p-3 rounded-full ${
          mounted && theme === 'light'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-blue-900/30 text-blue-400'
        }`}>
          {info.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 ${
            mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {info.label}
          </h3>
          {info.href ? (
            <a
              href={(() => {
                if (info.id === 'whatsapp' && info.href) {
                  // Normaliza wa.me → api.whatsapp.com/send?phone=NNN
                  const match = info.href.match(/wa\.me\/(\+?\d+)/);
                  const phone = match?.[1]?.replace(/^\+/, '') || '573027413967';
                  return `https://api.whatsapp.com/send?phone=${phone}`;
                }
                return info.href;
              })()}
              className={`text-lg font-medium hover:underline transition-colors ${
                mounted && theme === 'light' 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'text-blue-400 hover:text-blue-300'
              }`}
              target={info.href.startsWith('http') ? '_blank' : undefined}
              rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {info.value}
            </a>
          ) : (
            <p className={`text-lg font-medium ${
              mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {info.value}
            </p>
          )}
          {info.description && (
            <p className={`text-sm mt-1 ${
              mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {info.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // Componente de horarios de atención
  const BusinessHoursCard = ({ hours }: { hours: BusinessHours[] }) => (
    <div className={`p-6 rounded-xl ${
      mounted && theme === 'light' 
        ? 'bg-white shadow-md' 
        : 'bg-gray-800 shadow-lg'
    }`}>
      <h3 className={`text-xl font-semibold mb-4 flex items-center ${
        mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        <svg className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Horarios de Atención
      </h3>
      <div className="space-y-3">
        {hours.map((day, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className={`font-medium ${
              mounted && theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {day.day}
            </span>
            <span className={`${
              day.isOpen 
                ? mounted && theme === 'light' ? 'text-green-600' : 'text-green-400'
                : mounted && theme === 'light' ? 'text-red-600' : 'text-red-400'
            } font-medium`}>
              {day.hours}
            </span>
          </div>
        ))}
      </div>
      
      {/* Current Status */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className={`text-sm font-medium ${
            mounted && theme === 'light' ? 'text-green-600' : 'text-green-400'
          }`}>
            Disponible para consultas por WhatsApp 24/7
          </span>
        </div>
      </div>
    </div>
  );

  // Componente de información de ubicación
  const LocationCard = () => (
    <div className={`p-6 rounded-xl ${
      mounted && theme === 'light' 
        ? 'bg-white shadow-md' 
        : 'bg-gray-800 shadow-lg'
    }`}>
      <h3 className={`text-xl font-semibold mb-4 flex items-center ${
        mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        <svg className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Nuestra Ubicación
      </h3>
      
      <div className="space-y-3">
        <div>
          <h4 className={`font-semibold ${
            mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {contactData.location.name}
          </h4>
          <p className={`text-sm ${
            mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {contactData.location.address}<br />
            {contactData.location.city}, {contactData.location.country}<br />
            Codigo Postal: {contactData.location.postalCode}
          </p>
        </div>
        
        <p className={`text-sm leading-relaxed ${
          mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {contactData.location.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={`https://maps.google.com/?q=${contactData.location.coordinates.lat},${contactData.location.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver en Google Maps
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${contactData.location.coordinates.lat},${contactData.location.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              mounted && theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Cómo llegar
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section id="contacto" className={`section ${
      mounted && theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 to-gray-100' 
        : 'bg-gradient-to-br from-gray-800 to-gray-900'
    } ${className}`}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {contactData.title}
          </h2>
          <p className={`text-xl mb-4 ${
            mounted && theme === 'light' ? 'text-blue-600' : 'text-blue-400'
          }`}>
            {contactData.subtitle}
          </p>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
            mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {contactData.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Contact Form */}
          <div>
            <div className={`p-8 rounded-2xl ${
              mounted && theme === 'light' 
                ? 'bg-white shadow-xl' 
                : 'bg-gray-800 shadow-2xl'
            }`}>
              <h3 className={`text-2xl font-bold mb-6 ${
                mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Envíanos tu consulta
              </h3>
              <ContactForm />
            </div>
          </div>

          {/* Right Column - Contact Info & Hours */}
          <div className="space-y-6">
            {/* Contact Information */}
            {contactConfig.showContactInfo && (
              <div className="grid gap-4">
                {contactData.contactInfo.map((info) => (
                  <ContactInfoCard key={info.id} info={info} />
                ))}
              </div>
            )}

            {/* Business Hours */}
            {contactConfig.showBusinessHours && (
              <BusinessHoursCard hours={contactData.businessHours} />
            )}
          </div>
        </div>

        {/* Location Section */}
        {/*<div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LocationCard />
          </div>

          {contactConfig.showMap && (
            <div className="lg:col-span-2">
              <GoogleMap 
                height={contactConfig.mapHeight}
                showInfoWindow={true}
                className="w-full"
              />
            </div>
          )}
        </div> */}

      </div>
    </section>
  );
}
