# Zititex - Manufacturer of Labels and Tags

![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?logo=tailwind-css)

Modern, responsive website for Zititex, a manufacturer specializing in labels, tags, and paper bags for the textile industry.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **SEO Optimized**: Server-side rendering with Next.js 15 App Router
- **Performance**: Static export optimized for CDN delivery
- **Contact Integration**: Form with email notifications and WhatsApp integration
- **Google Maps**: Interactive map showing business location
- **Product Catalog**: Comprehensive showcase of all products with images
- **Progressive Web App**: Offline support with manifest.json
- **Accessibility**: WCAG compliant with semantic HTML

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
│   ├── config/
│   │   └── seo.ts                # SEO configuration
│   ├── contexts/
│   │   └── ThemeContext.tsx      # Theme state management
│   └── data/                     # Data layer
│       ├── benefitsData.tsx      # Benefits content
│       ├── contactData.tsx       # Contact information
│       ├── heroData.ts           # Hero content
│       └── productsData.tsx      # Product catalog
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
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
   
   Edit `.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key
   NEXT_PUBLIC_WEB3FORMS_KEY=your_actual_web3forms_access_key
   ```
   
   **Get your Web3Forms key** (free, no signup required):
   - Visit: https://web3forms.com
   - Enter your email address
   - Copy the Access Key sent to your email

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

Configure these in GitHub repository settings:

- `S3_BUCKET_NAME`: Your S3 bucket name
- `AWS_ACCESS_KEY_ID`: AWS credentials
- `AWS_SECRET_ACCESS_KEY`: AWS credentials
- `AWS_REGION`: AWS region (e.g., `us-east-1`)
- `CF_DISTRIBUTION_ID`: CloudFront distribution ID (optional)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NEXT_PUBLIC_WEB3FORMS_KEY`: Web3Forms access key

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

The contact form uses **Web3Forms**, a free third-party service that works perfectly with static sites.

**Integration Details**:
- **Service**: Web3Forms (https://web3forms.com)
- **Type**: Client-side form submission
- **Cost**: Free (up to 250 submissions/month)
- **Setup**: No server required, works with static export

**How it works**:
1. User fills out the contact form
2. Form data is validated client-side
3. Data is sent to Web3Forms API
4. Web3Forms forwards the email to your configured email address
5. User receives success/error message

**Configuration**:
```typescript
// Form submits to Web3Forms API
const submitData = {
  access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
  subject: `New contact from Zititex - ${name}`,
  from_name: name,
  email: email,
  message: message,
  // ... other form fields
};

await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(submitData)
});
```

**Setup Instructions**:
1. Visit https://web3forms.com
2. Enter your email address where you want to receive form submissions
3. Copy the Access Key
4. Add to `.env.local`: `NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key`
5. Add to GitHub Secrets for deployment

**Features**:
- Spam protection with honeypot
- Email notifications
- Custom subject lines
- No backend required
- GDPR compliant

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
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps API key for map integration |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Yes | Web3Forms access key for contact form |
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

### Available Guides

- [AWS S3 Deployment](./docs/aws-s3-deployment.md) - Complete deployment guide
- [Contact Module](./docs/contact-module-guide.md) - Contact feature documentation
- [Product Catalog](./docs/expanded-product-catalog.md) - Product management guide
- [Image Paths](./docs/image-paths-fix.md) - Image handling guide

### Additional Resources

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

## 📊 Performance

### Lighthouse Scores (Target)

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Optimization Techniques

- Static site generation (SSG)
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS purging with Tailwind
- CDN delivery via CloudFront
- Efficient cache headers

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

