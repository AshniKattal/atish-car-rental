import { Page, View, Text, Document } from "@react-pdf/renderer";
//
import styles from "./PdfStyle";
import CurrencyFormat from "react-currency-format";

// ----------------------------------------------------------------------

export default function InvPdf({
  companyId,
  clientId,
  companyName,
  clientName,
  statementRows,
  us_fromDate,
  us_ToDate,
  totalStatement,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={[styles.tableAutoWidth, styles.mb8]}>
            <View
              style={[
                styles.rowNewTable,
                styles.boldNewTable,
                styles.headerNewTable,
              ]}
            >
              <Text style={styles.headerColumn}>{companyName || ""}</Text>
            </View>
            <View
              style={[
                styles.rowNewTable,
                styles.boldNewTable,
                styles.headerNewTable,
              ]}
            >
              <Text style={styles.headerColumn}>
                {`STATEMENT OF ACCOUNT FOR ${clientName || ""} FROM ${
                  us_fromDate || ""
                } TO ${us_ToDate || ""}`}
              </Text>
            </View>

            <View
              style={[
                styles.rowNewTable,
                styles.boldNewTable,
                styles.headerNewTable,
              ]}
            >
              <View style={styles.headerColumn}></View>
              <Text style={styles.headerColumn}>Date</Text>
              <Text style={styles.headerColumn}>Invoice Number</Text>
              {companyId &&
              companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
                <Text style={styles.headerColumn}>Customer's</Text>
              ) : (
                <View></View>
              )}
              {companyId &&
              companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
              clientId &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                clientId
              ) ? (
                <Text style={styles.headerColumn}>Job Ref</Text>
              ) : (
                <View></View>
              )}
              {companyId &&
              companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
                <Text style={styles.headerColumn}>Remarks</Text>
              ) : (
                <View></View>
              )}
              <Text style={styles.headerColumn}>Amount</Text>
            </View>

            {statementRows &&
              statementRows?.length > 0 &&
              statementRows?.map((row, index) => (
                <View key={index} style={styles.rowNewTable} wrap={true}>
                  <Text style={styles.column}>{index + 1}</Text>
                  <Text style={styles.column}>
                    {row?.date !== undefined && row?.date !== null
                      ? row?.date
                      : ""}
                  </Text>
                  <Text style={styles.column}>
                    {row?.receiptNumber !== undefined &&
                    row?.receiptNumber !== null
                      ? row?.receiptNumber
                      : ""}
                  </Text>

                  {companyId &&
                  companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
                    <Text style={styles.column}>
                      {row?.customerName !== undefined &&
                      row?.customerName !== null
                        ? row?.customerName
                        : ""}
                    </Text>
                  ) : (
                    <View></View>
                  )}
                  {companyId &&
                  companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
                  clientId &&
                  process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
                  process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                    clientId
                  ) ? (
                    <Text style={styles.column}>
                      {row?.invJobRef !== undefined && row?.invJobRef !== null
                        ? row?.invJobRef
                        : ""}
                    </Text>
                  ) : (
                    <View></View>
                  )}
                  {companyId &&
                  companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
                    <Text style={styles.column}>
                      {row?.docRemarks !== undefined && row?.docRemarks !== null
                        ? row?.docRemarks
                        : ""}
                    </Text>
                  ) : (
                    <View></View>
                  )}

                  <Text style={styles.column}>
                    <CurrencyFormat
                      value={Number(row?.amount || 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </Text>
                </View>
              ))}

            <View style={styles.rowNewTable} wrap={true}>
              <View style={styles.column}></View>
              <View style={styles.column}></View>

              {companyId &&
              (companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
                companyId === process.env.REACT_APP_CUSTOM_SOREFAN_ID) ? (
                <View style={styles.column}></View>
              ) : (
                <View></View>
              )}

              {companyId &&
              companyId === process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
              clientId &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
              process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                clientId
              ) ? (
                <View style={styles.column}></View>
              ) : (
                <View></View>
              )}

              <Text style={styles.column}>TOTAL</Text>

              <Text style={styles.column}>
                <CurrencyFormat
                  value={Number(totalStatement || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
