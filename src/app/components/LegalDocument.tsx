import type { ReactNode } from "react";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import logo from "../../assets/logo.svg";

type LegalDocumentProps = {
  title: string;
  updatedDateTime: string;
  updatedLabel: string;
  introduction: ReactNode;
  children: ReactNode;
};

type LegalSectionProps = {
  number: number;
  title: string;
  children: ReactNode;
};

export function LegalDocument({
  title,
  updatedDateTime,
  updatedLabel,
  introduction,
  children,
}: LegalDocumentProps) {
  return (
    <div className="cass-legal-page">
      <main className="cass-legal-shell">
        <header className="cass-legal-topbar">
          <a
            href="../"
            className="cass-legal-back"
            aria-label="Back to Cass home"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M15 5 8 12l7 7M8 12h12" />
            </svg>
          </a>

          <img
            src={logo}
            alt="Cass"
            className="cass-legal-brand"
            draggable="false"
          />
        </header>

        <article className="cass-legal-document">
          <header className="cass-legal-lede cass-legal-grid">
            <div>
              <h1>{title}</h1>
              <p className="cass-legal-updated">
                Last updated ·{" "}
                <time dateTime={updatedDateTime}>{updatedLabel}</time>
              </p>
            </div>

            <div className="cass-legal-copy cass-legal-introduction">
              {introduction}
            </div>
          </header>

          <div>{children}</div>
        </article>
      </main>
    </div>
  );
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <section className="cass-legal-section cass-legal-grid">
      <h2>
        <span>{number}. </span>
        {title}
      </h2>
      <div className="cass-legal-copy">{children}</div>
    </section>
  );
}

export function LegalEmailLink({ children }: { children: ReactNode }) {
  return (
    <a href="mailto:hello@getcass.com" className="cass-legal-link">
      {children}
    </a>
  );
}

export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className="cass-legal-link">
      {children}
    </a>
  );
}
