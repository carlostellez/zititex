export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  applications: string[];
  materials: string[];
  image: string;
  gallery?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  title: string;
  description: string;
  backgroundImage: string;
  overlayColor: 'light' | 'dark' | 'gradient';
  icon: React.ReactNode;
  products: Product[];
  highlights: string[];
  parallaxSpeed?: number;
}

export interface ProductsSection {
  title: string;
  subtitle: string;
  description: string;
  categories: ProductCategory[];
}

export const productsData: ProductsSection = {
  title: "Nuestros Productos Especializados",
  subtitle: "Etiquetas y marquillas premium para cada necesidad textil",
  description: "Descubre nuestra amplia gama de productos diseñados específicamente para la industria textil, desde etiquetas básicas hasta marquillas de lujo.",
  categories: [
    {
      id: "etiquetas",
      name: "Etiquetas",
      title: "Etiquetas",
      description: "Etiquetas obligatorias que cumplen con todas las normativas nacionales e internacionales para productos textiles.",
      backgroundImage: "/static/products/etiquetas/etiqueta.png",
      overlayColor: "dark",
      parallaxSpeed: 0.5,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      highlights: [
        "Cumplimiento normativo 100%",
        "Símbolos de cuidado internacionales",
        "Resistente a 100+ lavados",
        "Materiales certificados OEKO-TEX"
      ],
      products: [
        {
          id: "etiqueta-solapa",
          name: "Etiqueta solapa",
          description: "Etiqueta estándar en satén blanco con solapa.",
          features: [
            "Satén premium 100% poliéster",
            "Impresión en negro de alta durabilidad",
            "Corte con bordes sellados",
            "Resistencia a lavados industriales"
          ],
          applications: [
            "Ropa casual y deportiva",
            "Uniformes corporativos",
            "Ropa de trabajo",
            "Productos de exportación"
          ],
          materials: ["Satén poliéster", "Tinta resistente al agua"],
          image: "/static/products/etiquetas/etiqueta_solapa.jpg"
        },
        {
          id: "etiqueta-carton-personalizada",
          name: "Etiqueta Carton Personalizada",
          description: "Etiqueta de lujo en carton con acabados especiales para marcas premium.",
          features: [
            "100% carton certificado",
            "Impresión con tintas",
            "Bordes deshilachados",
            "Tacto suave"
          ],
          applications: [
            "Ropa de lujo y alta costura",
            "Marcas sostenibles",
            "Ropa infantil premium",
            "Productos orgánicos certificados"
          ],
          materials: ["Algodón orgánico", "Tintas eco-friendly"],
          image: "/static/products/etiquetas/etiquetas_carton_personalizadas.jpg"
        },
        {
          id: "etiqueta-transparente",
          name: "Etiqueta Transparente",
          description: "Etiqueta completamente transparente que se integra perfectamente con cualquier prenda.",
          features: [
            "Material 100% transparente",
            "Impresión invisible hasta el lavado",
            "Adhesivo removible en frío",
            "No deja residuos"
          ],
          applications: [
            "Ropa de gala y ceremonias",
            "Lencería fina",
            "Ropa transparente o traslúcida",
            "Productos donde la estética es crítica"
          ],
          materials: ["Film transparente", "Adhesivo removible"],
          image: "/static/products/etiquetas/etiqueta-transparente.jpg"
        }
      ]
    },
    {
      id: "marquillas",
      name: "Marquillas de Marca",
      title: "Marquillas de Marca y Branding",
      description: "Marquillas personalizadas que comunican la identidad de tu marca con diseños únicos y acabados premium.",
      backgroundImage: "/static/products/marquillas/marquillatejida.jpg",
      overlayColor: "gradient",
      parallaxSpeed: 0.3,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      highlights: [
        "Diseños 100% personalizados",
        "Acabados premium disponibles",
        "Colores Pantone exactos",
        "Desde 100 unidades"
      ],
      products: [
        {
          id: "marquilla-nylon",
          name: "Marquilla Nylon",
          description: "Marquilla nylon con logo y texto en relieve, perfecta para marcas de lujo.",
          features: [
            "Nylon de alta densidad",
            "Logo en relieve tridimensional",
            "Hasta 8 colores simultáneos",
            "Bordes ultrasónicos"
          ],
          applications: [
            "Marcas de lujo y alta costura",
            "Jeans y denim premium",
            "Ropa deportiva de marca",
            "Accesorios de cuero"
          ],
          materials: ["Hilos poliéster premium", "Hilos metálicos"],
          image: "/static/products/marquillas/marquillanylon.jpg"
        },
        {
          id: "marquilla-satin",
          name: "Marquilla Satin",
          description: "Marquilla en satén con impresión digital de alta resolución, ideal para diseños complejos.",
          features: [
            "Impresión digital 1440 DPI",
            "Satin brillante premium",
            "Colores vibrantes y duraderos",
            "Corte láser de precisión"
          ],
          applications: [
            "Ropa femenina y lencería",
            "Ropa infantil colorida",
            "Marcas con diseños complejos",
            "Ediciones limitadas"
          ],
          materials: ["Satén poliéster brillante", "Tintas digitales UV"],
          image: "/static/products/marquillas/marquillasatin.jpeg"
        },
        {
          id: "marquilla-tejida",
          name: "Marquilla Tejida",
          description: "Marquilla en tejido 100% natural con impresión digital para marcas orgánicas y sostenibles.",
          features: [
            "100% tejido certificado",
            "Impresión digital de alta calidad",
            "Tacto natural y suave",
            "Bordes deshilachados elegantes"
          ],
          applications: [
            "Marcas sostenibles y eco-friendly",
            "Ropa orgánica certificada",
            "Productos para bebés",
            "Colecciones naturales"
          ],
          materials: ["Algodón orgánico GOTS", "Tintas base agua"],
          image: "/static/products/marquillas/marquillatejida.jpg"
        }
      ]
    },
    {
      id: "garra-pantalon",
      name: "Garra Pantalon",
      title: "Garra Pantalon",
      description: "Soluciones especializadas para necesidades específicas: transparentes, reflectivas, termoadhesivas y más.",
      backgroundImage: "/static/products/garra_pantalon/cuero.jpeg",
      overlayColor: "light",
      parallaxSpeed: 0.7,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      highlights: [
        "Tecnología de vanguardia",
        "Soluciones innovadoras",
        "Aplicaciones especializadas",
        "Resistencia extrema"
      ],
      products: [
        {
          id: "cuero-sintetico",
          name: "Cuero Sintetico",
          description: "Cuero sintetico con logo y texto en relieve, perfecta para marcas de lujo.",
          features: [
            "Material 100% sintetico",
            "Impresión digital de alta calidad",
            "Bordes deshilachados",
            "Tacto suave"
          ],
          applications: [
            "Ropa de lujo y alta costura",
            "Jeans y denim premium",
            "Ropa deportiva de marca",
            "Accesorios de cuero"
          ],
          materials: ["Cuero sintetico", "Tintas digitales UV"],
          image: "/static/products/garra_pantalon/cuero_sintetico.jpeg"
        },
        {
          id: "sintetico",
          name: "Sintetico",
          description: "Sintetico con logo y texto en relieve, perfecta para marcas de lujo.",
          features: [
            "Material 100% sintetico",
            "Impresión digital de alta calidad",
            "Bordes deshilachados",
            "Tacto suave"
          ],
          applications: [
            "Ropa de lujo y alta costura",
            "Jeans y denim premium",
            "Ropa deportiva de marca",
            "Accesorios de cuero"
          ],
          materials: ["Cuero sintetico", "Tintas digitales UV"],
          image: "/static/products/garra_pantalon/sintetico.png"
        },
        {
          id: "sublimada",
          name: "Sublimada",
          description: "Sublimada con logo y texto en relieve, perfecta para marcas de lujo.",
          features: [
            "Material 100% sublimado",
            "Impresión digital de alta calidad",
            "Bordes deshilachados",
            "Tacto suave"            
          ],
          applications: [
            "Ropa de lujo y alta costura",
            "Ropa deportiva de marca",
            "Accesorios de cuero",
            "Ropa de trabajo pesado"
          ],
          materials: ["Sublimado", "Tintas digitales UV"],
          image: "/static/products/garra_pantalon/sublimada.jpg"
        },
      ]
    }
  ]
};

// Configuración del módulo de productos
export const productsConfig = {
  parallaxEnabled: true,
  showProductDetails: true,
  showMaterials: true,
  showApplications: true,
  animationDelay: 150,
  parallaxOffset: 100, // píxeles de offset para el efecto parallax
};
