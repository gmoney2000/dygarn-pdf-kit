import * as React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

import type { BookendTheme } from "./theme";

export interface BookendFooterProps {
  theme: BookendTheme;
  agencyName: string;
  agencyPhone?: string | null;
  agencyEmail?: string | null;
  dateStamp?: string | null;
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  footerLeft: { flexDirection: "column" },
  footerText: { fontSize: 6.5 },
  footerRight: { alignItems: "flex-end" },
});

/**
 * Fixed bottom footer with agency name + contact left, date + page numbers right.
 * Renders on every page via React-PDF's `fixed` flag.
 */
export function BookendFooter({
  theme,
  agencyName,
  agencyPhone,
  agencyEmail,
  dateStamp,
}: BookendFooterProps): React.ReactElement {
  const { accentColor } = theme;
  const muted = "#666666";

  const contactParts: string[] = [];
  if (agencyPhone) contactParts.push(agencyPhone);
  if (agencyEmail) contactParts.push(agencyEmail);

  return (
    <View style={[styles.footer, { borderTopColor: accentColor }]} fixed>
      <View style={styles.footerLeft}>
        <Text style={[styles.footerText, { color: muted }]}>{agencyName}</Text>
        {contactParts.length > 0 && (
          <Text style={[styles.footerText, { color: muted }]}>{contactParts.join("  ·  ")}</Text>
        )}
      </View>
      <View style={styles.footerRight}>
        {dateStamp && <Text style={[styles.footerText, { color: muted }]}>{dateStamp}</Text>}
        <Text
          style={[styles.footerText, { color: muted }]}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </View>
    </View>
  );
}
