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

RUN turbo prune user-service --docker

###############################
# Install & Build
###############################
FROM base AS builder

WORKDIR /app

COPY --from=pruner /app/out/json/ .

RUN npm install

COPY --from=pruner /app/out/full/ .

RUN DATABASE_URL=postgresql://localhost:5432/build npm run db:generate --workspace=@repo/user-db

RUN npm run build --workspace=@repo/user-db
RUN npm run build --workspace=user-service

###############################
# Runtime
###############################
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app .

WORKDIR /app/apps/user-service

EXPOSE 8004

CMD ["npm", "run", "start"]