# Development Prompts History

This document tracks all major prompts and development decisions made during the Zititex project development.

## Table of Contents
- [Initial Setup](#initial-setup)
- [Contact Form Integration](#contact-form-integration)
- [CI/CD Configuration](#cicd-configuration)

---

## Initial Setup

### Project Initialization
**Date**: Initial development phase  
**Context**: Setting up the Next.js application for Zititex textile products

**Prompt**:
```
Create a modern Next.js application for a textile manufacturing company (Zititex) 
that produces labels, tags, and textile accessories. Include:
- Responsive design with dark/light mode
- Product catalog section
- Contact form
- SEO optimization
- Static export capability for S3/CloudFront deployment
```

**Implementation Details**:
- Used Next.js 14+ with App Router
- Implemented Tailwind CSS for styling
- Created modular component structure
- Set up TypeScript for type safety
- Configured for static site generation

**Key Files Created**:
- `src/app/layout.tsx` - Main application layout
- `src/app/page.tsx` - Home page
- `src/components/` - Reusable components
- `tailwind.config.ts` - Tailwind configuration

---

## Contact Form Integration

### Phase 1: Initial Web3Forms Implementation
**Date**: Early development phase  
**Context**: Implementing contact form with third-party service

**Prompt**:
```
Implement a contact form for the Zititex website using Web3Forms service.
The form should collect:
- Full name
- Company (optional)
- Email
- Phone
- Product type (select dropdown)
- Quantity estimate
- Message
Include validation, error handling, and success/error messages.
```

**Implementation**:
- Created `ContactForm.tsx` component
- Integrated Web3Forms API
- Added real-time validation
- Implemented loading states
- Added success/error messaging

**Files Modified**:
- `src/components/ui/ContactForm.tsx`
- `src/data/contactData.tsx`
- `env.example` (added Web3Forms key)

### Phase 2: Backend API Integration (Current)
**Date**: 2025-10-21  
**Context**: Migrating from Web3Forms to custom backend API

**Prompt** (Spanish):
```
vamos a agregar el llamado del api a components/sections/@Contact.tsx 
y verificar que se envie la informacion
```

**Translation**:
```
Let's add the API call to components/sections/@Contact.tsx 
and verify that the information is sent
```

**Requirements**:
1. Replace Web3Forms integration with custom backend API
2. Use existing API configuration in `src/config/api-contact.ts`
3. Maintain all existing form validation and UX
4. Add comprehensive logging for debugging
5. Create testing tools to verify API connectivity

**Implementation Steps**:

1. **Updated ContactForm Component**
   - Imported `sendContactForm` function from `api-contact.ts`
   - Replaced Web3Forms API call with backend API call
   - Maintained existing validation logic
   - Added detailed console logging for debugging
   - Kept all UI/UX elements intact

2. **Cleaned Up Contact Section**
   - Removed unused state variables from `Contact.tsx`
   - Removed duplicate imports
   - Simplified component structure
   - Kept display components (ContactInfoCard, BusinessHoursCard, LocationCard)

3. **Updated Environment Configuration**
   - Added `NEXT_PUBLIC_API_BASE_URL` to `env.example`
   - Added `NEXT_PUBLIC_API_KEY` to `env.example`
   - Marked Web3Forms as deprecated (kept as fallback)
   - Added configuration examples and documentation

4. **Created Testing Tools**
   - Created `scripts/test-contact-api.js` for automated API testing
   - Script features:
     - Loads environment variables from `.env.local`
     - Validates API configuration
     - Sends test contact form data
     - Displays detailed response information
     - Provides troubleshooting guidance

5. **Created Comprehensive Documentation**
   - Created `docs/contact-api-integration.md`
   - Documented architecture and data flow
   - Included request/response formats
   - Added troubleshooting guide
   - Provided testing instructions
   - Added security considerations

**Files Modified**:
```
src/components/ui/ContactForm.tsx
  - Added: import sendContactForm from api-contact
  - Added: ContactFormData interface import
  - Modified: handleSubmit function to use backend API
  - Added: Comprehensive logging

src/components/sections/Contact.tsx
  - Removed: Unused state variables (formData, errors, submitStatus, submitMessage)
  - Removed: Unused imports (sendContactForm, ContactFormData interface)
  - Simplified: Component structure

env.example
  - Added: NEXT_PUBLIC_API_BASE_URL
  - Added: NEXT_PUBLIC_API_KEY
  - Updated: Comments and documentation
```

**Files Created**:
```
scripts/test-contact-api.js
  - Purpose: Automated API testing script
  - Features: Environment loading, validation, test data submission

docs/contact-api-integration.md
  - Complete API integration documentation
  - Architecture overview
  - Testing guide
  - Troubleshooting section
```

**Technical Decisions**:

1. **Why modify ContactForm instead of Contact**:
   - ContactForm already handles all form logic
   - Cleaner separation of concerns
   - ContactForm is reusable across the application
   - Maintains single responsibility principle

2. **API Configuration Structure**:
   ```typescript
   // Core API layer (api.ts)
   - Environment variable handling
   - Generic apiRequest function
   - Logging and error handling
   
   // Contact-specific layer (api-contact.ts)
   - ContactFormData interface
   - sendContactForm function
   - Contact-specific error handling
   ```

3. **Error Handling Strategy**:
   - Client-side validation before API call
   - Try-catch blocks for network errors
   - Success/error state management
   - User-friendly error messages
   - Detailed console logging for debugging

4. **Logging Strategy**:
   ```typescript
   // Request logging
   console.log('📤 Enviando formulario de contacto:', data);
   
   // API layer logging (in api.ts)
   console.log('🌐 API Request:', { url, method, headers });
   console.log('📡 API Response:', { status, ok });
   
   // Success/error logging
   console.log('✅ Formulario enviado exitosamente');
   console.error('❌ Error al enviar formulario:', error);
   ```

**Testing Approach**:

1. **Automated Testing**:
   ```bash
   node scripts/test-contact-api.js
   ```
   - Tests API connectivity
   - Validates environment setup
   - Sends test data
   - Reports detailed results

2. **Manual Testing**:
   - Browser-based form submission
   - Console log inspection
   - Network tab analysis
   - Error scenario testing

3. **Validation Testing**:
   - Required field validation
   - Email format validation
   - Phone format validation
   - Length constraints
   - Real-time error display

**Expected API Contract**:
```typescript
// Request
POST {BASE_URL}/contact/
Headers: {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
}
Body: ContactFormData

// Success Response (200)
{
  success: true,
  data: { ... },
  message: "Contact form sent successfully"
}

// Error Response (4xx/5xx)
{
  success: false,
  error: "Error message",
  message: "Error sending contact form"
}
```

**Benefits of This Implementation**:
- ✅ Full control over data handling
- ✅ Integration with custom backend
- ✅ Enhanced security and validation
- ✅ Better error tracking and logging
- ✅ Scalable architecture
- ✅ Easy to maintain and test
- ✅ Comprehensive documentation
- ✅ Automated testing capability

**Future Enhancements Identified**:
- Add reCAPTCHA for spam protection
- Implement file upload for design references
- Add form analytics tracking
- Multi-step form for complex quotes
- Email confirmation to users
- Webhook notifications

---

## CI/CD Configuration

### GitHub Actions Workflow Fix
**Date**: 2025-10-21  
**Context**: Fixing GitHub Actions workflow syntax error

**Issue**:
```
Line 52: Unrecognized named-value: 'secrets'
Located in expression: secrets.CF_DISTRIBUTION_ID != '' && env.NODE_ENV == 'production'
```

**Prompt** (Spanish):
```
(Line: 52, Col: 11): Unrecognized named-value: 'secrets'. 
Located at position 1 within expression: 
secrets.CF_DISTRIBUTION_ID != '' && env.NODE_ENV == 'production'
```

**Root Cause**:
GitHub Actions does not allow direct access to `secrets` context in conditional expressions (`if:` statements) for security reasons.

**Solution Implemented**:
1. Simplified `if:` condition to check branch only
2. Moved secret validation into bash script
3. Added AWS credentials to CloudFront step environment

**Changes Made**:
```yaml
# Before (INCORRECT)
- name: Invalidate CloudFront cache
  if: ${{ secrets.CF_DISTRIBUTION_ID != '' && env.NODE_ENV == 'production' }}
  run: |
    ...
  env:
    NODE_ENV: ${{ env.NODE_ENV }}

# After (CORRECT)
- name: Invalidate CloudFront cache
  if: ${{ github.ref == 'refs/heads/master' }}
  run: |
    if [ -n "${{ secrets.CF_DISTRIBUTION_ID }}" ]; then
      echo "Invalidating CloudFront distribution"
      aws cloudfront create-invalidation \
        --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} \
        --paths "/*"
    else
      echo "CloudFront distribution ID not configured. Skipping."
    fi
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: ${{ secrets.AWS_REGION }}
```

**Technical Explanation**:
- GitHub Actions restricts `secrets` access in `if:` expressions
- Secret values cannot be used in conditional logic directly
- Workaround: Use bash conditional `[ -n "${{ secrets.VALUE }}" ]`
- The `if:` only checks the branch reference
- Actual secret validation happens inside the script

**Files Modified**:
- `.github/workflows/deploy-to-s3.yml`

---

## Design Patterns Used

### 1. Separation of Concerns
- **Components**: Presentation logic
- **Config**: API configuration and utilities
- **Data**: Static data and content
- **Types**: TypeScript interfaces and types

### 2. Single Responsibility Principle
Each component/function has one clear purpose:
- `ContactForm`: Form UI and validation
- `sendContactForm`: API communication
- `apiRequest`: Generic HTTP requests
- `contactData`: Form configuration

### 3. Dependency Injection
```typescript
// ContactForm doesn't know about API details
// It uses the injected sendContactForm function
import { sendContactForm } from '@/config/api-contact';
```

### 4. Error Boundaries
```typescript
try {
  const result = await sendContactForm(data);
  if (result.success) {
    // Handle success
  } else {
    throw new Error(result.message);
  }
} catch (error) {
  // Handle error
  console.error('Error:', error);
}
```

### 5. Configuration Pattern
```typescript
// Centralized configuration
export const API_CONFIG = {
  BASE_URL: getStaticEnvVar('NEXT_PUBLIC_API_BASE_URL', ''),
  API_KEY: getStaticEnvVar('NEXT_PUBLIC_API_KEY', ''),
};
```

### 6. Factory Pattern
```typescript
// Generic API request factory
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T>
```

---

## Clean Architecture Principles

### Layers

```
┌─────────────────────────────────────┐
│   Presentation Layer                │
│   (Components, UI)                  │
│   - ContactForm.tsx                 │
│   - Contact.tsx                     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Business Logic Layer              │
│   (Validation, State Management)    │
│   - Form validation functions       │
│   - State handlers                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Data Access Layer                 │
│   (API calls, External services)    │
│   - sendContactForm()               │
│   - apiRequest()                    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   External Services                 │
│   - Backend REST API                │
└─────────────────────────────────────┘
```

### Dependency Rule
- Outer layers depend on inner layers
- Inner layers have no knowledge of outer layers
- Data flows from outer to inner layers

---

## SOLID Principles Applied

### Single Responsibility
- `ContactForm`: Handles form UI only
- `sendContactForm`: Handles API communication only
- `apiRequest`: Handles HTTP requests only

### Open/Closed
- `apiRequest` is open for extension (can add interceptors, middleware)
- Closed for modification (core logic stays stable)

### Liskov Substitution
- Could swap `sendContactForm` with any function matching the interface
- Easy to create mock implementations for testing

### Interface Segregation
```typescript
// Specific interfaces for different needs
interface ContactFormData { ... }
interface ContactFormField { ... }
interface FormErrors { ... }
```

### Dependency Inversion
- Components depend on abstractions (functions, interfaces)
- Not on concrete implementations (specific API services)

---

## Testing Strategy

### 1. Component Testing (Future)
```typescript
describe('ContactForm', () => {
  it('validates required fields', () => { ... });
  it('shows error messages', () => { ... });
  it('calls API on submit', () => { ... });
});
```

### 2. Integration Testing
- Use `test-contact-api.js` script
- Tests real API connectivity
- Validates request/response flow

### 3. Manual Testing
- Browser-based testing
- Console log inspection
- Network tab analysis

### 4. E2E Testing (Future)
- Playwright/Cypress tests
- User journey testing
- Form submission flows

---

## Documentation Standards

All major features include:
1. **Code Comments**: Inline documentation
2. **TypeScript Types**: Full type safety
3. **README Updates**: User-facing documentation
4. **Technical Docs**: Architecture and implementation details
5. **Testing Docs**: How to test and verify
6. **Troubleshooting**: Common issues and solutions

---

## Next Steps

### Immediate
- [ ] Set up backend API endpoint
- [ ] Configure production environment variables
- [ ] Test API integration in development
- [ ] Deploy to staging environment

### Short Term
- [ ] Add form analytics
- [ ] Implement reCAPTCHA
- [ ] Add automated tests
- [ ] Performance optimization

### Long Term
- [ ] Multi-language support
- [ ] Advanced form features
- [ ] A/B testing
- [ ] Conversion optimization

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Web3Forms](https://web3forms.com) (deprecated)

