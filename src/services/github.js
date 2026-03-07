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

const statsCache = new Map();
const inFlightRequests = new Map();
let rateLimitedUntil = 0;

export async function fetchGitHubStats(githubUrl) {
  const cached = statsCache.get(githubUrl);
  if (cached) return cached;

  if (Date.now() < rateLimitedUntil) {
    return null;
  }

  const repoInfo = parseGitHubRepo(githubUrl);
  if (!repoInfo) return null;
  if (repoInfo.owner.toLowerCase() === 'your-username') return null;

  if (inFlightRequests.has(githubUrl)) {
    return inFlightRequests.get(githubUrl);
  }

  const request = (async () => {
    try {
      const repoResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );

      if (repoResponse.status === 403) {
        // Back off for a short period to avoid repeated browser console noise.
        rateLimitedUntil = Date.now() + 5 * 60 * 1000;
        return null;
      }
      if (!repoResponse.ok) return null;

      const repo = await repoResponse.json();

      const commitsResponse = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/commits?per_page=1`,
        { headers: { Accept: 'application/vnd.github+json' } },
      );
      const commits = commitsResponse.ok ? await commitsResponse.json() : [];
      const lastCommit = commits?.[0]?.commit?.committer?.date || null;

      const result = {
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        lastCommit,
      };
      statsCache.set(githubUrl, result);
      return result;
    } catch {
      return null;
    } finally {
      inFlightRequests.delete(githubUrl);
    }
  })();

  inFlightRequests.set(githubUrl, request);
  return request;
}
