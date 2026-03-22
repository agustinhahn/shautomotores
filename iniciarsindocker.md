# Guía para Iniciar el Proyecto Localmente (Sin Docker)

Este documento explica cómo levantar el proyecto completo (Base de datos, Backend y Frontend) en tu entorno de desarrollo local (localhost) sin utilizar Docker.

---

## 1. Iniciar la Base de Datos (PostgreSQL)

Como no vas a usar Docker, necesitas tener **PostgreSQL instalado en tu Windows**. 
Tu archivo `backend/.env` indica que la base de datos se conecta así:
- **Host**: `localhost`
- **Puerto**: `5433` *(Nota: El puerto por defecto de Postgres suele ser 5432, asegúrate de utilizar el puerto correcto según tu instalación de Windows)*.
- **Usuario**: `postgres`
- **Contraseña**: `metallica123`
- **Base de datos**: `sh_db`

**¿Cómo iniciarla?**
En Windows, PostgreSQL generalmente se ejecuta como un "Servicio" en segundo plano que se inicia automáticamente al prender la PC. Si no está corriendo:
1. Presiona `Win + R`, escribe `services.msc` y dale a Enter.
2. Busca un servicio llamado `postgresql-x64-XX` y dale clic derecho -> **Iniciar** (si no estaba iniciado).
3. Asegúrate de que la base de datos `sh_db` esté creada. Si usas pgAdmin, puedes crearla desde ahí.

---

## 2. Iniciar el Backend (API)

El backend está desarrollado en Node.js y se encuentra dentro de la carpeta `backend/`.

1. Abre tu terminal (Símbolo del sistema, PowerShell o la terminal de VS Code).
2. Entra a la carpeta del backend:
   ```bash
   cd backend
   ```
3. Ejecuta el entorno de desarrollo con este comando:
   ```bash
   npm run dev
   ```
   *(Este comando utiliza `nodemon`, lo que significa que el servidor se reiniciará automáticamente si haces cambios en el código).*
   
Verás en la consola mensajes indicando que el servidor está corriendo en el puerto `40001` (o el que indique en tu `.env`) y que la base de datos se sincronizó correctamente.

---

## 3. Iniciar el Frontend (React)

El frontend está desarrollado en React (o similar) y se encuentra dentro de la carpeta `frontend/`.

1. Abre **una nueva ventana o pestaña de terminal** (deja la del backend abierta y corriendo).
2. Entra a la carpeta del frontend:
   ```bash
   cd frontend
   ```
3. Ejecuta el entorno de desarrollo:
   ```bash
   npm run dev
   ```
   *(Este comando suele levantar tu web en `http://localhost:5173` o `3000`, y también se actualiza automáticamente cuando guardas cambios).*

---

## ¿Cuál es el archivo principal del Backend?

Dices que ves muchísimos archivos y no sabes por dónde empieza todo.
El **archivo principal** (el punto de entrada de tu backend) es:

👉 **`backend/src/app.js`**

Ahí es donde arranca el servidor, se conecta la base de datos, se configuran las medidas de seguridad y se registran todas las rutas de la API.

---

## ¿Se puede ordenar todo en menos archivos para que sea más simple de leer?

**Poder, se puede... pero NO ES RECOMENDABLE en absoluto.**

El proyecto está diseñado usando una arquitectura llamada **MVC** (Modelo, Vista, Controlador), aunque para APIs se adapta usando Modelos, Controladores y Rutas. 

### ¿Por qué está dividido en tantas carpetas?
- **`models/`**: Define de qué están hechas tus tablas en la base de datos (Ej: `vehicleModel.js` describe los autos).
- **`routes/`**: Define los "links" de tu API (Ej: `GET /api/vehicles`).
- **`controllers/`**: Tiene la lógica matemática o el procesamiento de datos (Ej: "Qué pasa cuando me piden todos los autos").
- **`middlewares/`**: Funciones de seguridad y autorización (Ej: Verificar si el usuario está logueado).
- **`utils/`**: Herramientas extra (Envío de mails, etc.).

### Si ponemos todo en un solo archivo (o en 2 o 3 archivos)...
Si fusionamos todo para tener menos archivos, el archivo principal (`app.js`) pasaría de tener ~100 líneas a tener **miles de líneas de código**. 

Consecuencias de poner todo en un solo archivo:
1. **Es un infierno para leer o buscar errores:** Vas a pasar todo el tiempo haciendo *scroll* para encontrar dónde enviar un email y dónde guardar un auto.
2. **Caos de mantenimiento:** Cuando tu sistema crezca (más secciones), el archivo principal se hará inmanejable.
3. **Mala práctica:** Un archivo de 5,000 líneas asusta a cualquier desarrollador futuro que quiera ayudarte.

**Conclusión:** 
Lo que ahora percibes como "muchos archivos difíciles de seguir", en realidad es la forma en la que los profesionales ordenan el software. **Te sugiero mantener esta estructura.** Cuando quieras ver "cómo se guardan los autos", sabes que debes ir a la carpeta `controllers`, abrir el archivo del controlador de vehículos y ahí estará la función; no necesitas buscar en un documento de 5,000 líneas.
