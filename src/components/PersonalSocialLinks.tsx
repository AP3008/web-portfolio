import { socialLinks, type SocialLink } from "@/components/desk/data/socials";

type PersonalSocialLinksProps = {
  align?: "left" | "center";
  className?: string;
};

const PERSONAL_SOCIAL_ORDER = ["GitHub", "LinkedIn"] as const;

const PERSONAL_SOCIALS: SocialLink[] = PERSONAL_SOCIAL_ORDER.flatMap((label) => {
  const link = socialLinks.find((social) => social.label === label);
  return link ? [link] : [];
});

export function PersonalSocialLinks({
  align = "left",
  className,
}: PersonalSocialLinksProps) {
  if (PERSONAL_SOCIALS.length === 0) return null;

  const alignmentClass = align === "center" ? "justify-center" : "justify-start";

  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${alignmentClass}${className ? ` ${className}` : ""}`}
    >
      {PERSONAL_SOCIALS.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${link.label} profile`}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--rp-highlight-med)] bg-[var(--rp-surface)] px-3 py-1.5 text-xs text-[var(--rp-subtle)] transition-colors duration-200 hover:border-[var(--rp-iris)] hover:text-[var(--rp-text)] focus-visible:border-[var(--rp-iris)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rp-iris)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--rp-base)] sm:text-sm"
          title={link.label}
        >
          <svg
            viewBox={link.viewBox ?? "0 0 24 24"}
            className="h-3.5 w-3.5 shrink-0 text-[var(--rp-iris)] transition-colors duration-200 group-hover:text-[var(--rp-foam)] group-focus-visible:text-[var(--rp-foam)] sm:h-4 sm:w-4"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={link.iconPath} />
          </svg>
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
