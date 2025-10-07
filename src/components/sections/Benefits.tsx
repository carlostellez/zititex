'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { benefitsData, statsData, benefitsConfig } from '@/data/benefitsData';
import type { Benefit } from '@/data/benefitsData';

interface BenefitsProps {
  className?: string;
}

export function Benefits({ className = '' }: BenefitsProps) {
  const [mounted, setMounted] = useState(false);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());

  // Datos verificados y funcionando correctamente

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

  // Intersection Observer para animaciones
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px',
      }
    );

    // Observar elementos
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted]);

  // Función para obtener clases de animación - Simplificada
  const getAnimationClass = (id: string, delay: number = 0) => {
    // Mostrar elementos siempre visibles para evitar problemas de animación
    return 'opacity-100 translate-y-0 transition-all duration-300 ease-out';
  };

  // Componente de estadística
  const StatCard = ({ stat, index }: { stat: typeof statsData[0], index: number }) => (
    <div
      id={`stat-${stat.id}`}
      data-animate
      className={`text-center ${getAnimationClass(`stat-${stat.id}`)}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`responsive-text-4xl font-bold mb-2 ${
        mounted && theme === 'light' ? 'text-blue-600' : 'text-blue-400'
      }`}>
        {stat.number}
      </div>
      <div className={`responsive-text-lg font-semibold mb-1 ${
        mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        {stat.label}
      </div>
      <div className={`responsive-text-sm ${
        mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
      }`}>
        {stat.description}
      </div>
    </div>
  );

  // Componente de beneficio
  const BenefitCard = ({ benefit, index }: { benefit: Benefit, index: number }) => (
    <div
      id={`benefit-${benefit.id}`}
      data-animate
      className={`responsive-card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${getAnimationClass(`benefit-${benefit.id}`)}`}
      style={{ transitionDelay: `${index * benefitsConfig.animationDelay}ms` }}
    >
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-all duration-300 group-hover:scale-110 ${
        mounted && theme === 'light'
          ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
          : 'bg-blue-900/30 text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
      }`}>
        {benefit.icon}
      </div>

      {/* Highlight Badge */}
      {benefit.highlight && (
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
          mounted && theme === 'light'
            ? 'bg-green-100 text-green-700'
            : 'bg-green-900/30 text-green-400'
        }`}>
          {benefit.highlight}
        </div>
      )}

      {/* Title */}
      <h3 className={`responsive-text-xl font-bold mb-4 ${
        mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
      }`}>
        {benefit.title}
      </h3>

      {/* Description */}
      <p className={`responsive-text-base mb-6 leading-relaxed ${
        mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
      }`}>
        {benefit.description}
      </p>

      {/* Features */}
      {benefitsConfig.showFeatures && benefit.features && (
        <ul className="space-y-2">
          {benefit.features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                mounted && theme === 'light'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-blue-900/30 text-blue-400'
              }`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={`responsive-text-sm ${
                mounted && theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section id="beneficios" className={`section ${
      !mounted
        ? 'bg-gray-50' // Fallback para SSR
        : mounted && theme === 'light' 
        ? 'bg-gray-50' 
        : 'bg-gray-900'
    } ${className}`}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div
            id="benefits-header"
            data-animate
            className={getAnimationClass('benefits-header')}
          >
            <h2 className={`responsive-text-4xl font-bold mb-4 ${
              mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {benefitsData.title}
            </h2>
            <p className={`responsive-text-xl mb-6 ${
              mounted && theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`}>
              {benefitsData.subtitle}
            </p>
            <p className={`responsive-text-lg max-w-3xl mx-auto leading-relaxed ${
              mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {benefitsData.description}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mb-16 lg:mb-20 p-8 rounded-2xl ${
          mounted && theme === 'light'
            ? 'bg-white shadow-lg'
            : 'bg-gray-800 shadow-xl'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={stat.id} className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  mounted && theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                }`}>
                  {stat.number}
                </div>
                <div className={`text-lg font-semibold mb-1 ${
                  mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  {stat.label}
                </div>
                <div className={`text-sm ${
                  mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefitsData.benefits.map((benefit, index) => (
            <div key={benefit.id} className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
              mounted && theme === 'light' 
                ? 'bg-white' 
                : 'bg-gray-800'
            }`}>
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-all duration-300 ${
                mounted && theme === 'light'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-blue-900/30 text-blue-400'
              }`}>
                {benefit.icon}
              </div>

              {/* Highlight Badge */}
              {benefit.highlight && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  mounted && theme === 'light'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-900/30 text-green-400'
                }`}>
                  {benefit.highlight}
                </div>
              )}

              {/* Title */}
              <h3 className={`text-xl font-bold mb-4 ${
                mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                {benefit.title}
              </h3>

              {/* Description */}
              <p className={`text-base mb-6 leading-relaxed ${
                mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                {benefit.description}
              </p>

              {/* Features */}
              {benefit.features && (
                <ul className="space-y-2">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        mounted && theme === 'light'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-blue-900/30 text-blue-400'
                      }`}>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-sm ${
                        mounted && theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 lg:mt-16">
          <div
            id="benefits-cta"
            data-animate
            className={getAnimationClass('benefits-cta')}
            style={{ transitionDelay: `${benefitsData.benefits.length * benefitsConfig.animationDelay + 200}ms` }}
          >
            <h3 className={`responsive-text-2xl font-bold mb-4 ${
              mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              ¿Listo para llevar tu marca textil al siguiente nivel?
            </h3>
            <p className={`responsive-text-lg mb-8 max-w-2xl mx-auto ${
              mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Únete a más de 300 marcas de moda que ya confían en nuestras etiquetas especializadas para textiles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
              <a
                href="#contacto"
                className="responsive-btn bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 transition-all transform hover:scale-105 w-full sm:w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Solicitar Cotización
              </a>
              <a
                href="#productos"
                className={`responsive-btn bg-transparent border-2 transition-all transform hover:scale-105 w-full sm:w-auto ${
                  mounted && theme === 'light'
                    ? 'text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'
                    : 'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-gray-900'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
