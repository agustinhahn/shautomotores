# Guía: PGAdmin Local y Despliegue en VPS

Este documento explica cómo conectarte a tu base de datos local usando pgAdmin y cómo llevar este proyecto a tu VPS (Hostinger) usando Docker.

---

## 1. Conectar la Base de Datos Local en pgAdmin

El error que te devuelve pgAdmin al crear el servidor **suele deberse al puerto**. Por defecto, PostgreSQL usa el `5432`, pero tu aplicación local está configurada en el archivo `backend/.env` para usar el puerto **`5433`**.

Para conectarte exitosamente, abre pgAdmin, añade un nuevo **Server**, y en la pestaña de **Connection** usa EXACTAMENTE estos datos:

- **Host name/address**: `localhost` (o `127.0.0.1`)
- **Port**: `5433` ⚠️ *(¡Asegúrate de cambiar esto!)*
- **Maintenance database**: `postgres`
- **Username**: `postgres`
- **Password**: `metallica123`

Una vez conectado:
1. Haz clic derecho en "Databases" -> Create -> Database.
2. Nómbrala `sh_db` (y asígnale al owner `postgres`).
3. Listo. Tu backend ya no debería arrojar errores de base de datos.

---

## 2. Diferencias entre tu entorno Local y el VPS

Tu proyecto está muy bien configurado para VPS usando **Docker**, específicamente con el archivo `docker-compose.yml`. Al usar Docker en el VPS, **NO** vas a ejecutar `npm run dev` ni necesitas instalar PostgreSQL en el Linux. Todo correrá automáticamente en contenedores aislados.

### Local vs VPS
| Entorno | Archivo Variables de Entorno | Cómo se Inicia | Servidor de BD |
| :--- | :--- | :--- | :--- |
| **Local** | `backend/.env` (Localhost) | `npm run dev` en 2 terminales | Postgres instalado en Windows (5433) |
| **VPS** | `env_vps_hostinger.txt` (.env) | `docker compose up -d` | Contenedor de Docker (15-alpine) interno |

### Puertos en VPS (Según tu docker-compose)
Al subir todo a Hostinger, los puertos definidos funcionarán de la siguiente manera:
- **Frontend**: Puerto `51001` (El mundo accede a esta IP:puerto)
- **Backend**: Puerto `50001` (El frontend y clientes HTTP acceden aquí)
- **Base de Datos**: Corre internamente llamándose `db` (No es "localhost", viaja de contenedor a contenedor).

---

## 3. Pasos para Desplegar el Proyecto al VPS

Asumiendo que ya has subido el código fuente al VPS (por ejemplo vía Git o FTP/SFTP), debes seguir estos pasos adentro de tu servidor Hostinger (Debian).

### Paso 1: Configurar las variables de entorno
Tu VPS debe usar los valores del archivo `env_vps_hostinger.txt`. 
1. Pega ese código desde la línea 4 en el archivo principal y cámbiale el nombre para generar tu `.env` maestro en la raíz del proyecto.
El frontend compilará la URL de la API apuntando a: `http://82.25.74.158:50001/api`.

### Paso 2: Ejecutar Docker Compose
Ve a la carpeta de tu proyecto (la que contiene `docker-compose.yml`) en la consola del VPS.
Ejecuta:
```bash
docker compose up -d --build
```

**¿Qué hace este comando?**
- Descarga una imagen de base de datos Postgres y comienza a correrla con los datos `shautomotores_db` y `metallica123`.
- Compila el Backend y lo deja listo.
- Compila el Frontend y conecta su comunicación con el `50001`.
- Ejecuta los tres servicios de fondo (gracias a `-d`).

### Paso 3: Verificar que todo funcione
Puedes ver si los contenedores están arriba y sin errores usando:
```bash
docker compose ps
```
Para leer los registros/errores del backend, por ejemplo:
```bash
docker compose logs -f backend
```

> **Consejo Importante para Producción**: Como los puertos están en `51001` y `50001`, se recomienda en un futuro que utilices **Nginx** como proxy inverso dentro de tu servidor. Esto permitirá que la web se vea sin puerto explícito (como `misitio.com` apuntando al `51001` por detrás) e incorporará el certificado SSL (`HTTPS`).
