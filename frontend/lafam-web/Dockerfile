# Stage 1: Install dependencies

FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .


ENV NEXT_TELEMETRY_DISABLED=1


ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY


RUN npm run build

# Stage 3: Production

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public directory
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy build-time files
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


# Set ownership
USER nextjs

# Expose the port
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Default command to run the application
CMD ["node", "server.js"]

