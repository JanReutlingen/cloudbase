FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Port, auf dem dein Backend lauscht
EXPOSE 80

CMD ["node", "./backend.js"]
