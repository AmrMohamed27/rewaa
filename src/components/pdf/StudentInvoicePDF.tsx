import { Document, Page, Text, View, StyleSheet, Font, Svg, Path } from "@react-pdf/renderer";
import { Student, StudentTransaction } from "@/types/student";

// Register IBM Plex Sans Arabic
Font.register({
  family: "IBM Plex Sans Arabic",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsansarabic/IBMPlexSansArabic-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsansarabic/IBMPlexSansArabic-Bold.ttf",
      fontWeight: 700,
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsansarabic/IBMPlexSansArabic-Medium.ttf",
      fontWeight: 500,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: "IBM Plex Sans Arabic",
    backgroundColor: "#ffffff",
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1pt solid #e2e8f0",
    paddingBottom: 12,
    marginBottom: 20,
  },
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0f172a",
  },
  brandSubtitle: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  badge: {
    fontSize: 10,
    backgroundColor: "#f0f9ff",
    border: "1pt solid #bae6fd",
    padding: "4 8",
    borderRadius: 4,
    color: "#0284c7",
    fontWeight: 700,
  },
  dateText: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 4,
  },

  // Metadata Grid
  metaGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    border: "1pt solid #e2e8f0",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  metaCol: {
    width: "48%",
  },
  metaSectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaName: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 2,
  },
  metaText: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 2,
  },
  statusBadge: {
    fontSize: 9,
    fontWeight: 700,
    backgroundColor: "#ecfdf5",
    border: "1pt solid #a7f3d0",
    color: "#059669",
    padding: "3 8",
    borderRadius: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },

  // Amount Box
  amountBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    border: "1pt solid #bae6fd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: 500,
  },
  amountNotes: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0284c7",
  },

  // Footer
  footer: {
    borderTop: "1pt solid #f1f5f9",
    paddingTop: 16,
    alignItems: "center",
  },
  footerThankYou: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 2,
  },
  footerReceipt: {
    fontSize: 9,
    color: "#64748b",
  },
});

interface PDFProps {
  student: Student;
  transaction: StudentTransaction;
  locale: string;
  strings: Record<string, string>;
}

