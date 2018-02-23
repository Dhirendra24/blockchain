FROM node:carbon
RUN mkdir -p /codebase
RUN mkdir -p /packages
WORKDIR /packages
COPY package*.json ./
RUN npm install
WORKDIR /codebase
