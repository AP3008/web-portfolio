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
    company: "Cybex GmbH",
    role: "E-Com Advanced Data Analyst Intern",
    dates: "May 2026 – Aug 2026",
    description:
      "Owned 3 production ETL pipelines in Microsoft Fabric (Python notebooks), ingesting warehouse logistics and PayPal payment data hourly from SFTP and API sources into a ~10M-row Lakehouse using Medallion architecture. Built AI data agents in Fabric & Copilot Studio that automated weekly executive reporting, and shipped an end-to-end Consumer Service dashboard in PostgreSQL and Power BI adopted across the customer service department.",
  },
  {
    company: "Savify",
    role: "Full-Stack Developer",
    dates: "Jan 2026 – Present",
    description:
      "Shipped marketing landing page in Next.js + React, integrating authentication with the startup's backend for a startup backed by $10K in pre-seed funding.",
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

export function WorkExperience() {
  return (
    <section className="px-4 py-12 sm:px-8 sm:py-16 md:px-16 lg:px-24">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        {/* Header */}
        <h2
          className="text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
          style={{ color: "var(--rp-text)" }}
        >
          Work Experience
        </h2>

        {/* Entries */}
        <div className="flex flex-col gap-4">
          {WORK_EXPERIENCE.map((entry) => (
            <div
              key={`${entry.company}-${entry.dates}`}
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
