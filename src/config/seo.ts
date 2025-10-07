import type { Metadata } from 'next';

// Configuración SEO base para Zititex
export const seoConfig = {
  // Información básica de la empresa
  siteName: 'Zititex',
  siteUrl: 'https://zititex.com',
  companyName: 'Zititex S.A.S.',
  
  // Información de contacto
  contact: {
    phone: '+57 (1) 234-5678',
    whatsapp: '+57 300 123 4567',
    email: 'ventas@zititex.com',
    address: 'Cl 19 sur 12g 45, Bogotá, Colombia',
    coordinates: {
      lat: 4.583804,
      lng: -74.1016785
    }
  },

  // Keywords principales por categoría
  keywords: {
    primary: [
      'etiquetas textiles',
      'marquillas para ropa',
      'etiquetas de composición',
      'marquillas tejidas',
      'etiquetas para textiles',
      'marquillas personalizadas',
      'garra pantalón',
      'etiquetas Bogotá',
      'marquillas Colombia'
    ],
    secondary: [
      'etiquetas de cuidado',
      'marquillas de marca',
      'etiquetas transparentes',
      'marquillas satín',
      'etiquetas cuero sintético',
      'marquillas nylon',
      'etiquetas sublimadas',
      'industria textil Colombia',
      'fabricación etiquetas',
      'proveedor marquillas'
    ],
    longTail: [
      'etiquetas de composición para ropa',
      'marquillas tejidas personalizadas',
      'etiquetas transparentes para textiles',
      'garra pantalón cuero sintético',
      'marquillas satín alta calidad',
      'etiquetas textiles Bogotá Colombia',
      'fabricante etiquetas industria textil',
      'proveedor marquillas marcas de ropa',
      'etiquetas personalizadas exportación',
      'marquillas premium alta costura'
    ]
  },

  // Redes sociales
  social: {
    facebook: 'https://facebook.com/zititex',
    instagram: 'https://instagram.com/zititex',
    linkedin: 'https://linkedin.com/company/zititex',
    youtube: 'https://youtube.com/@zititex'
  },

  // Configuración de imágenes
  images: {
    logo: '/static/logo/zititex-logo.png',
    ogImage: '/static/seo/og-image.jpg',
    favicon: '/favicon.ico'
  }
};

// Metadata base para todas las páginas
export const baseMetadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  
  // Títulos y descripciones
  title: {
    default: 'Zititex - Etiquetas y Marquillas Premium para la Industria Textil',
    template: '%s | Zititex'
  },
  
  description: 'Especialistas en fabricación de etiquetas de composición, marquillas tejidas y garra pantalón para la industria textil. Más de 15 años de experiencia en Bogotá, Colombia. Calidad premium garantizada.',
  
  // Keywords
  keywords: [
    ...seoConfig.keywords.primary,
    ...seoConfig.keywords.secondary
  ].join(', '),
  
  // Información del autor/empresa
  authors: [{ name: seoConfig.companyName }],
  creator: seoConfig.companyName,
  publisher: seoConfig.companyName,
  
  // Configuración de robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: 'Zititex - Etiquetas y Marquillas Premium para la Industria Textil',
    description: 'Fabricamos etiquetas de composición, marquillas tejidas y garra pantalón para marcas textiles. Calidad premium, entrega rápida. Bogotá, Colombia.',
    images: [
      {
        url: seoConfig.images.ogImage,
        width: 1200,
        height: 630,
        alt: 'Zititex - Etiquetas y Marquillas Premium',
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@zititex',
    creator: '@zititex',
    title: 'Zititex - Etiquetas y Marquillas Premium',
    description: 'Especialistas en etiquetas textiles y marquillas personalizadas. Calidad premium para la industria textil colombiana.',
    images: [seoConfig.images.ogImage],
  },
  
  // Verificación de motores de búsqueda
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      bing: 'bing-verification-code',
    },
  },
  
  // Configuración adicional
  category: 'Industria Textil',
  classification: 'Fabricación de Etiquetas y Marquillas',
  
  // Información geográfica
  other: {
    'geo.region': 'CO-DC',
    'geo.placename': 'Bogotá',
    'geo.position': `${seoConfig.contact.coordinates.lat};${seoConfig.contact.coordinates.lng}`,
    'ICBM': `${seoConfig.contact.coordinates.lat}, ${seoConfig.contact.coordinates.lng}`,
  },
};

