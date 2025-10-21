/**
 * Contact API Configuration
 * 
 * Handles contact form submissions and related functionality
 */

import { apiRequest } from './api';
import { API_CONFIG } from './api';

/**
 * Contact form data interface
 */
export interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  product_type: string;
  quantity: string;
  message: string;
}

/**
 * Send contact form data
 * 
 * @param formData - Contact form data
 * @returns Promise with the response
 */
export async function sendContactForm(
  formData: ContactFormData
  ) {  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': API_CONFIG.API_KEY,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}/contact/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      success: true,
      data,
      message: 'Contact form sent successfully'
    };
  } catch (error) {
    console.error('Error sending contact form:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      message: 'Error sending contact form' 
    };
  }
} 