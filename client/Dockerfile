<<<<<<< HEAD
# Install dependencies only when needed
FROM node:14-alpine AS deps
=======
FROM node:14-alpine AS builder
>>>>>>> dev
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
<<<<<<< HEAD

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image
=======
COPY . .
RUN yarn build

>>>>>>> dev
FROM nginx AS runner
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
