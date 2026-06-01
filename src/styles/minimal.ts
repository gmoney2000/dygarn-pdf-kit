import type { PdfStyle } from "./types";

export const minimalStyle: PdfStyle = {
  id: "minimal",
  label: "Minimal",
  description: "Monochrome and typographic. Hairline rules, no color blocks.",

  colors: {
    text: "#111111",
    textMuted: "#6b6b6b",
    textInverse: "#ffffff",
    accent: "#111111",
    accentLight: "#f5f5f5",
    border: "#d4d4d4",
    rowAlt: "#fafafa",
    headerBg: "#ffffff",
    headerText: "#111111",
    tableHeaderBg: "#ffffff",
    tableHeaderText: "#6b6b6b",
    surface: "#ffffff",
  },

  fonts: {
    body: "Helvetica",
    heading: "Helvetica-Bold",
    mono: "Courier",
    sizeBase: 9,
    sizeLabel: 6.5,
    sizeHeading: 11,
    sizeHuge: 18,
    letterSpacingHeading: 2,
  },

  layout: {
    pagePaddingBottom: 55,
    sectionPaddingHorizontal: 54,
    headerPaddingVertical: 36,
    accentBarHeight: 1,
    tableRadius: 2,
    zebra: false,
    showInfoSection: true,
    infoSectionBg: "none",
  },

  header: {
    variant: "minimal",
    logoWidth: 70,
    logoHeight: 42,
    agencyNameSize: 16,
    titleSize: 7,
    numberSize: 16,
  },
};
