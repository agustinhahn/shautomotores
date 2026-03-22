# 📘 MANUAL COMPLETO — SH Automotores
### Guía Maestra: Desarrollo Local → Despliegue en VPS

> **Última actualización:** Marzo 2026  
> Este documento unifica toda la documentación del proyecto. Es la fuente de verdad única para levantar, bajar, actualizar y desplegar SH Automotores tanto en tu PC como en el VPS de Hostinger.

---

## 📐 Arquitectura del Sistema

El proyecto está compuesto por **3 contenedores Docker**:

| Capa | Tecnología | Puerto Interno | Puerto Externo |
|---|---|---|---|
| **Frontend** | Vite + React → Nginx | 80 | `41001` |
| **Backend** | Node.js (Express) | 5000 | `40001` |
| **Base de datos** | PostgreSQL 15 | 5432 | `5432` |

> ⚠️ **Concepto clave sobre el Frontend:** Vite compila React a HTML/JS **estáticos**. Eso significa que las variables como `VITE_API_URL` se **incrustan en el código en tiempo de build** (construcción), no en tiempo de ejecución. Si cambias la URL, no alcanza con reiniciar: hay que **reconstruir** (`--build`).

---

## 🗂️ Variables de Entorno — El Archivo `.env`

Toda la configuración del proyecto viene de un único archivo `.env` en la raíz del proyecto. Nunca commitees este archivo a Git.

### Para Desarrollo Local (tu PC)
```env
PUBLIC_IP=localhost
VITE_API_URL=http://localhost:40001/api

FRONT_PORT=41001
BACK_PORT=40001

DB_USER=postgres
DB_PASSWORD=metallica123
DB_NAME=shautomotores_db
DB_HOST=db
DB_PORT=5432

JWT_SECRET=super_secret_jwt_key_dev_local
PORT=5000
```

### Para Producción (VPS Hostinger)
```env
PUBLIC_IP=82.25.74.158
VITE_API_URL=http://82.25.74.158:40001/api

FRONT_PORT=41001
BACK_PORT=40001

DB_USER=postgres
DB_PASSWORD=metallica123
DB_NAME=shautomotores_db
DB_HOST=db
DB_PORT=5432

JWT_SECRET=super_secret_jwt_key_prod_2026_shautomotores
PORT=5000
```

> 🔑 **Diferencia clave entre Local y VPS:** La única diferencia real es `PUBLIC_IP` y `VITE_API_URL`. En local apuntan a `localhost`; en el VPS apuntan a la IP pública `82.25.74.158`.

---

## 💻 PARTE 1 — Entorno Local (tu PC con Windows)

### Prerrequisito
- Tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y **corriendo** (el ícono de Docker debe estar activo en la barra de tareas).

---

### 🟢 Escenario A: Iniciar desde CERO (primera vez)

1. Abre una terminal en la raíz del proyecto:
   ```
   c:\Users\Usuario\Desktop\programacion\antigravity\shautomotores
   ```

2. Crea el archivo `.env` copiando el bloque de **Desarrollo Local** de arriba.

3. Levanta todos los contenedores (construye las imágenes y los inicia):
   ```bash
   docker compose --env-file .env up -d --build
   ```

4. Espera ~60 segundos. El frontend tarda más porque compila Vite y levanta Nginx.

