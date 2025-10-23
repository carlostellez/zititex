# Zititex - Manufacturer of Labels and Tags

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)

Modern, responsive website for Zititex, a manufacturer specializing in labels, tags, and paper bags for the textile industry.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations and dark/light mode
- **SEO Optimized**: Server-side rendering with Next.js 15 App Router
- **Performance**: Static export optimized for CDN delivery
- **Backend API Integration**: Robust contact form with custom API integration
- **Contact Integration**: Advanced form validation and WhatsApp integration
- **Google Maps**: Interactive map showing business location
- **Product Catalog**: Comprehensive showcase of all products with images
- **Progressive Web App**: Offline support with manifest.json
- **Accessibility**: WCAG compliant with semantic HTML
- **CI/CD Pipeline**: Automated deployment to AWS S3 + CloudFront

## 📋 Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [API Design](#api-design)
- [Configuration](#configuration)
- [Documentation](#documentation)

## 🏗️ Architecture

### Design Patterns

The project follows **Clean Architecture** principles and implements several design patterns:

- **Component Composition Pattern**: Reusable UI components with clear responsibilities
- **Container/Presenter Pattern**: Separation of business logic and presentation
- **Context API Pattern**: Global state management with React Context
- **Static Generation Pattern**: Pre-rendered pages for optimal performance
- **Repository Pattern**: Data layer abstraction in `src/data/`

### SOLID Principles

- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Components are open for extension, closed for modification
- **Liskov Substitution**: Component interfaces are consistent and replaceable
- **Interface Segregation**: Focused, minimal component props
- **Dependency Inversion**: Dependencies on abstractions, not implementations

### Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom React 19 components
- **State Management**: React Context API
- **Forms**: Native HTML5 with validation
- **Maps**: Google Maps JavaScript API
- **Deployment**: AWS S3 + CloudFront
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
zititex/
├── .github/
│   └── workflows/
│       └── deploy-to-s3.yml      # CI/CD deployment pipeline
├── docs/                          # Project documentation
│   ├── aws-s3-deployment.md      # AWS deployment guide
│   ├── contact-module-guide.md   # Contact feature documentation
│   └── ...
├── public/                        # Static assets
│   ├── manifest.json             # PWA manifest
│   └── static/
│       ├── hero/                 # Hero section images
│       ├── logo/                 # Company logos
│       └── products/             # Product images
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   └── contact/          # Contact form endpoint
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles
│   │   ├── robots.ts             # SEO robots.txt
│   │   └── sitemap.ts            # SEO sitemap
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx        # Site header with navigation
│   │   │   └── Footer.tsx        # Site footer
│   │   ├── sections/             # Page sections
│   │   │   ├── Hero.tsx          # Hero section
│   │   │   ├── Products.tsx      # Product showcase
│   │   │   ├── Benefits.tsx      # Company benefits
│   │   │   └── Contact.tsx       # Contact section
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── ContactForm.tsx   # Contact form
│   │   │   ├── FloatingWhatsApp.tsx
│   │   │   ├── GoogleMap.tsx     # Map integration
│   │   │   ├── ImageCarousel.tsx # Image slider
│   │   │   ├── Menu.tsx          # Mobile menu
│   │   │   └── ParallaxSection.tsx
│   │   └── seo/                  # SEO components
│   │       └── SEOImage.tsx      # Optimized images
│   ├── config/                   # Configuration layer
│   │   ├── api.ts                # Core API configuration
│   │   ├── api-contact.ts        # Contact API functions
│   │   └── seo.ts                # SEO configuration
│   ├── contexts/
│   │   └── ThemeContext.tsx      # Theme state management
│   ├── data/                     # Data layer
│   │   ├── benefitsData.tsx      # Benefits content
│   │   ├── contactData.tsx       # Contact information & form fields
│   │   ├── heroData.ts           # Hero content
│   │   └── productsData.tsx      # Product catalog
│   └── types/
│       └── env.d.ts              # Environment variables types
├── scripts/
│   └── test-contact-api.js       # API testing script
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── prompts.md                    # Development history & prompts
├── run.md                        # Detailed run instructions
└── package.json                  # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Git**: For version control

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/zititex.git
   cd zititex
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Backend API (REQUIRED for contact form)
   NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api/v1
   NEXT_PUBLIC_API_KEY=your_api_key_here
   
   # Google Maps (Optional)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Environment
   NODE_ENV=development
   ```
   
   **Backend API Setup**:
   - Set up your backend API endpoint for contact form submissions
   - The API should accept POST requests to `/contact/` endpoint
   - Include API key authentication via `x-api-key` header
   - See [Contact API Integration](./docs/contact-api-integration.md) for details

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💻 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server (requires build)
npm start

# Run linter
npm run lint

# Test contact form API connectivity
node scripts/test-contact-api.js
```

### Development Workflow

1. Create a feature branch from `master`
2. Make your changes following the code style
3. Test locally with `npm run dev`
4. Run linter with `npm run lint`
5. Commit with clear, descriptive messages
6. Push and create a pull request

### Code Style Guidelines

- Use **TypeScript** for all new code
- Follow **ESLint** rules (Next.js config)
- Use **Tailwind CSS** for styling
- Write **clear, descriptive** component names
- Add **JSDoc comments** for complex functions
- Keep components **small and focused**

### Best Practices

- **Component Structure**: Follow the single responsibility principle
- **Type Safety**: Always define TypeScript interfaces for props
- **Performance**: Use React.memo() for expensive components
- **Accessibility**: Include ARIA labels and semantic HTML
- **SEO**: Use proper heading hierarchy (h1, h2, h3)
- **Images**: Optimize images before adding to `/public/static/`

## 🚀 Deployment

### Automatic Deployment

The application automatically deploys to AWS S3 when you push to the `master` branch.

**Deployment Pipeline**:
1. Code pushed to `master`
2. GitHub Actions triggers
3. Dependencies installed
4. Application built with `npm run build`
5. Static files synced to S3
6. CloudFront cache invalidated
7. New version live in ~2 minutes

### Required GitHub Secrets

Configure these in GitHub repository settings (Settings → Secrets and variables → Actions):

- `S3_BUCKET_NAME`: Your S3 bucket name
- `AWS_ACCESS_KEY_ID`: AWS credentials
- `AWS_SECRET_ACCESS_KEY`: AWS credentials
- `AWS_REGION`: AWS region (e.g., `us-east-1`)
- `CF_DISTRIBUTION_ID`: CloudFront distribution ID (optional)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (REQUIRED)
- `NEXT_PUBLIC_API_KEY`: Backend API authentication key (REQUIRED)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key (optional)

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy to S3
aws s3 sync ./out s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Quick Start Options**:
- [S3 Only Quick Start](./docs/s3-only-quick-start.md) - Get live in 10 minutes (HTTP only)
- [Full AWS S3 + CloudFront Guide](./docs/aws-s3-deployment.md) - Complete production setup (HTTPS, CDN)

## 🔌 API Design

### Contact Form Integration

The contact form integrates with a custom backend API for robust data handling and processing.

**Architecture Overview**:
```
Frontend (React)
    ↓
ContactForm Component
    ↓
sendContactForm() function
    ↓
apiRequest() (core API layer)
    ↓
Backend API (POST /contact/)
    ↓
Database / Email Service
```

**Integration Details**:
- **Type**: RESTful API
- **Authentication**: API Key via `x-api-key` header
- **Format**: JSON request/response
- **Deployment**: Works with static export (client-side API calls)

**API Endpoint**:
```
POST {NEXT_PUBLIC_API_BASE_URL}/contact/

Headers:
  Content-Type: application/json
  x-api-key: {NEXT_PUBLIC_API_KEY}

Body:
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+57 300 123 4567",
  "company": "Example Corp",
  "product_type": "Etiquetas de Composición",
  "quantity": "1,000 - 5,000 unidades",
  "message": "I'm interested in..."
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Contact form sent successfully"
}
```

**Error Response (4xx/5xx)**:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Error sending contact form"
}
```

**Implementation Example**:
```typescript
// src/config/api-contact.ts
export async function sendContactForm(formData: ContactFormData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.API_KEY,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error sending form');
    }

    return {
      success: true,
      data,
      message: 'Contact form sent successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Error sending contact form'
    };
  }
}
```

**Features**:
- ✅ Full control over data handling
- ✅ Custom validation and processing
- ✅ Direct database integration
- ✅ Enhanced security
- ✅ Comprehensive error handling
- ✅ Detailed logging and debugging
- ✅ Easy to test and monitor

**Testing**:
```bash
# Test API connectivity
node scripts/test-contact-api.js
```

**Documentation**:
See [Contact API Integration Guide](./docs/contact-api-integration.md) for complete documentation including:
- Architecture details
- Request/response formats
- Error handling
- Testing guide
- Troubleshooting
- Security considerations

### Data Layer

Data is organized in the `src/data/` directory:

- **productsData.tsx**: Product catalog with categories
- **benefitsData.tsx**: Company benefits and features
- **contactData.tsx**: Contact information and social links
- **heroData.ts**: Hero section content

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend API base URL (e.g., `https://api.example.com/api/v1`) |
| `NEXT_PUBLIC_API_KEY` | Yes | Backend API authentication key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | No | Google Maps API key for map integration |
| `NODE_ENV` | No | Environment (development/production) |

