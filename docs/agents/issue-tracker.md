# Issue tracker: Linear

Issues and specs for this repo live in Linear:

- Workspace: "Adam Porbanderwalla" (`https://linear.app/adam-porbanderwalla`)
- Team: `ADA`
- Project: **`Webportfolio`** (`P-ADA-2`)

Use the Linear MCP tools (`mcp__claude_ai_Linear__*`). Every issue you create or query for this repo must be scoped to `team: "ADA"` and `project: "Webportfolio"`. The ADA team also holds other projects (e.g. CityScope), so never list or edit issues without the project filter.

## Conventions

- **Create an issue:** `save_issue` with `team: "ADA"`, `project: "Webportfolio"`, `title`, `description` (markdown, real newlines), and `labels` if needed. Run `list_issues` first to check for a duplicate.
- **Read an issue:** `get_issue` with the identifier (e.g. `ADA-12`). Comments come from `list_comments`.
- **List issues:** `list_issues` with `project: "Webportfolio"`, plus `label` / `state` filters as needed.
- **Sub-issue:** pass `parentId: "<ADA-n>"` to `save_issue`.
- **Comment:** `save_comment` on the issue.
- **Apply / remove labels:** `save_issue` with `id` and the full `labels` list. It **replaces** the existing labels, so read the current ones first and send the merged list.
- **Close:** set the issue to a completed state (`Done`) or a canceled state with `save_issue`, and add a closing comment.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag. PRs live on GitHub at `AP3008/web-portfolio`; use `gh pr` for them.)_

## When a skill says "publish to the issue tracker"

Create a Linear issue in project `Webportfolio`, as above.

## When a skill says "fetch the relevant ticket"

Read it as in **Read an issue** above.

## Wayfinding operations

Used by `/wayfinder`. The **map** is one issue, and its tickets are **child** issues.

- **Map:** an issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body.
- **Child ticket:** a sub-issue of the map (`parentId`), labelled `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, assign it to the driving dev.
- **Blocking:** use Linear's native "blocked by" relation on the child issue. A ticket is unblocked when every blocker is completed or canceled.
- **Frontier query:** `list_issues` with `parentId: <map>` in an unstarted/started state. Drop any with an open blocker or an assignee. The first one in map order wins.
- **Claim:** `save_issue` with `assignee: "me"`. Make this the session's first write.
- **Resolve:** comment the answer, mark the ticket done, then append a context pointer (gist + link) to the map's Decisions-so-far.
