# Utiliza la imagen oficial de Node como base
FROM node:18.13.0

# Crea el directorio de trabajo de la app en la imagen
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json (si existe) a la imagen
COPY package*.json ./

# Instala las dependencias de la app
RUN npm install --production

# Copia todo el contenido de tu proyecto a la imagen
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Inicia la app
CMD [ "npm", "start" ]