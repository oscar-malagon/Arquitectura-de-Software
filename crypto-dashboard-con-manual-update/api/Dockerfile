FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install --omit=dev

COPY . .

EXPOSE 4000

CMD ["node", "index.js"] 