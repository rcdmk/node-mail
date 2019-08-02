FROM node:10.16.0-alpine

ENV NODE_ENV=production

WORKDIR /var/app

COPY package*.json .

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "node" , "index.js" ]
