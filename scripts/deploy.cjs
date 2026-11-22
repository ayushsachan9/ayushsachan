const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Cloudflare deployment for ayushsachan.in...');

// 1. Resolve Cloudflare auth token & ensure freshness via cf auth whoami if needed
const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
const cfConfigPath = path.join(appData, 'xdg.config', 'cloudflare', 'config', 'default.json');

try {
  // Trigger cf auth whoami to refresh token if needed
  execSync('npx cf auth whoami', { stdio: 'pipe' });
} catch (e) {
  // If cf auth whoami fails, proceed to attempt with existing token
}

let token = process.env.CLOUDFLARE_API_TOKEN;
if (!token && fs.existsSync(cfConfigPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(cfConfigPath, 'utf8'));
    token = data.oauth_token;
  } catch (err) {
    console.warn('Could not read cf CLI default.json:', err.message);
  }
}

// 2. Build Vite Project
console.log('📦 Building Vite project...');
execSync('npm run build', { stdio: 'inherit' });

// 3. Deploy to Cloudflare Pages
console.log('☁️  Deploying to Cloudflare Pages (ayush-sachan-portfolio)...');
execSync('npx wrangler pages deploy dist --project-name ayush-sachan-portfolio --branch main --commit-dirty=true', {
  stdio: 'inherit',
  env: {
    ...process.env,
    CLOUDFLARE_API_TOKEN: token
  }
});

console.log('\n✅ Successfully deployed to https://ayushsachan.in and https://ayushsachan.in/exam!');
