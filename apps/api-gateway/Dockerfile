FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /app/apps/api-gateway

EXPOSE 8000

CMD ["pnpm", "dev"]

