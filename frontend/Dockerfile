# Frontend service (React + Vite)
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps
COPY frontend/package*.json ./
RUN npm install

# Copy sources
COPY frontend/tsconfig*.json ./
COPY frontend/vite.config.ts ./vite.config.ts
COPY frontend/index.html ./index.html
COPY frontend/src ./src

# Build with configurable API URL
ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
