FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

WORKDIR /app/apps/order-service
EXPOSE 8003

CMD ["pnpm", "dev"]