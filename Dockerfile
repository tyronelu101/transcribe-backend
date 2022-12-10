FROM node:18-alpine as base
WORKDIR /src
COPY package*.json .
RUN npm install
COPY . .