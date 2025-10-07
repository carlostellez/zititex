#!/usr/bin/env node

/**
 * Script para probar la configuración MCP
 * Ejecutar con: node scripts/test-mcp.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Probando configuración MCP...\n');

// Función para probar si un servidor MCP está disponible
function testMcpServer(serverName) {
  return new Promise((resolve) => {
    console.log(`📦 Probando ${serverName}...`);
    
    const process = spawn('npx', ['-y', serverName, '--help'], {
      stdio: 'pipe',
      timeout: 15000
    });

    let output = '';
    let errorOutput = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0 || output.includes('Usage') || output.includes('help') || output.includes('Options')) {
        console.log(`   ✅ ${serverName} - Disponible`);
        resolve({ server: serverName, status: 'available', output });
      } else {
        console.log(`   ❌ ${serverName} - No disponible (código: ${code})`);
        if (errorOutput) {
          console.log(`      Error: ${errorOutput.slice(0, 150)}...`);
        }
        resolve({ server: serverName, status: 'unavailable', error: errorOutput });
      }
    });

    process.on('error', (error) => {
      console.log(`   ❌ ${serverName} - Error: ${error.message}`);
      resolve({ server: serverName, status: 'error', error: error.message });
    });

    // Timeout después de 15 segundos
    setTimeout(() => {
      process.kill();
      console.log(`   ⏰ ${serverName} - Timeout`);
      resolve({ server: serverName, status: 'timeout' });
    }, 15000);
  });
}

// Función para verificar la configuración MCP
function checkMcpConfig() {
  const mcpPath = path.join(process.env.HOME, '.cursor', 'mcp.json');
  
  console.log(`📁 Verificando configuración en: ${mcpPath}`);
  
  if (!fs.existsSync(mcpPath)) {
    console.log('   ❌ Archivo mcp.json no encontrado');
    return { valid: false, config: null };
  }

  try {
    const config = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
    console.log('   ✅ Archivo mcp.json válido');
    console.log(`   📊 Servidores configurados: ${Object.keys(config.mcpServers || {}).length}`);
    
    Object.keys(config.mcpServers || {}).forEach(server => {
      console.log(`      - ${server}`);
    });
    
    return { valid: true, config };
  } catch (error) {
    console.log(`   ❌ Error al leer mcp.json: ${error.message}`);
    return { valid: false, config: null };
  }
}

// Función para extraer nombres de servidores de la configuración
function extractServerNames(config) {
  const servers = [];
  
  Object.entries(config.mcpServers || {}).forEach(([name, serverConfig]) => {
    if (serverConfig.args && serverConfig.args.length > 1) {
      // Extraer el nombre del paquete del segundo argumento
      const packageName = serverConfig.args[1];
      if (packageName.startsWith('@')) {
        servers.push(packageName);
      }
    }
  });
  
  return servers;
}

// Función principal
async function main() {
  console.log('🚀 Iniciando pruebas MCP para Zititex\n');
  
  // Verificar configuración
  const { valid, config } = checkMcpConfig();
  console.log('');
  
  if (!valid) {
    console.log('❌ Configuración MCP inválida. Revisa el archivo ~/.cursor/mcp.json');
    process.exit(1);
  }

  // Extraer servidores de la configuración
  const mcpServers = extractServerNames(config);
  
  if (mcpServers.length === 0) {
    console.log('⚠️  No se encontraron servidores MCP para probar en la configuración.');
    return;
  }

  // Probar servidores
  console.log('🧪 Probando disponibilidad de servidores MCP...\n');
  
  const results = [];
  for (const server of mcpServers) {
    const result = await testMcpServer(server);
    results.push(result);
  }

  // Resumen
  console.log('\n📊 Resumen de pruebas:');
  console.log('=' .repeat(50));
  
  const available = results.filter(r => r.status === 'available').length;
  const total = results.length;
  
  console.log(`✅ Servidores disponibles: ${available}/${total}`);
  console.log(`❌ Servidores no disponibles: ${total - available}/${total}`);
  
  if (available === total) {
    console.log('\n🎉 ¡Todos los servidores MCP están funcionando correctamente!');
  } else if (available > 0) {
    console.log('\n⚠️  Algunos servidores están funcionando.');
  } else {
    console.log('\n❌ Ningún servidor MCP está disponible.');
    console.log('💡 Los servidores se descargarán automáticamente cuando Cursor los necesite.');
  }

  // Verificar configuración específica
  console.log('\n🔍 Verificando configuración específica:');
  
  if (config.mcpServers.github && config.mcpServers.github.env && config.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    const token = config.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    if (token.startsWith('github_pat_') && token.length > 20) {
      console.log('   ✅ Token de GitHub configurado correctamente');
    } else {
      console.log('   ⚠️  Token de GitHub parece incorrecto');
    }
  }

  // Instrucciones adicionales
  console.log('\n📚 Próximos pasos:');
  console.log('1. Reinicia Cursor completamente');
  console.log('2. Los servidores MCP se activarán automáticamente');
  console.log('3. Podrás usar comandos como:');
  console.log('   - Navegación de archivos avanzada');
  console.log('   - Integración con GitHub');
  console.log('   - Web scraping con Puppeteer');
  console.log('   - Peticiones HTTP con Fetch');
  
  console.log('\n💡 Tip: Los servidores MCP funcionan mejor cuando Cursor los invoca directamente.');
}

// Ejecutar
main().catch(console.error);
