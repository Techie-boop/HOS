const { execSync } = require('child_process');

console.log("Detecting build environment...");
console.log("CF_PAGES:", process.env.CF_PAGES);
console.log("VERCEL:", process.env.VERCEL);

if (process.env.VERCEL === '1' || process.env.STANDALONE === '1' || process.env.NEXT_STANDALONE === '1') {
  console.log(">> Standard environment (Vercel/Local/Docker) detected. Compiling using next build...");
  execSync('npx prisma generate && npx next build', { stdio: 'inherit' });
} else {
  console.log(">> Cloudflare / OpenNext environment detected. Compiling using next build followed by opennextjs-cloudflare...");
  execSync('npx prisma generate && npx next build && npx opennextjs-cloudflare build --skipNextBuild', { stdio: 'inherit' });
}
