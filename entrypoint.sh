#!/bin/sh
set -e

# Ensure nginx runtime dirs exist even if /tmp was reset on an ephemeral disk
mkdir -p /tmp/nginx/client_body /tmp/nginx/proxy /tmp/nginx/fastcgi \
    /tmp/nginx/uwsgi /tmp/nginx/scgi

# Render sets PORT (default 80). Generate the effective nginx config into a
# WRITABLE location (/tmp/nginx) so we never write to the read-only /etc/nginx
# at runtime. The static template with "${PORT}" lives at /etc/nginx/nginx.conf
# (copied read-only at image build). We use plain 'sed' output redirection --
# NOT 'sed -i' -- so no temporary file is created in /etc/nginx.
sed "s|\${PORT}|${PORT:-80}|g" /etc/nginx/nginx.conf > /tmp/nginx/nginx.conf

# Start nginx in background, pointing -c at the writable generated config.
nginx -c /tmp/nginx/nginx.conf &

# Start Spring Boot application
exec java -jar /app/backend/app.jar \
  --server.port=8080 \
  --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod}
