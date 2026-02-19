import { NextResponse } from "next/server";

const REPO = "AP3008/web-portfolio";

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

export async function GET() {
  try {
    // Step 1: Get latest 3 commits
    const listRes = await fetch(
      `https://api.github.com/repos/${REPO}/commits?per_page=3`,
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

    const items: GitHubCommitListItem[] = await listRes.json();
    if (!items.length) {
      return NextResponse.json({ commits: [] });
    }

    // Step 2: Get LOC stats for each commit in parallel
    const commits: CommitData[] = await Promise.all(
      items.map(async (item) => {
        let additions = 0;
        let deletions = 0;

        const detailRes = await fetch(
          `https://api.github.com/repos/${REPO}/commits/${item.sha}`,
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
      })
    );

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
