# Guía de Despliegue en VPS (Hostinger) con Docker

Esta guía explica paso a paso cómo probar SH Automotores en tu PC (Modo Local) y luego desplegarlo en producción en tu servidor (Modo VPS).

---

## 💻 1. Entorno Local (Desarrollo en tu PC)

Para replicar el entorno de producción usando Docker Desktop en tu máquina local.

### Prerrequisitos
- Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) en tu máquina y que esté en ejecución.

### Instrucciones
1. Abre tu terminal y ubícate en la raíz del proyecto (`c:\Users\Usuario\Desktop\programacion\antigravity\shautomotores`).
2. Duplica el archivo `.env.example` y renómbralo a `.env`. (Si ya tienes uno, asegúrate de que contenga las variables del profile LOCAL).
3. Levanta los contenedores en segundo plano y oblígalos a compilar las imágenes:
   ```bash
   docker-compose up -d --build
   ```
4. Espera a que termine (el frontend tarda unos segundos extra en ejecutarse porque compila `Vite` y activa `Nginx`).
5. Abre en tu navegador:
   - Frontend: `http://localhost:51001`
   - Backend API: `http://localhost:50001/api/vehicles` (para verificar)

### Detener el local
Para apagar los contenedores sin borrar los datos guardados en PostgreSQL:
```bash
docker-compose down
```

---

## 🚀 2. Entorno Producción (VPS de Hostinger)

Instrucciones para cuando alquiles el VPS con Linux (generalmente Ubuntu 22.04 o 24.04).

### Prerrequisitos (Preparar el Servidor)
1. Conéctate a tu servidor VPS por consola SSH:
   ```bash
   ssh root@123.45.67.89
   ```
2. Actualiza el sistema e instala Docker y Docker Compose:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install docker.io docker-compose -y
   ```
3. Activa Docker para que inicie siempre con el servidor:
   ```bash
   sudo systemctl enable docker
   sudo systemctl start docker
   ```

### Subir el código y Desplegar
1. Sube los archivos de este proyecto al VPS (por FTP web, FileZilla, o Clonando un repositorio privado en Git).
2. Dentro de la carpeta del proyecto en el servidor, crea/edita el archivo `.env`:
   ```bash
   nano .env
   ```
3. **Pega la configuración del Perfil PRODUCCIÓN** (las variables de `.env.example` usando la IP real de tu VPS, ej. `123.45.67.89`).
   - *Nota Importante:* **VITE_API_URL** OBLIGATORIAMENTE debe mirar la IP externa del VPS, ej: `VITE_API_URL=http://123.45.67.89:50001/api`.
4. Levanta el proyecto en modo Daemon:
   ```bash
   docker-compose up -d --build
   ```
5. ¡Listo! Accede a `http://123.45.67.89:51001` desde cualquier teléfono o PC y deberías ver el sitio online.

---

## 🛠️ Resolviendo Problemas Comunes (Troubleshooting)

### Veo la pantalla en blanco o no carga la base de datos
Si la base inició antes e falló, fuerza el reinicio:
```bash
docker-compose restart
```

### El Backend dice "Failed to Connect" desde el Frontend (React)
Vite compila REACT (HTML/JS) estáticamente. Todo el código frontend se ejecuta **en el navegador de tus clientes** y no en el servidor.
Por ello, si un cliente entra a la web y en tu `.env` habías dejado `VITE_API_URL=http://localhost:50001/api`, el celular del cliente intentará buscar "su propio localhost".
- **Solución:** Tienes que tirar abajo los containers `docker-compose down`, editar el `.env` para que tenga la IP pública del servidor VPS y luego *re-buildear* el Frontend forzosamente para que NGINX embeba la IP:
```bash
docker-compose up -d --build
```

### Ver los Logs del servidor (Si hay errores internos 500)
Si querés ver qué le está pasando a la API en vivo:
```bash
docker logs shautomotores_backend --tail 50 -f
```

### Necesito levantar DOS sitios en el mismo Hostinger
1. Clona la carpeta (ej. `/shautomotores2`).
2. Edita su `.env` y cámbiale los puertos externos a otros libres: `FRONT_PORT=51002`, `BACK_PORT=50002`.
3. Edita `.env` para cambiar de base de datos (`DB_NAME=cliente2_db`).
4. Repite `docker-compose up -d --build`. Ahora tendrás ambos escuchando independientemente en 51001 y 51002.
