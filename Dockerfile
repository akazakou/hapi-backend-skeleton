FROM node:8
MAINTAINER Andrei Kazakou <a.v.kazakou@gmail.com>

COPY ./ /usr/src/app
WORKDIR /usr/src/app

RUN cd /usr/src/app
RUN rm -rf build node_modules package-lock.json
RUN npm install
RUN npm run build

CMD sh /usr/src/app/docker/application/heroku.sh
