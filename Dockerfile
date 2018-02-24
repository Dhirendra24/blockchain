FROM node:carbon
RUN apt-get update
RUN apt-get -y install postgresql postgresql-contrib
RUN mkdir -p /codebase
RUN mkdir -p /packages
WORKDIR /packages
COPY package*.json ./
RUN npm install
WORKDIR /codebase
