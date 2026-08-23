FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN npm install -g npm@11.10.1
RUN npm install -g turbo

COPY package.json package-lock.json turbo.json ./

COPY apps/product-service/package.json ./apps/product-service/package.json

COPY packages ./packages

RUN npm install

COPY apps/product-service ./apps/product-service

RUN DATABASE_URL=postgresql://localhost:5432/build npm run db:generate --workspace=@repo/product-db

RUN npm run build --workspace=product-service


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app .

WORKDIR /app/apps/product-service

EXPOSE 8003

CMD ["npm", "run", "start"]