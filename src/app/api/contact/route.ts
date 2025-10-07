import { NextRequest, NextResponse } from 'next/server';

// Interface para los datos del formulario
interface ContactFormData {
  name: string;
  company?: string;
  email: string;
  phone: string;
  productType: string;
  quantity?: string;
  message: string;
  timestamp: string;
  source: string;
}

// Validación de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de teléfono
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Sanitizar datos de entrada
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Función para enviar email (simulada - aquí integrarías con tu servicio de email)
const sendEmail = async (data: ContactFormData): Promise<boolean> => {
  try {
    // Aquí integrarías con tu servicio de email preferido:
    // - SendGrid
    // - Nodemailer
    // - AWS SES
    // - Resend
    // - etc.
    
    console.log('📧 Nuevo mensaje de contacto recibido:');
    console.log('-----------------------------------');
    console.log(`Nombre: ${data.name}`);
    console.log(`Empresa: ${data.company || 'No especificada'}`);
    console.log(`Email: ${data.email}`);
    console.log(`Teléfono: ${data.phone}`);
    console.log(`Tipo de Producto: ${data.productType}`);
    console.log(`Cantidad: ${data.quantity || 'No especificada'}`);
    console.log(`Mensaje: ${data.message}`);
    console.log(`Fecha: ${data.timestamp}`);
    console.log('-----------------------------------');

    // Simular envío exitoso
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
};

// Función para guardar en base de datos (simulada)
const saveToDatabase = async (data: ContactFormData): Promise<boolean> => {
  try {
    // Aquí integrarías con tu base de datos:
    // - PostgreSQL
    // - MongoDB
    // - MySQL
    // - Supabase
    // - Firebase
    // - etc.
    
    console.log('💾 Guardando contacto en base de datos...');
    
    // Simular guardado exitoso
    return true;
  } catch (error) {
    console.error('Error guardando en base de datos:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    // Parsear datos del request
    const body = await request.json();
    
    // Validar campos requeridos
    const requiredFields = ['name', 'email', 'phone', 'productType', 'message'];
    const missingFields = requiredFields.filter(field => !body[field] || !body[field].trim());
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos faltantes',
          missingFields 
        },
        { status: 400 }
      );
    }

    // Sanitizar y validar datos
    const contactData: ContactFormData = {
      name: sanitizeInput(body.name),
      company: body.company ? sanitizeInput(body.company) : undefined,
      email: sanitizeInput(body.email).toLowerCase(),
      phone: sanitizeInput(body.phone),
      productType: sanitizeInput(body.productType),
      quantity: body.quantity ? sanitizeInput(body.quantity) : undefined,
      message: sanitizeInput(body.message),
      timestamp: body.timestamp || new Date().toISOString(),
      source: body.source || 'website_contact_form'
    };

    // Validaciones específicas
    if (!isValidEmail(contactData.email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email no válido' 
        },
        { status: 400 }
      );
    }

    if (!isValidPhone(contactData.phone)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Teléfono no válido' 
        },
        { status: 400 }
      );
    }

    if (contactData.name.length < 2 || contactData.name.length > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El nombre debe tener entre 2 y 100 caracteres' 
        },
        { status: 400 }
      );
    }

    if (contactData.message.length < 10 || contactData.message.length > 1000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El mensaje debe tener entre 10 y 1000 caracteres' 
        },
        { status: 400 }
      );
    }

    // Procesar el formulario
    const [emailSent, dataSaved] = await Promise.all([
      sendEmail(contactData),
      saveToDatabase(contactData)
    ]);

    if (!emailSent && !dataSaved) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error interno del servidor' 
        },
        { status: 500 }
      );
    }

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: 'Mensaje enviado correctamente',
        data: {
          id: `contact_${Date.now()}`,
          timestamp: contactData.timestamp,
          status: 'received'
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en API de contacto:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// Manejar métodos no permitidos
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Método no permitido' 
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Método no permitido' 
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Método no permitido' 
    },
    { status: 405 }
  );
}
