import Image from 'next/image';
import { seoConfig } from '@/config/seo';

interface SEOImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  // SEO específico
  title?: string;
  caption?: string;
  category?: 'product' | 'hero' | 'gallery' | 'logo';
}

export function SEOImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '100vw',
  quality = 85,
  fill = false,
  loading = 'lazy',
  title,
  caption,
  category = 'gallery'
}: SEOImageProps) {
  // Generar structured data para la imagen si es necesario
  const imageSchema = category === 'product' ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${seoConfig.siteUrl}${src}`,
    url: `${seoConfig.siteUrl}${src}`,
    name: alt,
    description: caption || alt,
    width: width,
    height: height,
    encodingFormat: src.includes('.jpg') || src.includes('.jpeg') ? 'image/jpeg' : 
                   src.includes('.png') ? 'image/png' : 
                   src.includes('.webp') ? 'image/webp' : 'image/jpeg',
    author: {
      '@type': 'Organization',
      name: seoConfig.companyName
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: seoConfig.companyName
    },
    license: `${seoConfig.siteUrl}/legal/image-license`,
    acquireLicensePage: `${seoConfig.siteUrl}/contacto`
  } : null;

  return (
    <>
      {imageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(imageSchema),
          }}
        />
      )}
      
      <figure className={className}>
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading={priority ? 'eager' : loading}
          title={title || alt}
          className={fill ? 'object-cover' : ''}
          // Optimizaciones adicionales
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {caption && (
          <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>
    </>
  );
}

