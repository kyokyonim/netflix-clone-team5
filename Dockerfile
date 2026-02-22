# ─────────────────────────────────────────
# Stage 1: 의존성 설치
# ─────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ─────────────────────────────────────────
# Stage 2: 빌드
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_TMDB_API_KEY
ENV NEXT_PUBLIC_TMDB_API_KEY=$NEXT_PUBLIC_TMDB_API_KEY

RUN npm run build

# ─────────────────────────────────────────
# Stage 3: 실행 (경량 이미지)
# ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
