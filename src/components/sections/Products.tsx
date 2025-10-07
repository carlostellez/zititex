'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ParallaxSection } from '@/components/ui/ParallaxSection';
import { productsData, productsConfig } from '@/data/productsData';
import type { ProductCategory, Product } from '@/data/productsData';
import Image from 'next/image';

interface ProductsProps {
  className?: string;
}

export function Products({ className = '' }: ProductsProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  // Product Modal Component
  const ProductModal = ({ product, onClose }: { product: Product; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${
        mounted && theme === 'light' ? 'bg-white' : 'bg-gray-900'
      }`}>
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Product Image */}
          <div className="relative h-64 md:h-80">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-t-2xl"
              quality={90}
            />
          </div>

          {/* Product Content */}
          <div className="p-6 md:p-8">
            <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
              mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              {product.name}
            </h3>
            
            <p className={`text-lg mb-6 leading-relaxed ${
              mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {product.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Features */}
              <div>
                <h4 className={`text-xl font-semibold mb-4 ${
                  mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Características
                </h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
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
              </div>

              {/* Applications */}
              <div>
                <h4 className={`text-xl font-semibold mb-4 ${
                  mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Aplicaciones
                </h4>
                <ul className="space-y-2">
                  {product.applications.map((application, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-sm ${
                        mounted && theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                      }`}>
                        {application}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Materials */}
            <div className="mt-6">
              <h4 className={`text-xl font-semibold mb-4 ${
                mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Materiales
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mounted && theme === 'light'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-blue-900/30 text-blue-400'
                    }`}
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  onClose();
                  document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Category Section Component
  const CategorySection = ({ category, index }: { category: ProductCategory; index: number }) => (
    <ParallaxSection
      backgroundImage={category.backgroundImage}
      speed={category.parallaxSpeed || 0.5}
      overlay={category.overlayColor}
      height="min-h-screen"
      className="flex items-center"
    >
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} text-white`}>
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                {category.icon}
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {category.title}
              </h2>

              {/* Description */}
              <p className="text-xl mb-8 leading-relaxed text-white/90">
                {category.description}
              </p>

              {/* Highlights */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {category.highlights.map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white/90 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}  
              {/*
              <button
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Ver Productos de {category.name}
              </button>
              */}  
              </div>

            {/* Products Preview Side */}
            <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="grid gap-6">
                {category.products.slice(0, 2).map((product, productIndex) => (
                  <div
                    key={product.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {product.name}
                        </h4>
                        <p className="text-white/80 text-sm leading-relaxed">
                          {product.description.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );

  return (
    <section id="productos" className={className}>
      {/* Header Section */}
      <div className={`section ${
        mounted && theme === 'light' ? 'bg-white' : 'bg-gray-900'
      }`}>
        <div className="container text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            mounted && theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {productsData.title}
          </h2>
          <p className={`text-xl mb-4 ${
            mounted && theme === 'light' ? 'text-blue-600' : 'text-blue-400'
          }`}>
            {productsData.subtitle}
          </p>
          <p className={`text-lg max-w-3xl mx-auto leading-relaxed ${
            mounted && theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            {productsData.description}
          </p>
        </div>
      </div>

      {/* Parallax Categories */}
      {productsData.categories.map((category, index) => (
        <CategorySection key={category.id} category={category} index={index} />
      ))}

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
