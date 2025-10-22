import { MetadataRoute } from 'next'
import { seoConfig } from '@/config/seo'
import { productsData } from '@/data/productsData'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = seoConfig.siteUrl
  
  // Página principal
  const mainPage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }
  
  // Secciones principales
  const sections = [
    {
      url: `${baseUrl}#productos`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}#beneficios`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}#contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ]
  
  // URLs de productos (para rich snippets)
  const productUrls = productsData.products.map((product) => ({
    url: `${baseUrl}#producto-${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  return [mainPage, ...sections, ...productUrls]
}

