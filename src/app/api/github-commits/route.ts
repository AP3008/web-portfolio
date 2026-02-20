import { NextResponse } from "next/server";

const PROJECT_REPOS = [
  "garv130/FindMyProf",
  "adit1110/Reflecta",
  "AP3008/Learning-To-Fly",
  "AP3008/Bookey",
  "AP3008/UWO-H4H-Webpage",
  "AP3008/CityScope",
  "lblommesteyn/wds-reciepts",
  "AP3008/accountability",
];
const WEB_PORTFOLIO_REPO = "AP3008/web-portfolio";

export const revalidate = 3600;

interface GitHubCommitListItem {
  sha: string;
  html_url: string;
  commit: {
    message: string;
  };
}

interface GitHubCommitDetail {
  sha: string;
  html_url: string;
  commit: {
    message: string;
  };
  stats: { additions: number; deletions: number };
}

export interface CommitData {
  sha: string;
  shortSha: string;
  message: string;
  htmlUrl: string;
  additions: number;
  deletions: number;
}

async function fetchCommitDetail(
  repo: string,
  item: GitHubCommitListItem
): Promise<CommitData> {
  let additions = 0;
  let deletions = 0;

  const detailRes = await fetch(
    `https://api.github.com/repos/${repo}/commits/${item.sha}`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    }
  );

  if (detailRes.ok) {
    const detail: GitHubCommitDetail = await detailRes.json();
    additions = detail.stats?.additions ?? 0;
    deletions = detail.stats?.deletions ?? 0;
  }

  return {
    sha: item.sha,
    shortSha: item.sha.slice(0, 7),
    message: item.commit.message.split("\n")[0],
    htmlUrl: item.html_url,
    additions,
    deletions,
  };
}

async function fetchLatestCommit(repo: string): Promise<CommitData | null> {
  const res = await fetch(
    `https://api.github.com/repos/${repo}/commits?per_page=1`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return null;
  const items: GitHubCommitListItem[] = await res.json();
  if (!items.length) return null;
  return fetchCommitDetail(repo, items[0]);
}

export async function GET() {
  try {
    // Fetch latest commit for each project repo + 3 commits for web-portfolio, all in parallel
    const [projectResults, wpListRes] = await Promise.all([
      Promise.all(PROJECT_REPOS.map((repo) => fetchLatestCommit(repo))),
      fetch(
        `https://api.github.com/repos/${WEB_PORTFOLIO_REPO}/commits?per_page=3`,
        {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 3600 },
        }
      ),
    ]);

    // Build latestByRepo map
    const latestByRepo: Record<string, CommitData> = {};
    PROJECT_REPOS.forEach((repo, i) => {
      const result = projectResults[i];
      if (result) latestByRepo[repo] = result;
    });

    // Build web-portfolio commits array
    let webPortfolioCommits: CommitData[] = [];
    if (wpListRes.ok) {
      const wpItems: GitHubCommitListItem[] = await wpListRes.json();
      webPortfolioCommits = await Promise.all(
        wpItems.map((item) => fetchCommitDetail(WEB_PORTFOLIO_REPO, item))
      );
    }

    return NextResponse.json(
      { latestByRepo, webPortfolioCommits },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal error", latestByRepo: {}, webPortfolioCommits: [] },
      { status: 500 }
    );
  }
}
