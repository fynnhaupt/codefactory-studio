import dotenvLoad from 'dotenv-load';
import SmeeClient from 'smee-client';

dotenvLoad();

if (!process.env.GITHUB_APP_WEBHOOK_PROXY_URL) {
  throw new Error('GITHUB_APP_WEBHOOK_PROXY_URL is not defined');
}

const smee = new SmeeClient({
  source: process.env.GITHUB_APP_WEBHOOK_PROXY_URL,
  target: ' http://localhost:3000/api/github/callback/webhook',
  logger: console
});

smee.start();
