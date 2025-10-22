'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { contactData, contactConfig } from '@/data/contactData';
import type { ContactFormField } from '@/data/contactData';
import { sendContactForm, type ContactFormData } from '@/config/api-contact';

interface FormData {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className = '' }: ContactFormProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Usar tema de forma segura para evitar errores de hidratación
  let theme = 'light';

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
  } catch {
    // Si no hay contexto disponible, usar tema por defecto
  }

  useEffect(() => {
    setMounted(true);
    // Inicializar formData con valores vacíos
    const initialData: FormData = {};
    contactData.formFields.forEach(field => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
  }, []);

  // Validar campo individual
  const validateField = (field: ContactFormField, value: string): string => {
    if (field.required && !value.trim()) {
      return `${field.label} es requerido`;
    }

    if (field.validation) {
      const { minLength, maxLength, pattern } = field.validation;

      if (minLength && value.length < minLength) {
        return `${field.label} debe tener al menos ${minLength} caracteres`;
      }

      if (maxLength && value.length > maxLength) {
        return `${field.label} no puede tener más de ${maxLength} caracteres`;
      }

      if (pattern && !new RegExp(pattern).test(value)) {
        if (field.type === 'email') {
          return 'Por favor ingresa un email válido';
        }
        if (field.type === 'tel') {
          return 'Por favor ingresa un teléfono válido';
        }
        return `${field.label} no tiene el formato correcto`;
      }
    }

    return '';
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: ContactFormField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field.name]: value
    }));

    // Limpiar error si existe
    if (errors[field.name]) {
      setErrors(prev => ({
        ...prev,
        [field.name]: ''
      }));
    }
  };

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    contactData.formFields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Preparar datos del formulario para el API
      const contactFormData: ContactFormData = {
        full_name: formData.full_name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        company: formData.company || '',
        product_type: formData.product_type || '',
        quantity: formData.quantity || '',
        message: formData.message || '',
      };

      console.log('📤 Enviando formulario de contacto:', contactFormData);

      // Enviar a la API
      const result = await sendContactForm(contactFormData);

      console.log('📥 Resultado del envío:', result);

      if (result.success) {
        setSubmitStatus('success');
        // Limpiar formulario
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          company: '',
          product_type: '',
          quantity: '',
          message: '',
        });
        setErrors({message: result.message});
      }
    } catch (error) {
      setErrors({message: error instanceof Error ? error.message : String(error)});
    }
  };

  // Renderizar campo del formulario
  const renderField = (field: ContactFormField) => {
    const hasError = !!errors[field.name];
    const fieldValue = formData[field.name] || '';

    const baseInputClasses = `w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
      mounted && theme === 'light'
        ? `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
            hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
          }`
        : `bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-800 ${
            hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-800' : ''
          }`
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onKeyDown={(e) => {
              // Permitir espacio explícitamente
              if (e.key === ' ') {
                e.stopPropagation();
              }
            }}
            placeholder={field.placeholder}
            required={field.required}
            rows={5}
            className={`${baseInputClasses} resize-vertical`}
            autoComplete="off"
          />
        );

      case 'select':
        return (
          <select
            id={field.id}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            required={field.required}
            className={baseInputClasses}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={field.type}
            id={field.id}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onKeyDown={(e) => {
              // Permitir espacio explícitamente
              if (e.key === ' ') {
                e.stopPropagation();
              }
            }}
            placeholder={field.placeholder}
            required={field.required}
            className={baseInputClasses}
            autoComplete="off"
          />
        );
    }
  };

  return (
    <div className={`${className}`}>
      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-800 dark:text-green-200 font-medium">
              {contactConfig.successMessage}
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 dark:text-red-200 font-medium">
              {contactConfig.errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {contactData.formFields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className={`block text-sm font-medium mb-2 ${
                mounted && theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {renderField(field)}
            
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-70 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800'
            } text-white shadow-lg hover:shadow-xl`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Enviando...</span>
              </div>
            ) : (
              'Enviar Mensaje'
            )}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className={`text-xs leading-relaxed ${
          mounted && theme === 'light' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p>
            Al enviar este formulario, aceptas que Zititex use tu información para responder a tu consulta. 
            No compartimos tu información con terceros y respetamos tu privacidad.
          </p>
        </div>
      </form>
    </div>
  );
}
