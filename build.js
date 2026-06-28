const { execSync } = require('child_process');

console.log("Detecting build environment...");
console.log("CF_PAGES:", process.env.CF_PAGES);
console.log("VERCEL:", process.env.VERCEL);

if (process.env.CF_PAGES === '1' || process.env.CF_PAGES === 1) {
  console.log(">> Cloudflare Pages detected. Compiling using @opennextjs/cloudflare adapter...");
  execSync('npx prisma generate && npx opennextjs-cloudflare build', { stdio: 'inherit' });
} else {
  console.log(">> Standard environment (Vercel/Local/Docker) detected. Compiling using next build...");
  execSync('npx prisma generate && npx next build', { stdio: 'inherit' });
}
