/**
 * Brand-agnostic input for all PDF rendering primitives.
 *
 * Both RepFirm tenants and dygarn-dashboard prospects map to this shape via the
 * adapter helpers in src/brand.ts. Keeping the rendering layer keyed off this
 * shared type means a tenant-branded RepFirm quote and a prospect-branded
 * dygarn outreach kit both compose the same way.
 */
export interface BrandInput {
  /** Display name (agency, tenant, prospect — whatever appears in the header) */
  agencyName: string;

  /** Brand primary color, hex like "#1a73e8" */
  primaryColor: string;

  /** Optional company / legal name shown smaller below agencyName */
  legalName?: string | null;

  /** Optional logo URL (https or local public path) */
  logoUrl?: string | null;

  /** Optional dark-variant logo (used when header band is dark) */
  logoDarkUrl?: string | null;

  /** Optional light-variant logo (used when header band is light) */
  logoLightUrl?: string | null;

  /** Optional wordmark / mark fallback logos */
  logoWordmarkUrl?: string | null;
  logoMarkUrl?: string | null;

  /** Optional header theme override. 'auto' picks based on logo variants. */
  pdfHeaderTheme?: "dark" | "light" | "auto";

  /** Optional theme vars dictionary (used by RepFirm tenant theme system) */
  themeVars?: Record<string, string>;

  /** Optional contact + identity fields shown in footer/info section */
  tagline?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}
