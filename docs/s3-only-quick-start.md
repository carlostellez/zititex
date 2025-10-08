# S3 Only Quick Start Guide

This guide will help you deploy the Zititex website to AWS S3 in under 10 minutes, without CloudFront.

## When to Use S3 Only

✅ **Good for:**
- Development/staging environments
- Quick testing
- Internal company sites
- Budget-conscious deployments

⚠️ **Limitations:**
- HTTP only (no HTTPS)
- Slower global performance (no CDN)
- No custom domain HTTPS support

For production, we recommend adding CloudFront later for HTTPS and better performance.

## Prerequisites

- AWS Account
- AWS CLI installed (`aws --version`)
- Project built locally (`npm run build`)

## Step-by-Step Setup

### 1. Create S3 Bucket

```bash
# Replace 'zititex-website' with your unique bucket name
aws s3 mb s3://zititex-website --region us-east-1
```

### 2. Enable Static Website Hosting

```bash
aws s3 website s3://zititex-website \
  --index-document index.html \
  --error-document 404.html
```

### 3. Configure Bucket Policy for Public Access

Create a file named `bucket-policy.json`:

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

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket zititex-website \
  --policy file://bucket-policy.json
```

### 4. Disable Block Public Access

```bash
aws s3api put-public-access-block \
  --bucket zititex-website \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 5. Create IAM User for Deployment

#### Create IAM User

```bash
aws iam create-user --user-name zititex-deploy
```

#### Create Access Key

```bash
aws iam create-access-key --user-name zititex-deploy
```

**Save the output!** You'll need `AccessKeyId` and `SecretAccessKey`.

#### Attach Policy

Create a file named `deploy-user-policy.json`:

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
    }
  ]
}
```

Apply the policy:

```bash
aws iam put-user-policy \
  --user-name zititex-deploy \
  --policy-name S3DeploymentPolicy \
  --policy-document file://deploy-user-policy.json
```

### 6. Configure GitHub Secrets

Go to your GitHub repository:
1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `S3_BUCKET_NAME` | `zititex-website` (your bucket name) |
| `AWS_ACCESS_KEY_ID` | Your IAM user access key ID |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user secret access key |
| `AWS_REGION` | `us-east-1` (or your chosen region) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API key |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Your Web3Forms access key |

**Do NOT add** `CF_DISTRIBUTION_ID` - leave it empty.

### 7. Test the Deployment

Push to master branch:

```bash
git add .
git commit -m "Configure S3-only deployment"
git push origin master
```

GitHub Actions will automatically:
1. Build the project
2. Deploy to S3
3. Skip CloudFront (since it's not configured)

### 8. Get Your Website URL

Your website will be available at:
```
http://zititex-website.s3-website-us-east-1.amazonaws.com
```

Format: `http://[bucket-name].s3-website-[region].amazonaws.com`

## Verify Deployment

### Check if files are uploaded

```bash
aws s3 ls s3://zititex-website/ --recursive --human-readable --summarize
```

### Test the website

```bash
curl -I http://zititex-website.s3-website-us-east-1.amazonaws.com
```

You should see `HTTP/1.1 200 OK`

## Manual Deployment (Optional)

If you want to deploy manually instead of using GitHub Actions:

```bash
# Build the project
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
```

## Troubleshooting

### Website shows 403 Forbidden

**Problem**: Bucket policy not applied correctly.

**Solution**:
```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket zititex-website

# Reapply policy
aws s3api put-bucket-policy \
  --bucket zititex-website \
  --policy file://bucket-policy.json
```

### Website shows 404 Not Found

**Problem**: Static website hosting not enabled.

**Solution**:
```bash
aws s3 website s3://zititex-website \
  --index-document index.html \
  --error-document 404.html
```

### GitHub Actions deployment fails

**Problem**: IAM credentials incorrect or permissions missing.

**Solution**:
1. Verify secrets are set correctly in GitHub
2. Test credentials locally:
   ```bash
   export AWS_ACCESS_KEY_ID=your_key
   export AWS_SECRET_ACCESS_KEY=your_secret
   aws s3 ls s3://zititex-website
   ```

### Can't access website from browser

**Problem**: Public access blocked.

**Solution**:
```bash
# Check public access settings
aws s3api get-public-access-block --bucket zititex-website

# Disable if needed
aws s3api delete-public-access-block --bucket zititex-website
```

## Next Steps: Adding CloudFront (Optional)

Once your site is working with S3, you can add CloudFront for:
- HTTPS support
- Better global performance
- Custom domain support
- Enhanced security

See the full [AWS S3 Deployment Guide](./aws-s3-deployment.md) for CloudFront setup instructions.

## Cost Estimation

**S3 Only Costs** (approximate):
- Storage: $0.023/GB/month (first 50 TB)
- Requests: $0.005 per 1,000 GET requests
- Data Transfer: $0.09/GB (first 10 TB)

**Example for small website** (1GB storage, 10,000 requests/month):
- Storage: ~$0.02/month
- Requests: ~$0.05/month
- Data Transfer (1GB): ~$0.09/month
- **Total: ~$0.16/month**

Very affordable for small to medium traffic websites!

## Security Notes

⚠️ **Important**: This setup makes your website publicly accessible (which is intended for a public website).

However, note:
- No HTTPS (data transmitted in plain text)
- No DDoS protection (use CloudFront for this)
- No WAF (Web Application Firewall)

For production sites with sensitive data or high traffic, use CloudFront.

## Summary

You now have:
- ✅ Static website hosted on S3
- ✅ Automated deployment via GitHub Actions
- ✅ Public access configured
- ✅ Cost-effective hosting solution

Your website is live at: `http://[bucket-name].s3-website-[region].amazonaws.com`

To add HTTPS and better performance, proceed with CloudFront setup.

---

**Questions?** Check the main [AWS S3 Deployment Guide](./aws-s3-deployment.md) for more details.

