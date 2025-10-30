#!/bin/bash

# Script de Deploy a Producción (S3 + CloudFront)
# Uso: ./scripts/deploy-to-production.sh

set -e  # Detener en caso de error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=================================="
echo "🚀 DEPLOY A PRODUCCIÓN"
echo -e "==================================${NC}"
echo ""

# 1. Verificar que el build exista
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Error: Directorio 'out' no encontrado${NC}"
    echo "   Ejecuta primero: npm run build"
    exit 1
fi

echo -e "${GREEN}✅ Build encontrado${NC}"
echo ""

# 2. Obtener variables desde .env.local o GitHub Secrets
if [ -f ".env.local" ]; then
    source .env.local 2>/dev/null || true
fi

# Variables requeridas (puedes también pasarlas como argumentos)
S3_BUCKET="${S3_BUCKET_NAME:-}"
CF_DIST_ID="${CF_DISTRIBUTION_ID:-}"
AWS_REGION_VAR="${AWS_REGION:-us-east-1}"

# Si no están definidas, preguntar al usuario
if [ -z "$S3_BUCKET" ]; then
    echo -e "${YELLOW}📦 Ingresa el nombre del bucket S3:${NC}"
    read -p "   S3 Bucket: " S3_BUCKET
fi

if [ -z "$CF_DIST_ID" ]; then
    echo -e "${YELLOW}☁️  Ingresa el Distribution ID de CloudFront:${NC}"
    echo "   (Lo encuentras en: AWS Console → CloudFront → Distributions)"
    echo "   Ejemplo: E1ABCDEFGH2IJK"
    read -p "   Distribution ID: " CF_DIST_ID
fi

echo ""
echo -e "${GREEN}📋 Configuración:${NC}"
echo "   S3 Bucket: $S3_BUCKET"
echo "   CloudFront ID: $CF_DIST_ID"
echo "   AWS Region: $AWS_REGION_VAR"
echo ""

# Confirmar antes de continuar
read -p "¿Continuar con el deploy? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Deploy cancelado${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}=================================="
echo "📤 PASO 1: Subir archivos a S3"
echo -e "==================================${NC}"

# 3. Sync a S3
aws s3 sync ./out s3://$S3_BUCKET/ \
  --delete \
  --region $AWS_REGION_VAR \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "robots.txt" \
  --exclude "sitemap.xml"

# HTML files con caché corto
aws s3 sync ./out s3://$S3_BUCKET/ \
  --region $AWS_REGION_VAR \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html" \
  --exclude "*" \
  --include "*.html"

# robots.txt y sitemap.xml
aws s3 sync ./out s3://$S3_BUCKET/ \
  --region $AWS_REGION_VAR \
  --cache-control "public, max-age=3600" \
  --exclude "*" \
  --include "robots.txt" \
  --include "sitemap.xml"

echo ""
echo -e "${GREEN}✅ Archivos subidos a S3${NC}"
echo ""

# 4. Invalidar CloudFront Cache
if [ -n "$CF_DIST_ID" ]; then
    echo -e "${GREEN}=================================="
    echo "🔄 PASO 2: Invalidar CloudFront Cache"
    echo -e "==================================${NC}"
    echo ""
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
      --distribution-id $CF_DIST_ID \
      --paths "/*" \
      --query 'Invalidation.Id' \
      --output text)
    
    echo -e "${GREEN}✅ Invalidación creada: $INVALIDATION_ID${NC}"
    echo ""
    echo "⏳ Esperando que se complete la invalidación..."
    echo "   (Esto puede tomar 3-5 minutos)"
    echo ""
    
    # Esperar a que se complete (opcional)
    aws cloudfront wait invalidation-completed \
      --distribution-id $CF_DIST_ID \
      --id $INVALIDATION_ID 2>/dev/null || {
        echo -e "${YELLOW}⚠️  No se pudo esperar la invalidación (continúa en background)${NC}"
    }
    
    echo -e "${GREEN}✅ Invalidación completada${NC}"
else
    echo -e "${YELLOW}⚠️  CloudFront Distribution ID no proporcionado${NC}"
    echo "   Saltando invalidación de caché"
fi

echo ""
echo -e "${GREEN}=================================="
echo "✅ DEPLOY COMPLETADO"
echo -e "==================================${NC}"
echo ""
echo "🎉 Tu sitio está ahora en producción!"
echo ""
echo "📊 Próximos pasos:"
echo "   1. Verifica el sitio en tu dominio"
echo "   2. Prueba el botón de WhatsApp"
echo "   3. Verifica que todos los cambios estén reflejados"
echo ""
echo "🔗 URLs útiles:"
echo "   - S3 Bucket: https://s3.console.aws.amazon.com/s3/buckets/$S3_BUCKET"
if [ -n "$CF_DIST_ID" ]; then
    echo "   - CloudFront: https://console.aws.amazon.com/cloudfront/v3/home#/distributions/$CF_DIST_ID"
fi
echo ""


