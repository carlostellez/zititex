# Contact API Integration Guide

## Overview

This document explains the contact form API integration in the Zititex application. The contact form sends customer inquiries to a backend API for processing.

## Architecture

### Components Structure

```
src/
├── components/
│   ├── sections/
│   │   └── Contact.tsx          # Main contact section component
│   └── ui/
│       └── ContactForm.tsx      # Reusable contact form component
├── config/
│   ├── api.ts                   # Core API configuration
│   └── api-contact.ts           # Contact-specific API functions
└── data/
    └── contactData.tsx          # Contact form fields and configuration
```

### Data Flow

```
User Input → ContactForm.tsx → sendContactForm() → Backend API → Response
                                      ↓
                              Validation & Error Handling
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Backend API Configuration (REQUIRED for contact form)
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api/v1
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### API Endpoint

The contact form submits data to:
- **Endpoint**: `POST {NEXT_PUBLIC_API_BASE_URL}/contact/`
- **Authentication**: API Key via `x-api-key` header

## Request Format

### Request Headers

```json
{
  "Content-Type": "application/json",
  "x-api-key": "YOUR_API_KEY"
}
```

### Request Body

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+57 300 123 4567",
  "company": "Example Corp",
  "product_type": "Etiquetas de Composición",
  "quantity": "1,000 - 5,000 unidades",
  "message": "I'm interested in ordering custom labels..."
}
```

### Field Specifications

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `full_name` | string | Yes | 2-100 characters |
| `email` | string | Yes | Valid email format |
| `phone` | string | Yes | 10+ characters, phone format |
| `company` | string | No | Max 100 characters |
| `product_type` | string | Yes | One of predefined options |
| `quantity` | string | No | One of predefined options |
| `message` | string | Yes | 10-1000 characters |

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "contact_123456",
    "created_at": "2025-10-21T10:30:00Z",
    "status": "received"
  },
  "message": "Contact form sent successfully"
}
```

### Error Response (4xx/5xx)

```json
{
  "success": false,
  "error": "Error message here",
  "message": "Error sending contact form"
}
```

## Implementation Details

### API Configuration (`src/config/api.ts`)

The core API configuration provides:
- Environment variable handling (compatible with static deployment)
- Centralized API request function
- Comprehensive logging and error handling
- Support for both server-side and client-side requests

Key features:
```typescript
export const API_CONFIG = {
  BASE_URL: getStaticEnvVar('NEXT_PUBLIC_API_BASE_URL', ''),
  API_KEY: getStaticEnvVar('NEXT_PUBLIC_API_KEY', ''),
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T>
```

### Contact API (`src/config/api-contact.ts`)

Specialized contact form submission:

```typescript
export interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  product_type: string;
  quantity: string;
  message: string;
}

export async function sendContactForm(formData: ContactFormData)
```

### Contact Form Component (`src/components/ui/ContactForm.tsx`)

Features:
- **Real-time validation**: Validates each field as user types
- **Form state management**: Handles loading, success, and error states
- **Error display**: Shows field-specific validation errors
- **Accessibility**: Proper labels, ARIA attributes, keyboard navigation
- **Theme support**: Light/dark mode compatible
- **Responsive design**: Mobile-first approach

Validation rules:
- Required fields marked with `*`
- Minimum/maximum length checks
- Email format validation
- Phone number format validation
- Real-time error clearing on user input

## Testing

### 1. Automated Testing

Run the test script to verify API connectivity:

```bash
node scripts/test-contact-api.js
```

This script will:
- ✅ Load environment variables from `.env.local`
- ✅ Validate API configuration
- ✅ Send test data to the API
- ✅ Display detailed response information
- ✅ Report success or failure with diagnostics

### 2. Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000#contacto`

3. Fill out the form with test data:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Phone**: +57 300 123 4567
   - **Company**: Test Company
   - **Product Type**: Consulta General
   - **Quantity**: 100 - 500 unidades
   - **Message**: This is a test message

4. Submit the form and check:
   - Form shows loading state (spinner)
   - Success message appears on successful submission
   - Form fields are cleared after success
   - Error message appears if submission fails
   - Browser console shows detailed logs

### 3. Browser Console Debugging

The implementation includes comprehensive logging:

```javascript
// Sending request
console.log('📤 Enviando formulario de contacto:', data);

// API request details
console.log('🌐 API Request:', { url, method, headers, body });

// API response
console.log('📡 API Response:', { status, statusText, ok });

// Success
console.log('✅ Formulario enviado exitosamente');

// Errors
console.error('❌ Error al enviar formulario:', error);
```

