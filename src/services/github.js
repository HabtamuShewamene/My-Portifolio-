function parseGitHubRepo(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('github.com')) return null;
    const [owner, repo] = parsed.pathname.split('/').filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

export async function fetchGitHubStats(githubUrl) {
  const repoInfo = parseGitHubRepo(githubUrl);
  if (!repoInfo) return null;

  try {
    const repoResponse = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
    );
    if (!repoResponse.ok) return null;
    const repo = await repoResponse.json();

    const commitsResponse = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=1`,
    );
    const commits = commitsResponse.ok ? await commitsResponse.json() : [];
    const lastCommit = commits?.[0]?.commit?.committer?.date || null;

    return {
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      lastCommit,
    };
  } catch {
    return null;
  }
}
