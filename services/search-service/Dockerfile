FROM node:20-alpine

WORKDIR /app

COPY services/search-service/package*.json ./
RUN npm install --omit=dev

COPY services/search-service ./
COPY services/recipes-service/data.js ./recipes-data.js

EXPOSE 3002

CMD ["npm", "start"]
