# Utilisation d'une image légère
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copie des fichiers de dépendances depuis le dossier backend local
COPY backend/package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source du backend
COPY backend/ .

# Port exposé par votre API
EXPOSE 5000

# Commande de démarrage
CMD ["node", "index.js"]