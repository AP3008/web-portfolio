import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export async function GET(request: NextRequest) {
  const repo = request.nextUrl.searchParams.get("repo");
  if (!repo) {
    return NextResponse.json({ error: "Missing ?repo= param", commit: null }, { status: 400 });
  }

  try {
    // Step 1: Get latest commit SHA + message
    const listRes = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=1`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );

    if (!listRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch commits", commit: null },
        { status: listRes.status }
      );
    }

    const [latest]: GitHubCommitListItem[] = await listRes.json();
    if (!latest) {
      return NextResponse.json({ commit: null });
    }

    // Step 2: Get LOC stats from commit detail
    const detailRes = await fetch(
      `https://api.github.com/repos/${repo}/commits/${latest.sha}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );

    let additions = 0;
    let deletions = 0;
    if (detailRes.ok) {
      const detail: GitHubCommitDetail = await detailRes.json();
      additions = detail.stats?.additions ?? 0;
      deletions = detail.stats?.deletions ?? 0;
    }

    const commit: CommitData = {
      sha: latest.sha,
      shortSha: latest.sha.slice(0, 7),
      message: latest.commit.message.split("\n")[0],
      htmlUrl: latest.html_url,
      additions,
      deletions,
    };

    return NextResponse.json(
      { commit },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Internal error", commit: null }, { status: 500 });
  }
}
