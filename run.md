# How to Run Zititex Project

This document provides detailed instructions on how to set up, run, test, and deploy the Zititex website.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Development](#development)
- [Testing](#testing)
- [Building](#building)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js** (v18.0 or higher)
   ```bash
   node --version  # Should be v18.0+
   ```
   Download from: https://nodejs.org/

2. **npm** (v9.0 or higher) - Included with Node.js
   ```bash
   npm --version  # Should be v9.0+
   ```

3. **Git** (optional, for version control)
   ```bash
   git --version
   ```
   Download from: https://git-scm.com/

### Recommended Tools

- **VS Code**: Recommended IDE
  - Install from: https://code.visualstudio.com/
  - Recommended extensions:
    - ESLint
    - Prettier
    - Tailwind CSS IntelliSense
    - TypeScript and JavaScript Language Features

- **Browser**: Modern browser with DevTools
  - Chrome (recommended)
  - Firefox
  - Safari
  - Edge

---

## Initial Setup

### 1. Clone or Download the Project

**Option A: Using Git**
```bash
git clone <repository-url>
cd zititex
```

**Option B: Download ZIP**
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal in the project directory

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:
- Next.js
- React
- Tailwind CSS
- TypeScript
- And other dependencies

**Expected Output**:
```
added XXX packages in XXs
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Edit `.env.local` and configure your values:

```bash
# Backend API Configuration (REQUIRED for contact form)
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api/v1
NEXT_PUBLIC_API_KEY=your_api_key_here

# Google Maps API Key (OPTIONAL)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Web3Forms API Key (DEPRECATED - kept as fallback)
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key_here

# Environment
NODE_ENV=development
```

**Important Notes**:
- Never commit `.env.local` to version control
- Use different API keys for development and production
- The contact form requires `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_API_KEY`

### 4. Verify Setup

Check that everything is configured correctly:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check that node_modules was created
ls node_modules

# Verify environment file
cat .env.local
```

---

## Development

### Start Development Server

```bash
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in X.Xs
```

### Access the Application

1. Open your browser
2. Navigate to: `http://localhost:3000`
3. You should see the Zititex homepage

### Development Features

#### Hot Reload
- Save any file
- Browser automatically refreshes
- Changes appear instantly

#### Available Routes
- `/` - Home page (Hero, Products, Benefits, Contact)
- `/#productos` - Products section
- `/#beneficios` - Benefits section
- `/#contacto` - Contact section

#### Component Structure
```
src/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Hero, Products, Benefits, Contact
│   ├── ui/                # Reusable UI components
│   └── seo/               # SEO components
├── config/                # API configuration
├── contexts/              # React contexts (Theme)
├── data/                  # Static data
└── types/                 # TypeScript types
```

### Development Commands

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Check TypeScript types
npm run type-check  # (if configured)

# Format code (if Prettier is configured)
npm run format
```

### Making Changes

#### 1. Modifying Content

**Product Data** (`src/data/productsData.tsx`):
```typescript
export const productsData = {
  products: [
    {
      id: "etiquetas",
      name: "Product Name",
      description: "Description",
      // ... update content
    }
  ]
};
```

**Contact Information** (`src/data/contactData.tsx`):
```typescript
export const contactData = {
  contactInfo: [
    {
      label: "Phone",
      value: "+57 xxx xxx xxxx",
      // ... update info
    }
  ]
};
```

#### 2. Styling Changes

**Tailwind CSS**: Utility classes in components
```tsx
<div className="bg-blue-500 hover:bg-blue-600 p-4 rounded-lg">
  Content
</div>
```

**Global Styles** (`src/app/globals.css`):
```css
.custom-class {
  /* Custom styles */
}
```

#### 3. Adding New Components

```bash
# Create new component
touch src/components/ui/NewComponent.tsx
```

```typescript
// src/components/ui/NewComponent.tsx
'use client';

import { useState } from 'react';

export function NewComponent() {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

#### 4. Testing Changes

1. Save your changes
2. Check browser for visual changes
3. Open DevTools Console (F12) for errors
4. Test on different screen sizes
5. Test dark/light mode toggle

---

## Testing

### 1. Test Contact Form API

Before testing the form in the browser, verify API connectivity:

```bash
node scripts/test-contact-api.js
```

**Expected Output (Success)**:
```
🧪 Iniciando prueba del API de contacto
================================================

📋 Configuración:
   Base URL: https://api.example.com/api/v1
   API Key: abcd1234...

📤 Datos de prueba:
{
  "full_name": "Test Usuario",
  "email": "test@example.com",
  ...
}

🌐 Enviando petición a: https://api.example.com/api/v1/contact/

📡 Respuesta del servidor:
   Status: 200 OK

✅ ¡Prueba exitosa!

📥 Datos de respuesta:
{
  "success": true,
  ...
}

================================================
✅ El API de contacto está funcionando correctamente
================================================
```

**Expected Output (Error)**:
```
❌ Error: Variables de entorno no configuradas

Por favor configura las siguientes variables:
  - NEXT_PUBLIC_API_BASE_URL: URL base del API
  - NEXT_PUBLIC_API_KEY: API key para autenticación
```

### 2. Manual Browser Testing

#### Test Contact Form

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000#contacto`
3. Fill out the form:
   - **Nombre Completo**: Test User
   - **Empresa**: Test Company (optional)
   - **Correo Electrónico**: test@example.com
   - **Teléfono**: +57 300 123 4567
   - **Tipo de Producto**: Select any option
   - **Cantidad Aproximada**: Select any option (optional)
   - **Mensaje**: Enter test message (min 10 chars)
4. Click "Enviar Mensaje"
5. Check results:
   - ✅ Loading spinner appears
   - ✅ Success message appears (green)
   - ✅ Form fields are cleared
   - ✅ No errors in console

#### Test Form Validation

1. Try submitting empty form
   - ✅ Required field errors appear
2. Enter invalid email
   - ✅ Email validation error appears
3. Enter short message (< 10 chars)
   - ✅ Minimum length error appears
4. Fill all fields correctly
   - ✅ Form submits successfully

#### Test Console Logs

Open DevTools Console (F12) and check for:

```javascript
// When submitting form
📤 Enviando formulario de contacto: {...}

// API layer (from api.ts)
🌐 API Request: { url, method, headers, body }
📡 API Response: { status, ok, ... }

// Success
✅ API Success Response: {...}
✅ Formulario enviado exitosamente

// Or errors
❌ API Error Response: {...}
❌ Error al enviar formulario: Error message
```

### 3. Test Responsive Design

Test on different screen sizes:

```bash
# In browser DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M)
# Test these breakpoints:
```

- **Mobile**: 375px (iPhone SE)
- **Tablet**: 768px (iPad)
- **Desktop**: 1280px (Laptop)
- **Large Desktop**: 1920px (Desktop)

Check:
- ✅ Layout adapts correctly
- ✅ Navigation menu works (mobile hamburger)
- ✅ Images load properly
- ✅ Text is readable
- ✅ Buttons are clickable
- ✅ Form is usable

### 4. Test Dark/Light Mode

1. Click theme toggle button in header
2. Verify:
   - ✅ Background colors change
   - ✅ Text colors change
   - ✅ Component colors change
   - ✅ Contrast is maintained
   - ✅ All sections look good in both modes

### 5. Test SEO

Check SEO elements:

```bash
# View page source (Ctrl+U)
# Check for:
```

- ✅ `<title>` tag
- ✅ `<meta name="description">` tag
- ✅ Open Graph tags (`og:*`)
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ Structured data (JSON-LD)

### 6. Test Performance

```bash
# In browser DevTools
# Lighthouse tab
# Run audit (Mobile/Desktop)
```

Check scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 95

---

## Building

### Create Production Build

```bash
npm run build
```

**Process**:
1. Compiles TypeScript
2. Optimizes React components
3. Bundles JavaScript/CSS
4. Exports static HTML
5. Optimizes images
6. Generates sitemap

**Expected Output**:
```
   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (X/X)
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB        XXX kB
└ ○ /404                                 XXX kB        XXX kB
+ First Load JS shared by all            XXX kB
  ├ chunks/XXX.js                        XXX kB
  └ other chunks...

Export successful. Files written to /out
```

### Verify Build

```bash
# Check that /out directory was created
ls out

# Expected files:
# - index.html
# - _next/ (static assets)
# - static/ (images, etc)
# - 404.html
# - sitemap.xml
# - robots.txt
# - manifest.json
```

### Test Production Build Locally

```bash
# Install a static server
npm install -g serve

# Serve the /out directory
serve out -p 3000
```

Navigate to `http://localhost:3000` and test:
- ✅ All pages load
- ✅ Contact form works
- ✅ Images load correctly
- ✅ Navigation works
- ✅ Theme toggle works
- ✅ No console errors

---

## Deployment

### Option 1: AWS S3 + CloudFront (Recommended)

#### Prerequisites
- AWS Account
- AWS CLI configured
- S3 bucket created
- CloudFront distribution (optional)

#### Deploy Using GitHub Actions (Automated)

1. **Set Up GitHub Secrets**:
   Go to: Repository → Settings → Secrets and variables → Actions
   
   Add these secrets:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   CF_DISTRIBUTION_ID=your_distribution_id (optional)
   NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api/v1
   NEXT_PUBLIC_API_KEY=your_production_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key (optional)
   ```

2. **Push to Master Branch**:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin master
   ```

3. **Monitor Deployment**:
   - Go to: Repository → Actions
   - Watch the workflow run
   - Check for success ✅

4. **Verify Deployment**:
   - Visit your S3 website URL or CloudFront domain
   - Test all functionality
   - Check browser console for errors

#### Manual Deploy to S3

```bash
# Build the project
npm run build

# Deploy to S3
aws s3 sync ./out s3://your-bucket-name --delete

# Invalidate CloudFront cache (if using)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

#### Configuration Files
- `.github/workflows/deploy-to-s3.yml` - GitHub Actions workflow
- `docs/aws-s3-deployment.md` - Detailed S3 setup guide
- `docs/s3-only-quick-start.md` - Quick start guide

### Option 2: Vercel (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Note**: Update `next.config.ts` to remove `output: 'export'` for Vercel.

### Option 3: Netlify (Alternative)

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Add environment variables
5. Deploy

### Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All pages are accessible
- [ ] Contact form submits successfully
- [ ] Images load properly
- [ ] No console errors
- [ ] SSL certificate is active (HTTPS)
- [ ] SEO meta tags are present
- [ ] Analytics tracking works (if configured)
- [ ] Performance is good (Lighthouse audit)
- [ ] Contact form emails are received
- [ ] Mobile version works correctly
- [ ] Dark/light mode works

---

## Troubleshooting

### Common Issues

#### Issue: `npm install` fails

**Solution 1**: Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Solution 2**: Check Node.js version
```bash
node --version  # Should be v18+
```

**Solution 3**: Use different registry
```bash
npm install --registry https://registry.npmjs.org/
```

#### Issue: Port 3000 already in use

**Solution**: Use a different port
```bash
npm run dev -- -p 3001
```

Or kill the process using port 3000:
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Issue: Environment variables not working

**Checklist**:
- [ ] `.env.local` file exists in root directory
- [ ] Variables start with `NEXT_PUBLIC_`
- [ ] No spaces around `=` sign
- [ ] Restart dev server after changes
- [ ] Check for typos in variable names

**Test**:
```bash
# Print environment variables
cat .env.local

# Restart server
npm run dev
```

#### Issue: Contact form not working

**Debug Steps**:

1. **Check Environment Variables**:
   ```bash
   node scripts/test-contact-api.js
   ```

2. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for error messages
   - Check Network tab for failed requests

3. **Check API Configuration**:
   ```typescript
   // In browser console
   console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
   console.log('API Key:', process.env.NEXT_PUBLIC_API_KEY?.substring(0, 10));
   ```

4. **Test API Independently**:
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -H "x-api-key: YOUR_API_KEY" \
     -d '{"full_name":"Test","email":"test@test.com","phone":"+57 300 123 4567","company":"","product_type":"Consulta General","quantity":"","message":"Test message"}' \
     https://your-api-url.com/api/v1/contact/
   ```

#### Issue: Build fails

**Common causes**:

1. **TypeScript errors**:
   ```bash
   npm run lint
   # Fix reported errors
   ```

2. **Missing dependencies**:
   ```bash
   npm install
   ```

3. **Environment variables**:
   - Add all required variables to build environment
   - Check GitHub Secrets (for automated builds)

#### Issue: Images not loading

**Check**:
- [ ] Images exist in `public/static/` directory
- [ ] File paths are correct (case-sensitive)
- [ ] File extensions match (`.jpg` vs `.jpeg`)
- [ ] Images are optimized (not too large)

**Test**:
```bash
# List images
ls -R public/static/

# Check file size
du -sh public/static/*
```

#### Issue: Dark mode not working

**Check**:
- [ ] ThemeContext is properly imported
- [ ] Theme toggle button is present
- [ ] LocalStorage is available
- [ ] No JavaScript errors in console

**Test in Console**:
```javascript
// Check current theme
localStorage.getItem('theme')

// Manually set theme
localStorage.setItem('theme', 'dark')
location.reload()
```

### Getting Help

1. **Check Documentation**:
   - `README.md` - Project overview
   - `prompts.md` - Development history
   - `docs/` - Detailed guides

2. **Check Logs**:
   ```bash
   # Development server logs
   npm run dev

   # Build logs
   npm run build
   ```

3. **Enable Verbose Logging**:
   ```typescript
   // In src/config/api.ts
   console.log('🌐 API Request:', { ... });
   console.log('📡 API Response:', { ... });
   ```

4. **GitHub Actions Logs**:
   - Go to: Repository → Actions
   - Click on failed workflow
   - Review step-by-step logs

---

## Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin master

# 2. Install any new dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Make changes
# ... edit files ...

# 5. Test changes
# - Check browser
# - Check console
# - Test on mobile

# 6. Commit changes
git add .
git commit -m "Description of changes"
git push origin master
```

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/feature-name

# 2. Make changes
# ... develop feature ...

# 3. Test thoroughly
npm run lint
npm run build
node scripts/test-contact-api.js

# 4. Commit and push
git add .
git commit -m "feat: Add feature description"
git push origin feature/feature-name

# 5. Create Pull Request
# ... on GitHub ...

# 6. Merge to master
# ... after review ...
```

### Hotfix Workflow

```bash
# 1. Create hotfix branch
git checkout -b hotfix/issue-description

# 2. Fix the issue
# ... make minimal changes ...

# 3. Test fix
npm run dev
npm run build

# 4. Deploy immediately
git commit -m "fix: Issue description"
git push origin hotfix/issue-description

# 5. Merge to master
# ... deploy to production ...
```

---

## Performance Optimization

### Image Optimization

```bash
# Install image optimization tool
npm install -g sharp-cli

# Optimize images
sharp -i public/static/**/*.{jpg,png} -o public/static/ -f webp
```

### Bundle Analysis

```bash
# Add bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

### Caching Strategy

S3/CloudFront caching (in GitHub workflow):
- Static assets: 1 year cache
- HTML files: No cache (always fresh)
- Images: 1 year cache

---

## Maintenance

### Regular Tasks

**Weekly**:
- [ ] Check for dependency updates
- [ ] Review error logs
- [ ] Test contact form
- [ ] Check site performance

**Monthly**:
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance audit
- [ ] Backup data

**Quarterly**:
- [ ] Review and update content
- [ ] SEO audit
- [ ] Accessibility audit
- [ ] User testing

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update to latest versions (careful!)
npx npm-check-updates -u
npm install

# Test after updates
npm run dev
npm run build
```

---

## Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

### Project Docs
- [`README.md`](./README.md) - Project overview
- [`prompts.md`](./prompts.md) - Development history
- [`docs/contact-api-integration.md`](./docs/contact-api-integration.md) - API guide
- [`docs/aws-s3-deployment.md`](./docs/aws-s3-deployment.md) - Deployment guide

### Tools
- [Next.js CLI](https://nextjs.org/docs/api-reference/cli)
- [AWS CLI](https://aws.amazon.com/cli/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## Support

For issues or questions:
1. Check this document first
2. Review error messages carefully
3. Check browser console logs
4. Review GitHub Actions logs
5. Test with `test-contact-api.js` script
6. Check environment variables
7. Verify API endpoint is working

