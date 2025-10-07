# Módulo de Contacto - Guía de Implementación

## Descripción General

El módulo de contacto de Zititex es una solución completa que incluye:
- Formulario de contacto con validación avanzada
- Información de contacto y horarios de atención
- Mapa interactivo de Google Maps
- API endpoint para procesamiento de formularios
- Integración con servicios de email y bases de datos

## Estructura de Archivos

```
src/
├── data/
│   └── contactData.tsx              # Datos de contacto y configuración
├── components/
│   ├── ui/
│   │   ├── ContactForm.tsx          # Formulario de contacto
│   │   └── GoogleMap.tsx            # Componente de Google Maps
│   └── sections/
│       └── Contact.tsx              # Sección completa de contacto
└── app/
    └── api/
        └── contact/
            └── route.ts             # API endpoint para formularios
```

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Google Maps API Key (requerido para el mapa)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SendGrid (alternativa)
SENDGRID_API_KEY=your_sendgrid_api_key

# Database (opcional)
DATABASE_URL=postgresql://user:password@localhost:5432/zititex
```

### 2. Google Maps API

Para obtener tu API key:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps JavaScript API
   - Places API (opcional)
4. Crea credenciales (API Key)
5. Configura restricciones de dominio para seguridad

## Componentes

### ContactForm

Formulario inteligente con:
- **Validación en tiempo real**
- **Campos dinámicos** basados en `contactData.formFields`
- **Estados de envío** (loading, success, error)
- **Sanitización de datos**
- **Soporte para temas** (light/dark)

#### Campos Disponibles:
- Nombre (requerido)
- Empresa (opcional)
- Email (requerido, validado)
- Teléfono (requerido, validado)
- Tipo de Producto (select)
- Cantidad Aproximada (select)
- Mensaje (requerido, textarea)

### GoogleMap

Mapa interactivo con:
- **Marcador personalizado** con icono de Zititex
- **Ventana de información** con datos de la empresa
- **Estilos adaptativos** (light/dark theme)
- **Fallback** si Google Maps no carga
- **Enlaces directos** a Google Maps y direcciones

### Contact Section

Sección completa que incluye:
- **Header** con título y descripción
- **Grid responsivo** (formulario + información)
- **Tarjetas de contacto** con iconos y enlaces
- **Horarios de atención** con estado actual
- **Información de ubicación**
- **Mapa integrado**
- **CTA adicional** para WhatsApp

## API Endpoint

### POST /api/contact

Procesa formularios de contacto con:

#### Request Body:
```json
{
  "name": "Juan Pérez",
  "company": "Mi Empresa",
  "email": "juan@empresa.com",
  "phone": "+57 300 123 4567",
  "productType": "Etiquetas de Composición",
  "quantity": "1,000 - 5,000 unidades",
  "message": "Necesito cotización para etiquetas...",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "website_contact_form"
}
```

#### Response (Success):
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "data": {
    "id": "contact_1705312200000",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "status": "received"
  }
}
```

#### Response (Error):
```json
{
  "success": false,
  "error": "Email no válido",
  "missingFields": ["email"]
}
```

### Validaciones Implementadas:

- **Campos requeridos**: name, email, phone, productType, message
- **Email**: Formato válido con regex
- **Teléfono**: Formato internacional con regex
- **Longitud**: Nombre (2-100), Mensaje (10-1000)
- **Sanitización**: Eliminación de caracteres peligrosos

## Datos de Contacto

### Estructura en `contactData.tsx`:

```typescript
export const contactData: ContactSection = {
  title: "Contáctanos",
  subtitle: "Estamos aquí para ayudarte...",
  description: "Descripción completa...",
  
  contactInfo: [
    {
      id: "phone",
      icon: <PhoneIcon />,
      label: "Teléfono Principal",
      value: "+57 (1) 234-5678",
      href: "tel:+5712345678",
      description: "Lunes a Viernes: 8:00 AM - 6:00 PM"
    },
    // ... más información de contacto
  ],
  
  businessHours: [
    { day: "Lunes", hours: "8:00 AM - 6:00 PM", isOpen: true },
    // ... más horarios
  ],
  
  location: {
    name: "Zititex - Planta de Producción",
    address: "Calle 127 #15-45, Zona Industrial",
    city: "Bogotá",
    country: "Colombia",
    coordinates: { lat: 4.7110, lng: -74.0721 },
    description: "Descripción de la ubicación..."
  },
  
  formFields: [
    {
      id: "name",
      name: "name",
      label: "Nombre Completo",
      type: "text",
      required: true,
      validation: { minLength: 2, maxLength: 100 }
    },
    // ... más campos
  ]
};
```

