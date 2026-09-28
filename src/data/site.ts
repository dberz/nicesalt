export const SITE = {
  name: "NiceSalt",
  // Vercel redirects the apex domain to www. Keep generated canonicals,
  // form success URLs, and origin-scoped lead context on that final host.
  url: "https://www.nicesalt.com",
  email: "hello@nicesalt.com",
  description:
    "NiceSalt designs and builds AI products, web apps, and publishing platforms with deep data expertise.",
  formAction: "https://api.web3forms.com/submit",
  formAccessKey: (import.meta.env.WEB3FORMS_ACCESS_KEY ?? "").trim(),
  ga4Id: "G-B3RLW3R3SR",
  // Set this to a Cal.com or Calendly URL to turn on the direct-booking path.
  // Leave empty and every booking CTA falls back to the contact form.
  bookingUrl: "",
  principal: {
    name: "David Berzin",
    url: "https://davidberzin.com",
    linkedin: "https://www.linkedin.com/in/davidberzin",
    role: "Product and data executive, New York City",
    bio: "NiceSalt is led by David Berzin, who has spent two decades running product and data teams, from early-stage startups to global media platforms, including as a Chief Product Officer. He stays hands-on from the first decision through launch and brings in specialists when the work calls for them."
  }
};

// Credentials, stated as outcomes. Sourced from davidberzin.com.
export const credentials = [
  { stat: "20", label: "years leading product and data teams, startup to enterprise" },
  { stat: "$50M+", label: "new revenue from data products at Viacom" },
  { stat: "7×", label: "first-visit conversion lift at Vori Health" },
  { stat: "6 weeks", label: "zero to launched e-commerce platform at Proper" }
];

// Ways to begin a conversation about the work.
export const engagements = [
  {
    id: "teardown",
    title: "Free teardown",
    text: "Share a site, product, or prototype for a focused review. We select a few requests and confirm timing before starting.",
    cta: "Request a teardown",
    href: "/free-teardown/",
    projectType: "Teardown"
  },
  {
    id: "build",
    title: "Product builds",
    text: "A focused first version or a larger platform, shaped around a clear job and built to be used.",
    cta: "Discuss a build",
    href: "#contact",
    projectType: "Product build"
  }
];

// Offered capabilities; case studies show delivered work separately.
export const offers = [
  {
    title: "AI products",
    text: "Assistants and agents wired into your real data, with a person in the loop where the stakes are high."
  },
  {
    title: "Web apps",
    text: "Customer portals, internal tools, and the workflows that connect them."
  },
  {
    title: "Publishing platforms",
    text: "Sites and newsletters where one article becomes a page, an email, and a new subscriber."
  }
];

export const nextMoves = [
  {
    id: "positioning",
    title: "The work is stronger than the story",
    text: "Your positioning, structure, or UX doesn't reflect the depth of what you do.",
    projectType: "Positioning & narrative"
  },
  {
    id: "product",
    title: "There's nothing to react to",
    text: "You're pitching an idea from a deck. People need something they can click.",
    projectType: "Product & platforms"
  },
  {
    id: "conversion",
    title: "Attention isn't converting",
    text: "People show up and leave. The path from interest to inquiry, signup, or first use leaks.",
    projectType: "Content & publishing systems"
  },
  {
    id: "growth",
    title: "You can't see what's working",
    text: "Without clean measurement, growth decisions come down to guesswork.",
    projectType: "Measurement & growth"
  }
];

