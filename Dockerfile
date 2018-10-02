FROM node:carbon

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install

EXPOSE 8080

CMD [ "node", "server.js" ]