export function StudentInvoicePDF({ student, transaction, locale, strings }: PDFProps) {
  const isRtl = locale === "ar";
  const nameParts = [
    student.firstName,
    student.middleName,
    student.lastName,
    student.additionalName,
  ].filter(Boolean);
  const fullName = nameParts.length > 0 ? nameParts.join(" ") : student.firstName || "";

  const isDeposit = transaction.type === "deposit" || transaction.type === "refund";

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={false}>
        {/* HEADER */}
        <View style={{ ...styles.headerContainer, flexDirection: isRtl ? "row-reverse" : "row" }}>
          <View style={{ ...styles.brandWrapper, flexDirection: isRtl ? "row-reverse" : "row" }}>
            <View style={{ marginRight: isRtl ? 0 : 10, marginLeft: isRtl ? 10 : 0 }}>
              <Svg viewBox="0 0 22 27" width={20} height={24}>
                <Path
                  d="M11.0333 22.6667C11.3 22.6444 11.5278 22.5389 11.7167 22.35C11.9056 22.1611 12 21.9333 12 21.6667C12 21.3556 11.9 21.1056 11.7 20.9167C11.5 20.7278 11.2444 20.6444 10.9333 20.6667C10.0222 20.7333 9.05556 20.4833 8.03333 19.9167C7.01111 19.35 6.36667 18.3222 6.1 16.8333C6.05556 16.5889 5.93889 16.3889 5.75 16.2333C5.56111 16.0778 5.34444 16 5.1 16C4.78889 16 4.53333 16.1167 4.33333 16.35C4.13333 16.5833 4.06667 16.8556 4.13333 17.1667C4.51111 19.1889 5.4 20.6333 6.8 21.5C8.2 22.3667 9.61111 22.7556 11.0333 22.6667ZM10.6667 26.6667C7.62222 26.6667 5.08333 25.6222 3.05 23.5333C1.01667 21.4444 0 18.8444 0 15.7333C0 13.5111 0.883333 11.0944 2.65 8.48333C4.41667 5.87222 7.08889 3.04444 10.6667 0C14.2444 3.04444 16.9167 5.87222 18.6833 8.48333C20.45 11.0944 21.3333 13.5111 21.3333 15.7333C21.3333 18.8444 20.3167 21.4444 18.2833 23.5333C16.25 25.6222 13.7111 26.6667 10.6667 26.6667ZM10.6667 24C12.9778 24 14.8889 23.2167 16.4 21.65C17.9111 20.0833 18.6667 18.1111 18.6667 15.7333C18.6667 14.1111 17.9944 12.2778 16.65 10.2333C15.3056 8.18889 13.3111 5.95556 10.6667 3.53333C8.02222 5.95556 6.02778 8.18889 4.68333 10.2333C3.33889 12.2778 2.66667 14.1111 2.66667 15.7333C2.66667 18.1111 3.42222 20.0833 4.93333 21.65C6.44444 23.2167 8.35556 24 10.6667 24Z"
                  fill="#007fff"
                />
              </Svg>
            </View>
            <View>
              <Text style={{ ...styles.brandName, textAlign: isRtl ? "right" : "left" }}>
                رواء | Rewaa
              </Text>
              <Text style={{ ...styles.brandSubtitle, textAlign: isRtl ? "right" : "left" }}>
                {strings.subtitle}
              </Text>
            </View>
          </View>

          <View style={{ ...styles.headerRight, alignItems: isRtl ? "flex-start" : "flex-end" }}>
            <Text style={styles.badge}>#{transaction.id}</Text>
            <Text style={styles.dateText}>{strings.formattedDate}</Text>
          </View>
        </View>

        {/* METADATA GRID */}
        <View style={{ ...styles.metaGrid, flexDirection: isRtl ? "row-reverse" : "row" }}>
          {/* Bill To */}
          <View style={styles.metaCol}>
            <Text style={{ ...styles.metaSectionTitle, textAlign: isRtl ? "right" : "left" }}>
              {strings.billTo}
            </Text>
            <Text style={{ ...styles.metaName, textAlign: isRtl ? "right" : "left" }}>
              {fullName}
            </Text>
            {student.phoneNumber && (
              <Text style={{ ...styles.metaText, textAlign: isRtl ? "right" : "left" }}>
                {student.phoneNumber}
              </Text>
            )}
            {(student.country || student.state) && (
              <Text style={{ ...styles.metaText, textAlign: isRtl ? "right" : "left" }}>
                {[student.country, student.state].filter(Boolean).join(" - ")}
              </Text>
            )}
          </View>

          {/* Transaction Details */}
          <View style={{ ...styles.metaCol, alignItems: isRtl ? "flex-start" : "flex-end" }}>
            <Text style={{ ...styles.metaSectionTitle, textAlign: isRtl ? "left" : "right" }}>
              {strings.transactionDetails}
            </Text>
            <Text style={{ ...styles.metaName, textAlign: isRtl ? "left" : "right" }}>
              {strings.transactionType}
            </Text>
            {student.email && (
              <Text style={{ ...styles.metaText, textAlign: isRtl ? "left" : "right" }}>
                {student.email}
              </Text>
            )}
            <Text style={{ ...styles.statusBadge, alignSelf: isRtl ? "flex-start" : "flex-end" }}>
              {strings.statusCompleted}
            </Text>
          </View>
        </View>

        {/* AMOUNT BOX */}
        <View style={{ ...styles.amountBox, flexDirection: isRtl ? "row-reverse" : "row" }}>
          <View>
            <Text style={{ ...styles.amountLabel, textAlign: isRtl ? "right" : "left" }}>
              {strings.amountLabel}
            </Text>
            {transaction.notes && (
              <Text style={{ ...styles.amountNotes, textAlign: isRtl ? "right" : "left" }}>
                {transaction.notes}
              </Text>
            )}
          </View>
          <Text style={styles.amountValue}>
            {isDeposit ? "+" : "-"}
            {transaction.amount} {strings.currency}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerThankYou}>{strings.thankYou}</Text>
          <Text style={styles.footerReceipt}>{strings.officialReceipt}</Text>
        </View>
      </Page>
    </Document>
  );
}
