import type { BrandInput } from "./types";

/**
 * Adapter: RepFirm TenantBranding shape -> BrandInput.
 *
 * RepFirm tenants store branding on the `tenants.branding` JSONB column with
 * keys like primary_color, logo_url, logo_dark_url, etc. (snake_case). Pair
 * with the tenant name from the parent row when calling.
 */
export interface TenantBrandingShape {
  primary_color?: string;
  logo_url?: string | null;
  logo_wordmark_url?: string | null;
  logo_mark_url?: string | null;
  logo_dark_url?: string | null;
  logo_light_url?: string | null;
  pdf_header_theme?: "dark" | "light" | "auto";
  theme_vars?: Record<string, string>;
  tagline?: string | null;
  company_address?: string | null;
  company_phone?: string | null;
  company_email?: string | null;
}

export function brandFromTenantBranding(
  tenantName: string,
  branding: TenantBrandingShape | null | undefined,
  fallbackPrimary = "#1e3a5f",
): BrandInput {
  const b = branding ?? {};
  return {
    agencyName: tenantName,
    primaryColor: b.primary_color ?? fallbackPrimary,
    logoUrl: b.logo_url ?? null,
    logoDarkUrl: b.logo_dark_url ?? null,
    logoLightUrl: b.logo_light_url ?? null,
    logoWordmarkUrl: b.logo_wordmark_url ?? null,
    logoMarkUrl: b.logo_mark_url ?? null,
    pdfHeaderTheme: b.pdf_header_theme ?? "auto",
    themeVars: b.theme_vars ?? {},
    tagline: b.tagline ?? null,
    address: b.company_address ?? null,
    phone: b.company_phone ?? null,
    email: b.company_email ?? null,
  };
}

/**
 * Adapter: dygarn-dashboard prospect brand shape -> BrandInput.
 *
 * Dygarn-dashboard stores per-prospect brand kits in outreach_prospect_brands
 * with simpler shape (camelCase or snake — be liberal in what we accept).
 */
export interface ProspectBrandShape {
  agency_name?: string;
  agencyName?: string;
  legal_name?: string | null;
  legalName?: string | null;
  logo_url?: string | null;
  logoUrl?: string | null;
  primary_color?: string;
  primaryColor?: string;
  secondary_color?: string;
  secondaryColor?: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
}

export function brandFromProspectBrand(p: ProspectBrandShape): BrandInput {
  const agency = p.agencyName ?? p.agency_name ?? "Agency";
  return {
    agencyName: agency,
    legalName: p.legalName ?? p.legal_name ?? null,
    logoUrl: p.logoUrl ?? p.logo_url ?? null,
    primaryColor: p.primaryColor ?? p.primary_color ?? "#1a73e8",
    address: p.address ?? null,
    phone: p.phone ?? null,
    website: p.website ?? null,
    pdfHeaderTheme: "auto",
  };
}

/**
 * Determine whether to use a dark or light header band for this brand.
 *
 * - Explicit override: respect pdfHeaderTheme if set to 'dark' or 'light'.
 * - Auto (default): use dark theme only when a logoDarkUrl (white-on-dark
 *   variant) is available, OR when the logo filename hints at a white/dark
 *   variant. Otherwise default to LIGHT (safe for multi-color logos).
 */
export function resolveBandThemeMode(brand: BrandInput): "dark" | "light" {
  if (brand.pdfHeaderTheme === "dark") return "dark";
  if (brand.pdfHeaderTheme === "light") return "light";
  if (brand.logoDarkUrl) return "dark";
  const candidate = (brand.logoWordmarkUrl ?? brand.logoUrl ?? brand.logoMarkUrl ?? "").toLowerCase();
  if (candidate.includes("white") || candidate.includes("-on-dark") || candidate.includes("_dark")) return "dark";
  return "light";
}

/**
 * Pick the best logo URL for the resolved theme mode.
 * Returns null if no logo available.
 */
export function resolveBestLogoUrl(brand: BrandInput, mode: "dark" | "light"): string | null {
  if (mode === "dark") {
    return brand.logoDarkUrl ?? brand.logoUrl ?? brand.logoWordmarkUrl ?? brand.logoMarkUrl ?? null;
  }
  return (
    brand.logoLightUrl ?? brand.logoUrl ?? brand.logoWordmarkUrl ?? brand.logoMarkUrl ?? brand.logoDarkUrl ?? null
  );
}

/**
 * Darken a hex color by a 0-1 amount. Used to derive a dark band color from
 * a brand primary when no explicit dark variant exists.
 */
export function darkenHex(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = Number.parseInt(m[1], 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  r = Math.max(0, Math.round(r * (1 - amount)));
  g = Math.max(0, Math.round(g * (1 - amount)));
  b = Math.max(0, Math.round(b * (1 - amount)));
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Convert hex to {r,g,b} normalized 0-1. Used by both React-PDF (color objects)
 * and pdf-lib (rgb() arguments).
 */
export function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const r = Number.parseInt(h.slice(0, 2), 16) / 255;
  const g = Number.parseInt(h.slice(2, 4), 16) / 255;
  const b = Number.parseInt(h.slice(4, 6), 16) / 255;
  return [Number.isFinite(r) ? r : 0.12, Number.isFinite(g) ? g : 0.23, Number.isFinite(b) ? b : 0.37];
}
