#!/usr/bin/env bash
# Synchronisiert die Versionsnummer über web/version.json, web/index.html und web/app.js
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Verwendung: $0 <version> (z. B. 0.3.7)"
  exit 1
fi

NEW_VER="$1"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 1. web/version.json
cat <<EOF > "$ROOT_DIR/web/version.json"
{
  "version": "$NEW_VER",
  "tag": "$NEW_VER"
}
EOF

# 2. web/index.html Badge
sed -i '' -E "s/(id=\"appVersion\">)[^<]+(<\/span>)/\1$NEW_VER\2/g" "$ROOT_DIR/web/index.html"

# 3. web/app.js Konstante
sed -i '' -E "s/(const APP_VERSION = \")[^\"]+(\";)/\1$NEW_VER\2/g" "$ROOT_DIR/web/app.js"

echo "Version erfolgreich auf $NEW_VER aktualisiert in web/version.json, web/index.html und web/app.js."
