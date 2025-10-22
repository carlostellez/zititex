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
    console.log('📤 sendContactForm called with:', {
      full_name: formData.full_name,
      email: formData.email,
      product_type: formData.product_type,
    });
        
    const result = await apiRequest('/contact/', {
      method: 'POST',
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
    
    return {
      success: true,
      data: result,
      message: 'Contact form sent successfully'
    };
  } catch (error) {
    console.error('❌ Error in sendContactForm:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      message: 'Error sending contact form' 
    };
  }
} 