#!/usr/bin/env bash
#
# Extract NTP Background Images from a local Brave Browser installation.
#
# This script:
# 1. Finds the NTP Background Images component directory
# 2. Parses photo.json for metadata
# 3. Copies images to public/backgrounds/
# 4. Merges new entries into data/backgrounds.json
#
# Usage: bash scripts/extract-backgrounds.sh
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKGROUNDS_DIR="$REPO_ROOT/public/backgrounds"
DATA_FILE="$REPO_ROOT/data/backgrounds.json"
# Detect OS and set default Brave data path
if [ -z "${BRAVE_USER_DATA:-}" ]; then
  case "$(uname -s)" in
    Darwin)
      BRAVE_USER_DATA="$HOME/Library/Application Support/BraveSoftware/Brave-Browser"
      ;;
    Linux)
      BRAVE_USER_DATA="$HOME/.config/BraveSoftware/Brave-Browser"
      ;;
    *)
      echo "ERROR: Unsupported OS. Set BRAVE_USER_DATA manually."
      exit 1
      ;;
  esac
fi

echo "=== Brave NTP Background Extractor ==="
echo "Repo root: $REPO_ROOT"
echo "Looking for Brave data in: $BRAVE_USER_DATA"

# --- Find the component directory ---
COMPONENT_DIR=""
PHOTO_JSON=""

# Search for photo.json in the Brave components directory
# The NTP Background Images component stores images alongside photo.json
while IFS= read -r -d '' file; do
  PHOTO_JSON="$file"
  COMPONENT_DIR="$(dirname "$file")"
  echo "Found component at: $COMPONENT_DIR"
  break
done < <(find "$BRAVE_USER_DATA" -name "photo.json" -type f -print0 2>/dev/null)

if [ -z "$PHOTO_JSON" ]; then
  echo "ERROR: Could not find photo.json in Brave data directory."
  echo "Make sure Brave has been launched at least once to download the NTP component."
  exit 1
fi

echo "Parsing: $PHOTO_JSON"

# --- Parse photo.json and extract data ---
# photo.json contains an array of background objects.
# We need to read each entry and:
#   1. Copy the image file to public/backgrounds/
#   2. Generate a slug
#   3. Add metadata to our JSON

# Create output directory
mkdir -p "$BACKGROUNDS_DIR"

# Use a Node.js script inline for reliable JSON parsing
node -e "
const fs = require('fs');
const path = require('path');

const photoJson = JSON.parse(fs.readFileSync('$PHOTO_JSON', 'utf-8'));
const componentDir = '$COMPONENT_DIR';
const bgDir = '$BACKGROUNDS_DIR';
const dataFile = '$DATA_FILE';

// Load existing backgrounds
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
} catch (e) {
  existing = [];
}
const existingFilenames = new Set(existing.map(b => b.filename));

// Process each entry from photo.json
const photos = Array.isArray(photoJson) ? photoJson : (photoJson.images || photoJson.backgrounds || []);
let newCount = 0;
let copyCount = 0;
let nextOrder = existing.length > 0
  ? Math.max(...existing.map(b => b.sort_order)) + 1
  : 1;

// Build a lookup of existing entries by filename for updates
const existingByFilename = {};
for (const bg of existing) {
  existingByFilename[bg.filename] = bg;
}

for (const photo of photos) {
  // Normalize field names — photo.json may use different key names
  const filename = photo.wallpaperImageUrl || photo.filename || photo.image || '';
  if (!filename) continue;

  // Always try to copy the image file if it's missing from public/backgrounds/
  const destPath = path.join(bgDir, filename);
  if (!fs.existsSync(destPath)) {
    const srcPath = path.join(componentDir, filename);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log('  [copy] ' + filename);
      copyCount++;
    } else {
      console.log('  [warn] Image not found: ' + srcPath);
    }
  }

  // Update image_url for existing entries if the file now exists
  if (existingByFilename[filename]) {
    if (fs.existsSync(destPath) && !existingByFilename[filename].image_url) {
      existingByFilename[filename].image_url = '/backgrounds/' + filename;
      console.log('  [update] ' + filename + ' → image_url set');
    } else if (existingByFilename[filename].image_url) {
      console.log('  [ok] ' + filename);
    }
    continue;
  }

  // Generate slug from filename
  const slug = filename
    .replace(/\.[^.]+\$/, '')       // remove extension
    .replace(/[_\s]+/g, '-')       // underscores/spaces to dashes
    .replace(/[^a-z0-9-]/gi, '')   // remove special chars
    .toLowerCase();

  const author = photo.author || 'Unknown';
  const authorUrl = photo.link || '';
  const license = photo.license || 'used with permission';
  const originalUrl = photo.originalUrl || '';

  // Create new entry
  const entry = {
    slug: slug,
    filename: filename,
    author: author,
    author_url: authorUrl,
    season: 'Unknown',  // Will need manual classification or detection
    license: license,
    original_url: originalUrl,
    description: author + ' photography',
    image_url: fs.existsSync(destPath) ? '/backgrounds/' + filename : null,
    thumbnail_url: null,
    width: null,
    height: null,
    dominant_color: '#1A1425',
    is_current: true,
    sort_order: nextOrder++,
  };

  existing.push(entry);
  existingByFilename[filename] = entry;
  newCount++;
}

// Mark old 'is_current' entries as not current if they're not in the new set
const currentFilenames = new Set(photos.map(p => p.wallpaperImageUrl || p.filename || p.image || ''));
for (const bg of existing) {
  if (!currentFilenames.has(bg.filename)) {
    bg.is_current = false;
  } else {
    bg.is_current = true;
  }
}

// Write updated data
fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2) + '\n');
console.log('');
console.log('Done! Added ' + newCount + ' new background(s), copied ' + copyCount + ' image(s). Total: ' + existing.length);
"

echo ""
echo "=== Extraction complete ==="
echo "Images in: $BACKGROUNDS_DIR"
echo "Data in:   $DATA_FILE"
