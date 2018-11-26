FROM node:latest

WORKDIR /tmp
COPY package-lock.json package.json ./
RUN npm install
WORKDIR /var/app
ADD . .
RUN cp -r /tmp/node_modules ./node_modules && rm -rf /tmp

ENTRYPOINT node index.js
