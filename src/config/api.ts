/**
 * Base API Configuration
 * 
 * Core configuration and request function for external APIs
 * Compatible with S3 + CloudFront (static content)
 */

// Helper function to get environment variables from static file
function getStaticEnvVar(key: string, fallback: string = ''): string {
  // In development, read directly from process.env
  if (process.env.NODE_ENV === 'development') {
    const value = process.env[key];
    if (value) {
      console.log(`✅ Loaded ${key}:`, value.substring(0, 30) + '...');
      return value;
    }
  }
  
  // Try to get from window.ENV (static file - production)
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  
  // Fallback to process.env (for development)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  console.warn(`⚠️  Variable ${key} not found, using fallback:`, fallback);
  return fallback;
}

// Helper function to check if API is configured
function isApiConfigured(): boolean {
  const apiUrl = getStaticEnvVar('NEXT_PUBLIC_API_BASE_URL');
  const apiKey = getStaticEnvVar('NEXT_PUBLIC_API_KEY');
  
  return !!(apiUrl && apiKey && 
           !apiUrl.includes('your_') && !apiUrl.includes('tu_') &&
           !apiKey.includes('your_') && !apiKey.includes('tu_'));
}

export const API_CONFIG = {
  // Base URL for external API
  BASE_URL: getStaticEnvVar('NEXT_PUBLIC_API_BASE_URL', ''),
  API_KEY: getStaticEnvVar('NEXT_PUBLIC_API_KEY', ''),
} as const;

// Debug log in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API_CONFIG initialized:', {
    BASE_URL: API_CONFIG.BASE_URL ? API_CONFIG.BASE_URL.substring(0, 50) + '...' : '❌ EMPTY',
    API_KEY: API_CONFIG.API_KEY ? '✅ Configured' : '❌ EMPTY',
    NODE_ENV: process.env.NODE_ENV
  });
}

/**
 * Core API request function
 * 
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns Promise with the response
 */
export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_CONFIG.API_KEY,
      ...options.headers
    },
    ...options
  };
  
  // Ensure API key is present
  const headers = config.headers as Record<string, string>;
  if (!headers?.['x-api-key']) {
    config.headers = {
      ...config.headers,
      'x-api-key': API_CONFIG.API_KEY
    };
  }
  
  console.log('🌐 API Request:', {
    url,
    method: config.method || 'POST',
    headers: config.headers,
    body: config.body ? JSON.parse(config.body as string) : undefined,
    apiKeyConfigured: !!API_CONFIG.API_KEY,
    apiKeyLength: API_CONFIG.API_KEY?.length || 0,
    baseUrl: API_CONFIG.BASE_URL
  });
  
  try {
    const response = await fetch(url, config);
    
    console.log('📡 API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    // First, get the response text
    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('❌ JSON Parse Error:', jsonError);
      console.error('❌ Response was not JSON. Received:', responseText.substring(0, 500) + '...');
      
      if (responseText.includes('<!DOCTYPE')) {
        throw new Error('Server returned HTML instead of JSON - check API endpoint');
      } else {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
      }
    }
    
    if (!response.ok) {
      console.error('❌ API Error Response:', data);
      throw new Error(data.message || data.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    console.log('✅ API Success Response:', data);
    return data;
  } catch (error) {
    console.error('❌ API Request Error:', {
      url,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      errorType: typeof error,
      errorConstructor: error?.constructor?.name
    });
    throw error;
  }
}
