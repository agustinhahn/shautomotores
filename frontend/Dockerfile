# ==========================================
# STAGE 1: Build (React + Vite)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente
COPY . .

# Inyectar variables de entorno en tiempo de build (Vite requiere las VITE_ estáticas al construir)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Compilar la aplicación para producción (generará /app/dist)
RUN npm run build

# ==========================================
# STAGE 2: Serve (Nginx)
# ==========================================
FROM nginx:alpine

# Copiar la build generada en la etapa anterior a la carpeta root de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear un archivo de configuración custom para soportar el React Router (Single Page Application)
RUN echo 'server { \
    listen       80; \
    server_name  localhost; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