export const caseStudies = [
  {
    slug: "explorer-health",
    name: "ExplorerHealth.co",
    shortName: "Explorer Health",
    url: "https://explorerhealth.co/",
    label: "Self-initiated health product exploration",
    image: "/images/case-studies/explorer-health.webp",
    alt: "ExplorerHealth.co homepage screenshot.",
    preview: {
      video: "/videos/case-studies/explorer-health-hero.mp4",
      poster: "/images/case-studies/explorer-health-hero-poster.webp",
      alt: "ExplorerHealth.co animated homepage hero preview."
    },
    gallery: [
      {
        src: "/images/case-studies/explorer-how-it-works.webp",
        alt: "Explorer Health How it works section showing assessment, recovery profile, protocols, testing, and care.",
        caption: "The experience presents assessment, recovery profile, and possible next steps as a connected journey.",
        shape: "natural"
      },
      {
        src: "/images/case-studies/explorer-recovery-read.webp",
        alt: "Explorer Health Recovery Read result card showing risk score, watch areas, suggested labs, and next step.",
        caption: "The assessment concept leads to a plain-language Recovery Read with factors to discuss with a qualified clinician.",
        shape: "natural"
      }
    ],
    summary:
      "A self-initiated product exploration of an interactive assessment, recovery profile, and guidance flow for a sensitive health topic.",
    problem:
      "A sensitive health topic needed a clear way to introduce the concept, guide people through an assessment, and explain possible next steps.",
    work: [
      "Product narrative and positioning",
      "Interactive intake and recovery-read flow",
      "AI-assisted guidance and next-step concepts",
      "Evidence-aware content and privacy language"
    ],
    outcome:
      "The public site and assessment concept organize a complex topic into a clearer product journey, from first questions to a recovery profile and possible next steps.",
    result: {
      stat: "Live exploration",
      label: "A public site and interactive assessment concept."
    }
  },
  {
    slug: "robinberzinmd",
    name: "RobinBerzinMD.com",
    shortName: "RobinBerzinMD",
    url: "https://robinberzinmd.com/",
    label: "Agentic publishing platform",
    image: "/images/case-studies/robinberzinmd.webp",
    alt: "RobinBerzinMD.com homepage screenshot.",
    gallery: [
      {
        src: "/images/case-studies/robin-collage-mold.webp",
        alt: "Cut-paper collage of a house, layered mold forms, and flowing air.",
        caption: "Landscape editorial art for a story about mold exposure and symptoms.",
        shape: "wide"
      },
      {
        src: "/images/case-studies/robin-collage-perimenopause.webp",
        alt: "Cut-paper collage of moon phases, a lilac wave, and botanical forms.",
        caption: "A restrained visual metaphor for Robin's perimenopause guide.",
        shape: "portrait"
      },
      {
        src: "/images/case-studies/robin-collage-vagus.webp",
        alt: "Cut-paper collage connecting brain, heart, gut, and vagus nerve.",
        caption: "Portrait art built for article cards and social distribution.",
        shape: "portrait"
      }
    ],
    summary:
      "A publishing platform that turns one article into a website update, newsletter, and social assets.",
    problem:
      "Robin Berzin's articles, newsletter, programs, book, and practice needed one coherent home. Each new issue also needed a repeatable path into the website, email, and social formats without rewriting Robin's voice.",
    work: [
      "Editorial information architecture",
      "Astro publishing platform and reader journeys",
      "Multi-platform article workflow with editorial review",
      "Cut-paper art direction and channel-specific image assets",
      "Beehiiv draft and social distribution handoff"
    ],
    outcome:
      "The delivered system connects Robin's article library and reader journeys to a repeatable workflow. It prepares website, newsletter, and social material for editorial review before release.",
    result: {
      stat: "Live platform",
      label: "Articles, newsletter, programs, book, and practice in one reader experience."
    }
  },
  {
    slug: "bibo",
    name: "Bibo",
    shortName: "Bibo",
    url: "https://biboai.vercel.app/",
    label: "AI-native audiobook concept",
    image: "/images/case-studies/bibo.webp",
    alt: "Bibo AI audiobook app screens.",
    preview: {
      video: "/videos/case-studies/bibo-moby-dick.mp4",
      poster: "/images/case-studies/bibo-moby-dick-poster.webp",
      alt: "Bibo Moby Dick AI audiobook video preview.",
      shape: "portrait",
      frame: "iphone"
    },
    gallery: [
      {
        src: "/images/case-studies/bibo.webp",
        alt: "Bibo mobile feed showing the Moby Dick AI transformation prompt.",
        caption: "The mobile experience makes the core thesis visible immediately: one book can become many products.",
        shape: "portrait"
      },
      {
        src: "/images/case-studies/bibo-moby-dick-poster.webp",
        alt: "Bibo Moby Dick AI audiobook player preview.",
        caption: "The AI-generated trailer and player give the demo the feel of a real media product, not a pitch deck.",
        shape: "portrait"
      }
    ],
    summary:
      "What happens to audiobooks when the story itself is malleable? A working concept where one classic becomes five listenable versions: shortened, genre-shifted, translated, re-narrated. Wrapped in social-first discovery.",
    problem:
      "Audiobook apps treat AI as a feature: a synthetic voice here, a recommendation there. The thesis worth testing: if AI is native to the product, every book becomes a starting point, and discovery, the player, and the ad model all change with it.",
    work: [
      "Product thesis and category strategy",
      "Generative story transformation: five versions of one classic",
      "AI narration, translation, and cover-art pipeline",
      "Social-first discovery, achievements, and audio-ad concepts"
    ],
    outcome:
      "A self-contained working demo at production polish, built in weeks with AI-assisted development. It makes the argument no deck could: one asset became five products.",
    result: {
      stat: "1 asset → 5 products",
      label: "Five complete, listenable transformations plus more than 50 AI-generated covers."
    }
  }
];

export const notes = [
  {
    slug: "a-working-demo-beats-a-deck",
    title: "A working demo beats a deck",
    summary:
      "I had a thesis about what AI does to audiobooks and couldn't get anyone to react to it. So I built it instead. Why an argument you can tap settles debates a strategy document can't.",
    date: "2026-07-08",
    dateDisplay: "July 2026"
  },
  {
    slug: "production-got-cheap-judgment-didnt",
    title: "Production got cheap. Judgment didn't.",
    summary:
      "I built this site in about a week. Then I asked Google what it thought the site was, and Google told me I sell mayonnaise. On the difference between shipping something and knowing who's coming.",
    date: "2026-07-03",
    dateDisplay: "July 2026"
  },
  {
    slug: "why-expert-sites-undersell-the-expert",
    title: "Why expert sites undersell the expert",
    summary:
      "The person is impressive. The site isn't. Three structural reasons expert websites read weaker than the people behind them, and the one I got wrong about my own.",
    date: "2026-07-02",
    dateDisplay: "July 2026"
  }
];

export const faqs = [
  {
    question: "What does NiceSalt do?",
    answer:
      "The thinking and the building. Positioning and messaging, the product, platform, or site itself, the content around it, and the measurement that tells you whether any of it worked."
  },
  {
    question: "Who do you work best with?",
    answer:
      "Founders, operators, and teams building something complicated, where credibility is part of the product. That has meant a physician's publishing platform, a harm-reduction health product, an AI media concept, and multi-tenant platforms inside much larger companies. Health, science, and consumer products are where most of the recent work sits."
  },
  {
    question: "How is this different from an agency?",
    answer:
      "You work directly with the person making the decisions. Fewer hand-offs, faster proof, and specialists brought in when the scope earns them rather than staffed onto it by default. Most projects can start within two weeks."
  },
  {
    question: "Someone referred me. What's the fastest path?",
    answer:
      "Request a free teardown with a link and one line about what's bothering you. David reviews every request and will confirm availability and timing if it is selected."
  }
];
