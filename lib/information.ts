import type {Locale} from "@/i18n/routing";

export type InformationContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{title: string; body: string}>;
  cta: string;
};

export const aboutContent: Record<Locale, InformationContent> = {
  en: {
    eyebrow: "Independent Fan Resource",
    title: "About Warhounds Guide",
    intro:
      "Warhounds Guide is an independent guide site built to answer current player questions while keeping official facts, strategic inference, and evidence gaps visibly separate.",
    sections: [
      {
        title: "What we cover",
        body: "The first library focuses on beginner priorities, squad and class planning, base management, weapons, and combat. Overlapping class and combat intents are merged into stronger pages, and mission walkthroughs remain deferred until current-build evidence can support them.",
      },
      {
        title: "How evidence is graded",
        body: "The current Steam listing and first-party Warhounds site are the launch library's factual foundation. A confirmed system may support a transparent tactical recommendation, but the recommendation is labeled as inference rather than promoted to an official rule. Unsupported formulas, rankings, and mission steps stay out.",
      },
      {
        title: "Independent status",
        body: "This is an independent fan-made guide site. It is not affiliated with, endorsed by, or operated by Everplay DMCC, Brightika, Inc., Valve, Steam, or any other external service. Names and marks belong to their respective owners.",
      },
      {
        title: "Corrections and updates",
        body: "Warhounds launched recently, so balance and campaign details may change. Each guide shows a review date and evidence boundary. Corrections should include the page, current build or patch, and a reliable official source or reproducible observation.",
      },
    ],
    cta: "Read the Beginner Guide",
  },
};

export const contactContent: Record<Locale, InformationContent> = {
  en: {
    eyebrow: "Corrections & Feedback",
    title: "Contact Warhounds Guide",
    intro:
      "Use the public project repository for factual corrections, broken links, accessibility feedback, or privacy requests. The site does not operate a contact form or publish an unverified email address.",
    sections: [
      {
        title: "Report a guide problem",
        body: "Include the page URL, the exact statement that needs review, the current game build or patch, and a reliable source or reproducible observation. Do not paste competitor articles or copyrighted guides.",
      },
      {
        title: "Privacy or accessibility requests",
        body: "Use the same project channel for privacy or accessibility feedback. Do not publish account credentials, analytics identifiers, payment information, or other sensitive personal information in a public issue.",
      },
      {
        title: "What this site cannot handle",
        body: "Warhounds Guide cannot provide game account support, refunds, moderation, bug fixes, or official technical assistance. Use the Steam listing and first-party channels for official game support.",
      },
    ],
    cta: "Open the Project Repository",
  },
};
