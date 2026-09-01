#!/bin/sh
set -e

# Ensure nginx runtime dirs exist even if /tmp was reset on an ephemeral disk
mkdir -p /tmp/nginx/client_body /tmp/nginx/proxy /tmp/nginx/fastcgi \
    /tmp/nginx/uwsgi /tmp/nginx/scgi

# Render sets PORT (default 80). Rewrite the nginx listen directive so it always
# binds the port Render forwards traffic to, while still running as the
# non-root finflow user (unprivileged ports from Render, e.g. 10000).
sed -i "s/listen 80;/listen ${PORT:-80};/" /etc/nginx/nginx.conf

# Start nginx in background
nginx &

# Start Spring Boot application
exec java -jar /app/backend/app.jar \
  --server.port=8080 \
  --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod}
