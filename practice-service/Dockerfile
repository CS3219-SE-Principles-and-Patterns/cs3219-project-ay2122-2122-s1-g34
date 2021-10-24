FROM node:14-alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV production
RUN yarn build
