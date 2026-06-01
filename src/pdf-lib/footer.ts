import type { PDFPage } from "pdf-lib";
import { PDFArray, PDFName, PDFNumber, PDFRef, rgb } from "pdf-lib";

import type { BookendContext } from "./context";
import type { BookendFonts } from "./fonts";

export const BRANDED_FOOTER_HEIGHT = 38;

/**
 * Per-page branded footer with prepared-by line, date, page numbers, and a
 * clickable "Index" link that jumps to page 1.
 */
export function drawBrandedFooter(page: PDFPage, ctx: BookendContext, fonts: BookendFonts): void {
  const { helv, helvBold } = fonts;
  const W = page.getWidth();
  const BOT_BANNER_H = BRANDED_FOOTER_HEIGHT;
  const PAD = 10;
  const darkGrey = rgb(0.25, 0.25, 0.25);
  const midGrey = rgb(0.55, 0.55, 0.55);

  page.drawRectangle({ x: 0, y: 0, width: W, height: BOT_BANNER_H, color: ctx.cardColors.cream });

  page.drawLine({
    start: { x: 0, y: BOT_BANNER_H },
    end: { x: W, y: BOT_BANNER_H },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.78),
  });

  // TOP ROW
  const topRowY = BOT_BANNER_H - 13;
  page.drawText("Prepared By: ", { x: PAD, y: topRowY, size: 9, font: helv, color: darkGrey });
  const prepByW = helv.widthOfTextAtSize("Prepared By: ", 9);
  page.drawText(ctx.brand.agencyName, { x: PAD + prepByW, y: topRowY, size: 9, font: helvBold, color: darkGrey });

  const repParts: string[] = [];
  if (ctx.repName) repParts.push(ctx.repName);
  if (ctx.repEmail) repParts.push(ctx.repEmail);
  if (repParts.length > 0) {
    const repStr = repParts.join("  |  ");
    const repStrW = helv.widthOfTextAtSize(repStr, 9);
    page.drawText(repStr, { x: W - PAD - repStrW, y: topRowY, size: 9, font: helv, color: darkGrey });
  }

  // Thin divider
  const divY = Math.round(BOT_BANNER_H / 2) - 1;
  page.drawLine({
    start: { x: PAD, y: divY },
    end: { x: W - PAD, y: divY },
    thickness: 0.4,
    color: rgb(0.82, 0.82, 0.8),
  });

  // BOTTOM ROW
  const botRowY = 5;
  page.drawText(ctx.dateStamp, { x: PAD, y: botRowY, size: 8, font: helv, color: midGrey });

  const pageStr = ctx.pageCount > 0 ? `${ctx.pageNumber} of ${ctx.pageCount}` : String(ctx.pageNumber);
  const pageStrW = helv.widthOfTextAtSize(pageStr, 8);
  page.drawText(pageStr, { x: (W - pageStrW) / 2, y: botRowY, size: 8, font: helv, color: midGrey });

  const indexLabel = "Index";
  const indexW = helv.widthOfTextAtSize(indexLabel, 8);
  const indexX = W - PAD - indexW;
  page.drawText(indexLabel, { x: indexX, y: botRowY, size: 8, font: helv, color: ctx.accentColor });

  if (ctx.pageNumber > 1) {
    addGoToFirstPageLink(page, {
      x: indexX - 1,
      y: botRowY - 1,
      width: indexW + 2,
      height: 10,
    });
  }
}

function addGoToFirstPageLink(
  page: PDFPage,
  rect: { x: number; y: number; width: number; height: number },
): void {
  const doc = page.doc;
  const pages = doc.getPages();
  if (pages.length === 0) return;
  const firstPageRef = doc.context.getObjectRef(pages[0].node);
  if (!firstPageRef) return;

  const linkDict = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [rect.x, rect.y, rect.x + rect.width, rect.y + rect.height],
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "GoTo",
      D: [firstPageRef, PDFName.of("Fit")],
    },
  });
  const linkRef = doc.context.register(linkDict);

  const existing = page.node.Annots();
  if (existing instanceof PDFArray) {
    existing.push(linkRef);
  } else {
    page.node.set(PDFName.of("Annots"), doc.context.obj([linkRef]));
  }

  void PDFRef;
  void PDFNumber;
}
