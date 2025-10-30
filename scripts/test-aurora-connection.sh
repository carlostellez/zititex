#!/bin/bash

# Script de diagnóstico para conexión Aurora
# Uso: ./test-aurora-connection.sh

# Tu endpoint Aurora
ENDPOINT="zititex-aurora-cluster.cluster-cjiwim4msvqt.us-east-2.rds.amazonaws.com"
PORT="3306"

echo "=================================="
echo "🔍 DIAGNÓSTICO AURORA CONNECTION"
echo "=================================="
echo ""

# 1. Tu IP pública
echo "1️⃣  Tu IP pública:"
MY_IP=$(curl -s ifconfig.me)
echo "   ✅ $MY_IP"
echo "   Esta IP debe estar en el Security Group de Aurora"
echo ""

# 2. Test DNS resolution
echo "2️⃣  Resolviendo DNS del endpoint:"
echo "   Endpoint: $ENDPOINT"
RESOLVED_IP=$(nslookup $ENDPOINT 2>/dev/null | grep "Address:" | tail -1 | awk '{print $2}')
if [ -n "$RESOLVED_IP" ]; then
    echo "   ✅ DNS resuelve a: $RESOLVED_IP"
else
    echo "   ❌ No se pudo resolver DNS"
fi
echo ""

# 3. Test conectividad TCP al puerto 3306
echo "3️⃣  Test conectividad al puerto $PORT:"
timeout 5 bash -c "cat < /dev/null > /dev/tcp/$ENDPOINT/$PORT" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Puerto $PORT ACCESIBLE - Puedes conectarte"
else
    echo "   ❌ Puerto $PORT BLOQUEADO"
    echo ""
    echo "   🔴 PROBLEMA IDENTIFICADO:"
    echo "      El puerto está bloqueado. Causas posibles:"
    echo "      1. Security Group NO tiene tu IP ($MY_IP)"
    echo "      2. Public Access está deshabilitado"
    echo "      3. Firewall corporativo/ISP bloqueando"
fi
echo ""

# 4. Test alternativo con nc (si está disponible)
if command -v nc &> /dev/null; then
    echo "4️⃣  Test alternativo con netcat:"
    nc -z -w 5 $ENDPOINT $PORT 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "   ✅ Netcat confirma: Puerto accesible"
    else
        echo "   ❌ Netcat confirma: Puerto bloqueado"
    fi
    echo ""
fi

# 5. Instrucciones de solución
echo "=================================="
echo "📋 INSTRUCCIONES DE SOLUCIÓN"
echo "=================================="
echo ""
echo "Si el puerto está BLOQUEADO, sigue estos pasos:"
echo ""
echo "🔧 PASO 1: Ve a AWS Console → RDS → Databases"
echo "   - Clic en: zititex-aurora-cluster"
echo "   - Tab: Connectivity & security"
echo "   - Anota el Security Group ID"
echo ""
echo "🔧 PASO 2: Ve a VPC → Security Groups"
echo "   - Busca el Security Group de Aurora"
echo "   - Tab: Inbound rules → Edit inbound rules"
echo ""
echo "🔧 PASO 3: Agrega esta regla:"
echo ""
echo "   OPCIÓN A - Solo tu IP (Recomendado):"
echo "   Type: MySQL/Aurora"
echo "   Port: 3306"
echo "   Source: $MY_IP/32"
echo "   Description: My development machine"
echo ""
echo "   OPCIÓN B - Cualquier IP (⚠️ Solo desarrollo):"
echo "   Type: MySQL/Aurora"
echo "   Port: 3306"
echo "   Source: 0.0.0.0/0"
echo "   Description: Public access from internet (⚠️ Development only)"
echo ""
echo "🔧 PASO 4: Save rules y espera 30 segundos"
echo ""
echo "🔧 PASO 5: Verifica Public Access"
echo "   RDS → Databases → Cluster → Connectivity & security"
echo "   Publicly accessible debe ser: Yes"
echo "   Si es No → Modify → Public access: Yes → Apply immediately"
echo ""
echo "⚠️  ADVERTENCIA: 0.0.0.0/0 permite acceso desde cualquier IP."
echo "   Asegúrate de tener autenticación fuerte y no usar en producción."
echo ""
echo "=================================="
echo "✅ Después de hacer los cambios, ejecuta este script otra vez"
echo "=================================="

