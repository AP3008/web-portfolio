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
      "FastAPI",
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
  {
    id: "learningtofly",
    title: "Learning to Fly",
    description:
      "A repo focused on holding myself accountable to learning, and mini projects that I believe would be fun to build.",
    subtitle: "Ongoing",
    techStack: ["Check out the repo to see..."],
    repoOwner: "AP3008",
    repoName: "Learning-To-Fly",
  },
  {
    id: "bookey",
    title: "Bookey",
    description:
      "CLI tool that connects to your Google Calendar to display, add, and delete tasks and events.",
    subtitle: "",
    techStack: ["Python", "Google Calendar API"],
    repoOwner: "AP3008",
    repoName: "Bookey",
  },
  {
    id: "western-habitat-for-humanity-webpage",
    title: "Western Habitat For Humanity Webpage",
    description:
      "Created a webpage for Western's Chapter of Habitat for Humanity.",
    subtitle: "",
    techStack: ["Next.js", "TypeScript", "React"],
    repoOwner: "AP3008",
    repoName: "UWO-H4H-Webpage",
  },
  {
    id: "cityscope",
    title: "City Scope",
    description:
      "Looks at meeting minutes from the city of London, summarizes them into bullet points and a single paragraph. Then displays them onto a webpage where users can easily read past meeting minutes.",
    subtitle: "",
    techStack: [
      "Next.js",
      "TypeScript",
      "React",
      "Python",
      "Flask",
      "Selenium",
      "Beautiful Soup",
      "GitHub Actions",
    ],
    repoOwner: "AP3008",
    repoName: "CityScope",
  },
  {
    id: "receiptly",
    title: "Receiptly",
    description:
      "Uses OCR to read receipts and stores the information to then provide AI analytics based on spending habits.",
    subtitle: "WDS Mentorship Program",
    techStack: ["Next.js", "TypeScript", "React", "TesseractJS", "Groq Llama"],
    repoOwner: "lblommesteyn",
    repoName: "wds-reciepts",
  },
  {
    id: "accountability",
    title: "Accountability",
    description:
      "Rust CLI tool that helps the user record different metrics they want to keep track of locally.",
    subtitle: "",
    techStack: ["Rust", "Serde", "Clap"],
    repoOwner: "AP3008",
    repoName: "accountability",
  },
  {
    id: "web-portfolio",
    title: "Web Portfolio",
    description: "The website that you're on right now!",
    subtitle: "",
    techStack: ["Next.js", "TypeScript", "React", "Three.js", "Tailwind CSS"],
    repoOwner: "AP3008",
    repoName: "web-portfolio",
  },
  {
    id: "theia",
    title: "Theia",
    description:
      "Theia was regarded as the goddess from which all files proceeded",
    subtitle: "",
    techStack: ["Golang", "Charm Bracelet", "TUI", "OS"],
    repoOwner: "AP3008",
    repoName: "Theia",
  },
];
