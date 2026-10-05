import { App } from 'octokit';

const GITHUB_APP_KEY = 'github-app';

const globalForGitHubApp = global as unknown as {
  [GITHUB_APP_KEY]?: App;
};

export function getGitHubApp() {
  const appId = process.env.GITHUB_APP_APPID!;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY!;

  const app = new App({
    appId: appId,
    privateKey: privateKey,
    webhooks: {
      secret: process.env.GITHUB_APP_WEBHOOK_SECRET!
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    if (globalForGitHubApp[GITHUB_APP_KEY] === undefined) {
      globalForGitHubApp[GITHUB_APP_KEY] = app;
    }
  }

  return app;
}
