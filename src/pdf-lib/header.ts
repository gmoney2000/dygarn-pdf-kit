import type { PDFPage } from "pdf-lib";
import { rgb } from "pdf-lib";

import type { BookendContext } from "./context";
import type { BookendFonts } from "./fonts";

export const BRANDED_HEADER_HEIGHT = 110; // dark band + stripe + cream info zone
export const BRANDED_HEADER_MINIMAL_H = 56; // dark band + stripe + thin cream strip

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

/**
 * Draw the per-page branded header.
 *
 * showFixtureCard=true (datasheet pages): dark band 38pt + stripe 3pt + cream
 *   info zone with white card (Job Name / Manufacturer / Model Number) + type
 *   chip on right. Use for submittal datasheet pages.
 *
 * showFixtureCard=false (default): dark band 38pt + stripe 3pt + thin cream
 *   strip with project name + doc number. Use for non-datasheet pages.
 */
export function drawBrandedHeader(
  page: PDFPage,
  ctx: BookendContext,
  fonts: BookendFonts,
  opts?: { showFixtureCard?: boolean },
): void {
  const showFixtureCard = opts?.showFixtureCard ?? false;
  const { helv, helvBold } = fonts;
  const { bandColor, accentColor, cardColors, logoImage, logoAspect, themeMode } = ctx;
  const W = page.getWidth();
  const H = page.getHeight();
  const TOP_BANNER_H = showFixtureCard ? BRANDED_HEADER_HEIGHT : BRANDED_HEADER_MINIMAL_H;

  const PAD = 12;
  const DARK_H = 38;
  const STRIPE_H = 3;
  const CREAM_H = TOP_BANNER_H - DARK_H - STRIPE_H;

  const darkBandY = H - DARK_H;
  const stripeY = darkBandY - STRIPE_H;
  const headerTop = H - TOP_BANNER_H;

  page.drawRectangle({ x: 0, y: darkBandY, width: W, height: DARK_H, color: bandColor });
  page.drawRectangle({ x: 0, y: stripeY, width: W, height: STRIPE_H, color: accentColor });
  page.drawRectangle({ x: 0, y: headerTop, width: W, height: CREAM_H, color: cardColors.cream });

  page.drawLine({
    start: { x: 0, y: headerTop },
    end: { x: W, y: headerTop },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.78),
  });

  if (logoImage) {
    const bandLogoH = 26;
    const logoW = Math.round(bandLogoH * logoAspect);
    page.drawImage(logoImage, { x: PAD, y: darkBandY + (DARK_H - bandLogoH) / 2, width: logoW, height: bandLogoH });
  } else {
    const nameColor = themeMode === "dark" ? rgb(1, 1, 1) : rgb(0.08, 0.08, 0.08);
    page.drawText(ctx.brand.agencyName, { x: PAD, y: darkBandY + 12, size: 12, font: helvBold, color: nameColor });
  }

  if (showFixtureCard) {
    drawFixtureCard(page, ctx, fonts, W, TOP_BANNER_H, PAD, CREAM_H, headerTop);
  } else {
    drawSimpleInfoStrip(page, ctx, fonts, W, CREAM_H, headerTop, PAD);
  }
}

function drawFixtureCard(
  page: PDFPage,
  ctx: BookendContext,
  fonts: BookendFonts,
  W: number,
  _TOP_BANNER_H: number,
  PAD: number,
  CREAM_H: number,
  headerTop: number,
): void {
  const { helv, helvBold } = fonts;
  const { cardColors } = ctx;

  const CHIP_W_RESERVE = 60;
  const CARD_X = PAD * 2;
  const CARD_W = W - CARD_X - CHIP_W_RESERVE - PAD;
  const CARD_H = Math.min(CREAM_H - 8, 60);
  const CARD_Y = headerTop + (CREAM_H - CARD_H) / 2;

  page.drawRectangle({
    x: CARD_X,
    y: CARD_Y,
    width: CARD_W,
    height: CARD_H,
    borderColor: cardColors.cardBorder,
    borderWidth: 0.75,
    color: rgb(1, 1, 1),
  });

  const LABEL_X = CARD_X + 14;
  const VALUE_X = CARD_X + 100;
  const ROW1_Y = CARD_Y + CARD_H - 17;
  const ROW2_Y = ROW1_Y - 18;
  const ROW3_Y = ROW2_Y - 18;

  const jobName = (ctx.projectName || "—").toUpperCase();
  const rows: Array<[string, string]> = [
    ["Job Name:", clip(jobName, 48)],
    ["Manufacturer:", clip(ctx.fixtureMfr ?? "—", 44)],
    ["Model Number:", clip(ctx.fixturePartNumber ?? "—", 44)],
  ];
  const rowYs = [ROW1_Y, ROW2_Y, ROW3_Y];
  for (let i = 0; i < rows.length; i++) {
    const [label, value] = rows[i];
    const y = rowYs[i];
    page.drawText(label, { x: LABEL_X, y, size: 9, font: helvBold, color: rgb(0.27, 0.27, 0.27) });
    page.drawText(value, { x: VALUE_X, y, size: 10.5, font: helvBold, color: rgb(0.08, 0.08, 0.08) });
  }

  // Type chip
  const CHIP_W = 50;
  const CHIP_H = Math.min(CREAM_H - 8, 50);
  const CHIP_X = W - PAD - CHIP_W;
  const CHIP_Y = headerTop + (CREAM_H - CHIP_H) / 2;
  const typeCode = clip(ctx.fixtureType ?? "—", 4);

  page.drawRectangle({ x: CHIP_X, y: CHIP_Y, width: CHIP_W, height: CHIP_H, color: cardColors.chipBg });

  const typeLabelW = helv.widthOfTextAtSize("Type:", 7);
  page.drawText("Type:", {
    x: CHIP_X + (CHIP_W - typeLabelW) / 2,
    y: CHIP_Y + CHIP_H - 13,
    size: 7,
    font: helv,
    color: rgb(0.5, 0.5, 0.5),
  });

  const codeSize = typeCode.length <= 2 ? 22 : typeCode.length <= 3 ? 17 : 13;
  const codeW = helvBold.widthOfTextAtSize(typeCode, codeSize);
  page.drawText(typeCode, {
    x: CHIP_X + (CHIP_W - codeW) / 2,
    y: CHIP_Y + (CHIP_H - 13) / 2 - codeSize * 0.35,
    size: codeSize,
    font: helvBold,
    color: rgb(0.133, 0.133, 0.133),
  });
}

function drawSimpleInfoStrip(
  page: PDFPage,
  ctx: BookendContext,
  fonts: BookendFonts,
  W: number,
  CREAM_H: number,
  headerTop: number,
  PAD: number,
): void {
  const { helv, helvBold } = fonts;
  const stripY = headerTop + (CREAM_H - 9) / 2;

  if (ctx.projectName) {
    page.drawText(clip(ctx.projectName, 60), {
      x: PAD * 2,
      y: stripY,
      size: 9,
      font: helvBold,
      color: rgb(0.2, 0.2, 0.2),
    });
  }
  if (ctx.docNumber) {
    const numW = helv.widthOfTextAtSize(ctx.docNumber, 8);
    page.drawText(ctx.docNumber, { x: W - PAD - numW, y: stripY, size: 8, font: helv, color: rgb(0.4, 0.4, 0.4) });
  } else if (ctx.docType) {
    const dtW = helv.widthOfTextAtSize(ctx.docType, 8);
    page.drawText(ctx.docType, { x: W - PAD - dtW, y: stripY, size: 8, font: helv, color: rgb(0.4, 0.4, 0.4) });
  }
}
