import type { PdfStyle } from "./types";

export const boldStyle: PdfStyle = {
  id: "bold",
  label: "Bold",
  description: "Heavy colored header and big typography. Brand-forward look.",

  colors: {
    text: "#0f1420",
    textMuted: "#5a6378",
    textInverse: "#ffffff",
    accent: "#d97706",
    accentLight: "#fff4e6",
    border: "#e5d4bd",
    rowAlt: "#fffaf2",
    headerBg: "#0f1420",
    headerText: "#ffffff",
    tableHeaderBg: "#d97706",
    tableHeaderText: "#ffffff",
    surface: "#ffffff",
  },

  fonts: {
    body: "Helvetica",
    heading: "Helvetica-Bold",
    mono: "Helvetica-Bold",
    sizeBase: 9,
    sizeLabel: 7,
    sizeHeading: 14,
    sizeHuge: 28,
    letterSpacingHeading: 1,
  },

  layout: {
    pagePaddingBottom: 50,
    sectionPaddingHorizontal: 40,
    headerPaddingVertical: 36,
    accentBarHeight: 6,
    tableRadius: 2,
    zebra: true,
    showInfoSection: true,
    infoSectionBg: "accent",
  },

  header: {
    variant: "bold-block",
    logoWidth: 90,
    logoHeight: 54,
    agencyNameSize: 24,
    titleSize: 8,
    numberSize: 32,
  },
};
