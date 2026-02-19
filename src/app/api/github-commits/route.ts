import { NextResponse } from "next/server";

const GITHUB_USERNAME = "AP3008";
const MAX_COMMITS = 5;

interface GitHubEvent {
  type: string;
  repo: { name: string };
  payload: {
    commits?: { sha: string; message: string }[];
  };
  created_at: string;
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
    // Step 1: Fetch public events
    const eventsRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );

    if (!eventsRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch GitHub events", commits: [] },
        { status: eventsRes.status }
      );
    }

    const events: GitHubEvent[] = await eventsRes.json();

    // Extract unique commit SHAs from PushEvents
    const commitRefs: { sha: string; repoName: string }[] = [];
    for (const event of events) {
      if (event.type !== "PushEvent" || !event.payload.commits) continue;
      for (const commit of event.payload.commits) {
        if (commitRefs.length >= MAX_COMMITS) break;
        if (!commitRefs.some((c) => c.sha === commit.sha)) {
          commitRefs.push({ sha: commit.sha, repoName: event.repo.name });
        }
      }
      if (commitRefs.length >= MAX_COMMITS) break;
    }

    // Step 2: Fetch commit details for each SHA
    const commits: CommitData[] = [];
    for (const ref of commitRefs) {
      try {
        const commitRes = await fetch(
          `https://api.github.com/repos/${ref.repoName}/commits/${ref.sha}`,
          {
            headers: { Accept: "application/vnd.github+json" },
            next: { revalidate: 3600 },
          }
        );

        if (!commitRes.ok) continue;

        const detail: GitHubCommitDetail = await commitRes.json();
        commits.push({
          sha: detail.sha,
          shortSha: detail.sha.slice(0, 7),
          message: detail.commit.message.split("\n")[0],
          date: detail.commit.author.date,
          repoName: ref.repoName.split("/")[1] ?? ref.repoName,
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
