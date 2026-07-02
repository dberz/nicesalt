# NiceSalt Illustration Style Guide

The single source of truth for every illustration, icon, and animated element
on NiceSalt.com. The hero salt animation, the `SaltMark` brand crystal, the
favicon, and the service icons all follow these rules.

---

## 1. The motif: the salt crystal

Everything grows from one shape — **a faceted salt grain**:

- A rhombus (diamond) standing on its point, **width = 0.72 × height**.
- Split by a vertical and a horizontal seam into **four flat facets**.
- Canonical facet colors, clockwise from top-left: **pale, teal, blue, stone**.
- Seams are hairlines in paper; the outline is a thin, low-opacity ink stroke.

Reference implementations: `src/components/SaltMark.astro` (SVG),
`drawCrystal()` in `public/scripts/site.js` (canvas), `public/favicon.svg`.

Use the full four-facet crystal sparingly — once per composition at most.
Supporting grains (as in the hero animation) are the same rhombus in a single
tone with paper cross-seams.

## 2. Palette

CSS uses `color-mix()`; these are the resolved hex values for external tools:

| Token | Hex | Use |
|---|---|---|
| Paper | `#f4f2ec` | Background |
| Paper soft | `#faf8f3` | Panels, facet seams |
| Card | `#ffffff` | Panel fills |
| Ink | `#163a2f` | Outlines, line work (usually at 15–50% opacity) |
| Pale | `#e1e2da` | Facet 1 (top-left) |
| Teal | `#62978c` | Facet 2 (top-right) |
| Blue | `#5d7c88` | Facet 3 (bottom-right) |
| Stone | `#9da599` | Facet 4 (bottom-left) |
| Coral | `#c0764c` | The single accent — one per composition, never more |

## 3. Construction rules

1. **Flat planes only.** No gradients inside a shape, no rendered 3D, no cast
   shadows inside the artwork. Depth comes from facet color changes.
2. **One coral element per icon.** An arrow, spark, or flag — it marks "the
   result" or the direction of movement. Two coral elements is a bug.
3. **Line work:** rounded caps and joins, ~2.2 units at 260px scale. Solid
   ink lines (≈48% opacity) for structure; muted blue lines for secondary
   detail; dotted lines for flows and journeys.
4. **Panels:** rounded rectangles (radius ≈ 8–12 at 260px scale) in paper
   soft/card with a faint ink border — these read as "screens" or "documents."
5. **Nodes:** small solid circles (teal or blue) with a paper stroke — these
   read as "touchpoints."
6. **Composition:** off-center, generous whitespace, roughly one panel + one
   crystal or crystal-cluster + one connector. Don't fill the frame.
7. **Geometry discipline:** crystals always at the 0.72 ratio. Rotation is
   fine; distortion is not.
8. **Element budget.** Per icon: one focal crystal (or grain group), one
   support shape, one connector, one coral accent. If a composition has more
   than ~7 shapes, it's noisy — cut, don't shrink.

## 4. Where it lives

| Surface | Asset | Notes |
|---|---|---|
| Header/footer | `SaltMark.astro` | 18–22px, next to wordmark |
| Favicon | `favicon.svg` | Crystal on paper tile |
| Hero animation | `site.js` | Falling grains = single-tone rhombi; resting chips = full four-facet crystals |
| Offer cards | `ServiceIllustration.astro` | 4 icons, 260×150 |
| Loop diagram hub | inline SVG in `index.astro` | Crystal cluster |

---

## 5. GPT Images — master style prompt

Paste this before every icon request:

> Flat vector-style illustration for a premium consulting studio, on a fully
> transparent background. Style: minimal geometric shapes built from flat,
> unshaded color planes — absolutely no gradients, no drop shadows, no 3D
> rendering, no texture, no photorealism. Limited palette, exactly these
> colors: pale gray-green #e1e2da, muted teal #62978c, slate blue #5d7c88,
> warm stone gray #9da599, off-white #faf8f3, deep forest ink #163a2f (used
> only for thin outlines and line work at reduced opacity), and terracotta
> coral #c0764c used for exactly ONE small accent element in the whole image.
> The recurring brand motif is a faceted salt crystal: a diamond/rhombus
> standing on its point, width 72% of its height, divided by one vertical and
> one horizontal hairline seam in off-white into four flat facets colored
> pale gray-green (top-left), muted teal (top-right), slate blue
> (bottom-right), stone gray (bottom-left), with a thin dark-green outline.
> Supporting elements: rounded-rectangle panels in off-white with faint
> outlines (like abstract screens or cards), thin rounded line work
> suggesting text, dotted lines suggesting movement or flow, and small solid
> circles as connection nodes. Composition is airy and off-center with
> generous empty space. Aspect ratio 26:15, landscape. No text, no letters,
> no logos.

