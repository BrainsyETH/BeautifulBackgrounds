#!/usr/bin/env bash
#
# Extract NTP Background Images from a local Brave Browser installation.
#
# This script:
# 1. Finds the NTP Background Images component (aoojcmojmmcbpfgoecoadbdpnagfchel)
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

# The NTP Background Images component ID in Brave
# This is distinct from the Sponsored Images component (gccbbckogglekeggclmmekihdgdpdgoe)
NTP_COMPONENT_ID="aoojcmojmmcbpfgoecoadbdpnagfchel"

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

# --- Find the NTP component directory ---
NTP_BASE="$BRAVE_USER_DATA/$NTP_COMPONENT_ID"

if [ ! -d "$NTP_BASE" ]; then
  echo "ERROR: NTP Background Images component not found at:"
  echo "  $NTP_BASE"
  echo ""
  echo "Open brave://components in Brave and look for 'NTP Background Images'."
  echo "Click 'Check for update' to download it."
  exit 1
fi

# Find the latest version subdirectory
COMPONENT_DIR=""
LATEST_VERSION=""
for dir in "$NTP_BASE"/*/; do
  [ -d "$dir" ] || continue
  version="$(basename "$dir")"
  echo "  Found NTP component version: $version"
  if [ -z "$LATEST_VERSION" ] || [[ "$version" > "$LATEST_VERSION" ]]; then
    LATEST_VERSION="$version"
    COMPONENT_DIR="${dir%/}"
  fi
done

if [ -z "$COMPONENT_DIR" ]; then
  echo "ERROR: No version directories found in $NTP_BASE"
  echo "Open brave://components and click 'Check for update' on NTP Background Images."
  exit 1
fi

PHOTO_JSON="$COMPONENT_DIR/photo.json"
if [ ! -f "$PHOTO_JSON" ]; then
  echo "ERROR: photo.json not found in $COMPONENT_DIR"
  exit 1
fi

echo ""
echo "Using NTP component: $COMPONENT_DIR (version $LATEST_VERSION)"
echo ""

# --- Diagnostics: show everything in the component directory ---
echo "--- Component directory contents ---"
ls -lhR "$COMPONENT_DIR"/ 2>/dev/null || echo "(could not list directory)"
echo ""

echo "--- photo.json (raw content, first 2000 chars) ---"
head -c 2000 "$PHOTO_JSON"
echo ""
echo ""

echo "--- photo.json summary ---"
node -e "
const data = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf-8'));
const photos = Array.isArray(data) ? data : (data.images || data.backgrounds || []);
console.log('Total entries in photo.json: ' + photos.length);
console.log('');
if (photos.length > 0) {
  console.log('First entry (all keys):');
  const first = photos[0];
  for (const [k, v] of Object.entries(first)) {
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    console.log('  ' + k + ': ' + (s.length > 100 ? s.slice(0, 100) + '...' : s));
  }
  console.log('');
}
console.log('All entries:');
for (let i = 0; i < photos.length; i++) {
  const p = photos[i];
  // Try every plausible filename key — 'source' is what Brave uses as of 2026-Q1
  const f = p.source || p.wallpaperImageUrl || p.imageUrl || p.image_url
    || p.filename || p.file || p.image || p.url || p.name || '(no filename field found)';
  const a = p.author || p.photographer || p.credit || '?';
  console.log('  ' + (i+1) + '. ' + f + ' — ' + a);
}
" "$PHOTO_JSON"
echo ""

# --- Parse photo.json and extract data ---
mkdir -p "$BACKGROUNDS_DIR"

node -e "
const fs = require('fs');
const path = require('path');

const photoJson = JSON.parse(fs.readFileSync(process.argv[1], 'utf-8'));
const componentDir = process.argv[2];
const bgDir = process.argv[3];
const dataFile = process.argv[4];

// Load existing backgrounds
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
} catch (e) {
  existing = [];
}

// Process each entry from photo.json
const photos = Array.isArray(photoJson) ? photoJson : (photoJson.images || photoJson.backgrounds || []);
let newCount = 0;
let copyCount = 0;
let updateCount = 0;
let nextOrder = existing.length > 0
  ? Math.max(...existing.map(b => b.sort_order)) + 1
  : 1;

// Build a lookup of existing entries by filename
const existingByFilename = {};
for (const bg of existing) {
  existingByFilename[bg.filename] = bg;
}

// List all image files in the component directory (recursively)
function findImages(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findImages(full));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      results.push({ name: entry.name, path: full });
    }
  }
  return results;
}

const componentImages = findImages(componentDir);
console.log('Image files found in component (recursive): ' + componentImages.length);
for (const img of componentImages) {
  console.log('  ' + img.path.replace(componentDir + '/', ''));
}
console.log('');

for (const photo of photos) {
  // Try every plausible filename key — 'source' is what Brave uses as of 2026-Q1
  const filename = photo.source || photo.wallpaperImageUrl || photo.imageUrl || photo.image_url
    || photo.filename || photo.file || photo.image || '';
  if (!filename) continue;

  // Try to find the image: directly, or as basename in subdirectories
  const destPath = path.join(bgDir, path.basename(filename));
  if (!fs.existsSync(destPath)) {
    // Try direct path first
    let srcPath = path.join(componentDir, filename);
    if (!fs.existsSync(srcPath)) {
      // Try finding by basename in any subdirectory
      const match = componentImages.find(img => img.name === path.basename(filename));
      if (match) srcPath = match.path;
    }
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log('  [copy] ' + filename);
      copyCount++;
    } else {
      console.log('  [MISS] ' + filename + ' — not found anywhere in component dir');
    }
  }

  const baseName = path.basename(filename);

  // Check if already exists in our data
  if (existingByFilename[baseName] || existingByFilename[filename]) {
    const entry = existingByFilename[baseName] || existingByFilename[filename];
    if (fs.existsSync(destPath) && !entry.image_url) {
      entry.image_url = '/backgrounds/' + baseName;
      console.log('  [update] ' + baseName + ' → image_url set');
      updateCount++;
    } else {
      console.log('  [ok] ' + baseName);
    }
    continue;
  }

  // Generate slug from filename
  const slug = baseName
    .replace(/\.[^.]+\$/, '')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/gi, '')
    .toLowerCase();

  const author = photo.author || photo.photographer || photo.credit || 'Unknown';
  const authorUrl = photo.link || photo.authorUrl || photo.author_url || '';
  const license = photo.license || 'used with permission';
  const originalUrl = photo.originalUrl || photo.original_url || '';

  const entry = {
    slug: slug,
    filename: baseName,
    author: author,
    author_url: authorUrl,
    season: 'Unknown',
    license: license,
    original_url: originalUrl,
    description: author + ' photography',
    image_url: fs.existsSync(destPath) ? '/backgrounds/' + baseName : null,
    thumbnail_url: null,
    width: null,
    height: null,
    dominant_color: '#1A1425',
    is_current: true,
    sort_order: nextOrder++,
  };

  existing.push(entry);
  existingByFilename[baseName] = entry;
  newCount++;
  console.log('  [new] ' + baseName + ' (' + author + ')');
}

// Mark is_current based on whether the entry is in the current photo.json
const currentFilenames = new Set(photos.map(p => {
  const f = p.source || p.wallpaperImageUrl || p.imageUrl || p.image_url
    || p.filename || p.file || p.image || '';
  return path.basename(f);
}));
for (const bg of existing) {
  bg.is_current = currentFilenames.has(bg.filename);
}

// Write updated data
fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2) + '\n');
console.log('');
console.log('=== Summary ===');
console.log('New entries added:   ' + newCount);
console.log('Images copied:       ' + copyCount);
console.log('image_url updated:   ' + updateCount);
console.log('Total backgrounds:   ' + existing.length);
console.log('Images in component: ' + componentImages.length);
" "$PHOTO_JSON" "$COMPONENT_DIR" "$BACKGROUNDS_DIR" "$DATA_FILE"

echo ""
echo "=== Extraction complete ==="
echo "Images in: $BACKGROUNDS_DIR"
echo "Data in:   $DATA_FILE"
echo ""
echo "TIP: If the backgrounds are stale, open brave://components in Brave,"
echo "     find 'NTP Background Images', and click 'Check for update'."
echo "     Then re-run this script."
