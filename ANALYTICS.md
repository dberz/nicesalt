# Analytics (GA4)

NiceSalt uses the shared GA4 event standard. gtag is loaded in
`src/layouts/BaseLayout.astro` from `SITE.ga4Id` (`src/data/site.ts`). The event
layer lives in `public/scripts/analytics.js` — one delegated click listener reads
`data-analytics-*` attributes and fires a consistent taxonomy. Instrumentation is
declarative: annotate a container, never per-element handlers.

## Events fired

| Event | When | Key params |
|-------|------|-----------|
| `generate_lead` | Contact form success (on `/thanks/`) | `method=inquiry`, `form_name`, `value=10`, `currency`, `inquiry_type`, `lead_source`, `source_page` |
| `inquiry_submit` | Same success, named companion | `form_name`, `inquiry_type`, `lead_source`, `source_page` |
| `select_content` | CTA / button click | `content_type=cta`, `component_name`, `link_text`, `link_url` |
| `navigation` | Header / footer chrome click | `component_name`, `link_text`, `link_url` |
| `recirculation` | Content-to-content link (work cards, notes list) | `component_name`, `link_text`, `link_url` |
| `outbound_click` | Any external link (auto) | `component_name`, `link_text`, `link_url`, `link_domain` |

## component_name values in use

`header_nav`, `header_nav_cta`, `footer`, `home_hero`, `home_offers`,
`home_next_move`, `home_selected_work`, `work_index`, `notes_index`,
`article_body`, `article_cta`, `case_study`.

Keep these stable once shipped (renaming fragments historical reporting). Add new
ones here when you introduce a component.

## GA4 Admin — register these custom dimensions

Admin → Custom definitions → Create custom dimension, **scope: Event**, param
name exactly as below. (`value` / `currency` are built-in — do NOT register.)

`component_name`, `link_text`, `link_url`, `link_domain`, `form_name`,
`inquiry_type`, `method`, `lead_source`, `source_page`.

Optional: `content_type` (only if you want to report on it).

Then mark `generate_lead` (and optionally `inquiry_submit`) as **Key events**.

## Adding a lead source later (newsletter, search)

The helpers exist in the shared standard. If you add a newsletter, fire
`generate_lead` + `email_capture_submit` (value 1) and register `placement`,
`lead_magnet`, `content_category`. If you add site search, fire `search` with
`search_term`. Reuse the same param names.
