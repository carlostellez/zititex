# Cómo Eliminar una VPC en AWS - Guía Completa Paso a Paso

## 📋 Índice

- [Por qué necesitas esta guía](#por-qué-necesitas-esta-guía)
- [Antes de comenzar](#antes-de-comenzar)
- [Método 1: Eliminación Automática (Recomendado)](#método-1-eliminación-automática-recomendado)
- [Método 2: Eliminación Manual](#método-2-eliminación-manual)
- [Troubleshooting](#troubleshooting)
- [Verificación Final](#verificación-final)

---

## Por qué necesitas esta guía

**Situaciones comunes**:
- ✅ Creaste una VPC con "VPC only" en lugar de "VPC and more"
- ✅ Quieres empezar de nuevo con la configuración correcta
- ✅ VPC de prueba que ya no necesitas
- ✅ Limpieza de recursos para evitar costos

**⚠️ ADVERTENCIA IMPORTANTE**:
- Eliminar una VPC **borra todos los recursos** dentro de ella
- Esto incluye: EC2, RDS, Lambda (si está conectada), Load Balancers, etc.
- **NO SE PUEDE DESHACER** - Verifica que no necesitas nada antes de eliminar
- Si tienes Aurora o RDS, créales snapshots primero (opcional pero recomendado)

---

## Antes de comenzar

### Verifica qué VPC vas a eliminar

1. Ve a **AWS Console** → **VPC**
2. En el panel izquierdo, clic en **"Your VPCs"**
3. Verás una lista de VPCs:

```
VPC ID           Name              IPv4 CIDR        State
vpc-0abc123      zititex-vpc       10.0.0.0/16     Available
vpc-1def456      default           172.31.0.0/16   Available
```

**⚠️ NUNCA elimines la VPC "default"** - Es la VPC predeterminada de AWS

### Identifica tu VPC

- **Por nombre**: Busca el nombre que le pusiste (ej: `zititex-vpc`)
- **Por CIDR**: Verifica el rango de IPs (ej: `10.0.0.0/16`)
- **Por fecha**: Ordena por fecha de creación

4. **Anota el VPC ID** (ej: `vpc-0abc123def456789`)

---

## Método 1: Eliminación Automática (Recomendado)

AWS puede eliminar la VPC y **todos sus recursos asociados automáticamente**.

### Paso 1: Ir a VPC Console

1. AWS Console → **VPC**
2. Panel izquierdo → **"Your VPCs"**
3. Encuentra tu VPC (ej: `zititex-vpc`)

### Paso 2: Intentar Eliminar

1. **Selecciona** la VPC (checkbox a la izquierda)
2. Clic en **"Actions"** (arriba)
3. Selecciona **"Delete VPC"**

### Paso 3: Revisar Recursos Asociados

AWS te mostrará una ventana con **todos los recursos que se eliminarán**:

```
┌────────────────────────────────────────────────────────┐
│ Delete VPC: vpc-0abc123def456789                       │
├────────────────────────────────────────────────────────┤
│                                                        │
│ ⚠️  The following resources will be deleted:           │
│                                                        │
│ VPC:                    1                              │
│ Subnets:                4                              │
│ Route Tables:           2                              │
│ Internet Gateways:      1                              │
│ NAT Gateways:           2                              │
│ Security Groups:        3                              │
│ Network ACLs:           1                              │
│ VPC Endpoints:          0                              │
│                                                        │
│ [ ] I acknowledge that these resources will be deleted │
│                                                        │
│ To confirm, type: delete                               │
│ [________________]                                     │
│                                                        │
│           [Cancel]              [Delete]               │
└────────────────────────────────────────────────────────┘
```

### Paso 4: Confirmar Eliminación

1. ✅ Marca el checkbox **"I acknowledge..."**
2. Escribe exactamente: **`delete`** (en minúsculas)
3. Clic en **"Delete"** (botón rojo)

### Paso 5: Esperar

- AWS comenzará a eliminar todos los recursos
- Verás una barra de progreso
- **Tiempo estimado**: 2-5 minutos
- **NAT Gateways** son los más lentos (pueden tomar 3-5 minutos)

### Paso 6: Verificar

Si todo salió bien, verás:
```
✅ VPC vpc-0abc123def456789 has been deleted
```

**¡Listo!** 🎉 Tu VPC y todos sus recursos han sido eliminados.

---

## Método 2: Eliminación Manual

Si el Método 1 falla o muestra errores, necesitas eliminar recursos manualmente en orden específico.

### Orden de Eliminación

**Debes eliminar en este orden** (de dependiente a independiente):

```
1. RDS/Aurora Instances
2. EC2 Instances
3. Load Balancers
4. Lambda Functions (desconectar de VPC)
5. NAT Gateways
6. Elastic IPs
7. VPC Endpoints
8. Security Groups (excepto default)
9. Network Interfaces (ENIs)
10. Subnets
11. Route Tables (excepto main)
12. Internet Gateway
13. VPC
```

---

### Paso 1: Eliminar RDS/Aurora (Si tienes)

**IMPORTANTE**: Si tienes bases de datos, elimínalas primero.

#### Opción A: Eliminar con Snapshot Final (Recomendado)

1. Ve a **RDS** → **Databases**
2. Selecciona tu database/cluster
3. **Actions** → **Delete**
4. En la ventana de confirmación:
   - ✅ **"Create final snapshot"**: `Yes`
   - **Snapshot name**: `zititex-aurora-final-snapshot-2025-10-23`
   - ❌ **"Retain automated backups"**: `No` (a menos que los necesites)
   - Escribe: **`delete me`** (exactamente)
5. Clic en **"Delete"**
6. **Espera 5-10 minutos** hasta que el status sea `Deleted`

#### Opción B: Eliminar sin Snapshot (Más rápido, datos perdidos)

1. Ve a **RDS** → **Databases**
2. Selecciona tu database/cluster
3. **Actions** → **Delete**
4. En la ventana:
   - ❌ **"Create final snapshot"**: `No`
   - ✅ **"I acknowledge..."**: Marca el checkbox
   - Escribe: **`delete me`**
5. Clic en **"Delete"**

---

### Paso 2: Eliminar EC2 Instances (Si tienes)

1. Ve a **EC2** → **Instances**
2. Filtra por VPC ID: `vpc-0abc123`
3. Selecciona todas las instances de esa VPC
4. **Instance state** → **Terminate instance**
5. Confirma y espera hasta que status sea `Terminated`

---

### Paso 3: Eliminar Load Balancers (Si tienes)

1. Ve a **EC2** → **Load Balancers**
2. Selecciona los load balancers de tu VPC
3. **Actions** → **Delete**
4. Confirma
5. Espera 2-3 minutos

---

### Paso 4: Desconectar Lambda de VPC (Si tienes)

1. Ve a **Lambda** → **Functions**
2. Para cada función conectada a tu VPC:
   - Clic en la función
   - Tab **"Configuration"** → **"VPC"**
   - Clic en **"Edit"**
   - Selecciona **"No VPC"**
   - **"Save"**

---

### Paso 5: Eliminar NAT Gateways

**⚠️ IMPORTANTE**: NAT Gateways son los más comunes que bloquean la eliminación.

1. Ve a **VPC** → **NAT Gateways**
2. Filtra por VPC ID
3. Selecciona todos los NAT Gateways de tu VPC
4. **Actions** → **Delete NAT gateway**
5. Confirma escribiendo: **`delete`**
6. Clic en **"Delete"**
7. **Espera 3-5 minutos** hasta que el status sea `Deleted`

**Estado durante eliminación**:
```
Available → Deleting → Deleted
```

---

### Paso 6: Liberar Elastic IPs

Los NAT Gateways usan Elastic IPs. Después de eliminar NAT Gateways:

1. Ve a **EC2** → **Elastic IPs**
2. Busca las IPs que NO están asociadas a nada
3. Selecciónalas
4. **Actions** → **Release Elastic IP addresses**
5. Confirma

**⚠️ NOTA**: Si liberas una IP aún asociada, aparecerá error. Espera a que NAT Gateways estén `Deleted`.

---

### Paso 7: Eliminar VPC Endpoints (Si tienes)

1. Ve a **VPC** → **Endpoints**
2. Filtra por VPC ID
3. Selecciona todos los endpoints
4. **Actions** → **Delete VPC endpoints**
5. Confirma

---

### Paso 8: Eliminar Security Groups

**⚠️ NO elimines el Security Group "default"** - AWS no te deja y es necesario.

1. Ve a **VPC** → **Security Groups**
2. Filtra por VPC ID: `vpc-0abc123`
3. Verás una lista, por ejemplo:
   ```
   sg-0111  default                   ← NO ELIMINAR
   sg-0222  zititex-aurora-sg         ← Eliminar
   sg-0333  zititex-lambda-sg         ← Eliminar
   ```

4. Selecciona los Security Groups (excepto `default`)
5. **Actions** → **Delete security groups**
6. Confirma

**Si falla con "dependency violation"**:
- Verifica que RDS/EC2/Lambda estén eliminados
- Espera 5 minutos y reintenta
- Los Security Groups se referencian entre sí, elimínalos uno por uno

---

### Paso 9: Eliminar Network Interfaces (ENIs)

**ENIs** son interfaces de red creadas por Lambda, RDS, NAT Gateways, etc.

1. Ve a **EC2** → **Network Interfaces**
2. Filtra por VPC ID
3. Busca ENIs con status `Available` (no `In-use`)
4. Selecciónalas
5. **Actions** → **Delete**
6. Confirma

**Si algunos están "In-use"**:
- Lambda aún está conectado a VPC (volver a Paso 4)
- RDS aún existe (volver a Paso 1)
- Espera 5 minutos (ENIs de recursos eliminados se borran solos)

---

### Paso 10: Eliminar Subnets

1. Ve a **VPC** → **Subnets**
2. Filtra por VPC ID
3. Selecciona todas las subnets
4. **Actions** → **Delete subnet**
5. Confirma

**Si falla**:
- Aún hay recursos usando la subnet (EC2, RDS, ENIs)
- Revisa pasos anteriores

---

### Paso 11: Eliminar Route Tables

**⚠️ NO elimines la Route Table "Main"** - Se eliminará automáticamente con la VPC.

1. Ve a **VPC** → **Route Tables**
2. Filtra por VPC ID
3. Verás algo como:
   ```
   rtb-0111  zititex-rtb-public    Main: No  ← Eliminar
   rtb-0222  zititex-rtb-private   Main: No  ← Eliminar
   rtb-0333  (unnamed)             Main: Yes ← NO ELIMINAR
   ```

4. Selecciona las Route Tables **que NO sean Main**
5. **Actions** → **Delete route table**
6. Confirma

---

### Paso 12: Desconectar y Eliminar Internet Gateway

1. Ve a **VPC** → **Internet Gateways**
2. Filtra por VPC ID
3. Selecciona el Internet Gateway
4. **Actions** → **Detach from VPC**
5. Confirma
6. Espera 30 segundos
7. Con el IGW aún seleccionado:
   - **Actions** → **Delete internet gateway**
   - Confirma

**Orden importante**:
```
1. Detach from VPC (desconectar)
2. Delete internet gateway (eliminar)
```

---

### Paso 13: Eliminar VPC

¡Finalmente! Todos los recursos dependientes eliminados.

1. Ve a **VPC** → **Your VPCs**
2. Selecciona tu VPC
3. **Actions** → **Delete VPC**
4. Confirma escribiendo: **`delete`**
5. Clic en **"Delete"**

Si todo está correcto:
```
✅ VPC vpc-0abc123def456789 has been deleted
```

---

## Troubleshooting

### Error: "The vpc has dependencies and cannot be deleted"

**Causa**: Aún hay recursos asociados a la VPC.

**Solución**:
1. Ve a **VPC** → **Resource Map** (panel izquierdo)
2. Selecciona tu VPC en el dropdown
3. Verás un diagrama visual de TODOS los recursos
4. Identifica qué recursos quedan
5. Elimínalos siguiendo el Método 2

**Recursos comunes olvidados**:
- NAT Gateways (toman 5 minutos en eliminarse)
- Elastic IPs asociados
- ENIs (Network Interfaces) huérfanos
- Load Balancers
- VPC Endpoints

---

### Error: "Network interface is currently in use"

**Causa**: Un servicio aún está usando el ENI.

**Servicios comunes**:
- Lambda conectado a VPC
- RDS/Aurora activo
- NAT Gateway aún eliminándose
- Load Balancer activo

**Solución**:
1. Identifica qué servicio usa el ENI:
   - Ve a **EC2** → **Network Interfaces**
   - Clic en el ENI problemático
   - Tab **"Details"**
   - Busca **"Attachment"** o **"Description"**
   - Te dirá: "Lambda", "RDS", "NAT Gateway", etc.

2. Elimina ese servicio primero
3. Espera 5 minutos
4. Reintenta

---

### Error: "NAT Gateway is deleting" (stuck)

**Causa**: NAT Gateway toma 3-5 minutos en eliminarse.

**Solución**:
- ☕ Espera pacientemente
- **NO** refresques constantemente (puede aumentar el tiempo)
- Refresca cada 2 minutos
- Si después de 10 minutos sigue "Deleting", contacta AWS Support

---

### Error: "Cannot delete security group: dependency violation"

**Causa**: Otro Security Group tiene una regla que referencia este SG.

**Ejemplo**:
```
SG-A tiene regla: Allow port 3306 from SG-B
No puedes eliminar SG-B hasta eliminar esta regla
```

**Solución**:
1. Ve al Security Group que quieres eliminar
2. Tab **"Inbound rules"**
3. Mira si otra SG lo referencia
4. Ve al otro SG y elimina esa regla
5. Ahora podrás eliminar el SG original

**O más fácil**:
1. Elimina TODAS las reglas de inbound de TODOS los SGs
2. Luego elimina los SGs uno por uno

---

### Error: "Subnet has dependencies and cannot be deleted"

**Causa**: Hay recursos en la subnet.

**Solución**:
```bash
# Usar AWS CLI para ver qué hay en la subnet
aws ec2 describe-network-interfaces \
  --filters "Name=subnet-id,Values=subnet-0abc123" \
  --query 'NetworkInterfaces[*].[NetworkInterfaceId,Description,Status]' \
  --output table
```

Elimina los recursos mostrados.

---

### Error: "Route table has dependencies"

**Causa**: La route table está asociada a subnets.

**Solución**:
1. Ve a **VPC** → **Route Tables**
2. Selecciona la route table
3. Tab **"Subnet associations"**
4. Para cada subnet asociada:
   - Selecciona la subnet
   - Clic en **"Edit subnet associations"**
   - Desmarca todas las subnets
   - **"Save associations"**
5. Ahora podrás eliminar la route table

---

## Verificación Final

Después de eliminar todo, verifica:

### 1. VPC eliminada

```bash
aws ec2 describe-vpcs --vpc-ids vpc-0abc123def456789
```

Debe retornar:
```
An error occurred (InvalidVpcID.NotFound)
```

### 2. No hay costos pendientes

1. Ve a **AWS Billing** → **Cost Explorer**
2. Filtra por servicio: VPC, EC2, RDS
3. Verifica que los costos caigan a $0

**Recursos que pueden seguir costando**:
- ⚠️ Elastic IPs no liberados: **$0.005/hora** ($3.60/mes)
- ⚠️ NAT Gateway: **$0.045/hora** ($32/mes) - Hasta que se complete la eliminación
- ⚠️ Snapshots de RDS: **$0.095/GB-mes**

### 3. Verificación visual

1. **VPC** → **Your VPCs**: Tu VPC no debe aparecer
2. **VPC** → **Subnets**: Filtra por VPC ID, debe decir "No results"
3. **EC2** → **NAT Gateways**: Filtra por VPC ID, debe decir "No NAT gateways found"

---

## Script de Eliminación Automático (Avanzado)

Si tienes AWS CLI configurado, puedes usar este script:

```bash
#!/bin/bash

VPC_ID="vpc-0abc123def456789"  # Cambia esto

echo "⚠️  ADVERTENCIA: Esto eliminará TODA la VPC y sus recursos"
echo "VPC ID: $VPC_ID"
read -p "¿Estás seguro? (escribe 'yes' para continuar): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelado"
    exit 1
fi

echo "🗑️  Eliminando VPC $VPC_ID y todos sus recursos..."

# Eliminar NAT Gateways
echo "1. Eliminando NAT Gateways..."
NAT_GWS=$(aws ec2 describe-nat-gateways \
  --filter "Name=vpc-id,Values=$VPC_ID" "Name=state,Values=available" \
  --query 'NatGateways[*].NatGatewayId' --output text)

for NAT_GW in $NAT_GWS; do
    echo "   Eliminando NAT Gateway: $NAT_GW"
    aws ec2 delete-nat-gateway --nat-gateway-id $NAT_GW
done

echo "   Esperando a que NAT Gateways se eliminen (3-5 min)..."
sleep 180

# Eliminar IGW
echo "2. Eliminando Internet Gateway..."
IGW=$(aws ec2 describe-internet-gateways \
  --filters "Name=attachment.vpc-id,Values=$VPC_ID" \
  --query 'InternetGateways[0].InternetGatewayId' --output text)

if [ "$IGW" != "None" ]; then
    aws ec2 detach-internet-gateway --internet-gateway-id $IGW --vpc-id $VPC_ID
    aws ec2 delete-internet-gateway --internet-gateway-id $IGW
    echo "   ✅ Internet Gateway eliminado"
fi

# Eliminar Subnets
echo "3. Eliminando Subnets..."
SUBNETS=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'Subnets[*].SubnetId' --output text)

for SUBNET in $SUBNETS; do
    echo "   Eliminando Subnet: $SUBNET"
    aws ec2 delete-subnet --subnet-id $SUBNET
done

# Eliminar Security Groups (excepto default)
echo "4. Eliminando Security Groups..."
SGS=$(aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'SecurityGroups[?GroupName!=`default`].GroupId' --output text)

for SG in $SGS; do
    echo "   Eliminando Security Group: $SG"
    aws ec2 delete-security-group --group-id $SG 2>/dev/null || true
done

# Eliminar Route Tables (excepto main)
echo "5. Eliminando Route Tables..."
ROUTE_TABLES=$(aws ec2 describe-route-tables \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query 'RouteTables[?Associations[0].Main!=`true`].RouteTableId' --output text)

for RT in $ROUTE_TABLES; do
    echo "   Eliminando Route Table: $RT"
    aws ec2 delete-route-table --route-table-id $RT
done

# Eliminar VPC
echo "6. Eliminando VPC..."
aws ec2 delete-vpc --vpc-id $VPC_ID

echo ""
echo "✅ VPC eliminada exitosamente!"
echo ""
echo "Verifica en AWS Console que todos los recursos estén eliminados."
```

**Guarda esto como** `delete-vpc.sh` y ejecútalo:
```bash
chmod +x delete-vpc.sh
./delete-vpc.sh
```

---

## Resumen de Comandos

```bash
# Verificar VPC existe
aws ec2 describe-vpcs --vpc-ids vpc-0abc123

# Listar todos los recursos de una VPC
aws ec2 describe-vpcs --vpc-ids vpc-0abc123 --query 'Vpcs[0]'

# Eliminar NAT Gateway
aws ec2 delete-nat-gateway --nat-gateway-id nat-0abc123

# Liberar Elastic IP
aws ec2 release-address --allocation-id eipalloc-0abc123

# Eliminar IGW
aws ec2 detach-internet-gateway --internet-gateway-id igw-0abc123 --vpc-id vpc-0abc123
aws ec2 delete-internet-gateway --internet-gateway-id igw-0abc123

# Eliminar Subnet
aws ec2 delete-subnet --subnet-id subnet-0abc123

# Eliminar Security Group
aws ec2 delete-security-group --group-id sg-0abc123

# Eliminar Route Table
aws ec2 delete-route-table --route-table-id rtb-0abc123

# Eliminar VPC
aws ec2 delete-vpc --vpc-id vpc-0abc123
```

---

## Conclusión

**Método recomendado**:
1. Intenta **Método 1** (Eliminación Automática) primero
2. Si falla, sigue **Método 2** (Eliminación Manual) paso a paso
3. Usa **Resource Map** para visualizar dependencias

**Tiempo estimado**:
- Método 1: **3-5 minutos** (automático)
- Método 2: **10-20 minutos** (manual)

**Después de eliminar**:
- ✅ Crea una nueva VPC con **"VPC and more"**
- ✅ Verifica que no haya costos pendientes
- ✅ Documenta qué salió mal para evitarlo la próxima vez

---

**Última actualización**: 2025-10-23  
**Proyecto**: Zititex  
**Autor**: Equipo de desarrollo

