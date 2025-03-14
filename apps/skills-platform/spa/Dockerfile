FROM docker.io/node:lts-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 4203

CMD ["npx", "nx", "serve", "app-skills-platform", "--host", "0.0.0.0"]