### Next.js Configuration

Key configurations in `next.config.ts`:

```typescript
{
  output: 'export',           // Static export for S3
  images: { unoptimized: true }, // No server-side image optimization
  trailingSlash: true          // URL trailing slashes for S3
}
```

### Tailwind Configuration

Custom configuration in `tailwind.config.ts`:

- Custom colors for brand identity
- Extended spacing and typography
- Responsive breakpoints
- Custom animations

## 📚 Documentation

### Project Documentation

- **[run.md](./run.md)** - Comprehensive guide on how to run the project
- **[prompts.md](./prompts.md)** - Development history and decisions

### Feature Guides

- **[Contact API Integration](./docs/contact-api-integration.md)** - Complete API integration guide
- **[Contact Module](./docs/contact-module-guide.md)** - Contact feature documentation
- **[AWS S3 Deployment](./docs/aws-s3-deployment.md)** - Complete deployment guide
- **[S3 Quick Start](./docs/s3-only-quick-start.md)** - Fast deployment guide
- **[Product Catalog](./docs/expanded-product-catalog.md)** - Product management guide
- **[Image Paths](./docs/image-paths-fix.md)** - Image handling guide

### Technology Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🔧 Troubleshooting

### Common Issues

**Issue**: `Module not found` errors
```bash
# Solution: Clean install dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Build fails with type errors
```bash
# Solution: Check TypeScript configuration
npm run lint
```

**Issue**: Contact form not working
```bash
# Solution 1: Test API connectivity
node scripts/test-contact-api.js

