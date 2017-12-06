FROM node:8
MAINTAINER Andrei Kazakou <a.v.kazakou@gmail.com>

ENV NODE_ENV=debug
ENV database__uri=mongodb://heroku_1gzx69f4:heroku_1gzx69f4@ds133136.mlab.com:33136/heroku_1gzx69f4

COPY docker/application /usr/src/container
COPY ./ /usr/src/app
WORKDIR /usr/src/app

RUN cd /usr/src/app
RUN rm -rf build node_modules package-lock.json
RUN npm install -g gulp migrate-mongoose && npm install gulp && npm install
RUN npm run build

CMD node build/src/index.js --server:port=${PORT}