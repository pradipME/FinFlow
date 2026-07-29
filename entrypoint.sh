#!/bin/sh
set -e

# Start nginx in background
nginx &

# Start Spring Boot application
exec java -jar /app/backend/app.jar \
  --server.port=8080 \
  --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod}
