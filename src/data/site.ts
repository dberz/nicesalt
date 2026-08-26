export const SITE = {
  name: "NiceSalt",
  // Vercel redirects the apex domain to www. Keep generated canonicals,
  // form success URLs, and origin-scoped lead context on that final host.
  url: "https://www.nicesalt.com",
  email: "hello@nicesalt.com",
  description:
    "A small studio with great taste. Positioning, product and platforms, content, and measurement, run as one system. Independent project work by David Berzin.",
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
    bio: "NiceSalt is David Berzin. Fifteen years leading product and data teams at Hearst, Viacom, and four venture-backed health startups, including as Chief Product Officer. Global scopes, multi-tenant platforms, patented ML, and data products that carried real revenue, alongside the smaller, sharper work on this page.",
    bioSecond:
      "That background is the point. The person deciding what your site or product should be stays in the work, and brings in trusted design, engineering, and editorial specialists when the scope calls for it. Nobody hands you to a junior team once the contract is signed."
  }
};

// Credentials, stated as outcomes. Sourced from davidberzin.com.
export const credentials = [
  { stat: "15+", label: "years leading product and data teams, startup to enterprise" },
  { stat: "$50M+", label: "new revenue from data products at Viacom" },
  { stat: "7×", label: "first-visit conversion lift at Vori Health" },
  { stat: "6 weeks", label: "zero to launched e-commerce platform at Proper" }
];

// How engagements actually start. Priced so people can self-qualify before they write.
export const engagements = [
  {
    id: "teardown",
    title: "Teardown",
    price: "Free",
    meta: "A few selected each month",
    text: "Send whatever exists: a site, a product, a prototype, a deck. You get a short, specific read on what's costing you and what we'd fix first. No call, nothing owed. The fastest way to judge whether the thinking is any good.",
    cta: "Request a free teardown",
    href: "/free-teardown/",
    projectType: "Teardown"
  },
  {
    id: "sprint",
    title: "Project sprint",
    price: "From $25,000",
    meta: "4 to 6 weeks, fixed scope",
    text: "Positioning and messaging, the site or product itself, and the measurement that tells you whether it worked. Senior hands on it start to finish, with specialists added when the scope earns them.",
    cta: "Start a sprint",
    href: "#contact",
    projectType: "Project sprint",
    featured: true
  },
  {
    id: "advisory",
    title: "Advisory",
    price: "From $6,000/mo",
    meta: "Ongoing, month to month",
    text: "Standing time for teams making real product, data, and AI decisions. Fewer decks, more decisions. Best when there's a hard, specific problem already on the table.",
    cta: "Talk about advisory",
    href: "#contact",
    projectType: "Advisory"
  }
];

// The connected disciplines we work across: the growth loop, not isolated builds.
export const offers = [
  {
    title: "Positioning & narrative",
    text: "What you're saying, who it's for, and why it lands."
  },
  {
    title: "Product & platforms",
    text: "Working software, from a demo you can click to a platform that carries load."
  },
  {
    title: "Content & publishing systems",
    text: "The site or app, plus the editorial engine behind it."
  },
  {
    title: "Measurement & growth",
    text: "Data you can trust, and the experiments that follow."
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
    label: "AI-assisted health product",
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
        caption: "The product story moved past a landing page: assessment, recovery profile, protocols, testing, and care are framed as one private path.",
        shape: "natural"
      },
      {
        src: "/images/case-studies/explorer-recovery-read.webp",
        alt: "Explorer Health Recovery Read result card showing risk score, watch areas, suggested labs, and next step.",
        caption: "The intake resolves into a plain-language Recovery Read: risk drivers, lab asks, protective factors, and a specific next step.",
        shape: "natural"
      }
    ],
    summary:
      "A sensitive, complex harm-reduction idea, made usable: an interactive assessment, evidence content, and AI-assisted guidance, privacy first.",
    problem:
      "A nuanced harm-reduction concept that had to feel clear, credible, and safe before anyone would trust it.",
    work: [
      "Product narrative and positioning",
      "Interactive intake and recovery-read flow",
      "AI-assisted guidance and next-step concepts",
      "Evidence-led, privacy-first language"
    ],
    outcome:
      "A live product that makes a complex, sensitive idea feel clear, credible, and safe enough to trust.",
    result: {
      stat: "Live v1",
      label: "Assessment, recovery profile, protocols, testing, and care in one private path."
    }
  },
  {
    slug: "robinberzinmd",
    name: "RobinBerzinMD.com",
    shortName: "RobinBerzinMD",
    url: "https://robinberzinmd.com/",
    label: "Health publishing & lead gen",
    image: "/images/case-studies/robinberzinmd.webp",
    alt: "RobinBerzinMD.com homepage screenshot.",
    gallery: [
      {
        src: "/images/case-studies/robin-supplement-stack.webp",
        alt: "Robin Berzin MD supplement stack lead magnet cover.",
        caption: "Lead magnets and article visuals gave the publishing system a recognizable editorial world.",
        shape: "square",
        fit: "contain"
      },
      {
        src: "/images/case-studies/robin-post-illustration.webp",
        alt: "Robin Berzin MD article illustration for a nutrition and mood post.",
        caption: "Post-level imagery carried the same warm, clinical, human tone as the site.",
        shape: "wide"
      }
    ],
    summary:
      "A respected physician's ideas were scattered across formats. We built a publishing platform that gives her work one home, with a clear path from reader to lead.",
    problem:
      "A respected expert with deep, wide-ranging work and no single home for it, and no clear route from a casual reader to a real lead.",
    work: [
      "Editorial information architecture",
      "Fast, SEO-ready Astro build",
      "Article and newsletter conversion paths",
      "Journeys into courses, book, and practice"
    ],
    outcome:
      "A publishing system that compounds: every piece reinforces authority and feeds a clear path from reader to subscriber to lead.",
    result: {
      stat: "One connected platform",
      label: "Articles, newsletter, courses, book, and practice organized into a single reader journey."
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
      "We had a thesis about what AI does to audiobooks. Instead of writing it up, we built it. Why an argument you can tap settles debates a strategy document can't.",
    date: "2026-07-08",
    dateDisplay: "July 2026"
  },
  {
    slug: "production-got-cheap-judgment-didnt",
    title: "Production got cheap. Judgment didn't.",
    summary:
      "Anyone can ship a decent-looking site in a weekend now, template or AI, take your pick. So why do most of them still do nothing? Because the scarce skill was never production.",
    date: "2026-07-03",
    dateDisplay: "July 2026"
  },
  {
    slug: "why-expert-sites-undersell-the-expert",
    title: "Why expert sites undersell the expert",
    summary:
      "The person is impressive. The site isn't. Three structural reasons expert websites read weaker than the people behind them, and what fixes each one.",
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
