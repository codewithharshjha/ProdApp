###############################
# Base
###############################
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g turbo

###############################
# Prune
###############################
FROM base AS pruner

COPY . .

RUN turbo prune order-service --docker

###############################
# Install & Build
###############################
FROM base AS builder

WORKDIR /app

COPY --from=pruner /app/out/json/ .

RUN npm install

COPY --from=pruner /app/out/full/ .

RUN npm run build --workspace=order-service

###############################
# Runtime
###############################
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app .

WORKDIR /app/apps/order-service

EXPOSE 8001

CMD ["npm", "run", "start"]