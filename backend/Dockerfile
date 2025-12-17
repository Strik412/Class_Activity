# Backend service (Express + Prisma)
FROM node:20-slim AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Workspace manifests
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install workspace deps
RUN npm install --workspaces

# Copy backend sources and prisma schema
COPY backend ./backend
COPY backend/prisma ./backend/prisma

# Build backend and generate Prisma client
RUN cd backend && npx prisma generate && npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy runtime deps and build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend

EXPOSE 4000
CMD ["sh", "-c", "cd backend && npx prisma migrate deploy && node dist/index.js"]
