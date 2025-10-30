# Configuración de CloudFront con Dominio de GoDaddy - Guía Paso a Paso

## 📋 Índice

- [Requisitos Previos](#requisitos-previos)
- [Arquitectura](#arquitectura)
- [Paso 1: Preparar el Bucket S3](#paso-1-preparar-el-bucket-s3)
- [Paso 2: Solicitar Certificado SSL en AWS](#paso-2-solicitar-certificado-ssl-en-aws)
- [Paso 3: Crear Distribución de CloudFront](#paso-3-crear-distribución-de-cloudfront)
- [Paso 4: Configurar DNS en GoDaddy](#paso-4-configurar-dns-en-godaddy)
- [Paso 5: Verificación y Pruebas](#paso-5-verificación-y-pruebas)
- [Troubleshooting](#troubleshooting)
- [Costos Estimados](#costos-estimados)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta de AWS activa
- ✅ Dominio registrado en GoDaddy (ej: `zititex.com`)
- ✅ Acceso a la configuración DNS de GoDaddy
- ✅ Bucket S3 con el sitio web ya configurado
- ✅ Sitio web construido y listo para deployment
- ✅ Tarjeta de crédito válida en AWS (para CloudFront)

**Tiempo estimado**: 2-3 horas (incluyendo propagación DNS)

---

## Arquitectura

### Flujo del Tráfico

```
Usuario (Browser)
    ↓
GoDaddy DNS (zititex.com)
    ↓
CloudFront CDN (HTTPS)
    ↓
S3 Bucket (Static Website)
    ↓
HTML/CSS/JS/Images
```

### Beneficios de esta Configuración

1. **HTTPS Gratis**: Certificado SSL de AWS Certificate Manager
2. **CDN Global**: Contenido replicado en 400+ ubicaciones
3. **Velocidad**: Caché en edge locations
4. **Seguridad**: Protección DDoS, WAF opcional
5. **Escalabilidad**: Maneja millones de requests
6. **Bajo Costo**: Pay-as-you-go, tier gratuito disponible

---

## Paso 1: Preparar el Bucket S3

### 1.1 Verificar que el Bucket existe

1. Ve a la consola de AWS: https://console.aws.amazon.com/s3/
2. Busca tu bucket (ej: `zititex-website`)
3. Si no existe, créalo siguiendo esta guía: [AWS S3 Deployment](./aws-s3-deployment.md)

### 1.2 Configurar Permisos del Bucket

**IMPORTANTE**: Para CloudFront, el bucket NO necesita ser público, pero necesita una política específica.

1. Ve a tu bucket → **Permissions** tab
2. En **Block public access**, asegúrate que esté **habilitado** (más seguro)
3. No necesitas hacer el bucket público

### 1.3 Subir tu Sitio Web

```bash
# Build del proyecto
npm run build

# Subir a S3
aws s3 sync ./out s3://tu-bucket-name/ --delete
```

---

## Paso 2: Solicitar Certificado SSL en AWS

**IMPORTANTE**: El certificado DEBE solicitarse en la región **us-east-1** (Norte de Virginia) para usarlo con CloudFront.

### 2.1 Ir a Certificate Manager

1. Ve a AWS Console
2. **CRÍTICO**: Cambia la región a **US East (N. Virginia) us-east-1**
   - Mira en la esquina superior derecha
   - Haz clic en la región actual
   - Selecciona **US East (N. Virginia)**
3. Busca "Certificate Manager" o ve a: https://console.aws.amazon.com/acm/home?region=us-east-1
4. Haz clic en **"Request certificate"** (Solicitar certificado)

### 2.2 Configurar el Certificado

**Paso 1 - Tipo de Certificado**:
- Selecciona: **"Request a public certificate"** (Solicitar un certificado público)
- Clic en **"Next"** (Siguiente)

**Paso 2 - Nombres de Dominio**:
```
Domain names:
  1. zititex.com
  2. www.zititex.com
```

- En **"Fully qualified domain name"**:
  - Agrega: `zititex.com`
  - Clic en **"Add another name to this certificate"**
  - Agrega: `www.zititex.com`

**¿Por qué ambos?**
- `zititex.com` - Dominio principal
- `www.zititex.com` - Subdominio www
- Así ambas versiones funcionarán con HTTPS

**Paso 3 - Método de Validación**:
- Selecciona: **"DNS validation"** (Validación DNS)
- Ventajas:
  - No requiere email
  - Renovación automática
  - Más rápido
- Clic en **"Next"**

**Paso 4 - Tags (Opcional)**:
```
Key: Name
Value: Zititex SSL Certificate
```
- Clic en **"Request"** (Solicitar)

### 2.3 Validar el Certificado en GoDaddy

**AWS te mostrará registros CNAME para agregar a GoDaddy:**

**Ejemplo de registros CNAME** (los tuyos serán diferentes):
```
Name: _abc123def456.zititex.com
Type: CNAME
Value: _xyz789abc123.acm-validations.aws.
```

**Pasos para agregar en GoDaddy**:

1. **Ir a GoDaddy DNS**:
   - Ve a: https://dcc.godaddy.com/
   - Log in con tu cuenta
   - Selecciona tu dominio: `zititex.com`
   - Clic en **"DNS"** o **"Manage DNS"**

2. **Agregar Registro CNAME #1** (para zititex.com):
   - Clic en **"Add"** (Agregar)
   - **Type**: `CNAME`
   - **Name**: Copia el valor de AWS (ej: `_abc123def456`)
     - NOTA: NO incluyas el dominio completo, solo la parte antes del primer punto
     - AWS muestra: `_abc123def456.zititex.com`
     - En GoDaddy pones: `_abc123def456`
   - **Value**: Copia el valor completo de AWS (ej: `_xyz789abc123.acm-validations.aws.`)
   - **TTL**: `600` segundos (10 minutos)
   - Clic en **"Save"**

3. **Agregar Registro CNAME #2** (para www.zititex.com):
   - Repite el proceso con el segundo registro CNAME que AWS te proporciona
   - Generalmente es el mismo valor para www

4. **Esperar Validación**:
   - Regresa a AWS Certificate Manager
   - La validación puede tomar **5-30 minutos**
   - Refresca la página cada 5 minutos
   - El status cambiará de **"Pending validation"** → **"Issued"** ✅

**IMPORTANTE**: NO continúes hasta que el certificado diga **"Issued"** (Emitido).

### 2.4 Verificar Certificado

Una vez emitido, verás:
```
Status: Issued ✅
Domains: zititex.com, www.zititex.com
Region: US East (N. Virginia)
```

**Guarda el ARN del certificado**, lo necesitarás:
```
arn:aws:acm:us-east-1:123456789:certificate/abc-def-ghi-123
```

---

## Paso 3: Crear Distribución de CloudFront

### 3.1 Ir a CloudFront

1. En AWS Console, busca **"CloudFront"**
2. Ve a: https://console.aws.amazon.com/cloudfront/
3. Clic en **"Create Distribution"** (Crear distribución)

### 3.2 Configurar Origin (Origen)

**Origin Settings**:

- **Origin domain**:
  - Haz clic en el campo
  - Aparecerá una lista con tus buckets S3
  - **NO SELECCIONES** el bucket directamente de la lista
  - En su lugar, escribe manualmente el endpoint de website del bucket:
    ```
    tu-bucket-name.s3-website-us-east-1.amazonaws.com
    ```
  - Reemplaza:
    - `tu-bucket-name` con el nombre de tu bucket
    - `us-east-1` con tu región de S3

  **¿Por qué manualmente?**
  - Usar el endpoint de website permite que funcione el routing de Next.js
  - Soporta páginas de error personalizadas
  - Maneja trailing slashes correctamente

- **Name**: Se auto-completa, déjalo como está

- **Origin path**: Déjalo **vacío**

- **Enable Origin Shield**: **No** (para reducir costos)

### 3.3 Configurar Comportamiento (Default Cache Behavior)

**Viewer Protocol Policy**:
- Selecciona: **"Redirect HTTP to HTTPS"**
- Esto fuerza HTTPS siempre

**Allowed HTTP Methods**:
- Selecciona: **"GET, HEAD"**
- Suficiente para sitio estático

**Cache Policy**:
- Selecciona: **"CachingOptimized"**
- O crea una custom si necesitas control fino

**Origin Request Policy**:
- Selecciona: **"None"** o **"CORS-S3Origin"** si usas CORS

**Response Headers Policy** (Opcional pero recomendado):
- Selecciona: **"SecurityHeadersPolicy"**
- Agrega headers de seguridad automáticamente

**Compress objects automatically**:
- Selecciona: **"Yes"** ✅
- Habilita compresión Gzip/Brotli

### 3.4 Configurar Dominio y Certificado

**Settings** (Configuración):

- **Alternate domain names (CNAMEs)**:
  ```
  zititex.com
  www.zititex.com
  ```
  - Agrega ambos dominios
  - Clic en "Add item" para agregar el segundo

- **Custom SSL certificate**:
  - Haz clic en el dropdown
  - Selecciona el certificado que creaste en Paso 2
  - Debe aparecer como: `zititex.com (abc-def-ghi-123)`
  - Si no aparece, verifica:
    - Que esté en región **us-east-1**
    - Que status sea **"Issued"**

- **Security Policy**:
  - Selecciona: **"TLSv1.2_2021"** (recomendado)
  - Balancea seguridad y compatibilidad

- **Supported HTTP versions**:
  - Marca: **"HTTP/2"** ✅
  - Marca: **"HTTP/3"** ✅ (si está disponible)

### 3.5 Configurar Páginas de Error (Importante para SPA)

**Default root object**:
```
index.html
```

**Custom Error Responses** (Para Next.js export):

Scroll hasta la sección **"Error pages"** después de crear la distribución.

### 3.6 Otras Configuraciones

**Price Class**:
- **"Use all edge locations"** - Mejor performance global
- O selecciona regiones específicas para reducir costos

**Web Application Firewall (WAF)**:
- **"Do not enable security protections"** (por ahora)
- Puedes habilitarlo después si lo necesitas

**Description** (Opcional):
```
CloudFront distribution for Zititex website
```

### 3.7 Crear Distribución

1. Revisa toda la configuración
2. Clic en **"Create distribution"**
3. La creación toma **10-20 minutos** ⏱️
4. Status inicial: **"Deploying"** (Desplegando)
5. Status final: **"Enabled"** ✅

### 3.8 Guardar Información

Guarda estos datos:

```
Distribution ID: E1ABCDEFGH2IJK
Distribution Domain Name: d1a2b3c4d5e6f7.cloudfront.net
Status: Enabled
```

---

## Paso 4: Configurar DNS en GoDaddy

### 4.1 Ir a Configuración DNS

1. Ve a: https://dcc.godaddy.com/
2. Selecciona tu dominio: `zititex.com`
3. Clic en **"DNS"** o **"Manage DNS"**

### 4.2 Configurar Dominio Principal (zititex.com)

**Opción A: Usando CNAME (Solo si el dominio ya tiene un registro A)**

Si tu dominio actualmente apunta a otro sitio:

1. Busca el registro **A** existente con nombre `@`
2. Clic en el ícono de lápiz para editar
3. Cámbialo a:
   - **Type**: `CNAME`
   - **Name**: `@`
   - **Value**: `d1a2b3c4d5e6f7.cloudfront.net` (tu dominio de CloudFront)
   - **TTL**: `600` segundos

**Opción B: Usando Alias/ANAME (Recomendado)**

GoDaddy soporta CNAME-like para el dominio raíz:

1. Si hay registro A con nombre `@`, elimínalo
2. Clic en **"Add"**
3. Configurar:
   - **Type**: `CNAME`
   - **Name**: `@`
   - **Value**: `d1a2b3c4d5e6f7.cloudfront.net`
   - **TTL**: `600`
4. Clic en **"Save"**

**NOTA**: Si GoDaddy no permite CNAME en `@`, necesitas usar CloudFlare (ver alternativa abajo).

### 4.3 Configurar Subdominio WWW (www.zititex.com)

1. Clic en **"Add"**
2. Configurar:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Value**: `d1a2b3c4d5e6f7.cloudfront.net` (tu CloudFront)
   - **TTL**: `600` segundos
3. Clic en **"Save"**

### 4.4 Verificar Configuración DNS

Tu DNS debería verse así:

```
Tipo    Nombre    Valor                           TTL
------------------------------------------------------
CNAME   @         d1a2b3c4d5e6f7.cloudfront.net   600
CNAME   www       d1a2b3c4d5e6f7.cloudfront.net   600
CNAME   _abc123   _xyz789.acm-validations.aws.    600  (validación SSL)
```

### 4.5 Propagación DNS

- **Tiempo de propagación**: 5 minutos - 48 horas
- **Promedio**: 30 minutos - 2 horas
- **Factores**:
  - TTL anterior del dominio
  - ISP del usuario
  - Caché DNS local

---

## Paso 5: Verificación y Pruebas

### 5.1 Verificar Propagación DNS

**Herramientas Online**:

1. **WhatsMyDNS**: https://www.whatsmydns.net/
   - Ingresa: `zititex.com`
   - Tipo: `CNAME`
   - Deberías ver tu dominio CloudFront en la mayoría de ubicaciones

2. **DNS Checker**: https://dnschecker.org/
   - Similar a WhatsMyDNS
   - Muestra propagación global

**Desde Terminal**:
```bash
# Ver registros DNS actuales
nslookup zititex.com

# Ver registros CNAME específicos
dig zititex.com CNAME +short

# Ver desde diferentes DNS servers
dig @8.8.8.8 zititex.com CNAME +short  # Google DNS
dig @1.1.1.1 zititex.com CNAME +short  # Cloudflare DNS
```

### 5.2 Probar HTTPS

```bash
# Probar conexión HTTPS
curl -I https://zititex.com

# Deberías ver:
HTTP/2 200
server: CloudFront
x-cache: Hit from cloudfront
```

### 5.3 Probar en Navegador

1. **Limpiar caché del navegador**:
   - Chrome: `Ctrl+Shift+Delete` (Windows) o `Cmd+Shift+Delete` (Mac)
   - Selecciona "All time"
   - Marca "Cached images and files"
   - Clic en "Clear data"

2. **Abrir en modo incógnito**:
   - Chrome: `Ctrl+Shift+N`
   - Firefox: `Ctrl+Shift+P`

3. **Probar URLs**:
   - https://zititex.com ✅
   - https://www.zititex.com ✅
   - http://zititex.com → debería redirigir a HTTPS ✅

4. **Verificar certificado**:
   - Haz clic en el candado 🔒 en la barra de direcciones
   - Clic en "Certificate"
   - Verifica:
     - Issued to: `zititex.com`
     - Issued by: `Amazon`
     - Valid dates

### 5.4 Verificar CloudFront Cache

En CloudFront console:

1. Ve a tu distribución
2. Tab **"Monitoring"**
3. Deberías ver gráficas de:
   - Requests
   - Bytes downloaded
   - HTTP status codes

### 5.5 Test de Performance

**PageSpeed Insights**:
```
https://pagespeed.web.dev/
```
- Ingresa: `https://zititex.com`
- Verifica scores mejorados

**WebPageTest**:
```
https://www.webpagetest.org/
```
- Test de diferentes ubicaciones
- Verifica TTFB (Time to First Byte)

### 5.6 Checklist de Verificación

- [ ] DNS propagado (whatsmydns.net)
- [ ] HTTPS funciona sin warnings
- [ ] HTTP redirige a HTTPS
- [ ] www.zititex.com funciona
- [ ] Certificado SSL válido
- [ ] CloudFront muestra hits en cache
- [ ] Performance mejorado vs S3 directo
- [ ] Todas las páginas cargan correctamente
- [ ] Assets (CSS, JS, imágenes) cargan
- [ ] No hay errores en console del navegador

---

## Troubleshooting

### Problema 1: "This site can't be reached" (ERR_NAME_NOT_RESOLVED)

**Causa**: DNS no ha propagado o está mal configurado

**Solución**:
1. Verifica registros CNAME en GoDaddy
2. Espera más tiempo (hasta 48h)
3. Limpia caché DNS local:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Problema 2: "Your connection is not private" (SSL Error)

**Causas posibles**:
- Certificado no validado en ACM
- Certificado no agregado a CloudFront
- Dominio no coincide con certificado

**Solución**:
1. Verifica en ACM que el certificado tenga status **"Issued"**
2. Verifica que CloudFront tenga el certificado correcto
3. Verifica que los CNAMEs coincidan exactamente

### Problema 3: CloudFront devuelve página de S3 error

**Causa**: Origin configurado incorrectamente

**Solución**:
1. Ve a CloudFront → Origins
2. Edita el origin
3. Usa el endpoint de website del bucket:
   ```
   tu-bucket.s3-website-us-east-1.amazonaws.com
   ```
   NO uses:
   ```
   tu-bucket.s3.amazonaws.com  ❌
   ```

### Problema 4: 403 Forbidden

**Causas**:
- Bucket no tiene permisos correctos
- Archivos no existen en S3
- CloudFront no puede acceder al bucket

**Solución**:
1. Verifica que los archivos estén en S3:
   ```bash
   aws s3 ls s3://tu-bucket/
   ```
2. Verifica bucket policy
3. Espera que CloudFront termine de deployar (status: Enabled)

### Problema 5: Cambios no aparecen

**Causa**: CloudFront caché

**Solución - Invalidar Cache**:
```bash
# Desde terminal
aws cloudfront create-invalidation \
  --distribution-id E1ABCDEFGH2IJK \
  --paths "/*"

# O desde consola:
# CloudFront → Distributions → Tu distribución
# Tab "Invalidations" → "Create invalidation"
# Paths: /*
```

**NOTA**: Tienes 1000 invalidaciones gratis por mes, después cuesta $0.005 por path.

### Problema 6: GoDaddy no permite CNAME en @

**Solución - Usar Cloudflare DNS** (Gratis):

1. Crear cuenta en Cloudflare: https://dash.cloudflare.com/sign-up
2. Agregar tu sitio: `zititex.com`
3. Cloudflare te dará nameservers:
   ```
   bob.ns.cloudflare.com
   jane.ns.cloudflare.com
   ```
4. En GoDaddy:
   - Ve a "Domain Settings"
   - Cambia nameservers a los de Cloudflare
5. En Cloudflare DNS:
   - Agrega CNAME `@` → `d123.cloudfront.net`
   - Agrega CNAME `www` → `d123.cloudfront.net`
   - Marca como "DNS only" (nube gris, no naranja)

---

## Costos Estimados

### AWS CloudFront

**Tier Gratuito** (primer año):
- 1 TB de transferencia saliente
- 10,000,000 requests HTTP/HTTPS
- 2,000,000 invalidaciones CloudFront Functions

**Después del tier gratuito** (Región América):
- $0.085 por GB (primeros 10 TB/mes)
- $0.0075 por 10,000 HTTPS requests
- $0.0050 por invalidación (después de 1000 gratis)

**Estimado mensual para sitio pequeño-mediano**:
- 100 GB transferencia: **$8.50**
- 1M requests: **$0.75**
- 10 invalidaciones: **$0.05**
- **Total: ~$9.30/mes**

### AWS Certificate Manager (ACM)

- **$0.00** - GRATIS ✅
- Certificados SSL ilimitados
- Renovación automática

### AWS S3

- $0.023 por GB almacenamiento (primeros 50 TB)
- $0.004 por 10,000 GET requests desde CloudFront
- Estimado: **$1-2/mes** para sitio estático pequeño

### GoDaddy

- Costo del dominio: **$12-20/año** (ya lo tienes)
- Sin costos adicionales por DNS

### Total Estimado

**Primer año** (con tier gratuito):
- **$0-3/mes** ✅

**Después del primer año**:
- **$10-15/mes**

---

## Próximos Pasos

### 1. Monitoreo

**CloudWatch**:
- Ve a CloudWatch → Dashboards
- Crea dashboard personalizado
- Monitorea:
  - Requests
  - Errors (4xx, 5xx)
  - Bytes transferred
  - Cache hit rate

**CloudFront Reports**:
- CloudFront → Reports & analytics
- Revisa:
  - Popular objects
  - Top referrers
  - Usage by location
  - Device types

### 2. Optimizaciones

**Cache Headers**:
```
# En tus archivos estáticos
Cache-Control: public, max-age=31536000, immutable  # JS, CSS, imágenes
Cache-Control: public, max-age=0, must-revalidate    # HTML
```

**CloudFront Functions**:
- Redirecciones URL
- Headers de seguridad
- A/B testing

**Compresión**:
- Ya habilitamos compresión automática ✅
- CloudFront comprime automáticamente

### 3. Seguridad

**AWS WAF** (Optional):
- Protección contra SQL injection
- Rate limiting
- Geo-blocking
- Costo: ~$5/mes + $1/millón requests

**Security Headers**:
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### 4. Automatización CI/CD

Actualiza `.github/workflows/deploy-to-s3.yml`:

```yaml
- name: Invalidate CloudFront cache
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} \
      --paths "/*"
  env:
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    AWS_REGION: us-east-1
```

---

## Recursos Adicionales

### Documentación Oficial

- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [ACM Documentation](https://docs.aws.amazon.com/acm/)
- [GoDaddy DNS Help](https://www.godaddy.com/help/manage-dns-680)

### Herramientas Útiles

- **DNS Checker**: https://dnschecker.org/
- **SSL Test**: https://www.ssllabs.com/ssltest/
- **CDN Performance**: https://www.cdnperf.com/
- **AWS Calculator**: https://calculator.aws/

### Proyectos Relacionados

- [AWS S3 Deployment](./aws-s3-deployment.md)
- [GitHub Actions CI/CD](../.github/workflows/deploy-to-s3.yml)
- [Performance Guide](./performance-optimization-guide.md)

---

## Resumen de Comandos

```bash
# Build del proyecto
npm run build

# Subir a S3
aws s3 sync ./out s3://tu-bucket/ --delete

# Invalidar CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1ABCDEFGH2IJK \
  --paths "/*"

# Verificar DNS
dig zititex.com CNAME +short

# Verificar SSL
curl -I https://zititex.com

# Limpiar DNS cache local (Mac)
sudo dscacheutil -flushcache

# Ver logs de CloudFront
aws cloudfront get-distribution \
  --id E1ABCDEFGH2IJK
```

---

## Conclusión

Siguiendo esta guía paso a paso, habrás configurado:

- ✅ Certificado SSL gratis de AWS
- ✅ CDN global con CloudFront
- ✅ Dominio personalizado de GoDaddy
- ✅ HTTPS obligatorio
- ✅ Cache optimizado
- ✅ Compresión automática

Tu sitio ahora será:
- **Más rápido**: CDN en 400+ ubicaciones
- **Más seguro**: HTTPS con certificado válido
- **Más confiable**: SLA de 99.9% de AWS
- **Escalable**: Soporta millones de usuarios

**Tiempo total**: 2-3 horas (incluyendo propagación DNS)

¿Necesitas ayuda? Revisa la sección de [Troubleshooting](#troubleshooting) o consulta los recursos adicionales.

---

**Última actualización**: 2025-10-22  
**Proyecto**: Zititex  
**Autor**: Equipo de desarrollo

