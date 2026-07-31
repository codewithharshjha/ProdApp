###############################
# Base Image
###############################
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g turbo

###############################
# Prune Workspace
###############################
FROM base AS pruner

COPY . .

RUN turbo prune product-service --docker

###############################
# Install Dependencies
###############################
FROM base AS installer

WORKDIR /app

COPY --from=pruner /app/out/json/ .

RUN npm ci

COPY --from=pruner /app/out/full/ .

RUN npm run build --workspace=product-service

###############################
# Runtime
###############################
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=installer /app .

WORKDIR /app/apps/product-service

EXPOSE 8003

CMD ["npm","run","start"]