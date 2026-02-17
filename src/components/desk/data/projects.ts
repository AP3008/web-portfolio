export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "3D Portfolio",
    description:
      "An immersive 3D portfolio built with React Three Fiber, featuring interactive desk objects, GSAP camera animations, and a functional terminal interface.",
    techStack: ["Next.js", "React Three Fiber", "TypeScript", "GSAP", "Zustand"],
  },
  {
    id: "project-2",
    title: "Project Alpha",
    description:
      "A full-stack web application with real-time data processing and an intuitive dashboard interface.",
    techStack: ["React", "Node.js", "PostgreSQL", "WebSocket"],
  },
  {
    id: "project-3",
    title: "Project Beta",
    description:
      "A mobile-first progressive web app with offline capabilities and push notifications.",
    techStack: ["Next.js", "Tailwind CSS", "Service Workers", "IndexedDB"],
  },
  {
    id: "project-4",
    title: "Project Gamma",
    description:
      "An API gateway with rate limiting, caching, and comprehensive monitoring dashboards.",
    techStack: ["Go", "Redis", "Docker", "Grafana"],
  },
];
