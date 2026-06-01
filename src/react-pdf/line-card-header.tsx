import * as React from "react";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { BookendTheme } from "./theme";

export interface LineCardHeaderProps {
  theme: BookendTheme;
  logoUrl: string | null;
  agencyName: string;
  agencyPhone?: string | null;
  agencyEmail?: string | null;
  agencyWebsite?: string | null;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 44,
    paddingTop: 22,
    paddingBottom: 16,
  },
  logo: { height: 64, width: 180, objectFit: "contain" },
  fallbackName: { fontSize: 20, fontFamily: "Helvetica-Bold", letterSpacing: 0.3 },
  contactBlock: { alignItems: "flex-end" },
  contactLine: { fontSize: 8.5, lineHeight: 1.4 },
  contactPhone: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginTop: 2 },
  stripe: { height: 3, marginHorizontal: 44 },
});

/**
 * Variant header for line-card style documents: logo dominant on the left,
 * contact stack on the right, accent stripe underneath. Lower-weight than the
 * standard BookendHeader (no doc number).
 */
export function LineCardHeader({
  theme,
  logoUrl,
  agencyName,
  agencyPhone,
  agencyEmail,
  agencyWebsite,
}: LineCardHeaderProps): React.ReactElement {
  const { accentColor, bandColor, bandTextColor } = theme;

  return (
    <>
      <View style={[styles.row, { backgroundColor: bandColor }]}>
        {logoUrl ? (
          <Image src={logoUrl} style={styles.logo} />
        ) : (
          <Text style={[styles.fallbackName, { color: bandTextColor }]}>{agencyName}</Text>
        )}
        <View style={styles.contactBlock}>
          <Text style={[styles.contactLine, { color: bandTextColor, opacity: 0.8 }]}>{agencyName}</Text>
          {agencyPhone && <Text style={[styles.contactPhone, { color: bandTextColor }]}>{agencyPhone}</Text>}
          {agencyEmail && <Text style={[styles.contactLine, { color: bandTextColor, opacity: 0.7 }]}>{agencyEmail}</Text>}
          {agencyWebsite && (
            <Text style={[styles.contactLine, { color: bandTextColor, opacity: 0.7 }]}>{agencyWebsite}</Text>
          )}
        </View>
      </View>
      <View style={[styles.stripe, { backgroundColor: accentColor }]} />
    </>
  );
}
