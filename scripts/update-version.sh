#!/usr/bin/env bash
# Generiert web/version.json dynamisch aus dem aktuellen Git-Tag (Single Source of Truth)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Ermittelt den aktuellen Git-Tag (z. B. "0.4.2" oder "0.4.2-1-g..." bei Entwicklungsständen)
TAG="$(git -C "$ROOT_DIR" describe --tags --always 2>/dev/null || echo "dev")"
COMMIT_SHORT="$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || echo "")"
COMMIT_FULL="$(git -C "$ROOT_DIR" rev-parse HEAD 2>/dev/null || echo "")"

cat <<EOF > "$ROOT_DIR/web/version.json"
{
  "version": "$TAG",
  "tag": "$TAG",
  "commit": "$COMMIT_SHORT",
  "fullCommit": "$COMMIT_FULL"
}
EOF
