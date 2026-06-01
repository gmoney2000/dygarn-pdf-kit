/**
 * PDF style contract. All branded paperwork (quotes, POs, packing slips,
 * invoices) consumes a PdfStyle to render. Switching a tenant's style changes
 * every PDF at once.
 *
 * Structure stays identical across styles - only colors, fonts, spacing, and
 * visual accents vary.
 */

export type PdfStyleId = "classic" | "modern" | "minimal" | "bold";

export interface PdfStyle {
  id: PdfStyleId;
  label: string;
  description: string;

  colors: {
    text: string;
    textMuted: string;
    textInverse: string;
    accent: string;
    accentLight: string;
    border: string;
    rowAlt: string;
    headerBg: string;
    headerText: string;
    tableHeaderBg: string;
    tableHeaderText: string;
    surface: string;
  };

  fonts: {
    body: string;
    heading: string;
    mono: string;
    sizeBase: number;
    sizeLabel: number;
    sizeHeading: number;
    sizeHuge: number;
    letterSpacingHeading: number;
  };

  layout: {
    pagePaddingBottom: number;
    sectionPaddingHorizontal: number;
    headerPaddingVertical: number;
    accentBarHeight: number;
    tableRadius: number;
    zebra: boolean;
    showInfoSection: boolean;
    infoSectionBg: "accent" | "surface" | "none";
  };

  header: {
    variant: "band" | "hairline" | "minimal" | "bold-block";
    logoWidth: number;
    logoHeight: number;
    agencyNameSize: number;
    titleSize: number;
    numberSize: number;
  };
}
