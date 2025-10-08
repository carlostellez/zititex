export interface Benefit {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
  features?: string[];
}

export interface BenefitsSection {
  title: string;
  subtitle: string;
  description: string;
  benefits: Benefit[];
}

export const benefitsData: BenefitsSection = {
  title: "¿Por qué elegir Zititex para tu marca textil?",
  subtitle: "Especialistas en etiquetas y marquillas para la industria de la moda",
  description: "Más de 15 años creando identidad para marcas textiles colombianas e internacionales. Entendemos las necesidades específicas de tu industria.",
  benefits: [
    {
      id: "textile_expertise",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Expertos en Textiles y Confección",
      description: "Conocemos a fondo los procesos textiles, desde el diseño hasta la confección. Nuestras etiquetas están diseñadas específicamente para resistir los procesos industriales de la moda.",
      highlight: "15+ años en textiles",
      features: [
        "Resistencia a lavados industriales hasta 60°C",
        "Compatibilidad con todos los tipos de tela",
        "Adhesivos especiales para sintéticos y naturales",
        "Pruebas de durabilidad en lavandería industrial"
      ]
    },
    {
      id: "fashion_branding",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: "Branding Especializado para Moda",
      description: "Creamos etiquetas que comunican la personalidad de tu marca textil. Desde marcas de lujo hasta líneas casuales, adaptamos el diseño a tu segmento de mercado.",
      highlight: "Diseño fashion gratuito",
      features: [
        "Diseñadores especializados en moda",
        "Tendencias actuales en etiquetado textil",
        "Acabados premium: foil, relieve, bordado",
        "Etiquetas de composición y cuidado textil"
      ]
    },
    {
      id: "textile_materials",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Materiales Certificados para Textiles",
      description: "Utilizamos únicamente materiales aprobados para contacto directo con la piel y certificados OEKO-TEX. Perfectos para ropa interior, infantil y deportiva.",
      highlight: "Certificación OEKO-TEX",
      features: [
        "Algodón orgánico 100% natural",
        "Satén premium libre de químicos",
        "Poliéster reciclado eco-friendly",
        "Certificaciones para ropa infantil y deportiva"
      ]
    },
    {
      id: "production_scale",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Escalabilidad para Cualquier Producción",
      description: "Desde pequeños diseñadores independientes hasta grandes marcas nacionales. Manejamos desde 300 hasta 1'000.000 unidades con la misma calidad y atención.",
      highlight: "Desde 300 unidades",
      features: [
        "Mínimos accesibles para emprendedores",
        "Capacidad para grandes volúmenes",
        "Precios escalonados por cantidad",
        "Tiempos de entrega optimizados por volumen"
      ]
    },
    {
      id: "textile_compliance",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Cumplimiento Normativo Textil",
      description: "Nuestras etiquetas cumplen con todas las normativas colombianas e internacionales para productos textiles, incluyendo etiquetas de composición obligatorias.",
      highlight: "Normativa INVIMA",
      features: [
        "Etiquetas de composición según norma técnica",
        "Símbolos de cuidado internacionales",
        "Cumplimiento para exportación",
        "Asesoría en etiquetado obligatorio"
      ]
    },
    {
      id: "fashion_logistics",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-2 9a2 2 0 002 2h8a2 2 0 002-2l-2-9m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v0" />
        </svg>
      ),
      title: "Logística Especializada en Moda",
      description: "Entendemos los ciclos de la moda y las temporadas. Ofrecemos entregas express para lanzamientos de colección y almacenamiento para reposiciones.",
      highlight: "Entregas en temporada",
      features: [
        "Entregas express para lanzamientos",
        "Almacenamiento de etiquetas para reposición",
        "Sincronización con ciclos de producción",
        "Entregas directas a talleres de confección"
      ]
    }
  ]
};

// Estadísticas de respaldo específicas para textiles
export const statsData = [
  {
    id: "textile_experience",
    number: "15+",
    label: "Años en Textiles",
    description: "Especializados en la industria de la moda"
  },
  {
    id: "fashion_brands",
    number: "300+",
    label: "Marcas de Moda",
    description: "Desde emprendedores hasta grandes marcas"
  },
  {
    id: "textile_labels",
    number: "2M+",
    label: "Etiquetas Textiles",
    description: "Producidas para la industria fashion"
  },
  {
    id: "wash_resistance",
    number: "100+",
    label: "Ciclos de Lavado",
    description: "Resistencia garantizada en pruebas"
  }
];

// Configuración de la sección
export const benefitsConfig = {
  showStats: true,
  showFeatures: true,
  animationDelay: 200, // ms entre animaciones
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3
  }
};
