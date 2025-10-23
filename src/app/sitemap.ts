import { MetadataRoute } from 'next'
import { seoConfig } from '@/config/seo'
import { productsData } from '@/data/productsData'

export const dynamic = 'force-static'

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
  
  // URLs de categorías y productos (para rich snippets)
  const categoryAndProductUrls: MetadataRoute.Sitemap = []
  
  productsData.categories.forEach((category) => {
    // URL de la categoría
    categoryAndProductUrls.push({
      url: `${baseUrl}#${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
    
    // URLs de productos dentro de la categoría
    category.products.forEach((product) => {
      categoryAndProductUrls.push({
        url: `${baseUrl}#producto-${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })
    })
  })
  
  return [mainPage, ...sections, ...categoryAndProductUrls]
}

