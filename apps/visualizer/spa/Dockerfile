FROM docker.io/node:lts-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npx", "nx", "serve", "app-visualizer", "--host", "0.0.0.0"]
