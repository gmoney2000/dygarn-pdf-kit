import { boldStyle } from "./bold";
import { classicStyle } from "./classic";
import { minimalStyle } from "./minimal";
import { modernStyle } from "./modern";
import type { PdfStyle, PdfStyleId } from "./types";

export const PDF_STYLES: Record<PdfStyleId, PdfStyle> = {
  classic: classicStyle,
  modern: modernStyle,
  minimal: minimalStyle,
  bold: boldStyle,
};

export const PDF_STYLE_LIST: PdfStyle[] = [classicStyle, modernStyle, minimalStyle, boldStyle];

export const DEFAULT_PDF_STYLE_ID: PdfStyleId = "classic";

export function resolvePdfStyle(id: string | null | undefined): PdfStyle {
  if (id && id in PDF_STYLES) return PDF_STYLES[id as PdfStyleId];
  return PDF_STYLES[DEFAULT_PDF_STYLE_ID];
}

export { boldStyle, classicStyle, minimalStyle, modernStyle };
export type { PdfStyle, PdfStyleId } from "./types";
