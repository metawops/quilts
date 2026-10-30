#!/usr/bin/env bash
# Synchronisiert die Web-Applikation auf den Strato VPS (quilts.wops.de)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Deploye Quilts V2 auf Strato VPS (quilts.wops.de)..."

# SSH-Optionen um RemoteCommand/tmux fuer automatisierte Befehle zu deaktivieren
SSH_OPTS="-o RemoteCommand=none -o RequestTTY=no"

rsync -avz --exclude '.DS_Store' -e "ssh $SSH_OPTS" "$ROOT_DIR/web/" vps:/var/www/quilts.wops.de/

echo "✅ Deployment erfolgreich abgeschlossen!"
echo "🌐 Live unter: https://quilts.wops.de"
