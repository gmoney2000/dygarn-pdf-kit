import type { PDFPage } from "pdf-lib";
import { rgb } from "pdf-lib";

import type { BookendContext } from "./context";
import type { BookendFonts } from "./fonts";

/**
 * Draw a branded cover page. Logo centered on the band, doc type label,
 * project name, location, doc number, recipient, prepared-by signature block,
 * bottom metadata line.
 *
 * Designed for 612x792 (US Letter) page size. Caller is responsible for
 * adding the page to the document.
 */
export function drawBrandedCover(page: PDFPage, ctx: BookendContext, fonts: BookendFonts): void {
  const { helv, helvBold, helvOblique } = fonts;
  const { bandColor, accentColor, logoImage, logoAspect, themeMode } = ctx;
  const W = page.getWidth();
  const H = page.getHeight();
  const CX = W / 2;
  const agencyName = ctx.brand.agencyName;

  // Top branded band
  const COVER_HEADER_H = 130;
  page.drawRectangle({ x: 0, y: H - COVER_HEADER_H, width: W, height: COVER_HEADER_H, color: bandColor });
  page.drawRectangle({ x: 0, y: H - COVER_HEADER_H - 4, width: W, height: 4, color: accentColor });

  // Logo or name inside the band
  const COVER_LOGO_H = 70;
  const COVER_LOGO_W = Math.round(COVER_LOGO_H * (logoAspect || 1));
  if (logoImage) {
    page.drawImage(logoImage, {
      x: CX - COVER_LOGO_W / 2,
      y: H - COVER_HEADER_H + (COVER_HEADER_H - COVER_LOGO_H) / 2,
      width: COVER_LOGO_W,
      height: COVER_LOGO_H,
    });
  } else {
    const nameColor = themeMode === "dark" ? rgb(1, 1, 1) : rgb(0.08, 0.08, 0.08);
    const nameW = helvBold.widthOfTextAtSize(agencyName, 28);
    page.drawText(agencyName, {
      x: CX - nameW / 2,
      y: H - COVER_HEADER_H / 2 - 10,
      size: 28,
      font: helvBold,
      color: nameColor,
    });
  }

  // Project / document block (centered, upper-middle)
  let cursorY = H - COVER_HEADER_H - 70;

  const docTypeUpper = ctx.docType.toUpperCase();
  const tagW = helvBold.widthOfTextAtSize(docTypeUpper, 11);
  page.drawText(docTypeUpper, {
    x: CX - tagW / 2,
    y: cursorY,
    size: 11,
    font: helvBold,
    color: rgb(0.45, 0.45, 0.45),
  });
  cursorY -= 30;

  if (ctx.projectName) {
    const projW = helvBold.widthOfTextAtSize(ctx.projectName, 22);
    page.drawText(ctx.projectName, {
      x: CX - projW / 2,
      y: cursorY,
      size: 22,
      font: helvBold,
      color: rgb(0.08, 0.08, 0.08),
    });
    cursorY -= 24;
  }

  if (ctx.location) {
    const locW = helv.widthOfTextAtSize(ctx.location, 12);
    page.drawText(ctx.location, {
      x: CX - locW / 2,
      y: cursorY,
      size: 12,
      font: helv,
      color: rgb(0.4, 0.4, 0.4),
    });
    cursorY -= 36;
  } else {
    cursorY -= 24;
  }

  if (ctx.docNumber) {
    const numLabel = ctx.docNumber;
    const numW = helvBold.widthOfTextAtSize(numLabel, 12);
    page.drawText(numLabel, {
      x: CX - numW / 2,
      y: cursorY,
      size: 12,
      font: helvBold,
      color: rgb(0.25, 0.25, 0.25),
    });
    cursorY -= 28;
  }

  const recipientName = ctx.recipientName ?? ctx.distributorName ?? null;
  const recipientLabel = ctx.recipientLabel ?? (ctx.distributorName ? "DISTRIBUTOR" : null);
  if (recipientName && recipientLabel) {
    const labelW = helvBold.widthOfTextAtSize(recipientLabel, 11);
    const gap = 14;
    const valueW = helvBold.widthOfTextAtSize(recipientName, 13);
    const totalW = labelW + gap + valueW;
    const rowX = CX - totalW / 2;
    page.drawText(recipientLabel, { x: rowX, y: cursorY, size: 11, font: helvBold, color: rgb(0.45, 0.45, 0.45) });
    page.drawText(recipientName, { x: rowX + labelW + gap, y: cursorY, size: 13, font: helvBold, color: rgb(0.1, 0.1, 0.1) });
  }

  // Bottom signature block
  const SIG_BLOCK_TOP = 140;
  let sigY = SIG_BLOCK_TOP;

  page.drawRectangle({ x: CX - 100, y: sigY, width: 200, height: 0.5, color: rgb(0.7, 0.7, 0.7) });
  sigY -= 18;

  const prepLabel = "- Prepared By -";
  const prepLabelW = helvOblique.widthOfTextAtSize(prepLabel, 10);
  page.drawText(prepLabel, { x: CX - prepLabelW / 2, y: sigY, size: 10, font: helvOblique, color: rgb(0.5, 0.5, 0.5) });
  sigY -= 18;

  if (ctx.repName) {
    const repNameW = helvBold.widthOfTextAtSize(ctx.repName, 12);
    page.drawText(ctx.repName, { x: CX - repNameW / 2, y: sigY, size: 12, font: helvBold, color: rgb(0.1, 0.1, 0.1) });
    sigY -= 16;
  }
  if (ctx.repEmail) {
    const repEmailW = helv.widthOfTextAtSize(ctx.repEmail, 10);
    page.drawText(ctx.repEmail, { x: CX - repEmailW / 2, y: sigY, size: 10, font: helv, color: rgb(0.16, 0.42, 0.68) });
    sigY -= 14;
  }

  const tnW = helvOblique.widthOfTextAtSize(agencyName, 10);
  page.drawText(agencyName, { x: CX - tnW / 2, y: sigY, size: 10, font: helvOblique, color: rgb(0.4, 0.4, 0.4) });

  // Bottom-most: doc number + date
  const footerLine = [ctx.docNumber, ctx.dateStamp].filter(Boolean).join("  |  ");
  if (footerLine) {
    const flW = helv.widthOfTextAtSize(footerLine, 9);
    page.drawText(footerLine, { x: CX - flW / 2, y: 36, size: 9, font: helv, color: rgb(0.55, 0.55, 0.55) });
  }
}