## Error Handling

### Client-Side Validation

Performed before API call:
- Required fields check
- Format validation (email, phone)
- Length constraints
- Pattern matching

### API Error Handling

```typescript
try {
  const result = await sendContactForm(contactFormData);
  
  if (result.success) {
    // Show success message
    setSubmitStatus('success');
    // Clear form
  } else {
    // Show error message
    throw new Error(result.message);
  }
} catch (error) {
  console.error('❌ Error:', error);
  setSubmitStatus('error');
}
```

### User-Facing Error Messages

Configured in `src/data/contactData.tsx`:

```typescript
export const contactConfig = {
  successMessage: "¡Gracias por contactarnos! Te responderemos en las próximas 24 horas.",
  errorMessage: "Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente o contáctanos directamente.",
};
```

## Security Considerations

### API Key Protection

- ✅ API key stored in environment variables
- ✅ Never commit `.env.local` to version control
- ✅ Use different keys for development/production
- ⚠️ API key is exposed to client (use rate limiting on backend)

### Recommendations for Backend

1. **Rate Limiting**: Implement per-IP rate limits
2. **CORS**: Configure proper CORS headers
3. **Validation**: Validate all fields on backend
4. **Sanitization**: Sanitize user input to prevent XSS/injection
5. **Spam Protection**: Consider reCAPTCHA or similar
6. **API Key Rotation**: Rotate keys periodically
7. **Monitoring**: Log all requests for security auditing

## Troubleshooting

### Common Issues

#### Issue: "API key not configured"

**Solution**: Check `.env.local` exists and contains valid values:
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
NEXT_PUBLIC_API_KEY=your_actual_key
```

#### Issue: "Server returned HTML instead of JSON"

**Causes**:
- Incorrect API URL
- Endpoint doesn't exist (404)
- Server error (500)

**Solution**: 
1. Verify API URL is correct
2. Check endpoint path (should end with `/contact/`)
3. Test API independently with curl/Postman

#### Issue: CORS errors in browser console

**Solution**: Configure backend to allow your domain:
```javascript
// Example Express.js configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
```

#### Issue: Form submits but shows error

**Check**:
1. Backend is returning proper JSON response
2. Response includes `success: true` field
3. HTTP status code is 200
4. Check backend logs for errors

### Debug Checklist

- [ ] Environment variables are set correctly
- [ ] API endpoint URL is correct (with trailing slash)
- [ ] API key is valid and not expired
- [ ] Backend API is online and accessible
- [ ] CORS is configured on backend
- [ ] Backend accepts JSON content type
- [ ] Backend requires `x-api-key` header
- [ ] Response format matches expected structure
- [ ] Browser console shows detailed logs
- [ ] Network tab shows the request/response

## Production Deployment

### Environment Variables Setup

For S3 + CloudFront deployment, set environment variables in GitHub Secrets:

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Add secrets:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_API_KEY`

### Build Process

During build, Next.js will replace `process.env.NEXT_PUBLIC_*` with actual values:

```bash
npm run build  # Creates static export in ./out directory
```

### Verification

After deployment:
1. Test contact form on production site
2. Verify API calls in browser Network tab
3. Check backend logs for incoming requests
4. Confirm email notifications (if configured)

## Monitoring and Analytics

### Recommended Tracking

1. **Form Submissions**: Track successful submissions
2. **Validation Errors**: Monitor common validation failures
3. **API Errors**: Alert on high error rates
4. **Response Times**: Monitor API performance
5. **User Journey**: Track form interaction patterns

### Implementation Example

```typescript
// In ContactForm.tsx
if (result.success) {
  // Track successful submission
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'contact_form_submit', {
      event_category: 'engagement',
      event_label: contactFormData.product_type,
    });
  }
}
```

## Future Enhancements

- [ ] Add reCAPTCHA for spam protection
- [ ] Implement file upload for design references
- [ ] Add WhatsApp direct integration
- [ ] Email confirmation to user
- [ ] Multi-step form for complex quotes
- [ ] Form abandonment tracking
- [ ] A/B testing for conversion optimization
- [ ] Webhook notifications to Slack/Discord

## Related Documentation

- [Contact Module Guide](./contact-module-guide.md)
- [AWS S3 Deployment](./aws-s3-deployment.md)
- [API Configuration](../src/config/api.ts)
- [Contact Data Configuration](../src/data/contactData.tsx)

## Support

For issues or questions:
- Check browser console for errors
- Run test script: `node scripts/test-contact-api.js`
- Review backend API logs
- Verify environment variables
- Test API endpoint independently

