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

RUN turbo prune payment-service --docker

###############################
# Install & Build
###############################
FROM base AS builder

WORKDIR /app

COPY --from=pruner /app/out/json/ .

RUN npm install

COPY --from=pruner /app/out/full/ .

RUN DATABASE_URL=postgresql://localhost:5432/build npm run db:generate --workspace=@repo/payment-db

RUN npm run build --workspace=@repo/emailService
RUN npm run build --workspace=@repo/payment-db
RUN npm run build --workspace=payment-service

###############################
# Runtime
###############################
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app .

WORKDIR /app/apps/payment-service

EXPOSE 8002

CMD ["npm", "run", "start"]