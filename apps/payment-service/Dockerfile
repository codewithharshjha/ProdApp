FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /app/apps/payment-service

RUN pnpm build

EXPOSE 8002

CMD ["pnpm", "start"]