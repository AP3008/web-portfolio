"use client";

import Image from "next/image";
import Link from "next/link";
import { aboutData } from "@/components/desk/data/about";
import { InfoBar } from "./InfoBar";

const BIO_LINKS: Record<string, { label: string; url: string }> = {
  "{western}": { label: "Western University", url: "https://www.uwo.ca/index.html" },
  "{savify}": { label: "Savify", url: "https://savify.ca" },
  "{janus}": { label: "Janus", url: "https://github.com/AP3008/Janus" },
  "{genaigenesis}": { label: "GenAIGenesis 2026", url: "https://devpost.com/software/janus-u9e3cl" },
  "{ignitionhacks}": { label: "Ignition Hacks V7", url: "https://www.ignitionhacks.org/" },
};

function renderBioLine(text: string) {
  const tokenPattern = /(\{western\}|\{savify\}|\{janus\}|\{genaigenesis\}|\{ignitionhacks\})/g;
  const parts = text.split(tokenPattern);

  return (
    <>
      {parts.map((part, i) => {
        const link = BIO_LINKS[part];
        if (link) {
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-1 underline-offset-2 hover:decoration-2"
              style={{ color: "var(--rp-foam)" }}
            >
              {link.label}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function AboutSection() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-16 sm:gap-10 sm:px-8 sm:py-24 md:px-16 lg:px-24"
    >
      <h2
        className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
        style={{ color: "var(--rp-text)" }}
      >
        About Me
      </h2>

      <div className="flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:items-start md:gap-14">
        {/* Left — image + name */}
        <div className="flex shrink-0 flex-col items-center gap-4">
          <Image
            src="/adam_aboutme.png"
            alt="Adam Porbanderwalla"
            width={160}
            height={160}
            className="rounded-full border-2 object-cover"
            style={{ borderColor: "var(--rp-highlight-med)" }}
          />
          <h3
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--rp-text)" }}
          >
            {aboutData.name}
          </h3>
        </div>

        {/* Right — bio + links */}
        <div className="flex flex-1 flex-col gap-6">
          {aboutData.bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed sm:text-base md:text-lg"
              style={{ color: "var(--rp-subtle)" }}
            >
              {renderBioLine(paragraph)}
            </p>
          ))}

          {/* Contact links */}
          <div className="flex items-center gap-4 pt-2">
            {aboutData.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-80 sm:h-14 sm:w-14"
                style={{ borderColor: "var(--rp-highlight-med)" }}
                title={link.label}
              >
                <svg
                  viewBox={link.viewBox ?? "0 0 24 24"}
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="var(--rp-iris)"
                >
                  <path d={link.iconPath} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <InfoBar />

      <Link
        href="/2d/projects"
        className="text-sm tracking-wider transition-colors duration-200 sm:text-base"
        style={{ color: "var(--rp-foam)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-foam)")}
      >
        Checkout all of my projects! →
      </Link>
    </section>
  );
}
