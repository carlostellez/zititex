import { CarouselImage } from '@/components/ui/ImageCarousel';

export interface HeroSlide extends CarouselImage {
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  subtitle?: string;
  textPosition?: 'left' | 'center' | 'right';
  overlay?: 'light' | 'dark' | 'gradient';
}

export const heroData: HeroSlide[] = [
  {
    id: 'hero-1',
    src: '/static/hero/hero-1.jpg',
    alt: 'Etiquetas Premium Zititex',
    title: 'Etiquetas Textiles Premium para tu Marca',
    subtitle: 'Fabricación especializada en Bogotá, Colombia',
    description: 'Más de 15 años fabricando etiquetas de composición, marquillas tejidas y garra pantalón para la industria textil colombiana. Calidad premium garantizada.',
    buttonText: 'Ver Catálogo',
    buttonLink: '#productos',
    secondaryButtonText: 'Contactar',
    secondaryButtonLink: '#contacto',
    textPosition: 'center',
    overlay: 'gradient' // Se adapta automáticamente al tema
  },
  {
    id: 'hero-2',
    src: '/static/hero/hero-2.jpg',
    alt: 'Marquillas Personalizadas Zititex',
    title: 'Marquillas Tejidas que Cuentan tu Historia',
    subtitle: 'Especialistas en marquillas para la industria textil',
    description: 'Fabricamos marquillas nylon, satín y tejidas personalizadas para jeans, ropa deportiva y alta costura. Materiales premium y diseños únicos.',
    buttonText: 'Personalizar',
    buttonLink: '#contacto',
    secondaryButtonText: 'Ver Ejemplos',
    secondaryButtonLink: '#productos',
    textPosition: 'left',
    overlay: 'light' // Mejor para imágenes oscuras - se adapta al tema
  },
  {
    id: 'hero-3',
    src: '/static/hero/hero-3.jpg',
    alt: 'Tecnología Avanzada Zititex',
    title: 'Tecnología de Vanguardia',
    subtitle: 'Innovación en cada detalle',
    description: 'Utilizamos la más avanzada tecnología de impresión y corte para garantizar resultados perfectos en cada etiqueta y marquilla.',
    buttonText: 'Conocer Proceso',
    buttonLink: '#contacto',
    secondaryButtonText: 'Ver Productos',
    secondaryButtonLink: '#productos',
    textPosition: 'right',
    overlay: 'dark' // Mejor para imágenes claras - se adapta al tema
  },
  {
    id: 'hero-4',
    src: '/static/hero/hero-2.jpg',
    alt: 'Sostenibilidad Zititex',
    title: 'Compromiso con la Sostenibilidad',
    subtitle: 'Materiales eco-amigables',
    description: 'Trabajamos con materiales sostenibles y procesos eco-amigables para cuidar el medio ambiente sin comprometer la calidad.',
    buttonText: 'Saber Más',
    buttonLink: '#contacto',
    secondaryButtonText: 'Ver Productos',
    secondaryButtonLink: '#productos',
    textPosition: 'center',
    overlay: 'gradient' // Se adapta automáticamente al tema
  }
];

// Configuración del carrusel para Hero
export const heroCarouselConfig = {
  autoPlay: true,
  autoPlayInterval: 7000,
  showDots: true,
  showArrows: true,
  showThumbnails: false,
  aspectRatio: 'screen' as const,
};

// Texto alternativo para cuando no hay imágenes
export const heroFallback = {
  title: 'Zititex',
  subtitle: 'Etiquetas y Marquillas Premium',
  description: 'Especialistas en etiquetas y marquillas de calidad premium para la industria textil',
  buttonText: 'Ver Productos',
  buttonLink: '#productos',
  secondaryButtonText: 'Contactar',
  secondaryButtonLink: '#contacto',
};
