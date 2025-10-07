# How to Run Zititex Project

This document provides detailed instructions for running the Zititex application in different environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Environment](#development-environment)
4. [Production Build](#production-build)
5. [Testing the Build Locally](#testing-the-build-locally)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before running the project, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (version 20.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version  # Should output v20.x.x or higher
     ```

2. **npm** (version 10.x or higher)
   - Comes with Node.js
   - Verify installation:
     ```bash
     npm --version  # Should output 10.x.x or higher
     ```

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

### Optional Software

4. **AWS CLI** (for manual deployments)
   - Installation: https://aws.amazon.com/cli/
   - Verify installation:
     ```bash
     aws --version
     ```

## Initial Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/zititex.git

# Navigate to project directory
cd zititex
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

This command will:
- Read `package.json`
- Download all required packages to `node_modules/`
- Create/update `package-lock.json`
- Take approximately 1-2 minutes

### Step 3: Configure Environment Variables

1. **Copy the example environment file**:
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local` with your values**:
   ```bash
   # Use your preferred editor (nano, vim, code, etc.)
   nano .env.local
   ```

3. **Required variables**:
   ```env
   # Google Maps API Key (Required)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key

   # Web3Forms Access Key (Required for contact form)
   NEXT_PUBLIC_WEB3FORMS_KEY=your_actual_web3forms_access_key

   # Environment
   NODE_ENV=development
   ```

4. **Obtaining API Keys**:

   **Google Maps API Key**:
   - Visit: https://console.cloud.google.com/apis/credentials
   - Create a new project or select existing
   - Enable "Maps JavaScript API"
   - Create credentials (API Key)
   - Copy the API key and paste it in `.env.local`

   **Web3Forms Access Key** (free, no credit card required):
   - Visit: https://web3forms.com
   - Enter your email address where you want to receive form submissions
   - Check your email and copy the Access Key
   - Paste it in `.env.local`
   - No signup or account creation required!

## Development Environment

### Running the Development Server

```bash
# Start development server
npm run dev
```

**What happens**:
- Next.js development server starts on port 3000
- Turbopack is used for fast hot module replacement (HMR)
- TypeScript type checking runs in background
- Changes to files automatically reload the browser

**Access the application**:
- Open your browser and navigate to: http://localhost:3000

**Features available in development mode**:
- Hot reload (instant updates on file save)
- Detailed error messages
- React Developer Tools support
- Source maps for debugging

### Development Commands

```bash
# Start development server (default)
npm run dev

# Run ESLint to check code quality
npm run lint

# Fix auto-fixable linting issues
npm run lint -- --fix
```

### Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Make changes to files** in:
   - `src/components/` - React components
   - `src/app/` - Pages and routes
   - `src/data/` - Data files
   - `public/static/` - Static assets

3. **View changes** in the browser (http://localhost:3000)
   - Changes appear automatically
   - Check browser console for errors

4. **Check for linting errors**:
   ```bash
   npm run lint
   ```

5. **Stop the server**:
   - Press `Ctrl + C` in the terminal

## Production Build

### Building for Production

```bash
# Create production build
npm run build
```

**What happens**:
1. Next.js compiles TypeScript to JavaScript
2. Optimizes all code for production
3. Generates static HTML, CSS, and JS files
4. Creates the `out/` directory with all static files
5. Build process takes approximately 1-2 minutes

**Output**:
```
zititex/
└── out/                    # Generated static files
    ├── index.html         # Home page
    ├── _next/             # Next.js optimized assets
    │   ├── static/        # Static JS and CSS bundles
    │   └── ...
    ├── static/            # Your static assets (copied)
    └── ...
```

### Build Output Details

The `out/` directory contains:
- **HTML files**: Pre-rendered pages
- **JavaScript bundles**: Optimized and minified
- **CSS files**: Purged and minified
- **Static assets**: Images, fonts, etc.
- **Manifest**: PWA manifest.json

### Build Verification

After building, verify the output:

```bash
# Check build directory exists
ls -la out/

# Check build size
du -sh out/

# List all generated HTML files
find out -name "*.html"
```

## Testing the Build Locally

### Option 1: Using Python (Easiest)

```bash
# Navigate to build directory
cd out

# Start a simple HTTP server (Python 3)
python3 -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000
```

Access at: http://localhost:8000

### Option 2: Using npx serve

```bash
# Install and run serve (from project root)
npx serve out -p 8000
```

Access at: http://localhost:8000

### Option 3: Using Node.js http-server

```bash
# Install globally
npm install -g http-server

# Serve the build
http-server out -p 8000
```

Access at: http://localhost:8000

### Testing Checklist

After serving the build locally, test:

- [ ] Home page loads correctly
- [ ] All images display properly
- [ ] Navigation menu works
- [ ] Contact form submits successfully
- [ ] Google Maps loads and displays location
- [ ] WhatsApp button functions
- [ ] All product images load
- [ ] Page is responsive on different screen sizes
- [ ] No console errors in browser developer tools

## Deployment

### Automatic Deployment (Recommended)

The project uses GitHub Actions for automatic deployment to AWS S3.

**How it works**:

1. **Push to master branch**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```

2. **GitHub Actions workflow triggers automatically**:
   - Workflow file: `.github/workflows/deploy-to-s3.yml`
   - Build process runs
   - Files sync to S3
   - CloudFront cache invalidates

3. **Monitor deployment**:
   - Go to GitHub repository
   - Click "Actions" tab
   - View workflow progress
   - Deployment takes ~2-3 minutes

**Prerequisites**:
- GitHub repository secrets configured (see README.md)
- AWS S3 bucket created
- CloudFront distribution configured

### Manual Deployment

If you need to deploy manually:

#### Step 1: Build the project

```bash
npm run build
```

#### Step 2: Configure AWS CLI

```bash
# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)
```

#### Step 3: Sync to S3

```bash
# Sync build to S3 bucket
aws s3 sync ./out s3://your-bucket-name \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html" \
  --exclude "manifest.json"

# Sync HTML files with different cache headers
aws s3 sync ./out s3://your-bucket-name \
  --delete \
  --cache-control "public,max-age=0,must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "manifest.json" \
  --content-type "text/html; charset=utf-8"
```

#### Step 4: Invalidate CloudFront Cache

```bash
# Create CloudFront invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Verify deployment**:
- Visit your CloudFront URL or custom domain
- Check that changes are live
- Test all functionality

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port 3000 Already in Use

**Error**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or run on a different port
npm run dev -- -p 3001
```

#### Issue 2: Module Not Found Errors

**Error**:
```
Module not found: Can't resolve 'module-name'
```

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Issue 3: Google Maps Not Loading

**Error**:
Map doesn't display or shows error message

**Solution**:
```bash
# 1. Check if API key is set
cat .env.local | grep GOOGLE_MAPS

# 2. Verify the key is valid in Google Cloud Console

# 3. Ensure Maps JavaScript API is enabled

# 4. Restart development server
npm run dev
```

#### Issue 6: Contact Form Not Working

**Error**:
Form shows error message when submitting

**Solution**:
```bash
# 1. Check if Web3Forms key is set
cat .env.local | grep WEB3FORMS

# 2. Verify the key is valid
# Visit https://web3forms.com and check your email for the key

# 3. Restart development server
npm run dev

# 4. Test form submission
# Check browser console for any errors
```

#### Issue 4: Build Fails

**Error**:
```
Error: Build failed
```

**Solution**:
```bash
# 1. Check for TypeScript errors
npm run lint

# 2. Clear cache and rebuild
rm -rf .next out
npm run build

# 3. Check Node.js version
node --version  # Should be 20.x or higher

# 4. Update dependencies
npm update
```

#### Issue 5: Images Not Loading

**Error**:
Images show broken icon or 404 error

**Solution**:
1. **Check image path** (must use `/static/` prefix):
   ```tsx
   // Correct
   <img src="/static/products/image.jpg" />
   
   // Incorrect
   <img src="/products/image.jpg" />
   ```

2. **Verify image exists** in `public/static/` directory

3. **Check file name** (case-sensitive on Linux/S3)

#### Issue 6: Environment Variables Not Working

**Error**:
Environment variables are undefined

**Solution**:
1. **Restart development server** after changing `.env.local`
2. **Use correct prefix** for client-side variables:
   ```env
   # Correct (accessible in browser)
   NEXT_PUBLIC_API_KEY=abc123
   
   # Incorrect (only available server-side)
   API_KEY=abc123
   ```

### Getting Help

If you encounter issues not covered here:

1. **Check documentation**:
   - README.md
   - docs/aws-s3-deployment.md
   - docs/contact-module-guide.md

2. **Search existing issues** on GitHub repository

3. **Create a new issue** with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

4. **Contact development team**

## Performance Tips

### Optimizing Development Experience

```bash
# Use faster package manager (optional)
npm install -g pnpm
pnpm install
pnpm dev

# Enable caching for faster rebuilds
export NEXT_TELEMETRY_DISABLED=1
```

### Monitoring Build Performance

```bash
# Analyze bundle size
npm run build

# The build output shows:
# - Route sizes
# - First load JS shared by all
# - Individual page sizes
```

## Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all packages to latest versions
npm update

# Update specific package
npm update package-name

# Update Next.js specifically
npm install next@latest react@latest react-dom@latest
```

### Cleaning Up

```bash
# Remove build artifacts
rm -rf .next out

# Remove dependencies
rm -rf node_modules

# Full clean install
rm -rf node_modules package-lock.json .next out
npm install
```

---

**Last Updated**: October 2025
**Maintained By**: Zititex Development Team

