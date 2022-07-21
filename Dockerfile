FROM node:16-alpine
ENV NODE_ENV development

RUN apk add --no-cache libc6-compat g++

WORKDIR /app
COPY . .

RUN npm run install:ui

EXPOSE 3000/tcp