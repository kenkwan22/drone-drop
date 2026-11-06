// Copies the web game into www/ so Capacitor can bundle it into the iOS and Android apps.
import { cpSync, mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'manifest.webmanifest']) cpSync(join(root, f), join(out, f));
// Optional: inject RevenueCat public SDK keys at build time, so a key (for example a test_ Test Store key used while developing)
// never has to be committed. Usage: RC_ANDROID_KEY=goog_... RC_IOS_KEY=appl_... npm run sync
const keys = { iosKey: process.env.RC_IOS_KEY, androidKey: process.env.RC_ANDROID_KEY };
let html = readFileSync(join(out, 'index.html'), 'utf8');
for (const [name, val] of Object.entries(keys)) {
  if (!val) continue;
  const before = new RegExp(name + ": ''");
  if (!before.test(html)) { console.error('Cannot inject ' + name + ': it is not empty in index.html'); process.exit(1); }
  html = html.replace(before, name + ": '" + val.replace(/[^A-Za-z0-9_.-]/g, '') + "'");
  console.log('injected ' + name + ' (' + val.slice(0, 5) + '...)');
}
writeFileSync(join(out, 'index.html'), html);
if (existsSync(join(root, 'assets'))) cpSync(join(root, 'assets'), join(out, 'assets'), { recursive: true });
console.log('web build copied to www/');
