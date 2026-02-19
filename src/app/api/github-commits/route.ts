import { NextResponse } from "next/server";

const REPO_OWNER = "AP3008";
const REPO_NAME = "web-portfolio";
const MAX_COMMITS = 5;

interface GitHubCommitListItem {
  sha: string;
}

interface GitHubCommitDetail {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { date: string };
  };
  stats: { additions: number; deletions: number; total: number };
  files?: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch?: string;
  }[];
}

export interface CommitData {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  repoName: string;
  htmlUrl: string;
  additions: number;
  deletions: number;
  files: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch?: string;
  }[];
}

export async function GET() {
  try {
    // Fetch recent commits from the specific repo
    const listRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=${MAX_COMMITS}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );

    if (!listRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch commits", commits: [] },
        { status: listRes.status }
      );
    }

    const commitList: GitHubCommitListItem[] = await listRes.json();

    // Fetch details for each commit (stats + files)
    const commits: CommitData[] = [];
    for (const item of commitList) {
      try {
        const detailRes = await fetch(
          `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/${item.sha}`,
          {
            headers: { Accept: "application/vnd.github+json" },
            next: { revalidate: 3600 },
          }
        );

        if (!detailRes.ok) continue;

        const detail: GitHubCommitDetail = await detailRes.json();
        commits.push({
          sha: detail.sha,
          shortSha: detail.sha.slice(0, 7),
          message: detail.commit.message.split("\n")[0],
          date: detail.commit.author.date,
          repoName: REPO_NAME,
          htmlUrl: detail.html_url,
          additions: detail.stats?.additions ?? 0,
          deletions: detail.stats?.deletions ?? 0,
          files: (detail.files ?? []).slice(0, 10).map((f) => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions,
            patch: f.patch,
          })),
        });
      } catch {
        // Skip individual commit failures
      }
    }

    return NextResponse.json(
      { commits },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Internal error", commits: [] }, { status: 500 });
  }
}
