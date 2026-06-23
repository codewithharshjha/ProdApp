FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /app/apps/client

EXPOSE 3002

CMD ["pnpm", "dev"]

