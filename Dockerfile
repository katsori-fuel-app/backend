FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.2.2 --activate
RUN pnpm config set ignore-scripts false

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "prod:start"]