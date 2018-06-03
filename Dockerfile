FROM node:8-alpine as web

WORKDIR /opt/web

COPY web/package.json /opt/web/
COPY web/yarn.lock /opt/web/
RUN yarn install

COPY web/ /opt/web/
RUN yarn build:docker

FROM node:8-alpine

WORKDIR /opt/server

COPY server/package.json /opt/server/
COPY server/yarn.lock /opt/server/
RUN yarn install --production

COPY server/ /opt/server/
COPY --from=web /opt/web/build/ /opt/server/public/

EXPOSE 3001
CMD ["yarn", "start"]

