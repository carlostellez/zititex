/**
 * Base API Configuration
 * 
 * Core configuration and request function for external APIs
 * Compatible with S3 + CloudFront (static content)
 */

// Get API configuration directly from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// Debug logs
console.log('🔍 Environment Variables Check:', {
  'process.env.NEXT_PUBLIC_API_BASE_URL': process.env.NEXT_PUBLIC_API_BASE_URL ? 'FOUND' : '❌ MISSING',
  'process.env.NEXT_PUBLIC_API_KEY': process.env.NEXT_PUBLIC_API_KEY ? 'FOUND' : '❌ MISSING',
  'process.env.NODE_ENV': process.env.NODE_ENV,
});

export const API_CONFIG = {
  BASE_URL,
  API_KEY,
} as const;

// Debug log
console.log('🔧 API_CONFIG initialized:', {
  BASE_URL: API_CONFIG.BASE_URL ? API_CONFIG.BASE_URL.substring(0, 50) + '...' : '❌ EMPTY',
  API_KEY: API_CONFIG.API_KEY ? '✅ ' + API_CONFIG.API_KEY.substring(0, 10) + '...' : '❌ EMPTY',
  NODE_ENV: process.env.NODE_ENV,
  'Full BASE_URL': API_CONFIG.BASE_URL,
});

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
