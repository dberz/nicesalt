export const SITE = {
  name: "NiceSalt",
  url: "https://nicesalt.com",
  email: "hello@nicesalt.com",
  description:
    "NiceSalt is a digital studio for expert-led teams. We connect positioning, content, UX, conversion, and measurement into one growth system.",
  formAction: "https://formsubmit.co/hello@nicesalt.com",
  ga4Id: "G-B3RLW3R3SR",
  principal: {
    name: "David Berzin",
    url: "https://davidberzin.com"
  }
};

// The connected disciplines we work across: the growth loop, not isolated builds.
export const offers = [
  {
    title: "Positioning & UX",
    text: "The structure, story, and experience that earn attention and trust."
  },
  {
    title: "Content & distribution",
    text: "Editorial systems and discovery that compound over time."
  },
  {
    title: "Conversion",
    text: "The path from attention to inquiry, tuned page by page."
  },
  {
    title: "Analytics & growth",
    text: "Measurement you can trust, and the experiments that follow."
  }
];

export const nextMoves = [
  {
    id: "positioning",
    title: "The site undersells the work",
    text: "Your positioning, structure, or UX doesn't reflect the depth of the work.",
    projectType: "Positioning & UX"
  },
  {
    id: "content",
    title: "Content isn't compounding",
    text: "You publish, but it doesn't build authority, traffic, or pipeline.",
    projectType: "Content & distribution"
  },
  {
    id: "conversion",
    title: "Attention isn't converting",
    text: "People show up and leave. The path from interest to inquiry leaks.",
    projectType: "Conversion"
  },
  {
    id: "growth",
    title: "You can't see what's working",
    text: "Without clean measurement, growth decisions come down to guesswork.",
    projectType: "Analytics & growth"
  }
];

export const caseStudies = [
  {
    slug: "robinberzinmd",
    name: "RobinBerzinMD.com",
    shortName: "RobinBerzinMD",
    url: "https://robinberzinmd.com/",
    label: "Health publishing & lead gen",
    image: "/images/case-studies/robinberzinmd.webp",
    alt: "RobinBerzinMD.com homepage screenshot.",
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
      "A publishing system that compounds: every piece reinforces authority and feeds a clear path from reader to subscriber to lead."
  },
  {
    slug: "explorer-health",
    name: "ExplorerHealth.co",
    shortName: "Explorer Health",
    url: "https://explorerhealth.co/",
    label: "AI-assisted health prototype",
    image: "/images/case-studies/explorer-health.webp",
    alt: "ExplorerHealth.co homepage screenshot.",
    summary:
      "A sensitive, complex harm-reduction idea, made testable: an interactive assessment, evidence content, and AI-assisted guidance, privacy first.",
    problem:
      "A nuanced harm-reduction concept that had to feel clear, credible, and safe before anyone would trust it.",
    work: [
      "Product narrative and positioning",
      "Interactive assessment flow",
      "AI-assisted guidance concepts",
      "Evidence-led, privacy-first language"
    ],
    outcome:
      "A working v1 that makes a complex, sensitive idea feel approachable: something real to test and react to."
  },
  {
    slug: "bibo",
    name: "Bibo",
    shortName: "Bibo",
    url: "https://biboai.vercel.app/",
    label: "AI-native audiobook concept",
    image: "/images/case-studies/bibo.webp",
    alt: "Bibo AI audiobook app screens.",
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
      "A self-contained working demo at production polish, built in weeks with AI-assisted development. It makes the argument no deck could: one asset became five products."
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
      "We handle the thinking and the building: positioning and messaging, the site or product itself, the content that supports it, and the measurement that tells you whether any of it actually worked."
  },
  {
    question: "Who do you work best with?",
    answer:
      "Founders, operators, and experts who want senior judgment and hands-on building without a large agency, especially in health, science, and media, where credibility is the product."
  },
  {
    question: "How is this different from an agency?",
    answer:
      "You work directly with the person doing the work. Fewer hand-offs, faster proof, and decisions made by someone who has shipped this before."
  }
];
