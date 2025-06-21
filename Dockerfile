FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG MONGO_URL
ENV MONGO_URL=${MONGO_URL}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]