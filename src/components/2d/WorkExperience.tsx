"use client";

interface WorkEntry {
  company: string;
  role: string;
  dates: string;
  description: string;
  url?: string;
}

const WORK_EXPERIENCE: WorkEntry[] = [
  {
    company: "Savify",
    role: "Full-Stack Developer",
    dates: "Jan 2026 – Present",
    description:
      "Architected and shipped a responsive marketing landing page in Next.js + React, integrating authentication flows with the startup's backend for a product backed by $10K in pre-seed funding.",
    url: "https://savify.ca",
  },
  {
    company: "MotiveMinds Pvt. Ltd.",
    role: "IT Intern",
    dates: "Jun 2025 – Jul 2025",
    description:
      "Automated 5+ internal IT workflows using MuleSoft Anypoint Studio and integrated multiple REST/SOAP APIs, reducing manual processing time by 25%.",
  },
  {
    company: "Cybex GmbH",
    role: "IT & Operations Intern",
    dates: "Jun 2023 – Aug 2023",
    description:
      "Resolved 15+ IT support tickets within a global e-commerce environment spanning manufacturing and logistics operations.",
  },
];

function BriefcaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function WorkExperience() {
  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16 md:px-16 lg:px-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span style={{ color: "var(--rp-muted)" }}>
            <BriefcaseIcon />
          </span>
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
            style={{ color: "var(--rp-text)" }}
          >
            Work Experience
          </h2>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-4">
          {WORK_EXPERIENCE.map((entry) => (
            <div
              key={entry.company}
              className="rounded-xl border p-4 sm:p-6"
              style={{
                background: "var(--rp-surface)",
                borderColor: "var(--rp-highlight-med)",
              }}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold underline decoration-1 underline-offset-2 hover:decoration-2 sm:text-lg"
                    style={{ color: "var(--rp-foam)" }}
                  >
                    {entry.company}
                  </a>
                ) : (
                  <span
                    className="text-base font-bold sm:text-lg"
                    style={{ color: "var(--rp-text)" }}
                  >
                    {entry.company}
                  </span>
                )}
                <span
                  className="text-xs tracking-wider sm:text-sm"
                  style={{ color: "var(--rp-muted)" }}
                >
                  {entry.dates}
                </span>
              </div>
              <p
                className="mt-1 text-sm tracking-wider sm:text-base"
                style={{ color: "var(--rp-iris)" }}
              >
                {entry.role}
              </p>
              <p
                className="mt-3 text-sm leading-relaxed sm:text-base"
                style={{ color: "var(--rp-subtle)" }}
              >
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
