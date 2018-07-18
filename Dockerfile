FROM node:slim

LABEL maintainer="DSRC Development Team"

WORKDIR /app

COPY ./ /app

RUN npm install

CMD [ "node", "server.js" ]

EXPOSE 3000