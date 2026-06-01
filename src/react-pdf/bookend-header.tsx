import * as React from "react";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { BookendTheme } from "./theme";

export interface BookendHeaderProps {
  theme: BookendTheme;
  logoUrl: string | null;
  agencyName: string;
  /** Doc label like "Quotation" or "Purchase Order" */
  docLabel: string;
  /** Doc number like "#Q-2026-1234" */
  docNumber: string;
  /** Formatted date string */
  docDate: string;
  /** Optional second line below date (e.g. "Expires ...") */
  docExtra?: string;
  logoWidth?: number;
  logoHeight?: number;
}

const styles = StyleSheet.create({
  bandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 40,
    paddingVertical: 22,
  },
  logoAndName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  agencyName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  agencyTagline: {
    fontSize: 7.5,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  metaBox: { alignItems: "flex-end" },
  metaLabel: {
    fontSize: 7,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metaNum: {
    fontSize: 20,
    fontFamily: "Courier-Bold",
    marginTop: 2,
  },
  metaDate: {
    fontSize: 8,
    marginTop: 5,
  },
  accentStripe: {
    height: 3,
  },
});

/**
 * Dark-or-light branded header band with logo + agency name on the left,
 * doc label/number/date on the right, accent stripe underneath.
 *
 * Renders on every page (uses React-PDF's `fixed` flag).
 */
export function BookendHeader({
  theme,
  logoUrl,
  agencyName,
  docLabel,
  docNumber,
  docDate,
  docExtra,
  logoWidth = 80,
  logoHeight = 48,
}: BookendHeaderProps): React.ReactElement {
  const { bandColor, accentColor, bandTextColor } = theme;
  const mutedText = theme.themeMode === "dark" ? "#8a9aaa" : "#666666";

  return (
    <View fixed>
      <View style={[styles.bandRow, { backgroundColor: bandColor }]}>
        <View style={styles.logoAndName}>
          {logoUrl && <Image src={logoUrl} style={{ width: logoWidth, height: logoHeight, objectFit: "contain" }} />}
          <View>
            <Text style={[styles.agencyName, { color: bandTextColor }]}>{agencyName}</Text>
          </View>
        </View>
        <View style={styles.metaBox}>
          <Text style={[styles.metaLabel, { color: mutedText }]}>{docLabel}</Text>
          <Text style={[styles.metaNum, { color: bandTextColor }]}>{docNumber}</Text>
          <Text style={[styles.metaDate, { color: mutedText }]}>{docDate}</Text>
          {docExtra && <Text style={[styles.metaDate, { color: mutedText }]}>{docExtra}</Text>}
        </View>
      </View>
      <View style={[styles.accentStripe, { backgroundColor: accentColor }]} />
    </View>
  );
}