# Solution 2: Check environment variables
cat .env.local

# Solution 3: Check browser console for errors
# Open DevTools (F12) and check Console tab
```

**Issue**: API returns HTML instead of JSON
```bash
# Possible causes:
# - Incorrect API URL
# - Endpoint doesn't exist (404)
# - Server error (500)

# Solution: Verify API URL format
# Correct: https://api.example.com/api/v1/contact/
# Include trailing slash if required by backend
```

**Issue**: CORS errors when submitting form
```bash
# Solution: Configure backend to allow your domain
# The backend must include proper CORS headers
# Allow-Origin: https://yourdomain.com
# Allow-Methods: POST
# Allow-Headers: Content-Type, x-api-key
```

**Issue**: Google Maps not loading
```bash
# Solution: Verify API key is set correctly
echo $NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

**Issue**: Images not loading in production
```bash
# Solution: Check image paths use /static/ prefix
# Correct: /static/products/image.jpg
# Incorrect: /products/image.jpg
```

### Debugging Contact Form

1. **Check Browser Console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages with emoji indicators:
     - 📤 = Sending form
     - 🌐 = API request
     - 📡 = API response
     - ✅ = Success
     - ❌ = Error

2. **Check Network Tab**:
   - Open DevTools (F12)
   - Go to Network tab
   - Submit form
   - Look for POST request to `/contact/`
   - Check request headers and body
   - Check response status and data

3. **Test API Independently**:
   ```bash
   node scripts/test-contact-api.js
   ```

