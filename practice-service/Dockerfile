FROM node:14-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S peerprep -u 1001

COPY package.json yarn.lock ./
RUN yarn global add @nestjs/cli
RUN yarn install
COPY . .
RUN yarn build

USER peerprep