// Structured Data (JSON-LD) para la empresa
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: seoConfig.companyName,
  alternateName: seoConfig.siteName,
  url: seoConfig.siteUrl,
  logo: `${seoConfig.siteUrl}${seoConfig.images.logo}`,
  description: 'Fabricante especializado en etiquetas de composición, marquillas tejidas y garra pantalón para la industria textil colombiana.',
  
  // Información de contacto
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: seoConfig.contact.phone,
    contactType: 'Ventas',
    areaServed: 'CO',
    availableLanguage: 'Spanish'
  },
  
  // Dirección
  address: {
    '@type': 'PostalAddress',
    streetAddress: seoConfig.contact.address,
    addressLocality: 'Bogotá',
    addressRegion: 'Cundinamarca',
    postalCode: '110111',
    addressCountry: 'CO'
  },
  
  // Coordenadas geográficas
  geo: {
    '@type': 'GeoCoordinates',
    latitude: seoConfig.contact.coordinates.lat,
    longitude: seoConfig.contact.coordinates.lng
  },
  
  // Redes sociales
  sameAs: [
    seoConfig.social.facebook,
    seoConfig.social.instagram,
    seoConfig.social.linkedin,
    seoConfig.social.youtube
  ],
  
  // Área de servicio
  areaServed: {
    '@type': 'Country',
    name: 'Colombia'
  },
  
  // Industria
  knowsAbout: [
    'Etiquetas Textiles',
    'Marquillas para Ropa',
    'Garra Pantalón',
    'Industria Textil',
    'Etiquetas de Composición'
  ],
  
  // Años de experiencia
  foundingDate: '2008',
  
  // Servicios
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Catálogo de Productos Textiles',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Etiquetas de Composición',
          description: 'Etiquetas obligatorias con información de composición y cuidado del textil'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Marquillas de Marca',
          description: 'Marquillas personalizadas para identidad de marca'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Garra Pantalón',
          description: 'Accesorios especializados para pantalones y jeans'
        }
      }
    ]
  }
};

// Schema para LocalBusiness
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${seoConfig.siteUrl}/#business`,
  name: seoConfig.companyName,
  image: `${seoConfig.siteUrl}${seoConfig.images.logo}`,
  telephone: seoConfig.contact.phone,
  email: seoConfig.contact.email,
  url: seoConfig.siteUrl,
  
  address: {
    '@type': 'PostalAddress',
    streetAddress: seoConfig.contact.address,
    addressLocality: 'Bogotá',
    addressRegion: 'Cundinamarca',
    postalCode: '110111',
    addressCountry: 'CO'
  },
  
  geo: {
    '@type': 'GeoCoordinates',
    latitude: seoConfig.contact.coordinates.lat,
    longitude: seoConfig.contact.coordinates.lng
  },
  
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00'
    }
  ],
  
  priceRange: '$$',
  servesCuisine: 'Industria Textil',
  
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1'
  }
};

// Schema para productos
export const productSchema = (product: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: `${seoConfig.siteUrl}${product.image}`,
  brand: {
    '@type': 'Brand',
    name: seoConfig.siteName
  },
  manufacturer: {
    '@type': 'Organization',
    name: seoConfig.companyName
  },
  category: 'Textiles',
  material: product.materials?.join(', '),
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'COP',
    seller: {
      '@type': 'Organization',
      name: seoConfig.companyName
    }
  }
});

// Función para generar breadcrumbs
export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${seoConfig.siteUrl}${item.url}`
  }))
});

