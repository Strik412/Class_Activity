# Backend service (Express + Prisma)
FROM node:20-alpine AS builder
WORKDIR /app

# Workspace manifests
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install workspace deps
RUN npm install --workspaces

# Copy backend sources
COPY backend ./backend

# Build backend and generate Prisma client
RUN npm run prisma:generate --workspace backend && npm run build --workspace backend

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime deps and build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend

EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node backend/dist/index.js"]
