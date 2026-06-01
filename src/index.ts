// Brand + brand adapters
export type { BrandInput } from "./types";
export {
  brandFromProspectBrand,
  brandFromTenantBranding,
  darkenHex,
  hexToRgb01,
  resolveBandThemeMode,
  resolveBestLogoUrl,
} from "./brand";
export type { ProspectBrandShape, TenantBrandingShape } from "./brand";

// Style contract + 4 themes
export {
  boldStyle,
  classicStyle,
  DEFAULT_PDF_STYLE_ID,
  minimalStyle,
  modernStyle,
  PDF_STYLE_LIST,
  PDF_STYLES,
  resolvePdfStyle,
} from "./styles";
export type { PdfStyle, PdfStyleId } from "./styles/types";
