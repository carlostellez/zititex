# SEO Optimization Guide - Zititex

## Overview

This guide documents the comprehensive SEO optimizations implemented for the Zititex website, following industry best practices and Google's recommendations.

## Table of Contents

- [Structured Data](#structured-data)
- [Technical SEO](#technical-seo)
- [Performance Optimization](#performance-optimization)
- [Testing & Validation](#testing--validation)
- [Monitoring](#monitoring)
- [Future Improvements](#future-improvements)

---

## Structured Data

### Implemented Schemas

#### 1. Organization Schema
**Location**: `src/config/seo.ts` → `organizationSchema`

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://zititex.com/#organization",
  "name": "Zititex S.A.S.",
  "url": "https://zititex.com",
  "logo": "https://zititex.com/static/logo/zititex-logo.png",
  "contactPoint": { ... },
  "address": { ... },
  "sameAs": [ /* social media URLs */ ]
}
```

**Benefits**:
- Knowledge panel in Google search
- Brand recognition
- Social profile links

#### 2. LocalBusiness Schema
**Location**: `src/config/seo.ts` → `localBusinessSchema`

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://zititex.com/#business",
  "name": "Zititex S.A.S.",
  "address": { ... },
  "geo": { ... },
  "openingHoursSpecification": [ ... ],
  "aggregateRating": { ... }
}
```

**Benefits**:
- Local search visibility
- Google Maps integration
- Business hours display
- Location-based queries

#### 3. WebSite Schema with SearchAction
**Location**: `src/config/seo.ts` → `websiteSchema`

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://zititex.com/#website",
  "url": "https://zititex.com",
  "potentialAction": [{
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://zititex.com/#productos?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }]
}
```

**Benefits**:
- Site search box in Google SERP
- Enhanced user experience
- Direct search from Google

#### 4. WebPage Schema
**Location**: `src/config/seo.ts` → `webPageSchema`

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://zititex.com/#webpage",
  "isPartOf": { "@id": "https://zititex.com/#website" },
  "about": { "@id": "https://zititex.com/#organization" },
  "breadcrumb": { "@id": "https://zititex.com/#breadcrumb" }
}
```

**Benefits**:
- Better page context for search engines
- Proper schema linking
- Enhanced crawlability

#### 5. ItemList Schema
**Location**: `src/config/seo.ts` → `productListSchema`

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Etiquetas de Composición",
      "url": "https://zititex.com#producto-etiquetas"
    },
    // ... more items
  ]
}
```

**Benefits**:
- Product catalog rich results
- Better product discoverability
- Enhanced SERP presence

#### 6. FAQPage Schema
**Location**: `src/app/page.tsx` → `faqSchema`

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué tipos de etiquetas fabrican?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Fabricamos etiquetas de composición..."
      }
    }
  ]
}
```

**Benefits**:
- FAQ accordion in search results
- Direct answers in SERP
- Higher click-through rates

### Schema Linking Strategy

All schemas are properly linked using `@id` references:

```
WebSite (@id: #website)
    ↓
WebPage (@id: #webpage)
    ↓
    ├─> isPartOf: #website
    ├─> about: #organization
    └─> breadcrumb: #breadcrumb
```

This creates a **semantic graph** that helps search engines understand relationships.

---

## Technical SEO

### 1. Dynamic Sitemap

**File**: `src/app/sitemap.ts`

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://zititex.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // ... sections and products
  ]
}
```

**Features**:
- Auto-generated from content
- Proper priority levels
- Change frequency indicators
- Includes all important URLs

**Access**: `https://zititex.com/sitemap.xml`

### 2. Robots.txt

**File**: `src/app/robots.ts`

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      }
    ],
    sitemap: 'https://zititex.com/sitemap.xml',
  }
}
```

**Configuration**:
- Allows all crawlers
- Blocks sensitive paths
- Links to sitemap
- Specifies host

**Access**: `https://zititex.com/robots.txt`

### 3. Meta Tags

**Complete meta tag implementation**:

```html
<!-- Basic SEO -->
<title>Zititex - Etiquetas y Marquillas Premium</title>
<meta name="description" content="...">
<meta name="keywords" content="...">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta property="og:url" content="...">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">

<!-- Geographic -->
<meta name="geo.region" content="CO-DC">
<meta name="geo.placename" content="Bogotá">
```

