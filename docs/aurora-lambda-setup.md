# Configuración de AWS Aurora + Lambda - Guía Paso a Paso

## 📋 Índice

- [Requisitos Previos](#requisitos-previos)
- [Arquitectura](#arquitectura)
- [Paso 1: Configurar VPC y Subnets](#paso-1-configurar-vpc-y-subnets)
- [Paso 2: Configurar Security Groups](#paso-2-configurar-security-groups)
- [Paso 3: Crear Aurora DB Cluster](#paso-3-crear-aurora-db-cluster)
- [Paso 4: Configurar Acceso Público](#paso-4-configurar-acceso-público)
- [Paso 5: Configurar Lambda con VPC](#paso-5-configurar-lambda-con-vpc)
- [Paso 6: Testing y Verificación](#paso-6-testing-y-verificación)
- [Mejores Prácticas de Seguridad](#mejores-prácticas-de-seguridad)
- [Troubleshooting](#troubleshooting)
- [Costos Estimados](#costos-estimados)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta de AWS activa con permisos de administrador
- ✅ AWS CLI instalado y configurado
- ✅ Conocimiento básico de networking (VPC, subnets, CIDR)
- ✅ Cliente de base de datos instalado (MySQL Workbench, pgAdmin, DBeaver, etc.)
- ✅ Presupuesto aprobado (Aurora tiene costo significativo)

**Tiempo estimado**: 1-2 horas

---

## Arquitectura

### Diagrama de Flujo

```
Internet (Tu IP)
    ↓
Internet Gateway
    ↓
Public Subnet (Security Group: Acceso desde tu IP)
    ↓
Aurora DB Cluster (Publicly Accessible)
    ↑
Private Subnet (Security Group: Acceso desde Lambda)
    ↑
Lambda Function (VPC Enabled)
    ↑
API Gateway / EventBridge / etc.
```

### Componentes Clave

1. **VPC (Virtual Private Cloud)**
   - Red aislada en AWS
   - CIDR: 10.0.0.0/16 (65,536 IPs)

2. **Subnets**
   - **Public Subnets**: Para acceso desde internet
   - **Private Subnets**: Para Lambda y recursos internos
   - Mínimo 2 AZs (Alta disponibilidad)

3. **Aurora DB Cluster**
   - Motor: MySQL 8.0 o PostgreSQL 15
   - Modo: Provisioned o Serverless v2
   - Multi-AZ para producción

4. **Lambda Function**
   - Dentro de VPC (acceso privado a Aurora)
   - ENI (Elastic Network Interface) automático
   - Acceso a internet vía NAT Gateway (opcional)

5. **Security Groups**
   - DB SG: Controla acceso a Aurora
   - Lambda SG: Controla tráfico de Lambda

---

## Paso 1: Configurar VPC y Subnets

### 1.1 Crear VPC

1. Ve a AWS Console → Busca **"VPC"** en la barra superior
2. En el panel izquierdo, clic en **"Your VPCs"**
3. Clic en el botón naranja **"Create VPC"** (arriba a la derecha)

**PASO CRÍTICO**: En la primera pantalla verás dos opciones de radio button:

```
┌────────────────────────────────────────────────────────────┐
│  Resources to create                                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ○  VPC only                                    ← ❌ NO   │
│     Create only a VPC                                      │
│                                                            │
│  ●  VPC and more                                ← ✅ SÍ   │
│     Create VPC, subnets, route tables,                     │
│     and network connections                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**⚠️ IMPORTANTE**: Debes seleccionar **"VPC and more"** para ver las opciones de Availability Zones.

**¿Por qué "VPC and more"?**
- ✅ Crea automáticamente: VPC + Subnets + Route Tables + Gateways
- ✅ Ahorra 30-40 minutos de configuración manual
- ✅ Menos errores de configuración
- ✅ Best practice de AWS

4. Después de seleccionar **"VPC and more"**, el formulario se expandirá mostrando TODAS estas opciones:

```
┌────────────────────────────────────────────────────────────┐
│  VPC settings                                              │
│  ├─ Name tag auto-generation: ☑ Auto-generate             │
│  ├─ IPv4 CIDR: 10.0.0.0/16                                │
│  └─ IPv6 CIDR: No IPv6                                    │
│                                                            │
│  Number of Availability Zones: [2 ▼]     ← AQUÍ ESTÁ ✅  │
│  Number of public subnets: [2 ▼]                          │
│  Number of private subnets: [2 ▼]                         │
│  NAT gateways: [1 per AZ ▼]                               │
│  VPC endpoints: [None ▼]                                  │
│                                                            │
│  DNS options                                               │
│  ├─ ☑ Enable DNS hostnames                                │
│  └─ ☑ Enable DNS resolution                               │
└────────────────────────────────────────────────────────────┘
```

**Si NO ves estas opciones**, significa que **NO** seleccionaste "VPC and more". Regresa al paso 3.

---

**VPC Settings** (Configuración detallada):
- **Name tag auto-generation**: 
  - ✅ Marca el checkbox "Auto-generate"
  - **Name**: `zititex` (se agregará automáticamente `-vpc`, `-subnet`, etc.)
  
- **IPv4 CIDR block**: `10.0.0.0/16`
  - Esto te da 65,536 IPs disponibles
  
- **IPv6 CIDR block**: Selecciona **"No IPv6 CIDR block"**
  
- **Tenancy**: `Default` (compartido, más económico)

**Ahora SÍ verás estas opciones**:

**Availability Zones (AZs)**:
- **Number of Availability Zones**: Selecciona **`2`** del dropdown
  - Mínimo requerido para Aurora (alta disponibilidad)
  - Aurora requiere mínimo 2 AZs diferentes

**Number of public subnets**: Selecciona **`2`**
- Una en cada AZ para redundancia

**Number of private subnets**: Selecciona **`2`**
- Una en cada AZ (aquí irán Aurora y Lambda)

**Customize subnets CIDR blocks** (Opcional):
- Puedes dejar los valores por defecto
- AWS asignará automáticamente rangos dentro de 10.0.0.0/16

**NAT gateways**:
- Selecciona: **"1 per AZ"** (para Lambda con acceso a internet)
- O selecciona: **"None"** (si Lambda no necesita internet)

**VPC endpoints**: `None` (por ahora)

**DNS options**:
- ✅ Enable DNS hostnames
- ✅ Enable DNS resolution

3. Clic en **"Create VPC"** (botón naranja abajo a la derecha)

**Vista previa** (Antes de crear):
AWS te mostrará un diagrama visual de lo que se creará. Deberías ver:
- 1 VPC
- 2 Public subnets (con Internet Gateway)
- 2 Private subnets (con NAT Gateway si lo seleccionaste)
- Route tables
- Network connections

4. Si todo se ve correcto, clic en **"Create VPC"**

**Tiempo de creación**: 2-3 minutos ⏱️

Esto creará automáticamente:
- ✅ 1 VPC
- ✅ 2 Public Subnets (10.0.0.0/24, 10.0.1.0/24)
- ✅ 2 Private Subnets (10.0.128.0/24, 10.0.129.0/24)
- ✅ 1 Internet Gateway
- ✅ Route Tables configuradas
- ✅ NAT Gateways (si seleccionaste)

### 1.2 ¿Qué hacer si ya seleccionaste "VPC only" por error?

Si ya creaste una VPC con "VPC only" y no ves las subnets, no te preocupes:

**Opción 1 - Empezar de nuevo (Recomendado si es nueva)**:
1. Ve a **VPC** → **Your VPCs**
2. Selecciona la VPC que creaste
3. **Actions** → **Delete VPC**
4. Sigue las instrucciones desde 1.1 con "VPC and more"

📘 **Guía completa**: Si tienes problemas eliminando la VPC, consulta:  
[Cómo Eliminar una VPC - Guía Completa](./how-to-delete-vpc.md)

**Opción 2 - Configuración Manual (Avanzado)**:
Si prefieres continuar con "VPC only", necesitarás crear manualmente:
- 4 Subnets (2 públicas + 2 privadas en diferentes AZs)
- Internet Gateway
- NAT Gateways (opcional)
- Route Tables (2: una pública, una privada)
- Asociaciones de subnets con route tables

📘 **No recomendado para principiantes** - Toma 30-40 minutos adicionales.

---

### 1.3 Verificar Configuración

**Subnets Creadas** (VPC → Subnets):

```
Subnet Name                  CIDR            AZ           Type
---------------------------------------------------------------
zititex-subnet-public1-us-east-1a   10.0.0.0/24    us-east-1a   Public
zititex-subnet-public2-us-east-1b   10.0.1.0/24    us-east-1b   Public
zititex-subnet-private1-us-east-1a  10.0.128.0/24  us-east-1a   Private
zititex-subnet-private2-us-east-1b  10.0.129.0/24  us-east-1b   Private
```

**Route Tables** (VPC → Route Tables):

```
Public Route Table:
  10.0.0.0/16 → local
  0.0.0.0/0 → Internet Gateway (igw-xxxxx)

Private Route Table:
  10.0.0.0/16 → local
  0.0.0.0/0 → NAT Gateway (nat-xxxxx) [opcional]
```

### 1.4 Crear DB Subnet Group

Aurora requiere un DB Subnet Group con subnets en al menos 2 AZs.

1. Ve a **RDS** → **Subnet groups**
2. Clic en **"Create DB subnet group"**

**Configuración**:
- **Name**: `zititex-db-subnet-group`
- **Description**: `Aurora subnet group for Zititex`
- **VPC**: Selecciona `zititex-vpc`

**Add subnets**:
- **Availability Zones**: Selecciona `us-east-1a`, `us-east-1b`
- **Subnets**: 
  - ✅ `10.0.128.0/24` (private1)
  - ✅ `10.0.129.0/24` (private2)

**¿Por qué subnets privadas?**
- Mejor seguridad (no expuestas directamente)
- Aurora puede tener acceso público incluso en subnet privada
- Lambda accede vía IP privada

3. Clic en **"Create"**

---

## Paso 2: Configurar Security Groups

Necesitamos 2 Security Groups:
1. **DB Security Group**: Para Aurora
2. **Lambda Security Group**: Para Lambda

### 2.1 Crear DB Security Group

1. Ve a **VPC** → **Security Groups**
2. Clic en **"Create security group"**

**Basic details**:
- **Security group name**: `zititex-aurora-sg`
- **Description**: `Security group for Aurora DB`
- **VPC**: Selecciona `zititex-vpc`

**Inbound rules**: Clic en **"Add rule"**

**Regla 1 - Acceso desde tu IP (Internet)**:
```
Type: MySQL/Aurora (o PostgreSQL)
Port: 3306 (MySQL) o 5432 (PostgreSQL)
Source: My IP (tu IP pública actual)
Description: Access from my development machine
```

**IMPORTANTE**: Tu IP pública la puedes obtener con:
```bash
curl ifconfig.me
# O visita: https://www.whatismyip.com/
```

**Regla 2 - Acceso desde Lambda** (agregaremos después):
```
Type: MySQL/Aurora (o PostgreSQL)
Port: 3306 (o 5432)
Source: Custom (Lambda Security Group) - lo configuraremos después
Description: Access from Lambda functions
```

**Outbound rules**:
- Deja el default (All traffic → 0.0.0.0/0)

3. Clic en **"Create security group"**
4. **Guarda el Security Group ID**: `sg-0123456789abcdef0`

### 2.2 Crear Lambda Security Group

1. Clic en **"Create security group"** nuevamente

**Basic details**:
- **Security group name**: `zititex-lambda-sg`
- **Description**: `Security group for Lambda functions`
- **VPC**: Selecciona `zititex-vpc`

**Inbound rules**: 
- No necesitas ninguna (Lambda no recibe conexiones entrantes)

**Outbound rules**:
- Deja el default (All traffic → 0.0.0.0/0)
- Esto permite a Lambda conectarse a Aurora, internet, etc.

2. Clic en **"Create security group"**
3. **Guarda el Security Group ID**: `sg-abcdef0123456789`

### 2.3 Actualizar DB Security Group

Ahora actualizamos la Regla 2 del DB Security Group:

1. Ve al Security Group `zititex-aurora-sg`
2. Tab **"Inbound rules"** → **"Edit inbound rules"**
3. Agrega nueva regla:

```
Type: MySQL/Aurora (o PostgreSQL)
Port: 3306 (o 5432)
Source: sg-abcdef0123456789 (zititex-lambda-sg)
Description: Access from Lambda functions
```

4. Clic en **"Save rules"**

**Resultado final del DB Security Group**:
```
Inbound Rules:
  1. MySQL/Aurora (3306) ← Tu IP pública      (Internet)
  2. MySQL/Aurora (3306) ← Lambda SG ID       (Lambda)

Outbound Rules:
  1. All traffic (0-65535) → 0.0.0.0/0
```

---

## Paso 3: Crear Aurora DB Cluster

### 3.1 Ir a RDS

1. Ve a AWS Console → **RDS**
2. Clic en **"Create database"**

### 3.2 Elegir Motor y Modo

**Choose a database creation method**:
- Selecciona: **"Standard create"** (más control)

**Engine options**:
- **Engine type**: `Amazon Aurora`
- **Edition**: 
  - `Amazon Aurora MySQL-Compatible Edition` (recomendado)
  - O `Amazon Aurora PostgreSQL-Compatible Edition`
- **Version**: Elige la última versión estable
  - MySQL: `Aurora MySQL 3.05.2 (compatible with MySQL 8.0.32)`
  - PostgreSQL: `Aurora PostgreSQL 15.4`

**Database features**:
- Selecciona: **"Provisioned"** (para desarrollo)
- O selecciona: **"Serverless v2"** (escala automática, mínimo/máximo ACUs)

### 3.3 Configuración de Templates y Settings

**Templates**:
- **Dev/Test** (para desarrollo, puede ser Single-AZ)
- **Production** (Multi-AZ, alta disponibilidad)

**Settings**:
- **DB cluster identifier**: `zititex-aurora-cluster`
- **Master username**: `admin` (o el que prefieras)
- **Master password**: 
  - Crea una contraseña fuerte: `MySecurePassword123!`
  - ✅ Marca: "Auto generate a password" (AWS la genera)
  - O ingresa manualmente

**IMPORTANTE**: Guarda las credenciales:
```
Endpoint: [Se generará después]
Username: admin
Password: MySecurePassword123!
Port: 3306 (MySQL) o 5432 (PostgreSQL)
```

### 3.4 Configuración de Instancia (Provisioned)

**DB instance class**:
- **Burstable classes**: `db.t3.medium` (2 vCPU, 4 GB RAM) - Económico
- **Memory optimized**: `db.r6g.large` (2 vCPU, 16 GB RAM) - Producción

**Availability & durability**:
- **Multi-AZ deployment**: 
  - ✅ `Create an Aurora Replica in a different AZ` (Producción)
  - ❌ `Don't create an Aurora Replica` (Dev/Test, más barato)

### 3.5 Configuración de Conectividad (CRÍTICO)

**Connectivity**:

**Virtual private cloud (VPC)**:
- Selecciona: `zititex-vpc`

**DB subnet group**:
- Selecciona: `zititex-db-subnet-group`

**Public access**:
- **IMPORTANTE**: Selecciona **"Yes"** ✅
- Esto permite acceso desde internet (con Security Group restringido)
- Lambda seguirá usando IP privada automáticamente

**VPC security group**:
- Selecciona: **"Choose existing"**
- Selecciona: `zititex-aurora-sg`
- Remueve el "default" security group

**Availability Zone**: aca voy
- `No preference` (AWS lo elige)

**Additional configuration**:
- **Database port**: `3306` (MySQL) o `5432` (PostgreSQL)

### 3.6 Configuración Adicional

**Database options**:

**Initial database name**: `zititex_db`
- IMPORTANTE: Esto crea la base de datos automáticamente
- Si no lo pones, tendrás que crear la DB manualmente

**DB cluster parameter group**: `default.aurora-mysql8.0` (o PostgreSQL)
**DB parameter group**: `default.aurora-mysql8.0` (o PostgreSQL)

**Backup**:
- **Backup retention period**: `7 days` (Producción: 30 días)
- **Backup window**: `No preference` (AWS lo elige)
- ✅ Enable automated backups

**Encryption**:
- ✅ **Enable encryption** (recomendado)
- **AWS KMS key**: `(default) aws/rds`

**Performance Insights**:
- ✅ Enable Performance Insights (7 días gratis)
- Retention period: `7 days`

**Monitoring**:
- ✅ Enable Enhanced monitoring
- Granularity: `60 seconds`

**Log exports** (Opcional):
- ✅ Audit log
- ✅ Error log
- ✅ General log
- ✅ Slow query log

**Maintenance**:
- ✅ Enable auto minor version upgrade
- **Maintenance window**: `No preference`

**Deletion protection**:
- ✅ Enable deletion protection (Producción)
- ❌ Disable (Dev/Test, para poder eliminar fácilmente)

### 3.7 Estimación de Costos

Antes de crear, revisa la estimación de costos en el panel derecho.

**Ejemplo (db.t3.medium, Single-AZ)**:
- ~$0.082/hora × 730 horas = **~$60/mes**

**Ejemplo (db.t3.medium, Multi-AZ con replica)**:
- ~$0.082/hora × 2 × 730 horas = **~$120/mes**

### 3.8 Crear Database

1. Revisa toda la configuración
2. Clic en **"Create database"**
3. Si elegiste auto-generate password, **descarga las credenciales** inmediatamente
4. La creación toma **10-15 minutos** ⏱️

**Status inicial**: `Creating`
**Status final**: `Available` ✅

### 3.9 Obtener Endpoint de Conexión

1. Ve a **RDS** → **Databases**
2. Clic en `zititex-aurora-cluster`
3. Tab **"Connectivity & security"**

**Guarda estos datos**:
```
Cluster Endpoint (Writer): zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com
Reader Endpoint: zititex-aurora-cluster.cluster-ro-xxxxx.us-east-1.rds.amazonaws.com
Port: 3306
```

**Endpoints**:
- **Writer Endpoint**: Para INSERT, UPDATE, DELETE (writes)
- **Reader Endpoint**: Para SELECT (reads) - distribuye entre replicas

---

## Paso 4: Configurar Acceso Público

### 4.1 Verificar Public Access

1. Ve a tu DB cluster → Tab **"Connectivity & security"**
2. Verifica:
   - **Publicly accessible**: `Yes` ✅
   - **VPC security groups**: `zititex-aurora-sg`

### 4.2 Configurar Acceso desde Internet

**Tienes 2 opciones:**

#### Opción A: Acceso Solo desde tu IP (Recomendado para Desarrollo)

**Seguro pero requiere actualizar cuando tu IP cambia:**

1. Ve a **VPC** → **Security Groups** → `zititex-aurora-sg`
2. Tab **"Inbound rules"** → **"Edit inbound rules"**
3. Clic en **"Add rule"** o edita la regla existente
4. Configura:
   ```bash
   # Obtén tu IP actual:
   curl ifconfig.me
   # Output: 203.0.113.45
   
   # En AWS Security Group:
   Type: MySQL/Aurora
   Port: 3306
   Source: 203.0.113.45/32
   Description: My development machine
   ```
5. Clic en **"Save rules"**

**Nota**: Si tu IP cambia (ISP dinámico), repite estos pasos.

#### Opción B: Acceso desde Cualquier IP (0.0.0.0/0) ⚠️

**⚠️ ADVERTENCIA DE SEGURIDAD**: Esto permite que **cualquier persona en internet** intente conectarse a tu base de datos. Solo úsalo si:
- Es un ambiente de desarrollo/pruebas
- Tienes autenticación fuerte (usuario/password seguros)
- Entiendes los riesgos de seguridad

**Pasos para habilitar acceso desde cualquier IP:**

1. Ve a **VPC** → **Security Groups**
2. Busca y selecciona `zititex-aurora-sg`
3. Tab **"Inbound rules"** → **"Edit inbound rules"**
4. Busca si ya existe una regla para puerto 3306:
   - Si existe: **Edítala**
   - Si no existe: Clic en **"Add rule"**
5. Configura la regla:
   ```
   Type: MySQL/Aurora
   Protocol: TCP
   Port range: 3306
   Source: 0.0.0.0/0
   Description: Public access from internet (⚠️ Development only)
   ```
6. Clic en **"Save rules"**
7. Espera 30 segundos para que los cambios se apliquen

**🔒 Recomendaciones de Seguridad para Opción B:**

- ✅ Usa contraseñas **MUY FUERTES** (mínimo 20 caracteres, alfanuméricos + símbolos)
- ✅ Deshabilita acceso de root desde IPs remotas
- ✅ Crea usuarios con permisos mínimos necesarios
- ✅ Habilita SSL/TLS obligatorio en conexiones
- ✅ Monitorea CloudWatch Logs para intentos de acceso sospechosos
- ✅ Considera usar AWS Secrets Manager para credenciales
- ❌ **NUNCA uses esto en producción sin autenticación adicional (VPN, bastion host, etc.)**

**Ejemplo de configuración MySQL/Aurora segura:**

```sql
-- Crear usuario con acceso remoto limitado
CREATE USER 'dev_user'@'%' IDENTIFIED BY 'TuPasswordSuperSeguro123!@#';

-- Otorgar solo permisos necesarios
GRANT SELECT, INSERT, UPDATE ON zititex_db.* TO 'dev_user'@'%';

-- Forzar SSL (recomendado)
ALTER USER 'dev_user'@'%' REQUIRE SSL;

FLUSH PRIVILEGES;
```

**Alternativa Más Segura**: En lugar de `0.0.0.0/0`, considera usar un rango de IPs conocido:
- Oficina: `203.0.113.0/24` (permite IPs 203.0.113.0-255)
- Cloud Provider: `52.0.0.0/8` (permite IPs de AWS)
- Equipo específico: `203.0.113.45/32` (solo una IP)

### 4.3 Probar Conexión desde tu Máquina

**Opción A: Usando MySQL CLI**:
```bash
# Instalar MySQL Client (si no lo tienes)
# Mac:
brew install mysql-client

# Ubuntu/Debian:
sudo apt-get install mysql-client

# Windows: Descargar MySQL Workbench

# Conectar
mysql -h zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com \
      -u admin \
      -p \
      --ssl-mode=REQUIRED

# Ingresa password cuando lo pida
# Si conecta exitosamente, verás:
# mysql>
```

**Opción B: Usando PostgreSQL CLI**:
```bash
# Instalar psql
# Mac:
brew install postgresql

# Ubuntu/Debian:
sudo apt-get install postgresql-client

# Conectar
psql -h zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com \
     -U admin \
     -d zititex_db \
     -p 5432

# Ingresa password cuando lo pida
```

**Opción C: Usando DBeaver (GUI)**:

1. Descarga DBeaver: https://dbeaver.io/
2. Nueva conexión:
   - **Host**: `zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com`
   - **Port**: `3306` (o 5432)
   - **Database**: `zititex_db`
   - **Username**: `admin`
   - **Password**: `MySecurePassword123!`
   - **SSL**: `require`
3. Clic en **"Test Connection"**
4. Debe decir: **"Connected"** ✅

### 4.4 Crear Tabla de Prueba

```sql
-- MySQL
USE zititex_db;

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar dato de prueba
INSERT INTO contacts (full_name, email, phone, company, message)
VALUES ('Test User', 'test@example.com', '+57 300 123 4567', 'Test Corp', 'Test message');

-- Verificar
SELECT * FROM contacts;
```

```sql
-- PostgreSQL
\c zititex_db;

CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar dato de prueba
INSERT INTO contacts (full_name, email, phone, company, message)
VALUES ('Test User', 'test@example.com', '+57 300 123 4567', 'Test Corp', 'Test message');

-- Verificar
SELECT * FROM contacts;
```

---

## Paso 5: Configurar Lambda con VPC

### 5.1 Crear Lambda Function

1. Ve a **Lambda** → **Functions**
2. Clic en **"Create function"**

**Basic information**:
- **Function name**: `zititex-contact-handler`
- **Runtime**: `Python 3.12` (o Node.js 20.x)
- **Architecture**: `x86_64`

**Permissions**:
- Selecciona: **"Create a new role with basic Lambda permissions"**

3. Clic en **"Create function"**

### 5.2 Configurar VPC

1. En tu Lambda function, ve a **"Configuration"** tab
2. Selecciona **"VPC"** en el menú izquierdo
3. Clic en **"Edit"**

**VPC**:
- Selecciona: `zititex-vpc`

**Subnets**:
- ✅ Selecciona las 2 subnets **PRIVADAS**:
  - `zititex-subnet-private1-us-east-1a` (10.0.128.0/24)
  - `zititex-subnet-private2-us-east-1b` (10.0.129.0/24)

**¿Por qué subnets privadas para Lambda?**
- Mejor práctica de seguridad
- Lambda accede a Aurora vía IP privada (más rápido)
- Si necesitas internet, usa NAT Gateway

**Security groups**:
- Selecciona: `zititex-lambda-sg`

4. Clic en **"Save"**

**IMPORTANTE**: Esto toma **1-2 minutos** para crear las ENIs (Elastic Network Interfaces).

### 5.3 Agregar Layer de MySQL/PostgreSQL

**Para Python + MySQL**:
```bash
# El driver mysql-connector-python debe estar en un Layer
# Lambda no incluye drivers de DB por default
```

**Para Python + PostgreSQL**:
```bash
# El driver psycopg2 debe estar en un Layer
```

**Para Node.js**:
```bash
# mysql2 o pg deben estar en node_modules
```

Opción más fácil: Usar AWS Data API (sin drivers, ver sección 5.7).

### 5.4 Código Lambda - Python + MySQL

```python
import json
import os
import pymysql

# Configuración desde variables de entorno
DB_HOST = os.environ['DB_HOST']
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_NAME = os.environ['DB_NAME']

def lambda_handler(event, context):
    """
    Lambda handler para insertar contactos en Aurora MySQL
    """
    
    # Parsear el body del request
    try:
        body = json.loads(event.get('body', '{}'))
    except:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON'})
        }
    
    # Validar campos requeridos
    required_fields = ['full_name', 'email']
    for field in required_fields:
        if field not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'Missing field: {field}'})
            }
    
    # Conectar a la base de datos
    connection = None
    try:
        # Usar el endpoint privado (IP interna dentro de VPC)
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            connect_timeout=5
        )
        
        with connection.cursor() as cursor:
            # Insert query
            sql = """
                INSERT INTO contacts 
                (full_name, email, phone, company, message) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                body.get('full_name'),
                body.get('email'),
                body.get('phone', ''),
                body.get('company', ''),
                body.get('message', '')
            ))
            
            connection.commit()
            contact_id = cursor.lastrowid
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Contact saved successfully',
                'contact_id': contact_id
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
    
    finally:
        if connection:
            connection.close()
```

### 5.5 Código Lambda - Node.js + MySQL

```javascript
const mysql = require('mysql2/promise');

// Configuración desde variables de entorno
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 5000
};

exports.handler = async (event) => {
    // Parsear body
    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON' })
        };
    }
    
    // Validar campos requeridos
    if (!body.full_name || !body.email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required fields' })
        };
    }
    
    // Conectar a la base de datos
    let connection;
    try {
        // Usar el endpoint privado (IP interna dentro de VPC)
        connection = await mysql.createConnection(dbConfig);
        
        // Insert query
        const [result] = await connection.execute(
            `INSERT INTO contacts 
             (full_name, email, phone, company, message) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                body.full_name,
                body.email,
                body.phone || '',
                body.company || '',
                body.message || ''
            ]
        );
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: 'Contact saved successfully',
                contact_id: result.insertId
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
        
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};
```

### 5.6 Configurar Variables de Entorno

1. En Lambda → **Configuration** → **Environment variables**
2. Clic en **"Edit"**
3. Agregar:

```
Key: DB_HOST
Value: zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com

Key: DB_USER
Value: admin

Key: DB_PASSWORD
Value: MySecurePassword123!

Key: DB_NAME
Value: zititex_db
```

4. Clic en **"Save"**

### 5.7 Alternativa: Usar AWS Data API (Sin VPC)

**Ventajas**:
- ✅ No necesita Lambda en VPC (más rápido cold start)
- ✅ No necesita drivers de base de datos
- ✅ Conexiones HTTP, no TCP
- ✅ Secrets Manager integration

**Requisitos**:
- Aurora Serverless v2 con Data API habilitado

**Ejemplo Python con Data API**:
```python
import boto3
import json

rds_client = boto3.client('rds-data')

def lambda_handler(event, context):
    body = json.loads(event['body'])
    
    response = rds_client.execute_statement(
        resourceArn='arn:aws:rds:us-east-1:123456789:cluster:zititex-aurora-cluster',
        secretArn='arn:aws:secretsmanager:us-east-1:123456789:secret:aurora-secret',
        database='zititex_db',
        sql="""
            INSERT INTO contacts 
            (full_name, email, phone, company, message) 
            VALUES (:full_name, :email, :phone, :company, :message)
        """,
        parameters=[
            {'name': 'full_name', 'value': {'stringValue': body['full_name']}},
            {'name': 'email', 'value': {'stringValue': body['email']}},
            {'name': 'phone', 'value': {'stringValue': body.get('phone', '')}},
            {'name': 'company', 'value': {'stringValue': body.get('company', '')}},
            {'name': 'message', 'value': {'stringValue': body.get('message', '')}}
        ]
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({'success': True})
    }
```

---

## Paso 6: Testing y Verificación

### 6.1 Probar Lambda Localmente

**Crear evento de prueba**:

1. En Lambda → **Test** tab
2. **Event name**: `test-contact`
3. **Event JSON**:

```json
{
  "body": "{\"full_name\":\"Lambda Test\",\"email\":\"lambda@test.com\",\"phone\":\"+57 300 123 4567\",\"company\":\"AWS\",\"message\":\"Testing from Lambda\"}"
}
```

4. Clic en **"Save"**
5. Clic en **"Test"**

**Resultado esperado**:
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{\"success\":true,\"message\":\"Contact saved successfully\",\"contact_id\":2}"
}
```

### 6.2 Verificar en Base de Datos

```sql
-- Conectar a Aurora
mysql -h zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com \
      -u admin -p

-- Verificar el registro
USE zititex_db;
SELECT * FROM contacts ORDER BY id DESC LIMIT 5;
```

**Deberías ver**:
```
+----+-------------+------------------+-------------------+---------+------------------------+---------------------+
| id | full_name   | email            | phone             | company | message                | created_at          |
+----+-------------+------------------+-------------------+---------+------------------------+---------------------+
|  2 | Lambda Test | lambda@test.com  | +57 300 123 4567  | AWS     | Testing from Lambda    | 2025-10-23 10:30:45 |
|  1 | Test User   | test@example.com | +57 300 123 4567  | Test Co | Test message           | 2025-10-23 10:15:22 |
+----+-------------+------------------+-------------------+---------+------------------------+---------------------+
```

### 6.3 Monitorear Lambda Logs

1. Ve a Lambda → **Monitor** tab
2. Clic en **"View CloudWatch logs"**
3. Selecciona el último log stream
4. Deberías ver logs de conexión exitosa

### 6.4 Crear API Gateway (Opcional)

Para exponer Lambda como API HTTP:

1. Ve a **API Gateway** → **Create API**
2. Selecciona **"HTTP API"**
3. **Integrations**: Add integration → Lambda
4. **Lambda function**: `zititex-contact-handler`
5. **API name**: `zititex-contact-api`
6. **Routes**: `POST /contact`
7. Clic en **"Create"**

**Obtén la URL**:
```
https://abc123xyz.execute-api.us-east-1.amazonaws.com/contact
```

**Probar con cURL**:
```bash
curl -X POST https://abc123xyz.execute-api.us-east-1.amazonaws.com/contact \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "API Test",
    "email": "api@test.com",
    "phone": "+57 300 123 4567",
    "company": "Test Corp",
    "message": "Testing via API Gateway"
  }'
```

---

## Mejores Prácticas de Seguridad

### 1. Usar AWS Secrets Manager

**NO guardes credenciales en variables de entorno**. Usa Secrets Manager:

```python
import boto3
import json

def get_db_credentials():
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId='aurora/zititex/credentials')
    secret = json.loads(response['SecretString'])
    return secret

def lambda_handler(event, context):
    creds = get_db_credentials()
    connection = pymysql.connect(
        host=creds['host'],
        user=creds['username'],
        password=creds['password'],
        database=creds['dbname']
    )
    # ...
```

**Crear Secret**:
```bash
aws secretsmanager create-secret \
  --name aurora/zititex/credentials \
  --secret-string '{
    "host": "zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com",
    "username": "admin",
    "password": "MySecurePassword123!",
    "dbname": "zititex_db"
  }'
```

### 2. Usar IAM Authentication (Sin Contraseñas)

Aurora soporta autenticación con IAM:

```python
import boto3
import pymysql

def get_iam_auth_token():
    rds_client = boto3.client('rds')
    token = rds_client.generate_db_auth_token(
        DBHostname='zititex-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com',
        Port=3306,
        DBUsername='admin',
        Region='us-east-1'
    )
    return token

connection = pymysql.connect(
    host=DB_HOST,
    user='admin',
    password=get_iam_auth_token(),
    database='zititex_db',
    ssl={'ca': '/opt/rds-ca-bundle.pem'}
)
```

### 3. Limitar Acceso Público

**Producción**: Deshabilita acceso público, usa bastion host o VPN:

1. RDS → Database → **Modify**
2. **Connectivity** → **Public access**: `No`
3. Clic en **"Continue"** → **"Apply immediately"**

Para acceder desde tu máquina:
- Opción A: VPN a VPC
- Opción B: Bastion host (EC2 en subnet pública)
- Opción C: AWS Systems Manager Session Manager

### 4. Rotar Credenciales Regularmente

```bash
# Cambiar password cada 90 días
aws rds modify-db-cluster \
  --db-cluster-identifier zititex-aurora-cluster \
  --master-user-password NewSecurePassword456!
```

### 5. Habilitar Audit Logging

```sql
-- MySQL: Verificar logs habilitados
SHOW VARIABLES LIKE 'audit%';

-- Ver slow queries
SELECT * FROM mysql.slow_log LIMIT 10;
```

### 6. Usar Connection Pooling

**Lambda puede agotar conexiones**. Usa RDS Proxy:

1. Ve a **RDS** → **Proxies** → **Create proxy**
2. **Proxy identifier**: `zititex-aurora-proxy`
3. **Target group**: `zititex-aurora-cluster`
4. **Secret**: Selecciona de Secrets Manager
5. **VPC**: `zititex-vpc`
6. **Security group**: `zititex-aurora-sg`

Luego en Lambda, conecta al proxy endpoint en lugar del cluster endpoint.

---

## Troubleshooting

### Problema 1: Lambda no puede conectar a Aurora

**Error**: `Can't connect to MySQL server` o `Timeout`

**Causas**:
1. Lambda no está en VPC
2. Lambda está en subnet pública (debería estar en privada)
3. Security Group no permite Lambda → Aurora
4. Endpoint incorrecto

**Solución**:
```bash
# 1. Verificar Lambda VPC configuration
aws lambda get-function-configuration \
  --function-name zititex-contact-handler \
  --query 'VpcConfig'

# Debe mostrar:
# {
#     "SubnetIds": ["subnet-xxx", "subnet-yyy"],
#     "SecurityGroupIds": ["sg-zzz"],
#     "VpcId": "vpc-abc"
# }

# 2. Verificar Security Group permite tráfico
aws ec2 describe-security-groups \
  --group-ids sg-auroraXXX \
  --query 'SecurityGroups[0].IpPermissions'

# Debe tener regla con SourceSecurityGroupId = Lambda SG
```

### Problema 2: "No space left on /tmp" en Lambda

**Causa**: Lambda tiene solo 512 MB en /tmp

**Solución**:
```python
# No guardes archivos grandes en /tmp
# Usa streaming en lugar de buffering completo
```

### Problema 3: "Too many connections" en Aurora

**Causa**: Lambda crea muchas conexiones concurrentes

**Solución**:
1. Usar RDS Proxy (recomendado)
2. Aumentar `max_connections` en parameter group
3. Implementar connection pooling

```sql
-- Ver conexiones actuales
SHOW PROCESSLIST;

-- Ver límite
SHOW VARIABLES LIKE 'max_connections';
```

### Problema 4: Lambda timeout (30 segundos)

**Causa**: Query lenta o cold start de VPC

**Solución**:
```bash
# Aumentar timeout
aws lambda update-function-configuration \
  --function-name zititex-contact-handler \
  --timeout 60

# Optimizar queries
# Agregar índices a tablas
```

### Problema 5: "Connection timed out" al conectar desde tu máquina

**Error**:
```
Socket fail to connect to host: xxx.rds.amazonaws.com, port:3306
Connect timed out
```

**Este es el problema MÁS COMÚN**. Causas posibles:

#### Causa 1: Security Group no permite tu IP (90% de los casos)

**Diagnóstico**:
1. Ve a **RDS** → **Databases** → Tu cluster
2. Tab **"Connectivity & security"**
3. Clic en el **Security Group** (ej: `sg-0123456789abcdef`)
4. Tab **"Inbound rules"**
5. Verifica si hay una regla con:
   - Type: `MySQL/Aurora` (o `MYSQL` o `Custom TCP`)
   - Port: `3306`
   - Source: Tu IP pública

**Solución**:

**Paso 1**: Obtén tu IP pública:
```bash
# En terminal (Mac/Linux)
curl ifconfig.me

# O visita en navegador
https://www.whatismyip.com/

# Resultado ejemplo: 203.0.113.45
```

**Paso 2**: Agrega tu IP al Security Group:
1. Ve a **VPC** → **Security Groups**
2. Busca y selecciona el Security Group de Aurora (ej: `zititex-aurora-sg`)
3. Tab **"Inbound rules"** → **"Edit inbound rules"**
4. Busca si ya existe una regla para puerto 3306
   - Si existe con IP incorrecta: **Edítala**
   - Si NO existe: Clic en **"Add rule"**

5. Configurar la regla:
```
Type: MySQL/Aurora
Protocol: TCP
Port range: 3306
Source: My IP (automático) o Custom → 203.0.113.45/32
Description: My development machine
```

6. Clic en **"Save rules"**

**Paso 3**: Espera 30 segundos y reintenta la conexión

**⚠️ IMPORTANTE**: 
- Usa `/32` al final de tu IP (ej: `203.0.113.45/32`)
- `/32` significa "solo esta IP exacta"
- **Para acceso desde cualquier IP** (⚠️ solo desarrollo), usa `0.0.0.0/0` (ver sección 4.2 Opción B)

#### Causa 2: Public Access deshabilitado

**Diagnóstico**:
1. Ve a **RDS** → **Databases** → Tu cluster
2. Tab **"Connectivity & security"**
3. Busca **"Publicly accessible"**
4. Debe decir: **`Yes`** ✅

Si dice **`No`** ❌:

**Solución**:
1. Clic en **"Modify"** (botón arriba)
2. Sección **"Connectivity"**
3. **"Public access"**: Cambia a **`Publicly accessible`** ✅
4. Scroll abajo → **"Continue"**
5. **"Apply immediately"** ✅ (importante)
6. Clic en **"Modify DB instance"**
7. Espera 5-10 minutos (el cluster se reinicia)

#### Causa 3: VPC/Subnet incorrectos

**Diagnóstico**:
1. Ve a **RDS** → **Databases** → Tu cluster
2. Tab **"Connectivity & security"**
3. Verifica:
   - **VPC**: Debe ser tu VPC (ej: `zititex-vpc`)
   - **Subnets**: Deben estar en 2 AZs diferentes
   - **VPC security groups**: Debe tener tu Security Group

Si la configuración es incorrecta, necesitarás:
- Crear snapshot del cluster
- Restaurar en nueva configuración de VPC
- (No se puede cambiar VPC de un cluster existente)

#### Causa 4: Firewall corporativo o ISP

**Diagnóstico**:
```bash
# Probar conectividad al puerto 3306
telnet zititex-aurora-cluster.cluster-xxx.us-east-2.rds.amazonaws.com 3306

# O con nc (netcat)
nc -zv zititex-aurora-cluster.cluster-xxx.us-east-2.rds.amazonaws.com 3306

# Si se conecta, verás:
# Connection to xxx.rds.amazonaws.com port 3306 [tcp/mysql] succeeded!
```

**Si falla**:
- Tu red corporativa/ISP puede bloquear puerto 3306 saliente
- Intenta desde otra red (hotspot de celular, otra wifi)
- Usa VPN
- O usa bastion host en AWS

#### Causa 5: Endpoint incorrecto

**Verificar endpoint correcto**:
1. Ve a **RDS** → **Databases**
2. Clic en tu **cluster** (no la instancia individual)
3. Tab **"Connectivity & security"**
4. Copia el **"Endpoint"** que dice **"Writer instance"**

Debe verse así:
```
✅ Correcto (Cluster endpoint):
zititex-aurora-cluster.cluster-cjiwim4msvqt.us-east-2.rds.amazonaws.com

❌ Incorrecto (Instance endpoint):
zititex-aurora-cluster-instance-1.cjiwim4msvqt.us-east-2.rds.amazonaws.com
```

---

### Diagnóstico Rápido - Comando TODO-EN-UNO

```bash
#!/bin/bash

echo "=== Diagnóstico de Conexión Aurora ==="
echo ""

# 1. Tu IP pública
echo "1. Tu IP pública:"
curl -s ifconfig.me
echo ""
echo ""

# 2. Test DNS
ENDPOINT="zititex-aurora-cluster.cluster-cjiwim4msvqt.us-east-2.rds.amazonaws.com"
echo "2. Resolviendo DNS:"
nslookup $ENDPOINT | grep "Address:"
echo ""

# 3. Test conectividad
echo "3. Test conectividad puerto 3306:"
timeout 5 bash -c "</dev/tcp/$ENDPOINT/3306" 2>/dev/null && \
  echo "✅ Puerto 3306 ACCESIBLE" || \
  echo "❌ Puerto 3306 BLOQUEADO (Security Group o Firewall)"
echo ""

# 4. Ruta de red
echo "4. Traceroute al host:"
traceroute -m 5 $ENDPOINT | head -n 7
echo ""

echo "=== Fin del diagnóstico ==="
```

**Guarda esto en un archivo `test-aurora-connection.sh` y ejecútalo**:
```bash
chmod +x test-aurora-connection.sh
./test-aurora-connection.sh
```

---

### Solución Paso a Paso para tu caso específico

Basado en tu error, el problema es **99% Security Group**. Sigue estos pasos:

**1. Obtén tu IP**:
```bash
curl ifconfig.me
# Anota el resultado
```

**2. Ve a AWS Console**:
- **RDS** → **Databases** → `zititex-aurora-cluster`
- Tab **"Connectivity & security"**
- Anota el **Security Group ID** (ej: `sg-0abc123def456`)

**3. Edita Security Group**:
- **VPC** → **Security Groups**
- Busca el Security Group del paso 2
- **Inbound rules** → **Edit inbound rules**
- **Add rule**:
  ```
  Type: MySQL/Aurora
  Port: 3306
  Source: [Tu IP del paso 1]/32
  ```
- **Save rules**

**4. Reintenta conexión** (30 segundos después)

**5. Si aún falla, verifica Public Access**:
- **RDS** → **Databases** → Cluster → **Modify**
- **Connectivity** → **Publicly accessible**: `Yes`
- **Apply immediately**

---

### Problema 6: "Public accessibility disabled"

**Causa**: Olvidaste habilitar public access

**Solución**:
1. RDS → Database → **Modify**
2. **Connectivity** → **Public access**: `Yes`
3. **Apply immediately**
4. Espera 5-10 minutos

---

## Costos Estimados

### Aurora Provisioned (db.t3.medium)

**Compute**:
- Writer instance: $0.082/hora × 730 horas = **$59.86/mes**
- Reader instance (opcional): $0.082/hora × 730 horas = **$59.86/mes**
- **Total Compute**: $59.86 - $119.72/mes

**Storage**:
- $0.10/GB-mes
- Ejemplo: 50 GB = **$5/mes**
- Crece automáticamente (1 GB a 128 TB)

**I/O**:
- $0.20 por millón de requests
- Ejemplo: 10M requests = **$2/mes**

**Backup**:
- Storage adicional (más allá de DB size): $0.021/GB-mes
- Ejemplo: 50 GB extra = **$1.05/mes**

**Total Estimado (Single-AZ)**:
- **$67-70/mes** (pequeña carga)

**Total Estimado (Multi-AZ)**:
- **$127-130/mes** (alta disponibilidad)

### Aurora Serverless v2

**ACU (Aurora Capacity Units)**:
- $0.12/ACU-hora
- Mínimo: 0.5 ACU
- Máximo: Configurado por ti (ej: 16 ACU)

**Ejemplo (promedio 2 ACU)**:
- $0.12 × 2 × 730 = **$175.20/mes**

**Storage e I/O**: Igual que Provisioned

**Ventajas**:
- Escala automáticamente (0.5 - N ACU)
- Pagas solo por lo que usas
- Puede pausarse automáticamente (ahorra 99%)

### Lambda

**Invocations**:
- Primer 1M/mes: **GRATIS**
- Después: $0.20 por millón

**Duration**:
- 400,000 GB-segundos gratis/mes
- Ejemplo: 1M requests × 1 segundo × 512 MB = **GRATIS** (dentro del tier gratuito)

**VPC ENI**: Sin costo adicional

**Estimado**: **$0-5/mes** (pequeña/mediana aplicación)

### NAT Gateway (Si Lambda necesita internet)

- $0.045/hora × 730 = **$32.85/mes**
- $0.045/GB procesado
- **Total**: ~$35-50/mes

### Secrets Manager

- $0.40/secreto/mes
- $0.05 por 10,000 API calls
- **Total**: **~$0.50/mes**

### Total Mensual Estimado

**Opción Económica (Dev)**:
- Aurora db.t3.medium Single-AZ: $70
- Lambda: $2
- Secrets Manager: $0.50
- **Total: ~$72/mes**

**Opción Producción**:
- Aurora db.t3.medium Multi-AZ: $130
- Lambda: $5
- NAT Gateway: $40
- Secrets Manager: $0.50
- **Total: ~$175/mes**

---

## Próximos Pasos

### 1. Optimización de Rendimiento

**Connection Pooling con RDS Proxy**:
- Reduce latencia en Lambda
- Maneja miles de conexiones concurrentes
- $0.015/hora ($11/mes)

**Read Replicas**:
- Separa reads de writes
- Usa reader endpoint para SELECTs
- Mejora throughput

### 2. Monitoreo y Alertas

**CloudWatch Alarms**:
```bash
# Alert si CPU > 80%
aws cloudwatch put-metric-alarm \
  --alarm-name aurora-high-cpu \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --metric-name CPUUtilization \
  --namespace AWS/RDS \
  --period 300 \
  --statistic Average \
  --threshold 80 \
  --dimensions Name=DBClusterIdentifier,Value=zititex-aurora-cluster
```

**Performance Insights**:
- Analiza queries lentas
- Identifica bottlenecks
- Gratis por 7 días de retención

### 3. Backup y Recovery

**Automated Backups**:
- Ya configurados (7-30 días retención)
- Point-in-time recovery

**Manual Snapshots**:
```bash
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier zititex-aurora-cluster \
  --db-cluster-snapshot-identifier zititex-manual-snapshot-2025-10-23
```

**Restore**:
```bash
aws rds restore-db-cluster-to-point-in-time \
  --db-cluster-identifier zititex-aurora-restored \
  --source-db-cluster-identifier zititex-aurora-cluster \
  --restore-to-time 2025-10-23T10:00:00Z
```

### 4. Seguridad Avanzada

**Audit Logging**:
- Ya habilitado en configuración
- Logs en CloudWatch Logs

**Encryption at Rest**:
- Ya habilitado con KMS

**Encryption in Transit**:
- Forzar SSL en código Lambda
- MySQL: `--ssl-mode=REQUIRED`

**Network ACLs**:
- Capa adicional de firewall en subnets

---

## Recursos Adicionales

### Documentación Oficial

- [Aurora User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/)
- [Lambda VPC Configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
- [RDS Security](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.html)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)

### Herramientas

- **DBeaver**: https://dbeaver.io/ (GUI universal)
- **MySQL Workbench**: https://www.mysql.com/products/workbench/
- **pgAdmin**: https://www.pgadmin.org/ (PostgreSQL)
- **AWS CLI**: https://aws.amazon.com/cli/

### Mejores Prácticas

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

---

## Resumen de Comandos

```bash
# Verificar conexión desde tu máquina
mysql -h ENDPOINT -u admin -p

# Probar Lambda
aws lambda invoke \
  --function-name zititex-contact-handler \
  --payload '{"body":"{\"full_name\":\"Test\",\"email\":\"test@test.com\"}"}' \
  response.json

# Ver logs de Lambda
aws logs tail /aws/lambda/zititex-contact-handler --follow

# Crear snapshot manual
aws rds create-db-cluster-snapshot \
  --db-cluster-identifier zititex-aurora-cluster \
  --db-cluster-snapshot-identifier my-snapshot

# Ver status de Aurora
aws rds describe-db-clusters \
  --db-cluster-identifier zititex-aurora-cluster \
  --query 'DBClusters[0].Status'

# Modificar Security Group
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 3306 \
  --cidr YOUR_IP/32
```

---

## Conclusión

Siguiendo esta guía, habrás configurado:

- ✅ Aurora DB Cluster (MySQL o PostgreSQL)
- ✅ VPC con subnets públicas y privadas
- ✅ Security Groups configurados correctamente
- ✅ Acceso desde internet (tu máquina)
- ✅ Lambda con acceso privado a Aurora
- ✅ Conexión segura y optimizada
- ✅ Monitoreo y logs habilitados

**Arquitectura Final**:
```
Internet (Tu IP) ──────────> Aurora DB (Puerto 3306)
                              ↑
Lambda (VPC privada) ────────┘ (IP interna, más rápido)
```

**Ventajas de esta configuración**:
- 🚀 Lambda usa IP privada (baja latencia)
- 🔒 Acceso público restringido a tu IP
- 💰 Costo optimizado (sin bastion host)
- 📊 Fácil de debugging (acceso directo)
- 🔄 Escalable (RDS Proxy, replicas)

**Tiempo total**: 1-2 horas

¿Necesitas ayuda? Revisa la sección de [Troubleshooting](#troubleshooting) o consulta los recursos adicionales.

---

**Última actualización**: 2025-10-23  
**Proyecto**: Zititex  
**Autor**: Equipo de desarrollo

