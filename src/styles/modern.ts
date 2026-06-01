import type { PdfStyle } from "./types";

export const modernStyle: PdfStyle = {
  id: "modern",
  label: "Modern",
  description: "Light and airy with generous whitespace. Contemporary look.",

  colors: {
    text: "#18243a",
    textMuted: "#5e7290",
    textInverse: "#ffffff",
    accent: "#5590b8",
    accentLight: "#f4f8fb",
    border: "#e5ecf3",
    rowAlt: "#fafbfd",
    headerBg: "#ffffff",
    headerText: "#18243a",
    tableHeaderBg: "#f4f8fb",
    tableHeaderText: "#5e7290",
    surface: "#ffffff",
  },

  fonts: {
    body: "Helvetica",
    heading: "Helvetica-Bold",
    mono: "Courier-Bold",
    sizeBase: 9.5,
    sizeLabel: 7,
    sizeHeading: 13,
    sizeHuge: 22,
    letterSpacingHeading: -0.3,
  },

  layout: {
    pagePaddingBottom: 60,
    sectionPaddingHorizontal: 48,
    headerPaddingVertical: 32,
    accentBarHeight: 2,
    tableRadius: 8,
    zebra: true,
    showInfoSection: true,
    infoSectionBg: "surface",
  },

  header: {
    variant: "hairline",
    logoWidth: 90,
    logoHeight: 54,
    agencyNameSize: 22,
    titleSize: 6.5,
    numberSize: 24,
  },
};
