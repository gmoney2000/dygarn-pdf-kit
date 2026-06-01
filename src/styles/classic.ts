import type { PdfStyle } from "./types";

export const classicStyle: PdfStyle = {
  id: "classic",
  label: "Classic",
  description: "Dark navy header band with steel-blue accent. Professional and traditional.",

  colors: {
    text: "#1a2535",
    textMuted: "#6b7a8a",
    textInverse: "#ffffff",
    accent: "#4a7aa0",
    accentLight: "#e8f2ed",
    border: "#d4dbe3",
    rowAlt: "#f7f9f8",
    headerBg: "#2c3e50",
    headerText: "#ffffff",
    tableHeaderBg: "#2c3e50",
    tableHeaderText: "#a0b4c0",
    surface: "#ffffff",
  },

  fonts: {
    body: "Helvetica",
    heading: "Helvetica-Bold",
    mono: "Courier-Bold",
    sizeBase: 9,
    sizeLabel: 7,
    sizeHeading: 12,
    sizeHuge: 20,
    letterSpacingHeading: 0.5,
  },

  layout: {
    pagePaddingBottom: 50,
    sectionPaddingHorizontal: 40,
    headerPaddingVertical: 28,
    accentBarHeight: 3,
    tableRadius: 4,
    zebra: true,
    showInfoSection: true,
    infoSectionBg: "accent",
  },

  header: {
    variant: "band",
    logoWidth: 80,
    logoHeight: 48,
    agencyNameSize: 18,
    titleSize: 7,
    numberSize: 20,
  },
};