5. Verificá que funcione:
   - **Sitio web:** [http://localhost:41001](http://localhost:41001)
   - **API (prueba):** [http://localhost:40001/api/vehicles](http://localhost:40001/api/vehicles)
   - **Panel Admin:** [http://localhost:41001/admin](http://localhost:41001/admin)

6. El usuario administrador se crea automáticamente al primer arranque:
   - **Email:** `admin@shautomotores.com`
   - **Contraseña:** `shgiovani2026`

---

### 🔄 Escenario B: El proyecto ya está creado — solo quiero levantarlo

Si ya construiste las imágenes antes y no hubo cambios de código, usá:
```bash
docker compose up -d
```
> Esto es más rápido porque no reconstruye nada, solo inicia los contenedores existentes.

---

### ⬇️ Apagar el entorno local

Para detener todos los contenedores **sin borrar la base de datos**:
```bash
docker compose down
```

---

### 🔁 Aplicar cambios de código en local

| ¿Qué cambié? | Comando a ejecutar |
|---|---|
| Solo el **Frontend** (React, CSS) | `docker compose --env-file .env up -d --build frontend` |
| Solo el **Backend** (rutas, lógica) | `docker compose --env-file .env up -d --build backend` |
| Ambos o no estoy seguro | `docker compose --env-file .env up -d --build` |

---

## 🚀 PARTE 2 — Despliegue en VPS de Hostinger (Debian 13)

### 📦 Prerrequisitos del servidor (solo la primera vez)

Conéctate al VPS por SSH:
```bash
ssh root@82.25.74.158
```

Instalá Docker y Docker Compose:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose-plugin -y
```

Activá Docker para que arranque automáticamente con el servidor:
```bash
sudo systemctl enable docker
sudo systemctl start docker
```

---

### 📁 Subir el código al VPS

Subí los archivos por **SFTP (FileZilla)** o cloná desde Git. Los archivos críticos que deben estar en el servidor son:
- `docker-compose.yml`
- `backend/` (carpeta completa)
- `frontend/` (carpeta completa)
- `.env` (con la configuración de **Producción**)

Creá o editá el `.env` directamente en el servidor:
```bash
nano .env
```
Pegá el bloque de configuración de **Producción** que está al inicio de este documento.

---

### 🟢 Escenario A: Desplegar desde CERO en el VPS

Estando dentro de la carpeta del proyecto en el VPS, ejecutá estos 3 pasos **en orden**:

**Paso 1 — Apagar cualquier servicio previo (si hubiera):**
```bash
docker compose down
```

**Paso 2 — Limpieza profunda de Docker (elimina caché vieja, imágenes, volúmenes):**
> ⚠️ Esto borra la base de datos existente. Usalo solo cuando empezás de cero.
```bash
docker system prune -a --volumes -f
```

**Paso 3 — Construir e iniciar todo:**
```bash
docker compose --env-file .env up -d --build
```

Cuando termine, el sitio estará disponible en: **http://82.25.74.158:41001**

---

### 🔄 Escenario B: El VPS ya tiene el proyecto — solo quiero actualizarlo

Si subiste cambios de código y querés aplicarlos **sin tocar la base de datos**:

Solo el frontend:
```bash
docker compose --env-file .env up -d --build frontend
```

Solo el backend:
```bash
docker compose --env-file .env up -d --build backend
```

Frontend y backend:
```bash
docker compose --env-file .env up -d --build frontend backend
```

---

### ⬇️ Apagar el VPS (sin borrar datos)

```bash
docker compose down
```

---

### 🗑️ Botón de Pánico: Limpieza Total (Resetear todo en VPS)

Úsalo solo si algo está completamente roto y querés empezar de cero:
```bash
# 1. Apagar todo
docker compose down

# 2. Borrar TODO: imágenes, redes, volúmenes (incluye la BD)
docker system prune -a --volumes -f

# 3. Levantar limpio
docker compose --env-file .env up -d --build
```

---

## ⚙️ Cambios Obligatorios al Pasar de Local → VPS

Este es el checklist de qué tenés que cambiar/verificar antes de desplegar:

- [ ] **`.env` tiene la IP pública del VPS**, no `localhost`. Especialmente `VITE_API_URL` y `PUBLIC_IP`.
- [ ] El `.env` está **en el servidor** (no solo en tu PC).
- [ ] Usás `docker compose --env-file .env up -d --build` (con `--env-file`) para forzar la lectura del `.env`.
- [ ] Los puertos del VPS (`40001` y `41001`) están **abiertos en el firewall** de Hostinger (desde el panel de control).
- [ ] Subiste los últimos cambios de código al servidor antes de hacer el build.

---

## 🔍 Logs y Diagnóstico

### Ver errores del Backend en tiempo real
```bash
docker logs shautomotores_backend --tail 50 -f
```
> Presioná `Ctrl+C` para salir del modo "seguimiento continuo".

### Ver errores del Frontend (Nginx)
```bash
docker logs shautomotores_frontend --tail 50
```

### Ver el estado de todos los contenedores
```bash
docker compose ps
```

### Ver consumo de recursos
```bash
docker stats
```

---

## 🗄️ Administración de la Base de Datos

El contenedor de la base se llama `shautomotores_db` y usa PostgreSQL 15.

### Entrar a la consola SQL interactiva (psql)
```bash
docker exec -it shautomotores_db psql -U postgres -d shautomotores_db
```
> Para salir de psql: escribí `\q` y presioná Enter.

### Comandos útiles dentro de psql
```sql
-- Ver todas las tablas
\dt

-- Ver usuarios registrados
SELECT id, full_name, email, role, status FROM users;

-- Ver todos los vehículos
SELECT id, brand, model, year, status FROM vehicles;

-- Salir
\q
```

### Hacer un Backup de la base de datos
```bash
docker exec -t shautomotores_db pg_dump -U postgres shautomotores_db > respaldo_$(date +%Y%m%d).sql
```

### Restaurar un Backup
```bash
cat respaldo_XXXXXXXX.sql | docker exec -i shautomotores_db psql -U postgres -d shautomotores_db
```

---

## 🏗️ Estructura de la Base de Datos

### Tabla `users`
| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Clave primaria |
| full_name | String | Nombre completo |
| email | String, único | Email de acceso |
| password_hash | String | Contraseña hasheada (bcrypt) |
| role | ENUM | `super_admin` o `seller` |
| phone | String | Teléfono (opcional) |
| status | ENUM | `active` o `inactive` |

### Tabla `vehicles`
| Campo | Tipo | Descripción |
|---|---|---|
| id | UUID | Clave primaria |
| user_id | UUID FK | Vendedor que lo cargó |
| brand / model / year | String/Int | Datos del auto |
| price | Decimal | Precio |
| currency | ENUM | `USD` o `ARS` |
| mileage | Integer | Kilometraje |
| condition | ENUM | `new` o `used` |
| status | ENUM | `draft`, `pending_approval`, `published`, `reserved`, `sold`, `hidden`, `rejected` |

### Otras Tablas
- **`vehicle_images`** — Imágenes asociadas a cada vehículo (con flag `is_main`).
- **`clientes`** — Compradores potenciales ingresados por vendedores.
- **`registros`** — Gestiones/eventos que vinculan vendedor con vehículo.
- **`leads`** — Consultas generadas públicamente (ej: clicks en WhatsApp).
- **`activity_logs`** — Bitácora de auditoría de acciones del sistema.
- **`VehicleViews`** — Métricas de vistas por vehículo.

### Relaciones Principales
- Un **Usuario** tiene muchos **Vehículos** (1:N).
- Un **Vehículo** tiene muchas **Imágenes** (1:N, con cascade delete).
- Un **Vehículo** puede generar muchos **Leads** (1:N).
- Un **Usuario** tiene muchos **Clientes** y **Registros** (1:N).

---

## 🌐 Hospedar Múltiples Proyectos en el Mismo VPS

Si querés correr otra instancia de la app (ej: otro concesionario) en el mismo servidor:

1. Subí el proyecto en una carpeta diferente, ej: `/shautomotores2`.
2. Editá su `.env` con **puertos distintos** y **otro nombre de base de datos**:
   ```env
   FRONT_PORT=51002
   BACK_PORT=50002
   DB_NAME=cliente2_db
   ```
3. Levantá normalmente:
   ```bash
   docker compose --env-file .env up -d --build
   ```
Tendrás ambos sitios corriendo en paralelo en el mismo VPS, escuchando en puertos separados, con bases de datos completamente independientes.

---

## 🚨 Troubleshooting — Problemas Comunes

### ❌ La pantalla aparece en blanco
La base de datos probablemente arrancó antes y falló la conexión inicial. Reiniciá:
```bash
docker compose restart
```

### ❌ El Frontend dice "Failed to connect" o no carga datos
El `VITE_API_URL` en tu `.env` probablemente dice `localhost` pero debería decir la IP pública del VPS. Editá el `.env` y volvé a buildear:
```bash
docker compose down
# Editá .env con la IP correcta
docker compose --env-file .env up -d --build
```

### ❌ Error 401 (Unauthorized) al hacer login
El `JWT_SECRET` no está llegando al backend. Verificá que:
1. El `.env` tenga definido `JWT_SECRET`.
2. El `docker-compose.yml` tenga `env_file: - .env` en el bloque del backend.
3. Estás usando `--env-file .env` al levantar.

### ❌ Error 500 (Internal Server Error)
Revisá los logs del backend:
```bash
docker logs shautomotores_backend --tail 100 -f
```

### ❌ Los cambios de código no se ven en el sitio
Nunca reconstruiste la imagen. Siempre que modifiques código en el frontend, debés hacer:
```bash
docker compose --env-file .env up -d --build frontend
```

### ❌ "Port already in use" al levantar
Otro proceso está usando el puerto. Bajá todo primero:
```bash
docker compose down
docker compose --env-file .env up -d --build
```

---

## 📋 Referencia Rápida de Comandos

```bash
# ─── LEVANTAR ───────────────────────────────────────────────
# Primera vez o con cambios de código (reconstruye todo)
docker compose --env-file .env up -d --build

# Solo levantarlo (sin cambios de código)
docker compose up -d

# Reconstruir solo el frontend
docker compose --env-file .env up -d --build frontend

# Reconstruir solo el backend
docker compose --env-file .env up -d --build backend

# ─── BAJAR ──────────────────────────────────────────────────
# Apagar todo (conserva la BD)
docker compose down

# Apagar todo + borrar la BD (reset total)
docker compose down && docker system prune -a --volumes -f

# ─── MONITOREO ──────────────────────────────────────────────
# Ver estado de contenedores
docker compose ps

# Logs del backend (en vivo)
docker logs shautomotores_backend --tail 50 -f

# Logs del frontend
docker logs shautomotores_frontend --tail 50

# ─── BASE DE DATOS ──────────────────────────────────────────
# Entrar a psql
docker exec -it shautomotores_db psql -U postgres -d shautomotores_db

# Hacer backup
docker exec -t shautomotores_db pg_dump -U postgres shautomotores_db > backup.sql

# Restaurar backup
cat backup.sql | docker exec -i shautomotores_db psql -U postgres -d shautomotores_db
```

---

## 🤖 Prompt Maestro para Nuevos Proyectos con AntiGravity

Copiá y pegá esto al iniciar un nuevo proyecto desde cero:

> "Hola AntiGravity, voy a iniciar un nuevo proyecto full-stack (React/Vite + Node.js + PostgreSQL) pensando en producción desde el día 1.
>
> **Contexto de infraestructura:**
> 1. **VPS:** Hostinger con Debian 13.
> 2. **Contenedores:** Todo (Front, Back, DB) contenerizado con `docker-compose.yml`.
> 3. **Puertos:** Frontend `5100X`, Backend `5000X` (X = número del proyecto).
> 4. **DB:** `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=metallica123`.
> 5. **Flujo:** Funciona en localhost primero, luego en VPS con `.env` de producción.
> 6. **Variables de entorno:**
>    - `VITE_API_URL` se pasa como `ARG` de build al Dockerfile del frontend.
>    - El backend usa `env_file: - .env` en el Compose para recibir todos los secrets.
>    - Al deployar: `docker compose --env-file .env up -d --build`.
>
> **Primera tarea:** Creá la estructura de carpetas, el `docker-compose.yml`, los `Dockerfile` (Nginx para el frontend), y un `.env.example` para desarrollo local."
