/**
 * Script de prueba para el API de contacto
 * 
 * Este script verifica que el endpoint de contacto esté funcionando correctamente
 * 
 * Uso:
 *   node scripts/test-contact-api.js
 * 
 * Variables de entorno requeridas:
 *   NEXT_PUBLIC_API_BASE_URL - URL base del API
 *   NEXT_PUBLIC_API_KEY - API key para autenticación
 */

// Cargar variables de entorno desde .env.local si existe
const fs = require('fs');
const path = require('path');

// Función para cargar .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  Archivo .env.local no encontrado');
    console.warn('📝 Usando variables de entorno del sistema');
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key && value) {
        process.env[key] = value;
      }
    }
  });

  console.log('✅ Variables de entorno cargadas desde .env.local');
}

// Cargar variables de entorno
loadEnvFile();

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

// Validar configuración
if (!API_BASE_URL || !API_KEY) {
  console.error('❌ Error: Variables de entorno no configuradas');
  console.error('');
  console.error('Por favor configura las siguientes variables:');
  console.error('  - NEXT_PUBLIC_API_BASE_URL: URL base del API');
  console.error('  - NEXT_PUBLIC_API_KEY: API key para autenticación');
  console.error('');
  console.error('Puedes copiar .env.example a .env.local y configurar los valores');
  process.exit(1);
}

// Datos de prueba
const testData = {
  full_name: 'Test Usuario',
  email: 'test@example.com',
  phone: '+57 300 123 4567',
  company: 'Test Company',
  product_type: 'Consulta General',
  quantity: '100 - 500 unidades',
  message: 'Este es un mensaje de prueba del sistema de contacto de Zititex.',
};

console.log('');
console.log('🧪 Iniciando prueba del API de contacto');
console.log('================================================');
console.log('');
console.log('📋 Configuración:');
console.log(`   Base URL: ${API_BASE_URL}`);
console.log(`   API Key: ${API_KEY.substring(0, 10)}...`);
console.log('');
console.log('📤 Datos de prueba:');
console.log(JSON.stringify(testData, null, 2));
console.log('');

// Realizar la petición
async function testContactAPI() {
  try {
    const url = `${API_BASE_URL}/contact/`;
    
    console.log(`🌐 Enviando petición a: ${url}`);
    console.log('');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(testData),
    });

    console.log(`📡 Respuesta del servidor:`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));
    console.log('');

    // Intentar leer la respuesta
    const contentType = response.headers.get('content-type');
    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      console.warn('⚠️  Respuesta no es JSON');
      console.log('Respuesta recibida:');
      console.log(text.substring(0, 500));
      console.log('');
      
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        console.error('❌ El servidor devolvió HTML en lugar de JSON');
        console.error('   Esto puede indicar:');
        console.error('   - URL incorrecta del API');
        console.error('   - Endpoint no existe');
        console.error('   - Error en el servidor');
        process.exit(1);
      }
      
      throw new Error('Respuesta no es JSON');
    }

    if (response.ok) {
      console.log('✅ ¡Prueba exitosa!');
      console.log('');
      console.log('📥 Datos de respuesta:');
      console.log(JSON.stringify(responseData, null, 2));
      console.log('');
      console.log('================================================');
      console.log('✅ El API de contacto está funcionando correctamente');
      console.log('================================================');
    } else {
      console.error('❌ Error en la respuesta del API');
      console.error('');
      console.error('Detalles del error:');
      console.error(JSON.stringify(responseData, null, 2));
      console.error('');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error al realizar la petición:');
    console.error('');
    console.error(`   ${error.message}`);
    console.error('');
    console.error('Stack trace:');
    console.error(error.stack);
    console.error('');
    console.error('Posibles causas:');
    console.error('  - El API no está en línea');
    console.error('  - URL incorrecta');
    console.error('  - Problemas de red');
    console.error('  - Configuración CORS del servidor');
    console.error('');
    process.exit(1);
  }
}

// Ejecutar la prueba
testContactAPI();

