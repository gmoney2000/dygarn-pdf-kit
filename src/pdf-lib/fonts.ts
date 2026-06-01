import type { PDFDocument, PDFFont } from "pdf-lib";
import { StandardFonts } from "pdf-lib";

export interface BookendFonts {
  helv: PDFFont;
  helvBold: PDFFont;
  helvOblique: PDFFont;
}

export async function loadBookendFonts(doc: PDFDocument): Promise<BookendFonts> {
  const [helv, helvBold, helvOblique] = await Promise.all([
    doc.embedFont(StandardFonts.Helvetica),
    doc.embedFont(StandardFonts.HelveticaBold),
    doc.embedFont(StandardFonts.HelveticaOblique),
  ]);
  return { helv, helvBold, helvOblique };
}
