import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Benefits } from '@/components/sections/Benefits';
import { Products } from '@/components/sections/Products';
import { Contact } from '@/components/sections/Contact';
import { generateBreadcrumbSchema } from '@/config/seo';

export default function Home() {
  // Breadcrumb schema para la página principal
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' }
  ]);

  // FAQ Schema para preguntas frecuentes
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué tipos de etiquetas fabrican?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Fabricamos etiquetas de composición, marquillas tejidas, etiquetas transparentes, garra pantalón y productos especializados para la industria textil.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuál es el tiempo de entrega?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'El tiempo de entrega varía según el producto y cantidad. Generalmente entre 5-10 días hábiles para pedidos estándar.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Hacen envíos a toda Colombia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, realizamos envíos a todo el territorio colombiano y también manejamos exportaciones.'
        }
      },
      {
        '@type': 'Question',
        name: '¿Cuál es la cantidad mínima de pedido?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Manejamos pedidos desde 100 unidades, adaptándonos a las necesidades de cada cliente.'
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <main className="bg-background text-foreground">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <Hero />

        {/* Benefits Section */}
        <Benefits />

        {/* Products Section with Parallax */}
        <Products />

        {/* Contact Section */}
        <Contact />

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}
