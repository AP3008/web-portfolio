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
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
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
              className="text-sm leading-relaxed sm:text-base"
              style={{ color: "var(--rp-subtle)" }}
            >
              I&apos;m a full-stack developer and computer science student with a
              passion for building interactive, performant web experiences. From
              immersive 3D portfolios to scalable backend systems, I love turning
              complex ideas into elegant code. When I&apos;m not coding, you&apos;ll
              find me at the gym, playing chess, or tinkering with new technologies.
            </p>
          </div>

          {/* Right — drawing */}
          <div className="flex flex-1 items-center justify-center">
            <Image
              src="/adam_drawing.png"
              alt="Drawing of Adam"
              width={400}
              height={400}
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
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: "var(--rp-text)" }}
          >
            Featured Projects
          </h2>
          <Link
            href="/2d/projects"
            className="rounded border px-4 py-1.5 text-xs tracking-wider transition-all duration-200"
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
          className="text-sm tracking-wider transition-colors duration-200"
          style={{ color: "var(--rp-foam)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rp-text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--rp-foam)")}
        >
          Learn more about me! →
        </Link>
      </section>
    </TwoDLayout>
  );
}
