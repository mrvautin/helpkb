FROM node:16-alpine

ENV NODE_ENV development

RUN apk add --no-cache libc6-compat

WORKDIR /var/helpkb

COPY ui/ /var/helpkb/ui/

COPY package.json /var/helpkb/
COPY package-lock.json /var/helpkb/

RUN npm install --save next@latest --include=optional
RUN npm run install:ui

RUN cd /var/helpkb/ui/ && npx next build

EXPOSE 3000/tcp