/**
 * Contact API Configuration
 * 
 * Handles contact form submissions and related functionality
 */

import { apiRequest, API_CONFIG } from './api';

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
export async function sendContactForm(formData: ContactFormData) {  
  try {
    return await apiRequest('/contact/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.API_KEY,
      },
      body: JSON.stringify({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        product_type: formData.product_type.trim(),
        quantity: formData.quantity.trim(),
        message: formData.message.trim(),
      }),
    });    
  } catch (error) {
    console.error('Error sending contact form:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      message: 'Error sending contact form' 
    };
  }
} 