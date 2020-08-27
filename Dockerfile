FROM node:14.4.0-alpine3.10 as base
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
COPY client/package.json client/yarn.lock ./client/
COPY server/package.json server/yarn.lock ./server/
RUN yarn --pure-lockfile
COPY . .
RUN yarn build

FROM node:14.4.0-alpine3.10 as production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
COPY client/package.json client/yarn.lock ./client/
COPY server/package.json server/yarn.lock ./server/
RUN yarn --pure-lockfile && yarn --cwd client --pure-lockfile && yarn --cwd server --pure-lockfile
COPY --from=base /usr/src/app/client/build ./client/build
COPY --from=base /usr/src/app/server/build ./server/build
WORKDIR "/usr/src/app/server"
CMD ["node", "build/index.js"]