### 4. Canonical URLs

```html
<link rel="canonical" href="https://zititex.com" />
```

Prevents duplicate content issues.

### 5. hreflang Tags

```html
<link rel="alternate" hrefLang="es" href="https://zititex.com" />
<link rel="alternate" hrefLang="es-CO" href="https://zititex.com" />
```

Targets Spanish-speaking audiences, especially Colombia.

---

## Performance Optimization

### Resource Hints

#### 1. Preconnect
**Location**: `src/app/layout.tsx`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://maps.googleapis.com" />
```

**Purpose**: Establishes early connections to critical third-party origins.

#### 2. DNS Prefetch

```html
<link rel="dns-prefetch" href="//fonts.googleapis.com" />
<link rel="dns-prefetch" href="//maps.googleapis.com" />
<link rel="dns-prefetch" href="//www.google-analytics.com" />
```

**Purpose**: Resolves DNS for secondary resources.

#### 3. Preload

```html
<link rel="preload" href="/static/logo/zititex.png" as="image" />
<link rel="preload" href="/static/hero/hero-1.jpg" as="image" fetchPriority="high" />
```

**Purpose**: Downloads critical assets ASAP.

#### 4. Prefetch

```html
<link rel="prefetch" href="/#productos" />
<link rel="prefetch" href="/#contacto" />
```

**Purpose**: Preloads next-page resources when browser is idle.

### Priority Strategy

```
1. Preload → Critical assets (logo, hero) → Highest priority
2. Preconnect → External domains → High priority
3. DNS Prefetch → Secondary resources → Medium priority
4. Prefetch → Next navigation → Lowest priority
```

### Core Web Vitals Targets

| Metric | Target | Implementation |
|--------|--------|----------------|
| **LCP** | < 2.5s | Preload hero images, optimize fonts |
| **FID** | < 100ms | Minimal blocking JS, code splitting |
| **CLS** | < 0.1 | Fixed image dimensions, reserved space |

---

## PWA Configuration

### Manifest.json Enhancements

**File**: `public/manifest.json`

```json
{
  "name": "Zititex - Etiquetas y Marquillas Premium",
  "short_name": "Zititex",
  "id": "/",
  "display": "standalone",
  "display_override": ["window-controls-overlay", "standalone", "minimal-ui"],
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "categories": ["business", "productivity", "shopping", "manufacturing"],
  "shortcuts": [ ... ]
}
```

**Features**:
- Multiple display modes
- App shortcuts
- Proper categorization
- Installable as PWA

---

## Testing & Validation

### 1. Google Rich Results Test

```bash
URL: https://search.google.com/test/rich-results
Steps:
1. Enter your website URL
2. Click "Test URL"
3. Verify all schemas appear
```

**Expected Results**:
- ✅ Organization
- ✅ LocalBusiness
- ✅ WebSite with SearchAction
- ✅ FAQPage
- ✅ ItemList

### 2. Schema Markup Validator

```bash
URL: https://validator.schema.org/
Steps:
1. Paste your page HTML
2. Click "Validate"
3. Fix any warnings/errors
```

### 3. Lighthouse Audit

```bash
# Build the project
npm run build

# Run local server
npx serve out

# Open Chrome DevTools
# Lighthouse → Run audit
```

**Target Scores**:
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- **SEO: 100**
- PWA: Installable

### 4. Google Search Console

**Setup Steps**:
1. Verify site ownership
2. Submit sitemap: `https://zititex.com/sitemap.xml`
3. Monitor:
   - Index coverage
   - Core Web Vitals
   - Mobile usability
   - Rich results status

### 5. PageSpeed Insights

```bash
URL: https://pagespeed.web.dev/
Enter: https://zititex.com
```

**Checks**:
- Mobile performance
- Desktop performance
- Core Web Vitals
- Opportunities for improvement

---

## Monitoring

### Key Metrics to Track

#### 1. Search Console Metrics
- **Impressions**: Page views in search
- **Clicks**: Actual visits from search
- **CTR**: Click-through rate
- **Average Position**: Ranking position
- **Rich Results**: Appearance frequency