### Dual aspect-ratio generation pipeline

Every new generated illustration must be produced as a matched pair, not a
single crop:

1. **Landscape source:** `1560×900` PNG with transparency, aspect ratio
   `26:15`. This is the primary source for service cards and wide content
   breaks. Downscale to `520×300` for retina display in a `260×150` slot.
2. **Square companion:** `1200×1200` PNG with transparency, aspect ratio
   `1:1`. This is the source for loop hubs, compact callouts, social crops,
   and any future square placement.

Both outputs must use the same subject, palette, crystal geometry, and single
coral accent rule. Recompose for the second aspect ratio instead of cropping:
the square version should keep the crystal readable and centered enough for
small placements, while the landscape version can stay airy and off-center.

## 6. GPT Images — icon-by-icon briefs

Append one of these to the master prompt. Keep each output at 1560×900 (26:15),
export PNG with transparency, then downscale to 520×300 for retina at the
260×150 slot. Also request the square companion described above for every new
asset, even when the immediate implementation only uses the landscape version.

**Icon 1 — Positioning & UX** (`strategy`)
> Subject, exactly six elements: (1) one rounded off-white panel like an
> abstract webpage, containing (2) a teal rectangular header block and
> (3) two thin ink text lines; (4) one short dotted line curving from the
> panel's right edge toward (5) one large faceted salt crystal (the brand
> motif) to the panel's right; (6) the single coral accent — a tiny coral
> pennant at the crystal's apex. Nothing else. Meaning: structure and story
> crystallizing into something valuable.

**Icon 2 — Content & distribution** (`content`)
> Subject, exactly eight elements: (1) one rounded off-white panel on the
> left containing (2) a teal block and (3) one thin ink text line; (4–6)
> three thin dotted rays fanning right from the panel's edge, ending in
> three single-tone salt-crystal rhombi with off-white cross seams — teal
> (top), slate blue (middle, slightly larger), stone (bottom); (7) generous
> empty space around the fan; (8) the single coral accent — a small coral
> arrowhead sitting on the middle ray, pointing toward the grain. Nothing
> else — no extra cards, nodes, or lines. Meaning: one piece of content
> distributed to many surfaces.

**Icon 3 — Conversion** (`conversion`)
> Subject, exactly six elements: (1) an abstract funnel mouth made of two
> flat planes only — muted teal left half, slate blue right half — narrowing
> to (2) a small pale spout; (3) the single coral accent — a small coral
> arrowhead pointing down from the spout; (4) one faceted salt crystal (the
> four-facet brand motif) directly below, as if the funnel distilled it;
> (5) a thin muted ground line under the crystal; (6) empty space
> everywhere else. No grains inside the funnel, no extra sparkles.
> Meaning: wide attention distilled into one concrete inquiry.

**Icon 4 — Analytics & growth** (`analytics`)
> Subject, exactly seven elements: (1) a thin muted horizontal baseline (no
> panel, no frame); (2–4) three flat bar-chart columns rising left to right —
> muted teal (short), slate blue (medium), stone gray (tall); (5) one thin
> dotted trend line rising diagonally across the bar tops and past them;
> (6) one small single-tone teal salt-crystal rhombus with off-white seams
> at the end of the trend line, above the tallest bar; (7) the single coral
> accent — a small coral arrowhead just beyond the grain, continuing the
> trend's direction. No circle nodes, no dashboard frame, no text lines.
> Meaning: measurement that compounds into growth.

**Icon 5 (optional) — Loop hub** (center of the approach diagram)
> Subject: one large faceted salt crystal (the four-facet brand motif) shown
> alone, slightly rotated, orbited by a thin dotted circular path with three
> small circle nodes on it — one teal, one blue, one stone. The single coral
> accent: one tiny coral rhombus grain sitting on the dotted orbit. Square
> aspect ratio 1:1. Meaning: the whole growth loop feeding one crystal.

### Consistency checklist (after generation)

- [ ] Background fully transparent
- [ ] Exactly one coral element
- [ ] Crystal(s) at the 0.72 ratio, point-down-and-up orientation
- [ ] Facet order correct: pale ↖ / teal ↗ / blue ↘ / stone ↙
- [ ] No gradients, shadows, or textures
- [ ] Line weights look consistent across all icons side by side
- [ ] Reads clearly at 260px wide
