export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoOwner: string;
  repoName: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "3D Portfolio",
    description:
      "An immersive 3D portfolio built with React Three Fiber, featuring interactive desk objects, GSAP camera animations, and a functional terminal interface.",
    techStack: ["Next.js", "React Three Fiber", "TypeScript", "GSAP", "Zustand"],
    repoOwner: "AP3008",
    repoName: "web-portfolio",
  },
  {
    id: "project-2",
    title: "Project Alpha",
    description:
      "A full-stack web application with real-time data processing and an intuitive dashboard interface.",
    techStack: ["React", "Node.js", "PostgreSQL", "WebSocket"],
    repoOwner: "AP3008",
    repoName: "project-alpha",
  },
];
