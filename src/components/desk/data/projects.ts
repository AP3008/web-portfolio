export interface Project {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  techStack: string[];
  repoOwner: string;
  repoName: string;
}

export const projects: Project[] = [
  {
    id: "findmyprof",
    title: "FindMyProf",
    description:
      "A platform for undergraduate students to find research supervisors by automating the cold email process, making it easier for students to get in touch with professors.",
    subtitle: "Built for ConUHacks 10 | 2026",
    techStack: [
      "TypeScript",
      "Python",
      "Web Scraping",
      "Next.js",
      "LangChain + LangGraph",
      "MongoDB",
    ],
    repoOwner: "garv130",
    repoName: "FindMyProf",
  },
  {
    id: "reflecta",
    title: "Reflecta",
    description:
      "A journaling platform that gives users detailed insights into their reflection progress.",
    subtitle: "Built for UofT Hacks 13 | 2026",
    techStack: ["TypeScript", "Next.js", "Supabase+Auth", "Gemini API"],
    repoOwner: "adit1110",
    repoName: "Reflecta",
  },
];