For detailed troubleshooting, see [Contact API Integration Guide](./docs/contact-api-integration.md#troubleshooting)

## 📊 Performance & SEO

### Lighthouse Scores (Target)

- **Performance**: 95+ / 100
- **Accessibility**: 100 / 100
- **Best Practices**: 100 / 100
- **SEO**: 100 / 100
- **PWA**: Installable

### SEO Features

#### Structured Data (Schema.org)
- ✅ **Organization Schema**: Company information with @id linking
- ✅ **LocalBusiness Schema**: Physical location, opening hours, contact
- ✅ **WebSite Schema**: With SearchAction for Google Search box
- ✅ **WebPage Schema**: Page context and breadcrumb references
- ✅ **ItemList Schema**: Product catalog structured data
- ✅ **FAQPage Schema**: Frequently asked questions
- ✅ **Product Schema**: Individual product structured data

#### Technical SEO
- ✅ **Dynamic Sitemap**: Auto-generated from content (`/sitemap.xml`)
- ✅ **Robots.txt**: Optimized crawler directives (`/robots.txt`)
- ✅ **Canonical URLs**: Proper URL canonicalization
- ✅ **hreflang**: Language/region targeting (es, es-CO)
- ✅ **Meta Tags**: Complete title, description, keywords
- ✅ **Open Graph**: Social media sharing optimization
- ✅ **Twitter Cards**: Twitter-specific sharing meta tags

#### Performance Optimization
- ✅ **Preconnect**: Critical external domains (fonts, maps)
- ✅ **DNS Prefetch**: Secondary resources (analytics)
- ✅ **Resource Preload**: Critical assets (logo, hero images)
- ✅ **fetchPriority**: High priority for LCP images
- ✅ **Prefetch**: Next-page navigation hints

#### Progressive Web App (PWA)
- ✅ **Manifest.json**: Complete PWA configuration
- ✅ **App Icons**: Multiple sizes (192x192, 512x512, maskable)
- ✅ **Shortcuts**: Quick access to products and contact
- ✅ **Display Modes**: Standalone, minimal-ui
- ✅ **Theme Color**: Brand color integration

### Rich Snippets Potential

1. **Organization Knowledge Panel**:
   - Company name and logo
   - Contact information
   - Social media profiles
   - Business hours

2. **Local Business Card**:
   - Map integration
   - Opening hours
   - Contact button
   - Reviews (when added)

3. **FAQ Rich Results**:
   - Expandable questions in search
   - Direct answers visibility

4. **Site Search Box**:
   - Search directly from Google
   - Improved user experience

5. **Breadcrumb Navigation**:
   - Clear site structure in SERP
   - Better click-through rates

### SEO Testing

```bash
# Test structured data
Google Rich Results Test: https://search.google.com/test/rich-results
Schema Markup Validator: https://validator.schema.org/

# Check sitemap
curl https://zititex.com/sitemap.xml

# Run Lighthouse
npm run build
# Open Chrome DevTools → Lighthouse → Run audit
```

### Core Web Vitals Optimization

- **LCP (Largest Contentful Paint)**: < 2.5s
  - Hero images preloaded
  - Critical CSS inlined
  - Font display optimized

- **FID (First Input Delay)**: < 100ms
  - Minimal JavaScript blocking
  - Code splitting implemented

- **CLS (Cumulative Layout Shift)**: < 0.1
  - Fixed image dimensions
  - Reserved space for dynamic content

### Optimization Techniques

- Static site generation (SSG)
- **OptimizedImage Component**: Custom lazy loading with loading states
- **Native Lazy Loading**: `loading="lazy"` for below-the-fold images
- **Priority Hints**: `fetchpriority="high"` for critical images
- Code splitting and lazy loading
- CSS purging with Tailwind
- **Font Optimization**: `font-display: swap` with fallback matching
- CDN delivery via CloudFront
- Efficient cache headers
- Structured data for rich snippets
- Performance hints (preconnect, dns-prefetch, preload)
- Critical resource preloading

### Image Optimization (CRITICAL)

⚠️ **ACTION REQUIRED**: Current images are TOO LARGE and severely impact performance:

| Image | Current Size | Target Size | Impact |
|-------|-------------|-------------|--------|
| hero-1.jpg | **4.4 MB** | 150 KB | 🔴 CRITICAL |
| hero-2.jpg | **4.3 MB** | 145 KB | 🔴 CRITICAL |
| hero-3.jpg | **3.8 MB** | 135 KB | 🔴 CRITICAL |
| sintetico.png | **2.7 MB** | 80 KB | 🔴 CRITICAL |
| etiqueta.png | **2.4 MB** | 70 KB | 🔴 CRITICAL |

**Current Performance**:
- Total page size: ~14.5 MB
- Load time (3G): 15-20 seconds
- Lighthouse Performance: 40-50/100

**After Optimization**:
- Total page size: ~1.2 MB (92% reduction)
- Load time (3G): 3-4 seconds (5x faster)
- Lighthouse Performance: 90-95/100 (2x improvement)

**How to Optimize**:
```bash
# Quick fix using Squoosh (https://squoosh.app/)
1. Upload each image
2. Select WebP format
3. Set quality: 80
4. Resize to: 1920x1080 (hero) or 800x800 (products)
5. Download and replace

# See detailed guide:
docs/image-optimization-guide.md
```

### Performance Components

**OptimizedImage Component** (`src/components/ui/OptimizedImage.tsx`):
```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

// Priority image (above-the-fold)
<OptimizedImage
  src="/static/hero/hero-1.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority={true}  // fetchpriority="high"
/>

// Lazy-loaded image (below-the-fold)
<OptimizedImage
  src="/static/product.jpg"
  alt="Product"
  width={800}
  height={800}
  priority={false}  // loading="lazy"
/>
```

### Performance Guides
- **[Performance Optimization Guide](./docs/performance-optimization-guide.md)** - Complete performance strategy
- **[Image Optimization Guide](./docs/image-optimization-guide.md)** - Step-by-step image optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Contact

**Zititex**
- Email: info@zititex.com
- Phone: +57 320 123 4567
- Website: https://zititex.com
- Location: Bogotá, Colombia

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React team for the UI library
- Vercel for development tools

---

Built with ❤️ by Zititex Team

