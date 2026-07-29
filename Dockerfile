# Multi-stage build for FinFlow

# ── Stage 1: Build frontend ──
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build backend ──
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn package -DskipTests -B

# ── Stage 3: Production runtime ──
FROM eclipse-temurin:21-jre-alpine AS production
RUN addgroup -S finflow && adduser -S finflow -G finflow

WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy backend jar
COPY --from=backend-build /app/backend/target/*.jar ./backend/app.jar

# Copy frontend nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Install nginx
RUN apk add --no-cache nginx

# Set ownership
RUN chown -R finflow:finflow /app

EXPOSE 80 8080

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER finflow

ENTRYPOINT ["/entrypoint.sh"]
