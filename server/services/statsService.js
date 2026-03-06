import { env } from '../config/env.js';

async function fetchGitHubProfile(username) {
  if (!username) return null;
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      username: data.login,
      followers: data.followers,
      publicRepos: data.public_repos,
      profileUrl: data.html_url,
    };
  } catch {
    return null;
  }
}

async function fetchGitHubRepo(username, repo) {
  if (!username || !repo) return null;
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repo}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      updatedAt: data.updated_at,
      htmlUrl: data.html_url,
    };
  } catch {
    return null;
  }
}

export async function getPortfolioStats() {
  const [githubProfile, githubRepo] = await Promise.all([
    fetchGitHubProfile(env.github.username),
    fetchGitHubRepo(env.github.username, env.github.repo),
  ]);

  return {
    github: {
      profile: githubProfile,
      repo: githubRepo,
    },
    linkedin: {
      followers: env.linkedinFollowers || 'not_configured',
    },
    updatedAt: new Date().toISOString(),
  };
}
