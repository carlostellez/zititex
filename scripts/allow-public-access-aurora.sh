#!/bin/bash

# Script para permitir acceso público a Aurora desde cualquier IP
# ⚠️ ADVERTENCIA: Esto expone la base de datos a internet
# Solo para ambientes de desarrollo/pruebas

set -e

echo "=========================================="
echo "⚠️  CONFIGURAR ACCESO PÚBLICO AURORA"
echo "=========================================="
echo ""
echo "Este script te guiará para permitir acceso desde cualquier IP (0.0.0.0/0)"
echo "⚠️  SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN"
echo ""

read -p "¿Continuar? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

echo ""
echo "📋 INFORMACIÓN NECESARIA:"
echo ""

# Solicitar Security Group ID
read -p "🔑 Security Group ID de Aurora (ej: sg-0123456789abcdef0): " SG_ID

if [ -z "$SG_ID" ]; then
    echo "❌ Error: Security Group ID es requerido"
    exit 1
fi

# Validar formato
if [[ ! $SG_ID =~ ^sg-[0-9a-f]{17}$ ]]; then
    echo "⚠️  Advertencia: El formato del Security Group ID parece incorrecto"
    echo "   Formato esperado: sg-0123456789abcdef0"
    read -p "¿Continuar de todas formas? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Solicitar región
read -p "🌍 Región AWS (ej: us-east-2): " AWS_REGION

if [ -z "$AWS_REGION" ]; then
    AWS_REGION="us-east-2"
    echo "   Usando región por defecto: $AWS_REGION"
fi

echo ""
echo "=========================================="
echo "🔧 CONFIGURANDO SECURITY GROUP"
echo "=========================================="
echo ""
echo "Security Group: $SG_ID"
echo "Región: $AWS_REGION"
echo ""

# Verificar si AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo "❌ Error: AWS CLI no está instalado"
    echo "   Instala con: pip install awscli o brew install awscli"
    exit 1
fi

# Verificar credenciales AWS
echo "🔍 Verificando credenciales AWS..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: No se pueden verificar las credenciales AWS"
    echo "   Configura con: aws configure"
    exit 1
fi

echo "✅ Credenciales AWS válidas"
echo ""

# Verificar si existe el Security Group
echo "🔍 Verificando Security Group..."
if ! aws ec2 describe-security-groups --group-ids "$SG_ID" --region "$AWS_REGION" &> /dev/null; then
    echo "❌ Error: No se encontró el Security Group $SG_ID en la región $AWS_REGION"
    exit 1
fi

echo "✅ Security Group encontrado"
echo ""

# Mostrar reglas actuales
echo "📋 Reglas actuales del Security Group:"
aws ec2 describe-security-groups \
    --group-ids "$SG_ID" \
    --region "$AWS_REGION" \
    --query 'SecurityGroups[0].IpPermissions[?FromPort==`3306`]' \
    --output table
echo ""

# Confirmar antes de agregar
echo "⚠️  Se agregará la siguiente regla:"
echo "   Type: MySQL/Aurora"
echo "   Port: 3306"
echo "   Source: 0.0.0.0/0 (CUALQUIER IP EN INTERNET)"
echo ""
read -p "¿Continuar y agregar esta regla? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

# Agregar regla
echo ""
echo "🔧 Agregando regla al Security Group..."
aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp \
    --port 3306 \
    --cidr 0.0.0.0/0 \
    --region "$AWS_REGION" \
    --description "Public access from internet (⚠️ Development only)"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅ REGLA AGREGADA EXITOSAMENTE"
    echo ""
    echo "=========================================="
    echo "📋 PRÓXIMOS PASOS"
    echo "=========================================="
    echo ""
    echo "1. Espera 30 segundos para que los cambios se apliquen"
    echo ""
    echo "2. Verifica que Public Access esté habilitado en Aurora:"
    echo "   RDS → Databases → [Tu cluster] → Connectivity & security"
    echo "   Publicly accessible debe ser: Yes"
    echo ""
    echo "3. Prueba la conexión desde tu herramienta favorita"
    echo ""
    echo "4. ⚠️  RECOMENDACIONES DE SEGURIDAD:"
    echo "   - Usa contraseñas MUY fuertes (20+ caracteres)"
    echo "   - Crea usuarios con permisos mínimos necesarios"
    echo "   - Habilita SSL/TLS obligatorio"
    echo "   - Monitorea CloudWatch Logs"
    echo "   - NO uses esto en producción sin protección adicional"
    echo ""
    echo "=========================================="
    echo "✅ Configuración completada"
    echo "=========================================="
else
    echo ""
    echo "❌ Error al agregar la regla"
    echo "   Posibles causas:"
    echo "   - La regla ya existe"
    echo "   - No tienes permisos para modificar Security Groups"
    echo "   - Verifica el Security Group ID y región"
    exit 1
fi

