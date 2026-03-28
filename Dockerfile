FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm build

FROM node:22-alpine AS production
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["serve", "dist", "-l", "3000", "-s"]
