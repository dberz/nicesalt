import { caseStudies, notes, SITE } from "../data/site";

export function GET() {
  const paths = [
    "/",
    "/case-studies/",
    "/notes/",
    "/thanks/",
    ...caseStudies.map((study) => `/case-studies/${study.slug}/`),
    ...notes.map((note) => `/notes/${note.slug}/`)
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${new URL(path, SITE.url).toString()}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}
