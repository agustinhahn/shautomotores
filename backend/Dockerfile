FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero para optimizar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto interno que usará Express
EXPOSE 5000

# Script de arranque
CMD ["npm", "start"]
