# @gmoney2000/dygarn-pdf-kit

Branded PDF design system for the DyGarn ecosystem (RepFirm, dygarn-dashboard, future apps).

Shared visual primitives + style themes so quote, submittal, PO, and outreach kit PDFs across all DyGarn apps look like they came from the same shop.

## Why it exists

Each app (RepFirm, dygarn-dashboard) had its own PDF generation code with similar-but-drifting visual layouts. This package extracts the visual primitives so:

- **One source of truth** for the bookend header band, accent stripe, info section, line items table, totals box, footer
- **Same look** across all DyGarn ecosystem outputs no matter which app produced them
- **Composable** — each app picks the primitives it needs and supplies its own data + business logic
- **Brand-agnostic** — primitives take a generic `BrandInput` shape, so they work for both tenant-style branding (RepFirm) and prospect-style branding (dygarn-dashboard outreach)

## Install

```bash
npm install @gmoney2000/dygarn-pdf-kit
```

Requires peer deps:
```bash
npm install @react-pdf/renderer pdf-lib react
```

This is a public npm package. No auth needed.

## Exports

```ts
// Core types + brand resolution + style themes
import { BrandInput, PdfStyle, resolvePdfStyle, resolveBrandTheme } from "@gmoney2000/dygarn-pdf-kit";

// React-PDF primitives (for @react-pdf/renderer-based docs)
import {
  BookendHeader,
  BookendFooter,
  InfoSection,
  LineItemsTable,
  TotalsBox,
  TermsBlock,
} from "@gmoney2000/dygarn-pdf-kit/react-pdf";

// pdf-lib primitives (for pdf-lib-based docs like submittal page assembly)
import {
  drawBookendCover,
  drawBookendHeader,
  drawBookendFooter,
  loadBookendFonts,
  BOOKEND_HEADER_HEIGHT,
  BOOKEND_FOOTER_HEIGHT,
} from "@gmoney2000/dygarn-pdf-kit/pdf-lib";
```

## Usage

### Compose a simple quote (React-PDF)

```tsx
import { Document, Page } from "@react-pdf/renderer";
import {
  BookendHeader,
  BookendFooter,
  InfoSection,
  LineItemsTable,
  TotalsBox,
  TermsBlock,
} from "@gmoney2000/dygarn-pdf-kit/react-pdf";
import { resolvePdfStyle, resolveBrandTheme } from "@gmoney2000/dygarn-pdf-kit";

const brand = {
  agencyName: "EFC Sales",
  logoUrl: "https://...",
  primaryColor: "#0a2540",
  // ... other BrandInput fields
};
const style = resolvePdfStyle("branded-bookend");
const theme = resolveBrandTheme(brand);

<Document>
  <Page size="LETTER">
    <BookendHeader theme={theme} brand={brand} docLabel="Quotation" docNumber="#Q-2026-1234" docDate="June 1, 2026" />
    <InfoSection style={style} blocks={[{label: "Project", value: "Downtown Tower"}]} />
    <LineItemsTable style={style} lines={lines} mode="standard" />
    <TotalsBox style={style} subtotal={1234.56} total={1234.56} />
    <TermsBlock style={style} terms="Standard terms..." />
    <BookendFooter theme={theme} brand={brand} docDate="June 1, 2026" />
  </Page>
</Document>
```

### Submittal page assembly (pdf-lib)

```ts
import { PDFDocument } from "pdf-lib";
import { drawBookendCover, drawBookendHeader, drawBookendFooter, loadBookendFonts } from "@gmoney2000/dygarn-pdf-kit/pdf-lib";

const pdf = await PDFDocument.create();
const fonts = await loadBookendFonts(pdf);
await drawBookendCover(pdf, { brand, fonts, title: "Submittal Package", projectName: "..." });
// concat external spec sheets ...
// drawBookendHeader / drawBookendFooter on each generated page
```

## Brand input

The package is brand-agnostic. Adapter functions live in `src/brand.ts`:

```ts
// RepFirm
import { brandFromTenantBranding } from "@gmoney2000/dygarn-pdf-kit";
const brand = brandFromTenantBranding(tenantBranding);

// dygarn-dashboard
import { brandFromProspectBrand } from "@gmoney2000/dygarn-pdf-kit";
const brand = brandFromProspectBrand(prospectBrand);
```

Both produce the same `BrandInput` shape that all primitives consume.

## Style themes

Five visual styles ported from RepFirm:

- `branded-bookend` (default) — dark band + accent stripe + cream info strip
- `bold` — heavy color blocks
- `classic` — traditional rep-agency look
- `minimal` — clean white space
- `modern` — geometric / contemporary

```ts
const style = resolvePdfStyle("branded-bookend"); // returns full PdfStyle contract
```

## Development

```bash
npm install
npm run build    # produces dist/
npm run dev      # watch mode
npm run typecheck
```

## Publishing

```bash
npm version patch  # or minor / major
npm publish        # publishes to GitHub Packages (private)
git push --follow-tags
```

## License

Proprietary. © DyGarn Technical Solutions.
