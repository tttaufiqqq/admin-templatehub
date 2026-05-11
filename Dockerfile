FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate

ARG DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL=$DATABASE_URL

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
