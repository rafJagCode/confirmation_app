FROM node:16

WORKDIR /usr/src/confirmation_app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 443