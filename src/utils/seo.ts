import { SITE, caseStudies, faqs, offers } from "../data/site";

export function canonical(path = "/") {
  return new URL(path, SITE.url).toString();
}

export function metaTitle(title?: string) {
  return title ? `${title} | ${SITE.name}` : `${SITE.name} | High-craft web, product, content, and AI work`;
}

export function baseJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      description: SITE.description
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      areaServed: "United States",
      serviceType: offers.map((offer) => offer.title),
      description: SITE.description
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }
  ];
}

export function caseStudyJsonLd(slug: string) {
  const item = caseStudies.find((study) => study.slug === slug);
  if (!item) return [];

  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: `${item.name} case study`,
      url: canonical(`/case-studies/${item.slug}/`),
      about: item.summary,
      image: canonical(item.image),
      workExample: item.url,
      provider: {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url
      }
    }
  ];
}
