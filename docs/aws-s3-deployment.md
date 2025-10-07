# AWS S3 Deployment Guide

## Overview

This document describes the deployment pipeline for the Zititex Next.js application to AWS S3 with CloudFront CDN distribution.

## Architecture

The deployment uses:
- **AWS S3**: Static website hosting
- **AWS CloudFront**: CDN for global content delivery
- **GitHub Actions**: Automated CI/CD pipeline

## Configuration

### Next.js Configuration

The application is configured for static export in `next.config.ts`:

```typescript
{
  output: 'export',           // Generate static HTML/CSS/JS files
  images: { unoptimized: true }, // Disable Next.js image optimization
  trailingSlash: true          // Add trailing slashes for S3 compatibility
}
```

### GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy-to-s3.yml`) triggers on push to the `master` branch and performs the following steps:

1. **Checkout code**: Get the latest code from the repository
2. **Setup Node.js**: Install Node.js 20 with npm caching
3. **Install dependencies**: Run `npm ci` for clean install
4. **Build and export**: Generate static files with environment variables
5. **Deploy to S3**: Sync files to S3 bucket with optimized caching
6. **Invalidate CloudFront**: Clear CDN cache to serve fresh content

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `S3_BUCKET_NAME` | Name of your S3 bucket | `zititex-website` |
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for S3 bucket | `us-east-1` |
| `CF_DISTRIBUTION_ID` | CloudFront distribution ID | `E1234567890ABC` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSyB...` |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Web3Forms access key | `abc123-def456-...` |

## AWS Setup

### 1. Create S3 Bucket

```bash
# Create S3 bucket
aws s3 mb s3://zititex-website --region us-east-1

# Enable static website hosting
aws s3 website s3://zititex-website --index-document index.html --error-document 404.html
```

### 2. Configure S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::zititex-website/*"
    }
  ]
}
```

### 3. Create CloudFront Distribution

1. Create a CloudFront distribution with:
   - **Origin Domain**: Your S3 bucket website endpoint (not the bucket name)
   - **Default Root Object**: `index.html`
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Compress Objects Automatically**: Yes

2. Configure custom error responses:
   - **404**: `/404/index.html` (response code 404)
   - **403**: `/index.html` (response code 200) - for client-side routing

### 4. Create IAM User

Create an IAM user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::zititex-website"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::zititex-website/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "arn:aws:cloudfront::*:distribution/*"
    }
  ]
}
```

## Caching Strategy

The deployment uses optimized cache headers:

- **Static assets** (CSS, JS, images): `max-age=31536000, immutable` (1 year)
- **HTML files**: `max-age=0, must-revalidate` (always check for updates)
- **manifest.json**: `max-age=0, must-revalidate` (always check for updates)

This ensures:
- Fast loading for returning visitors
- Instant updates when content changes
- Efficient CDN usage

## Manual Deployment

If you need to deploy manually:

```bash
# Build the application
npm run build

# Deploy to S3
aws s3 sync ./out s3://zititex-website \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "*.html" \
  --exclude "manifest.json"

aws s3 sync ./out s3://zititex-website \
  --delete \
  --cache-control "public,max-age=0,must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "manifest.json" \
  --content-type "text/html; charset=utf-8"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## Troubleshooting

### Issue: 404 errors on page refresh

**Solution**: Configure CloudFront custom error responses to redirect 404 to `/index.html` with a 200 response code.

### Issue: Old content still showing after deployment

**Solution**: Verify CloudFront invalidation completed successfully. Check the CloudFront console.

### Issue: Build fails with environment variable errors

**Solution**: Ensure all required secrets are configured in GitHub Actions settings.

### Issue: S3 sync fails with permissions error

**Solution**: Verify IAM user has correct permissions and credentials are valid.

## Performance Optimization

1. **CloudFront**: Content delivered from edge locations worldwide
2. **Gzip Compression**: CloudFront automatically compresses content
3. **HTTP/2**: CloudFront supports HTTP/2 for faster loading
4. **Cache Headers**: Optimized for best performance and update speed

## Cost Optimization

- Use CloudFront for reduced S3 data transfer costs
- Enable S3 lifecycle policies to delete old deployments
- Monitor CloudFront usage and optimize cache hit ratio

## Security Best Practices

1. Use HTTPS only (CloudFront enforces this)
2. Rotate AWS credentials regularly
3. Use IAM roles with minimal required permissions
4. Enable CloudFront access logging
5. Configure S3 bucket versioning for backup

## Monitoring

Monitor your deployment using:
- **AWS CloudWatch**: Track S3 and CloudFront metrics
- **CloudFront Reports**: Analyze cache hit ratio and popular content
- **S3 Access Logs**: Track all bucket access

## Related Documentation

- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

