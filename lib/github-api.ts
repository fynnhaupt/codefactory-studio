import { Octokit } from 'octokit';

export function getGitHubApi(token: string) {
  return new Octokit({
    auth: token
  });
}
