#!/usr/bin/env bash
# Optional: download Kenney Input Prompts (CC0) and copy keyboard/mouse subset.
# Manual fallback: https://kenney.nl/assets/input-prompts → unzip, then:
#   cp "Keyboard & Mouse/Default"/keyboard_*.png public/ui/input-prompts/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/ui/input-prompts"
mkdir -p "$DEST"
ZIP="${TMPDIR:-/tmp}/kenney-input-prompts.zip"

urls=(
  "https://kenney.nl/media/pages/assets/input-prompts.zip"
  "https://opengameart.org/sites/default/files/input-prompts.zip"
)

for url in "${urls[@]}"; do
  if curl -fsSL -o "$ZIP" "$url" 2>/dev/null; then
    echo "Downloaded from $url"
  break
  fi
done

if [[ ! -f "$ZIP" ]]; then
  echo "Could not auto-download. Game ships SVG prompts in public/ui/input-prompts/."
  echo "To use Kenney PNGs: download from https://kenney.nl/assets/input-prompts"
  exit 0
fi

WORKDIR="${TMPDIR:-/tmp}/kenney-input-prompts-extract"
rm -rf "$WORKDIR"
unzip -q -o "$ZIP" -d "$WORKDIR"
find "$WORKDIR" -path "*Keyboard*Default*" -name "*.png" \( \
  -name "keyboard_e.png" -o -name "keyboard_f.png" -o -name "keyboard_tab.png" -o \
  -name "keyboard_1.png" -o -name "keyboard_2.png" -o -name "keyboard_3.png" -o \
  -name "keyboard_4.png" -o -name "keyboard_5.png" -o -name "keyboard_6.png" -o \
  -name "keyboard_7.png" -o -name "keyboard_8.png" -o \
  -name "mouse_left.png" -o -name "mouse_right.png" \
\) -exec cp {} "$DEST/" \;
echo "Copied PNG subset to $DEST"
