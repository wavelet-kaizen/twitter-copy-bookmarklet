const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('[inject-user-config] No target files provided.');
  process.exit(1);
}

const BANNER = 'window.TWITTER_COPY_USER_CONFIG={trimBlankLine:128,removeEmoji:false};';
const PREFIX = 'javascript:';

files.forEach((relativePath) => {
  const filePath = path.resolve(relativePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`[inject-user-config] Skip (not found): ${relativePath}`);
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  if (!original.startsWith(PREFIX)) {
    console.warn(`[inject-user-config] Skip (missing prefix): ${relativePath}`);
    return;
  }

  const payload = original.slice(PREFIX.length);
  if (payload.startsWith(BANNER)) {
    return;
  }

  const updated = `${PREFIX}${BANNER}${payload}`;
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`[inject-user-config] Injected config banner into ${relativePath}`);
});




