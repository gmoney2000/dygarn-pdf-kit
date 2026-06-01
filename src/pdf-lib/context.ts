import type { PDFImage, RGB } from "pdf-lib";

import type { BrandInput } from "../types";

/**
 * Per-document context built from a BrandInput + loaded assets.
 * Each page that uses drawBrandedHeader / drawBrandedFooter needs this
 * (with per-page page_number + page_count updated).
 */
export interface BookendContext {
  /** Source brand for this document */
  brand: BrandInput;
  /** Embedded logo image (null if none) */
  logoImage: PDFImage | null;
  /** Logo width / height aspect ratio (1 if no image) */
  logoAspect: number;
  /** Resolved band color (depends on themeMode) */
  bandColor: RGB;
  /** Resolved accent stripe color */
  accentColor: RGB;
  /** Cream / card / chip colors used in info zone */
  cardColors: {
    cream: RGB;
    cardBorder: RGB;
    chipBg: RGB;
  };
  /** Resolved theme mode (dark = dark band + white logo) */
  themeMode: "dark" | "light";

  // Doc identity
  /** Doc type label like "Quote" | "Purchase Order" | "Drawings Submittal" | "Line Card" */
  docType: string;
  docNumber: string | null;
  projectName: string | null;
  location?: string | null;

  // Prepared-by signature block
  repName?: string | null;
  repEmail?: string | null;
  repPhone?: string | null;

  /** Legacy: distributor recipient (auto-labeled "DISTRIBUTOR" if recipientLabel empty) */
  distributorName?: string | null;
  /** Generalized recipient label (e.g. "ENGINEER", "SPECIFIER", "ARCHITECT") */
  recipientLabel?: string | null;
  recipientName?: string | null;

  // Per-page state — update before each draw
  pageNumber: number;
  pageCount: number;
  dateStamp: string;

  // Fixture context (submittal datasheet pages only)
  fixtureType?: string | null;
  fixtureMfr?: string | null;
  fixturePartNumber?: string | null;
}
