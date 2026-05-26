#!/usr/bin/env bash
# One-command deploy: build -> upload -> nginx setup on Lightsail.
# Run from project root:  ./deploy.sh
# First time? Edit SSH_KEY below to point at your Lightsail .pem file.

set -euo pipefail

# ---- Config ----
SERVER_IP="13.250.5.140"
SERVER_USER="ubuntu"
DOMAIN="metamorphs.xyz"
WWW_DOMAIN="www.metamorphs.xyz"
REMOTE_ROOT="/var/www/metamorphs"

# SSH key location -- override with:  SSH_KEY=/path/to/key.pem ./deploy.sh
SSH_KEY="${SSH_KEY:-$HOME/Downloads/LightsailDefaultKey-ap-southeast-1.pem}"

# ---- Pre-flight checks ----
if [ ! -f "$SSH_KEY" ]; then
  echo "ERROR: SSH key not found: $SSH_KEY"
  echo "  Download from Lightsail -> Account -> SSH keys"
  echo "  Or override: SSH_KEY=/path/to/your-key.pem ./deploy.sh"
  exit 1
fi

chmod 400 "$SSH_KEY" 2>/dev/null || true

SSH_OPTS=(-i "$SSH_KEY" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15)

echo "Server  : $SERVER_USER@$SERVER_IP"
echo "Domain  : $DOMAIN  /  $WWW_DOMAIN"
echo "SSH key : $SSH_KEY"
echo ""

# ---- 1. Build ----
echo "[1/3] Building production bundle..."
npm run build
echo ""

# ---- 2. Upload to staging ----
echo "[2/3] Uploading dist/ to staging on $SERVER_IP..."
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_IP" \
  "rm -rf /tmp/metamorphs-staging && mkdir -p /tmp/metamorphs-staging"
scp "${SSH_OPTS[@]}" -r dist/. "$SERVER_USER@$SERVER_IP:/tmp/metamorphs-staging/"
echo ""

# ---- 3. Server-side configure ----
echo "[3/3] Configuring server..."
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_IP" \
  "DOMAIN='$DOMAIN' WWW_DOMAIN='$WWW_DOMAIN' REMOTE_ROOT='$REMOTE_ROOT' bash -s" <<'REMOTE'
set -euo pipefail

if ! command -v nginx >/dev/null 2>&1; then
  echo "  installing nginx..."
  sudo DEBIAN_FRONTEND=noninteractive apt-get update -y
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx
  sudo systemctl enable --now nginx
fi

# Atomic content swap
sudo mkdir -p "$REMOTE_ROOT"
sudo rm -rf "$REMOTE_ROOT"/*
sudo cp -r /tmp/metamorphs-staging/. "$REMOTE_ROOT"/
sudo chown -R www-data:www-data "$REMOTE_ROOT"
rm -rf /tmp/metamorphs-staging

# Write nginx server block ONLY if config doesn't exist yet.
# On subsequent deploys we leave it alone so certbot's SSL edits are preserved.
if [ ! -f /etc/nginx/sites-available/metamorphs ]; then
  echo "  writing initial nginx config..."
  sudo tee /etc/nginx/sites-available/metamorphs >/dev/null <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN $WWW_DOMAIN;

    root $REMOTE_ROOT;
    index index.html;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

  sudo ln -sf /etc/nginx/sites-available/metamorphs /etc/nginx/sites-enabled/metamorphs
  sudo rm -f /etc/nginx/sites-enabled/default
fi

sudo nginx -t
sudo systemctl reload nginx

if ! command -v certbot >/dev/null 2>&1; then
  echo "  installing certbot..."
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y certbot python3-certbot-nginx
fi

echo "  nginx serving $REMOTE_ROOT"
REMOTE

echo ""
echo "[OK] Deploy complete."
echo ""
echo "Site live at http://$SERVER_IP and (after DNS propagates) http://$DOMAIN"
echo ""
echo "To enable HTTPS, run:"
echo "  ssh -i \"$SSH_KEY\" $SERVER_USER@$SERVER_IP \\"
echo "    \"sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos -m you@example.com --redirect\""
echo ""