#### 2. Analytics Metrics
- **Organic Traffic**: Visits from search engines
- **Bounce Rate**: Single-page sessions
- **Session Duration**: Time on site
- **Pages per Session**: Site engagement
- **Conversions**: Contact form submissions

#### 3. Technical Metrics
- **LCP**: Largest Contentful Paint
- **FID**: First Input Delay
- **CLS**: Cumulative Layout Shift
- **TTFB**: Time to First Byte
- **INP**: Interaction to Next Paint (new metric)

### Monitoring Tools

1. **Google Search Console**: Search performance
2. **Google Analytics 4**: User behavior
3. **Lighthouse CI**: Automated performance testing
4. **Uptime monitoring**: Site availability
5. **PageSpeed Insights**: Regular performance checks

---

## Future Improvements

### Content SEO

1. **Blog Section**:
   - Industry insights
   - Product guides
   - Use cases
   - Keywords: `etiquetas textiles blog`, `guía marquillas`

2. **Product Detail Pages**:
   - Individual product pages
   - Product schema for each
   - Rich product snippets
   - Technical specifications

3. **Customer Reviews**:
   - Add Review schema
   - Display testimonials
   - Aggregate ratings
   - Social proof

4. **Case Studies**:
   - Client success stories
   - Before/after examples
   - Industry-specific solutions

### Technical Improvements

1. **Image Optimization**:
   ```typescript
   // Implement WebP/AVIF
   <Image
     src="/product.jpg"
     alt="..."
     formats={['avif', 'webp', 'jpg']}
   />
   ```

2. **Service Worker**:
   - Offline functionality
   - Cache strategies
   - Background sync

3. **Lazy Loading**:
   - Below-the-fold images
   - Intersection Observer
   - Reduced initial load

4. **Video Content**:
   - VideoObject schema
   - Manufacturing process
   - Product demonstrations

### Local SEO

1. **Google Business Profile**:
   - Complete profile
   - Regular posts
   - Customer reviews
   - Photos/videos

2. **Local Citations**:
   - Directory listings
   - Industry directories
   - Local chambers

3. **Local Content**:
   - Bogotá-specific content
   - Colombia textile industry
   - Regional keywords

### International SEO

1. **Multi-language Support**:
   - English version
   - hreflang implementation
   - Translated content

2. **Regional Targeting**:
   - Different regions in Colombia
   - Export markets
   - International shipping info

---

## Best Practices Checklist

### On-Page SEO
- [x] Descriptive page titles
- [x] Meta descriptions (155 chars)
- [x] Heading hierarchy (H1, H2, H3)
- [x] Alt text for images
- [x] Internal linking
- [x] Keyword optimization
- [x] URL structure

### Technical SEO
- [x] Mobile-responsive
- [x] Fast loading speed
- [x] HTTPS enabled
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Canonical URLs
- [x] Structured data
- [x] No broken links

### Off-Page SEO
- [ ] Quality backlinks
- [ ] Social media presence
- [ ] Online directories
- [ ] Local citations
- [ ] Guest posting
- [ ] Industry partnerships

### User Experience
- [x] Clear navigation
- [x] Easy contact access
- [x] Fast page speed
- [x] Mobile-friendly
- [x] Accessible design
- [x] Clear CTAs

---

## Resources

### Documentation
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Web.dev SEO](https://web.dev/learn/seo/)

### Tools
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Validation
- [Schema Validator](https://validator.schema.org/)
- [W3C Markup Validator](https://validator.w3.org/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## Conclusion

The Zititex website now has comprehensive SEO optimization covering:
- ✅ Complete structured data implementation
- ✅ Technical SEO best practices
- ✅ Performance optimization
- ✅ PWA capabilities
- ✅ Rich snippet eligibility

**Expected Impact**:
- Higher search rankings
- More organic traffic
- Better user engagement
- Rich results in SERP
- Improved conversion rates

**Next Steps**:
1. Monitor Search Console for rich results
2. Track organic traffic growth
3. Optimize based on real data
4. Continue content creation
5. Build quality backlinks

For questions or assistance, refer to the main [README.md](../README.md) or [prompts.md](../prompts.md) documentation.

