#!/usr/bin/env bash
set -euo pipefail

src="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/deploy/ruox.top.nginx.conf"
dst="/etc/nginx/sites-available/default"
backup="/etc/nginx/sites-available/default.ruox-$(date +%Y%m%d%H%M%S).bak"

cp "$dst" "$backup"
cp "$src" "$dst"
nginx -t
systemctl reload nginx

echo "Installed ruox.top nginx config. Backup: $backup"
