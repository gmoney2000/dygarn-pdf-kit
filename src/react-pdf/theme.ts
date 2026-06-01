import type { BrandInput } from "../types";
import { darkenHex, resolveBandThemeMode } from "../brand";

/**
 * Theme derived from a BrandInput for use in React-PDF bookend components.
 * Mirrors the resolution logic of pdf-lib branded-bookend.ts so the two
 * rendering layers produce identical visual output.
 */
export interface BookendTheme {
  bandColor: string;
  accentColor: string;
  creamColor: string;
  bandTextColor: string;
  themeMode: "dark" | "light";
}

export function resolveBookendTheme(brand: BrandInput): BookendTheme {
  const themeVars = brand.themeVars ?? {};
  const themeMode = resolveBandThemeMode(brand);

  let bandColor: string;
  if (themeMode === "dark") {
    bandColor =
      themeVars["--sidebar-bg"] ??
      themeVars["--header-bg"] ??
      (brand.primaryColor ? darkenHex(brand.primaryColor, 0.45) : "#1e3a5f");
  } else {
    bandColor = "#fbfaf6";
  }

  const accentColor = brand.primaryColor ?? themeVars["--accent"] ?? "#1e3a5f";
  const creamColor = "#faf9f4";
  const bandTextColor = themeMode === "dark" ? "#ffffff" : "#111111";

  return { bandColor, accentColor, creamColor, bandTextColor, themeMode };
}
