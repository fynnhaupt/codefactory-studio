import { Octokit } from 'octokit';

export function getGithubApi(token: string) {
  return new Octokit({
    auth: token
  });
}
