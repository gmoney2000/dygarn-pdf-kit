import type { PDFDocument, PDFImage, RGB } from "pdf-lib";
import { rgb } from "pdf-lib";

import { darkenHex, hexToRgb01, resolveBandThemeMode, resolveBestLogoUrl } from "../brand";
import type { BrandInput } from "../types";

export interface ResolvedBookendAssets {
  logoImage: PDFImage | null;
  logoAspect: number;
  bandColor: RGB;
  accentColor: RGB;
  cardColors: {
    cream: RGB;
    cardBorder: RGB;
    chipBg: RGB;
  };
  themeMode: "dark" | "light";
}

export interface LoadBookendAssetsOptions {
  brand: BrandInput;
  doc: PDFDocument;
  /**
   * Optional URL resolver. Use when your app needs to convert relative paths
   * (e.g. /demo-files/logo.png) into absolute URLs for server-side fetching.
   * Defaults to identity (returns the URL unchanged).
   */
  resolveUrl?: (url: string) => string;
  /** Optional fetch timeout in ms. Default 8s. */
  fetchTimeoutMs?: number;
}

/**
 * Resolve brand colors + load logo PDFImage from URL.
 * Mirrors RepFirm's loadTenantBookendAssets behavior.
 */
export async function loadBookendAssets(opts: LoadBookendAssetsOptions): Promise<ResolvedBookendAssets> {
  const { brand, doc, resolveUrl = (u) => u, fetchTimeoutMs = 8_000 } = opts;
  const themeMode = resolveBandThemeMode(brand);
  const themeVars = brand.themeVars ?? {};

  // Band color
  let bandColorHex: string;
  if (themeMode === "dark") {
    bandColorHex =
      themeVars["--sidebar-bg"] ??
      themeVars["--header-bg"] ??
      (brand.primaryColor ? darkenHex(brand.primaryColor, 0.45) : "#1e3a5f");
  } else {
    bandColorHex = "#fbfaf6";
  }

  const accentHex = brand.primaryColor ?? themeVars["--accent"] ?? "#1e3a5f";

  const [br, bg2, bb] = hexToRgb01(bandColorHex);
  const [ar, ag, ab] = hexToRgb01(accentHex);

  const cardColors = {
    cream: rgb(0.984, 0.98, 0.965),
    cardBorder: rgb(0.78, 0.78, 0.78),
    chipBg: rgb(0.937, 0.937, 0.933),
  };

  // Logo URL resolution
  const candidate = resolveBestLogoUrl(brand, themeMode);
  const logoUrl = candidate ? resolveUrl(candidate) : null;

  let logoImage: PDFImage | null = null;
  let logoAspect = 1;

  if (logoUrl && !logoUrl.toLowerCase().endsWith(".svg")) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), fetchTimeoutMs);
      let res: Response;
      try {
        res = await fetch(logoUrl, { signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }
      if (res.ok) {
        const buf = new Uint8Array(await res.arrayBuffer());
        const lower = logoUrl.toLowerCase();
        if (lower.includes(".png") || (res.headers.get("content-type") ?? "").includes("png")) {
          logoImage = await doc.embedPng(buf);
        } else {
          logoImage = await doc.embedJpg(buf);
        }
        const dims = logoImage.scale(1);
        logoAspect = dims.width / dims.height;
      }
    } catch {
      // fall back to text-only header
    }
  }

  return {
    logoImage,
    logoAspect,
    bandColor: rgb(br, bg2, bb),
    accentColor: rgb(ar, ag, ab),
    cardColors,
    themeMode,
  };
}
