"use client";

import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";
import { useTypingEffect } from "@/lib/useTypingEffect";
import { TwoDLayout } from "./TwoDLayout";
import { ProjectTriangle } from "./ProjectTriangle";

const GREETING = "Hey! I'm Adam";
const TYPING_SPEED_MS = 80;

export function TwoDExperience() {
  const displayed = useTypingEffect(GREETING, TYPING_SPEED_MS);

  return (
    <TwoDLayout backHref={ROUTES.HOME}>
      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="flex w-full max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-16">
          {/* Left — title & blurb */}
          <div className="flex flex-1 flex-col gap-6 text-left">
            <h1
              className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
              style={{ color: "var(--rp-text)" }}
            >
              {displayed}
              <span
                className="inline-block w-0.75 ml-1 align-baseline"
                style={{
                  height: "0.8em",
                  background: "var(--rp-text)",
                  animation: "blink-cursor 1.06s step-end infinite",
                }}
              />
            </h1>
            <p
              className="text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--rp-subtle)" }}
            >
              Full Stack Developer | Computer Science @{" "}
              <a
                href="https://www.uwo.ca/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-2 hover:decoration-2"
                style={{ color: "var(--rp-foam)" }}
              >
                Western
              </a>{" "}
              | SWE @{" "}
              <a
                href="https://savify.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-1 underline-offset-2 hover:decoration-2"
                style={{ color: "var(--rp-foam)" }}
              >
                Savify
              </a>
            </p>
          </div>

          {/* Right — drawing */}
          <div className="flex flex-1 items-center justify-center">
            <Image
              src="/adam_drawing.png"
              alt="Drawing of Adam"
              width={470}
              height={470}
              className="max-w-full rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="flex flex-col items-center gap-10 px-8 py-24 md:px-16 lg:px-24">
        {/* Header */}
        <div className="flex w-full max-w-xl items-center justify-between">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--rp-text)" }}
          >
            Featured Projects
          </h2>
          <Link
            href="/2d/projects"
            className="rounded border px-5 py-2 text-sm tracking-wider transition-all duration-200"
            style={{
              borderColor: "var(--rp-highlight-high)",
              color: "var(--rp-subtle)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--rp-iris)";
              e.currentTarget.style.color = "var(--rp-iris)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--rp-highlight-high)";
              e.currentTarget.style.color = "var(--rp-subtle)";
            }}
          >
            VIEW ALL
          </Link>
        </div>

        {/* Triangle flip cards */}
        <ProjectTriangle />

        {/* Learn more link */}
        <Link
          href="/2d/about"
          className="text-base tracking-wider transition-colors duration-200"
          style={{ color: "var(--rp-foam)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-foam)")}
        >
          Learn more about me! →
        </Link>
        <Link
          href="/2d/socials"
          className="text-base tracking-wider transition-colors duration-200"
          style={{ color: "var(--rp-foam)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-foam)")}
        >
          Connect with me! →
        </Link>
      </section>
    </TwoDLayout>
  );
}
