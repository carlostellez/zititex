# Development Prompts Documentation

This document contains all prompts and development decisions made during the Zititex project development.

## Table of Contents

1. [Project Setup](#project-setup)
2. [AWS S3 Deployment Configuration](#aws-s3-deployment-configuration)
3. [Future Prompts](#future-prompts)

---

## Project Setup

### Initial Project Structure

**Date**: Initial development phase

**Prompt Context**:
Setting up a modern Next.js 15 application for Zititex, a manufacturer of labels and tags for the textile industry.

**Key Requirements**:
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design
- SEO optimization
- Contact form integration
- Google Maps integration

**Decisions Made**:
1. **Framework Choice**: Next.js 15 for server-side rendering and static site generation
2. **Language**: TypeScript for better code quality and maintainability
3. **Styling**: Tailwind CSS for rapid UI development
4. **Architecture**: Clean Architecture with separation of concerns
5. **Component Structure**: Organized into layout, sections, ui, and seo folders

**Implementation Details**:
- Created modular component structure
- Separated data layer from presentation
- Implemented responsive design with mobile-first approach
- Added SEO configuration with sitemap and robots.txt

---

## AWS S3 Deployment Configuration

### Reviewing and Fixing S3 Deployment

**Date**: October 7, 2025

**Original Prompt** (Spanish):
```
revisemos el despligue en s3
```

**Translation**:
"Let's review the S3 deployment"

**Context**:
User requested a review of the AWS S3 deployment configuration. The project had an existing GitHub Actions workflow with several issues.

**Issues Identified**:

1. **Workflow Filename Error**:
   - **Problem**: File named `de[loy-to-s3.yml` (typo in filename)
   - **Impact**: Unprofessional, potential confusion
   - **Solution**: Renamed to `deploy-to-s3.yml`

2. **Incorrect Branch Name**:
   - **Problem**: Workflow configured to trigger on `amster` branch instead of `master`
   - **Impact**: Workflow never triggers on actual production branch
   - **Solution**: Changed trigger branch to `master`

3. **Missing Static Export Configuration**:
   - **Problem**: `next.config.ts` was empty, Next.js not configured for static export
   - **Impact**: Build would create server-side rendered app, not static files for S3
   - **Solution**: Added `output: 'export'` configuration

4. **Image Optimization Incompatibility**:
   - **Problem**: Default Next.js image optimization requires server
   - **Impact**: Build would fail or images wouldn't work in static export
   - **Solution**: Added `images: { unoptimized: true }` to config

5. **CloudFront Invalidation Disabled**:
   - **Problem**: CloudFront cache invalidation was commented out
   - **Impact**: Updated content wouldn't be visible immediately to users
   - **Solution**: Uncommented and properly configured CloudFront invalidation

6. **Missing Environment Variables in Build**:
   - **Problem**: Environment variables not passed to build step
   - **Impact**: Google Maps API key and other env vars wouldn't be available
   - **Solution**: Added env vars to build step in workflow

7. **Non-Optimized Cache Headers**:
   - **Problem**: Single cache-control header for all files
   - **Impact**: Either static assets cached too little or HTML cached too much
   - **Solution**: Implemented dual sync strategy with different cache headers

8. **Missing Node.js Cache**:
   - **Problem**: No npm caching in workflow
   - **Impact**: Slower CI/CD builds
   - **Solution**: Added `cache: 'npm'` to Node.js setup

**Technical Decisions**:

1. **Next.js Configuration** (`next.config.ts`):
   ```typescript
   {
     output: 'export',              // Enable static export
     images: { unoptimized: true }, // Disable server-side optimization
     trailingSlash: true            // Better S3 compatibility
   }
   ```

2. **Caching Strategy**:
   - **Static Assets** (JS, CSS, images): `max-age=31536000, immutable` (1 year)
     - Rationale: Content-hashed filenames ensure safe long-term caching
   - **HTML Files**: `max-age=0, must-revalidate` (always fresh)
     - Rationale: HTML contains references to hashed assets, needs instant updates
   - **manifest.json**: `max-age=0, must-revalidate`
     - Rationale: PWA manifest should always be current

3. **Deployment Pipeline** (`.github/workflows/deploy-to-s3.yml`):
   ```yaml
   Steps:
   1. Checkout code
   2. Setup Node.js 20 with npm caching
   3. Install dependencies (npm ci for clean install)
   4. Build with environment variables
   5. Deploy to S3 with optimized cache headers
   6. Invalidate CloudFront cache
   ```

4. **S3 Sync Strategy**:
   - First sync: Static assets with long cache headers
   - Second sync: HTML files with short cache headers
   - Rationale: AWS CLI doesn't support different cache headers per file type in single command

**Documentation Created**:

1. **AWS S3 Deployment Guide** (`docs/aws-s3-deployment.md`):
   - Complete deployment architecture explanation
   - Required GitHub Secrets documentation
   - AWS setup instructions (S3, CloudFront, IAM)
   - Manual deployment commands
   - Troubleshooting guide
   - Performance and cost optimization tips
   - Security best practices

2. **README.md**:
   - Complete project documentation
   - Architecture and design patterns explanation
   - Project structure breakdown
   - Getting started guide
   - Development workflow
   - API design documentation
   - Configuration reference
   - Performance targets

3. **run.md**:
   - Detailed step-by-step instructions to run project
   - Prerequisites with version requirements
   - Initial setup guide
   - Development environment setup
   - Production build instructions
   - Local testing options
   - Deployment procedures (automatic and manual)
   - Comprehensive troubleshooting section
   - Maintenance and update procedures

**Best Practices Applied**:

1. **Clean Architecture**:
   - Separation of concerns (components, data, config)
   - Single responsibility principle for each component
   - Dependency inversion with data layer abstraction

2. **SOLID Principles**:
   - Single Responsibility: Each component has one clear purpose
   - Open/Closed: Components extensible without modification
   - Liskov Substitution: Consistent component interfaces
   - Interface Segregation: Minimal, focused props
   - Dependency Inversion: Depend on abstractions, not implementations

3. **DevOps Best Practices**:
   - Infrastructure as Code (GitHub Actions workflow)
   - Automated deployment pipeline
   - Environment variable management
   - Cache optimization strategy
   - Monitoring and troubleshooting documentation

4. **Documentation Standards**:
   - Clear, comprehensive English documentation
   - Step-by-step instructions with examples
   - Troubleshooting guides with solutions
   - Code examples with explanations
   - Visual structure diagrams

5. **Security Considerations**:
   - Secrets managed via GitHub Secrets
   - IAM roles with minimal required permissions
   - HTTPS-only delivery via CloudFront
   - Environment variables not committed to repo

**Performance Optimizations**:

1. **Build Performance**:
   - npm caching in GitHub Actions
   - Clean install (npm ci) for reproducibility
   - Parallel asset processing

2. **Runtime Performance**:
   - Static site generation (no server required)
   - Long-term caching for immutable assets
   - CDN delivery via CloudFront
   - Optimized cache headers

3. **SEO Optimization**:
   - Server-side rendering during build
   - Semantic HTML structure
   - Sitemap and robots.txt generation
   - Meta tags and Open Graph support

**Testing Strategy**:

1. **Local Testing**:
   - Development server with hot reload
   - Build verification locally
   - Multiple serving options documented (Python, serve, http-server)

2. **Deployment Testing**:
   - GitHub Actions workflow logs
   - CloudFront invalidation verification
   - Production environment testing checklist

**Cost Optimization**:

1. **S3 Costs**:
   - Static files only (no compute)
   - Delete old files with `--delete` flag
   - Efficient sync (only changed files)

2. **CloudFront Costs**:
   - Reduced S3 data transfer with CDN
   - Optimized cache hit ratio
   - Single wildcard invalidation per deployment

**Monitoring and Maintenance**:

1. **Deployment Monitoring**:
   - GitHub Actions workflow status
   - AWS CloudWatch for S3 and CloudFront metrics
   - CloudFront cache hit ratio monitoring

2. **Maintenance Procedures**:
   - Dependency update strategy
   - Build artifact cleanup
   - AWS credential rotation schedule

**Future Improvements**:

Potential enhancements identified during this review:

1. **Performance**:
   - Consider adding service worker for offline support
   - Implement bundle size monitoring
   - Add performance budgets to CI

2. **Security**:
   - Add Content Security Policy headers
   - Implement Subresource Integrity (SRI)
   - Add security headers via CloudFront Functions

3. **Monitoring**:
   - Add error tracking (e.g., Sentry)
   - Implement real-user monitoring (RUM)
   - Add uptime monitoring

4. **CI/CD**:
   - Add staging environment
   - Implement preview deployments for PRs
   - Add automated testing (unit, integration, e2e)

5. **Documentation**:
   - Add component documentation with Storybook
   - Create API documentation
   - Add architecture diagrams

---

## Future Prompts

This section will be updated with each new development prompt and the decisions made.

### Template for New Prompts

When adding new prompts, use this template:

```markdown
### [Feature/Task Name]

**Date**: [Date]

**Original Prompt**:
```
[Original prompt text]
```

**Context**:
[Background and context for the prompt]

**Issues/Requirements Identified**:
1. Issue 1
2. Issue 2
...

**Technical Decisions**:
1. Decision 1 with rationale
2. Decision 2 with rationale
...

**Implementation Details**:
[Key implementation details]

**Documentation Created/Updated**:
[List of documentation changes]

**Best Practices Applied**:
[Which best practices were followed]

**Testing Performed**:
[How the changes were tested]

**Future Improvements**:
[Potential enhancements for future]
```

---

## Prompt Categories

### Architecture & Design
- Clean Architecture implementation
- SOLID principles application
- Design pattern selection

### Deployment & DevOps
- AWS S3 and CloudFront configuration
- CI/CD pipeline setup
- Environment management

### Features & Functionality
- Component development
- API integration
- User interface implementation

### Documentation
- Technical documentation
- User guides
- Code comments and JSDoc

### Testing & Quality
- Test coverage strategies
- Linting and code quality
- Performance optimization

### Security
- Authentication and authorization
- Data protection
- Security best practices

---

**Maintenance Notes**:
- Keep this document updated with each significant development decision
- Include both successes and lessons learned
- Document rationale for technical decisions
- Link to related documentation files

**Last Updated**: October 7, 2025

