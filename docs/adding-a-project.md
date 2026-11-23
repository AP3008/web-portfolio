# Adding a project

A project shows up in the 2D `ProjectsSection` and `ProjectTriangle` and in the 3D projects modal. You need to edit two files.

## 1. `src/components/desk/data/projects.tsx`

Add an entry to `projects` (they display in array order):

```tsx
{
  id: "my-project",            // unique kebab-case
  title: "My Project",
  description: "What it does", // string or JSX
  subtitle: "Built for X | 2026",
  award: "1st place",          // optional
  techStack: ["Go", "React"],
  repoOwner: "AP3008",
  repoName: "my-project",
  devpostUrl: "https://devpost.com/...", // optional
},
```

For a rich description, use a JSX fragment: `<><em>&quot;Quote&quot;</em>{" "}text</>`.

## 2. `src/app/api/github-commits/route.ts`

Add `"owner/repo-name"` to `PROJECT_REPOS`. After that, the card fetches its latest commit automatically.

`ProjectsSection.tsx` equalises card heights for you.