## Personalización

### Modificar Información de Contacto

Edita `src/data/contactData.tsx`:

```typescript
contactInfo: [
  {
    id: "custom-contact",
    icon: <YourIcon />,
    label: "Tu Etiqueta",
    value: "Tu Valor",
    href: "tu-enlace",
    description: "Tu descripción"
  }
]
```

### Agregar Campos al Formulario

```typescript
formFields: [
  {
    id: "new-field",
    name: "newField",
    label: "Nuevo Campo",
    type: "text", // text, email, tel, textarea, select
    placeholder: "Placeholder...",
    required: true,
    options: ["Opción 1", "Opción 2"], // solo para select
    validation: {
      minLength: 5,
      maxLength: 50,
      pattern: "^[A-Za-z]+$"
    }
  }
]
```

### Personalizar Estilos del Mapa

En `GoogleMap.tsx`, modifica `getDarkMapStyles()` para cambiar la apariencia del mapa en modo oscuro.

## Integraciones

### Email Services

#### SendGrid:
```typescript
// En route.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendEmail = async (data: ContactFormData) => {
  const msg = {
    to: 'ventas@zititex.com',
    from: 'noreply@zititex.com',
    subject: `Nuevo contacto: ${data.name}`,
    html: generateEmailTemplate(data)
  };
  
  await sgMail.send(msg);
};
```

#### Nodemailer:
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### Database Integration

#### PostgreSQL con Prisma:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const saveToDatabase = async (data: ContactFormData) => {
  await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      // ... más campos
    }
  });
};
```

## Seguridad

### Medidas Implementadas:

1. **Sanitización de entrada**: Eliminación de caracteres peligrosos
2. **Validación estricta**: Regex para email y teléfono
3. **Rate limiting**: Implementar en producción
4. **CORS**: Configurar dominios permitidos
5. **API Key restrictions**: Limitar Google Maps API por dominio

### Recomendaciones Adicionales:

```typescript
// Implementar rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5 // máximo 5 requests por IP
});

// Validar CAPTCHA
import { verifyCaptcha } from './captcha';

if (!await verifyCaptcha(captchaToken)) {
  return NextResponse.json({ error: 'CAPTCHA inválido' }, { status: 400 });
}
```

## Testing

### Formulario:
- Validación de campos requeridos
- Formatos de email y teléfono
- Límites de caracteres
- Estados de envío

### API:
- Requests válidos e inválidos
- Manejo de errores
- Sanitización de datos
- Respuestas correctas

### Mapa:
- Carga con y sin API key
- Fallback cuando falla
- Responsive design
- Temas light/dark

## Troubleshooting

### Problemas Comunes:

1. **Mapa no carga**:
   - Verificar API key en `.env.local`
   - Confirmar APIs habilitadas en Google Cloud
   - Revisar restricciones de dominio

2. **Formulario no envía**:
   - Verificar endpoint `/api/contact`
   - Revisar validaciones en cliente y servidor
   - Comprobar logs de consola

3. **Emails no llegan**:
   - Configurar servicio de email
   - Verificar credenciales SMTP
   - Revisar carpeta de spam

4. **Errores de hidratación**:
   - Usar `mounted` state en componentes con tema
   - Evitar diferencias entre SSR y cliente

## Performance

### Optimizaciones Implementadas:

- **Lazy loading** de Google Maps
- **Throttling** de eventos de scroll
- **Validación debounced** en formularios
- **Compresión de imágenes** en marcadores
- **Code splitting** automático de Next.js

### Métricas Esperadas:

- **First Load JS**: ~131 kB
- **Contact API**: ~123 B
- **Lighthouse Score**: 90+ en todas las categorías

## Deployment

### Variables de Entorno en Producción:

```bash
# Vercel
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
vercel env add SENDGRID_API_KEY

# Netlify
netlify env:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY your_key

# Railway
railway variables set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

### Configuración de Dominio:

1. Actualizar restricciones de Google Maps API
2. Configurar CORS en API endpoints
3. Verificar dominios en servicios de email
4. Actualizar URLs en `contactData.tsx`

---

## Soporte

Para soporte técnico o preguntas sobre la implementación:
- Revisar logs de consola del navegador
- Verificar Network tab para requests fallidos
- Consultar documentación de Google Maps API
- Revisar configuración de servicios de email
