import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
//
import styles from "./PdfStyle";
import CurrencyFormat from "react-currency-format";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

InvTransportTemplatePdf.propTypes = {
  companyChosenObj: PropTypes.object,
  clientChosenObj: PropTypes.object,
  invDetails: PropTypes.object,
  logo: PropTypes.string,
  sigImage: PropTypes.string,
};

export default function InvTransportTemplatePdf({
  companyChosenObj,
  clientChosenObj,
  invDetails,
  logo,
  sigImage,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb15]}>
          {logo !== undefined && logo !== null && logo !== "" && (
            <View style={styles.col30}>
              <Image source={logo} style={{ width: "125px", height: "90px" }} />
            </View>
          )}

          <View style={[styles.col40, styles.alignCenter]}>
            {companyChosenObj?.data?.name !== undefined &&
              companyChosenObj?.data?.name !== null &&
              companyChosenObj?.data?.name !== "" && (
                <Text style={[styles.h3, styles.lineHeightMain]}>
                  <b>{companyChosenObj?.data?.name || ""}</b>
                </Text>
              )}

            {companyChosenObj?.data?.address !== undefined &&
              companyChosenObj?.data?.address !== null &&
              companyChosenObj?.data?.address !== "" && (
                <Text style={[styles.h4, styles.lineHeightMain]}>
                  <b>{companyChosenObj?.data?.address || ""}</b>
                </Text>
              )}

            {companyChosenObj?.data?.contactNumber !== undefined &&
              companyChosenObj?.data?.contactNumber !== null &&
              companyChosenObj?.data?.contactNumber !== "" && (
                <Text style={[styles.h4, styles.lineHeightMain]}>
                  <b>{`Contact: ${
                    companyChosenObj?.data?.contactNumber || ""
                  }`}</b>
                </Text>
              )}
            {companyChosenObj?.data?.mobileNumber !== undefined &&
              companyChosenObj?.data?.mobileNumber !== null &&
              companyChosenObj?.data?.mobileNumber !== "" && (
                <Text style={[styles.h4, styles.lineHeightMain]}>
                  <b>{`Mobile: ${
                    companyChosenObj?.data?.mobileNumber || ""
                  }`}</b>
                </Text>
              )}
            {companyChosenObj?.data?.email !== undefined &&
              companyChosenObj?.data?.email !== null &&
              companyChosenObj?.data?.email !== "" && (
                <Text style={[styles.h4, styles.lineHeightMain]}>
                  <b>{`Email: ${companyChosenObj?.data?.email || ""}`}</b>
                </Text>
              )}
            {companyChosenObj?.data?.brn !== undefined &&
              companyChosenObj?.data?.brn !== null &&
              companyChosenObj?.data?.brn !== "" && (
                <Text style={[styles.h4, styles.lineHeightMain]}>
                  <b>{`BRN: ${companyChosenObj?.data?.brn || ""}`}</b>
                </Text>
              )}
            {companyChosenObj?.data?.tan !== undefined &&
              companyChosenObj?.data?.tan !== null &&
              companyChosenObj?.data?.tan !== "" && (
                <Text style={[styles.h4, styles.lineHeightMain]}>
                  <b>{`VAT: ${companyChosenObj?.data?.tan || ""}`}</b>
                </Text>
              )}
          </View>
          <View style={[styles.col30, styles.alignRight]}>
            <Text style={styles.h3} align="right">
              <b>
                {companyChosenObj &&
                companyChosenObj?.id ===
                  process.env.REACT_APP_CUSTOM_SOREFAN_ID &&
                invDetails?.docType === "invoice"
                  ? "VAT INVOICE"
                  : invDetails?.docTitle && invDetails?.docTitle !== ""
                  ? invDetails?.docTitle.toUpperCase()
                  : ""}
              </b>
            </Text>
          </View>
        </View>

        <View style={[styles.underline, styles.mb15]}></View>

        <View style={[styles.gridContainer, styles.mb15]}>
          <View style={[styles.col6]}>
            <View style={{ alignItems: "flex-start", flexDirection: "column" }}>
              <Text
                style={{
                  color: "#000",
                  fontSize: "12px",
                  lineHeight: 1.5,
                  fontWeight: 900,
                }}
              >
                <b>BILL TO{":  "}</b>
                {clientChosenObj?.data?.name !== undefined &&
                  clientChosenObj?.data?.name !== null &&
                  clientChosenObj?.data?.name !== "" && (
                    <span
                      style={{
                        color: "#000",
                        lineHeight: "normal",
                        fontSize: "12px",
                      }}
                    >
                      {clientChosenObj?.data?.name || ""}
                    </span>
                  )}
              </Text>
              {clientChosenObj?.data?.email !== undefined &&
                clientChosenObj?.data?.email !== null &&
                clientChosenObj?.data?.email !== "" && (
                  <Text style={[styles.h4, styles.lineHeightMain]}>
                    {`Email: ${clientChosenObj?.data?.email || ""}`}
                  </Text>
                )}
              {clientChosenObj?.data?.brn !== undefined &&
                clientChosenObj?.data?.brn !== null &&
                clientChosenObj?.data?.brn !== "" && (
                  <Text style={[styles.h4, styles.lineHeightMain]}>
                    {`BRN: ${clientChosenObj?.data?.brn || ""}`}
                  </Text>
                )}
              {clientChosenObj?.data?.tan !== undefined &&
                clientChosenObj?.data?.tan !== null &&
                clientChosenObj?.data?.tan !== "" && (
                  <Text style={[styles.h4, styles.lineHeightMain]}>
                    {`VAT: ${clientChosenObj?.data?.tan || ""}`}
                  </Text>
                )}
              {clientChosenObj?.data?.contactNumber !== undefined &&
                clientChosenObj?.data?.contactNumber !== null &&
                clientChosenObj?.data?.contactNumber !== "" && (
                  <Text style={[styles.h4, styles.lineHeightMain]}>
                    {`Contact: ${clientChosenObj?.data?.contactNumber || ""}`}
                  </Text>
                )}
              {clientChosenObj?.data?.mobileNumber !== undefined &&
                clientChosenObj?.data?.mobileNumber !== null &&
                clientChosenObj?.data?.mobileNumber !== "" && (
                  <Text style={[styles.h4, styles.lineHeightMain]}>
                    {`Mobile: ${clientChosenObj?.data?.mobileNumber || ""}`}
                  </Text>
                )}
            </View>
          </View>
          <View style={[styles.col6, styles.alignRight, styles.mb8]}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 10,
              }}
            >
              <View style={styles.col6}>
                <Text
                  style={{
                    color: "#000",
                    lineHeight: "normal",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    fontWeight: 900,
                  }}
                >
                  <b>Invoice Number:</b>
                </Text>
              </View>
              <View style={styles.col35}>
                <Text
                  style={{
                    paddingLeft: "12px",
                    color: "#000",
                    lineHeight: "normal",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  {(invDetails?.invoiceString !== undefined &&
                    invDetails?.invoiceString !== null &&
                    invDetails?.invoiceString) ||
                    ""}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 10,
              }}
            >
              <View style={styles.col6}>
                <Text
                  style={{
                    color: "#000",
                    lineHeight: "normal",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    fontWeight: 900,
                  }}
                >
                  <b>Date:</b>
                </Text>
              </View>
              <View style={styles.col35}>
                <Text
                  style={{
                    paddingLeft: "12px",
                    color: "#000",
                    lineHeight: "normal",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  {(invDetails?.invDate !== undefined &&
                    invDetails?.invDate !== null &&
                    invDetails?.invDate) ||
                    ""}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 10,
              }}
            >
              <View style={styles.col6}>
                <Text
                  style={{
                    color: "#000",
                    lineHeight: "normal",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    fontWeight: 900,
                  }}
                >
                  <b>
                    {companyChosenObj &&
                    companyChosenObj?.id ===
                      process.env.REACT_APP_CUSTOM_SOREFAN_ID
                      ? "Lorry number: "
                      : "Vehicle number: "}
                  </b>
                </Text>
              </View>
              <View style={styles.col35}>
                <Text
                  style={{
                    paddingLeft: "12px",
                    color: "#000",
                    lineHeight: "normal",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    textAlign: "left",
                  }}
                >
                  {(invDetails?.invVehicleNo !== undefined &&
                    invDetails?.invVehicleNo !== null &&
                    invDetails?.invVehicleNo) ||
                    ""}
                </Text>
              </View>
            </View>

            {companyChosenObj &&
              companyChosenObj?.id !==
                process.env.REACT_APP_CUSTOM_SOREFAN_ID && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <View style={styles.col6}>
                    <Text
                      style={{
                        color: "#000",
                        lineHeight: "normal",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        fontWeight: 900,
                      }}
                    >
                      Job Ref:
                    </Text>
                  </View>
                  <View style={styles.col35}>
                    <Text
                      style={{
                        paddingLeft: "12px",
                        color: "#000",
                        lineHeight: "normal",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                      }}
                    >
                      {(invDetails?.invJobRef !== undefined &&
                        invDetails?.invJobRef !== null &&
                        invDetails?.invJobRef) ||
                        ""}
                    </Text>
                  </View>
                </View>
              )}
          </View>
        </View>

        <View style={[styles.table, styles.mb15, styles.middleTableHeight]}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableCell_1_header, styles.alignLeft]}>
              <Text style={styles.subtitle2}>Particulars</Text>
            </View>
            <View style={[styles.tableCell_2, styles.alignCenter]}>
              <Text style={styles.subtitle2}>Description</Text>
            </View>
            <View style={[styles.tableCell_3_header, styles.alignRight]}>
              <Text style={styles.subtitle2}>{"Amount (Rs)"}</Text>
            </View>
          </View>

          {companyChosenObj.data?.documentTemplate === "transport" && (
            <View style={styles.tableBody}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell_1, styles.alignLeft]}>
                  <Text style={{ fontWeight: 900 }}>Transport fees</Text>
                </View>
                <View style={[styles.tableCell_2, styles.alignCenter]}>
                  <Text>{invDetails?.transportDesc || ""}</Text>
                </View>
                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>
                    <CurrencyFormat
                      value={Number(invDetails?.transportFees || 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </Text>
                </View>
              </View>
            </View>
          )}

          {invDetails?.invParticulars &&
            invDetails?.invParticulars?.length > 0 &&
            invDetails?.invParticulars.map((particular, index) => (
              <View style={styles.tableBody} key={index}>
                <View style={styles.tableRow}>
                  <View style={[styles.tableCell_1, styles.alignLeft]}>
                    <Text style={{ fontWeight: 900 }}>
                      {particular?.title || ""}
                    </Text>
                  </View>
                  <View style={[styles.tableCell_2, styles.alignCenter]}>
                    <Text>{particular?.customDetail || ""}</Text>
                    <Text>{particular?.selectedValue || ""}</Text>
                  </View>
                  <View style={[styles.tableCell_3, styles.alignRight]}>
                    <Text>
                      {companyChosenObj &&
                      (companyChosenObj?.id ===
                        process.env.REACT_APP_CUSTOM_ASHLEY_ID ||
                        companyChosenObj?.id ===
                          process.env.REACT_APP_CUSTOM_SOREFAN_ID ||
                        companyChosenObj?.id ===
                          process.env.REACT_APP_CUSTOM_FER_TO_SITE_WEB) ? (
                        ""
                      ) : (
                        <CurrencyFormat
                          value={Number(particular?.amount || 0).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

          {invDetails?.invParticulars &&
            invDetails?.invParticulars?.length < 10 &&
            [...Array(10 - Number(invDetails?.invParticulars?.length))].map(
              (x, i) => (
                <View style={styles.tableBody} key={i}>
                  <View style={styles.tableRow}>
                    <View
                      style={[
                        styles.tableCell_1,
                        styles.alignLeft,
                        styles.emptyCell,
                      ]}
                    />
                    <View
                      style={[
                        styles.tableCell_2,
                        styles.alignCenter,
                        styles.emptyCell,
                      ]}
                    />
                    <View
                      style={[
                        styles.tableCell_3,
                        styles.alignRight,
                        styles.emptyCell,
                      ]}
                    />
                  </View>
                </View>
              )
            )}
        </View>

        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View style={styles.col6}>
            <View style={[styles.alignLeft]}>
              <Text style={styles.footerTitle}>Notes / Terms</Text>
              <Text style={styles.footerTxt}>Bank Details</Text>
              <Text style={styles.footerTxt}>
                Beneficiary Name:{"  "}
                <span
                  style={{
                    fontWeight: 900,
                  }}
                >
                  {companyChosenObj?.data?.beneficiaryName || ""}
                </span>
              </Text>
              <Text style={styles.footerTxt}>
                Bank:{"  "}
                <span
                  style={{
                    fontWeight: 900,
                  }}
                >
                  {companyChosenObj?.data?.bankName || ""}
                </span>
              </Text>
              <Text style={styles.footerTxt}>
                Account Number:{"  "}
                <span
                  style={{
                    fontWeight: 900,
                  }}
                >
                  {companyChosenObj?.data?.bankAccNo || ""}
                </span>
              </Text>
            </View>
          </View>
          <View style={styles.col6}>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 30,
              }}
            >
              <View style={{ textAlign: "right" }}>
                <Text style={styles.subtitle2}>
                  {companyChosenObj?.id ===
                  process.env.REACT_APP_CUSTOM_ASHLEY_ID
                    ? "Gate Pass / Storage Fee: "
                    : "Storage Fee: "}
                </Text>
              </View>

              <View style={[styles.alignRight, styles.col30]}>
                <Text style={styles.body1}>
                  <CurrencyFormat
                    value={Number(invDetails?.invStorageFee || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rs "}
                  />
                </Text>
              </View>
            </View>

            {companyChosenObj?.id ===
            process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View style={{ textAlign: "right" }}>
                  <Text style={styles.subtitle2}>Gate Pass Fee: </Text>
                </View>

                <View style={[styles.alignRight, styles.col30]}>
                  <Text style={styles.body1}>
                    <CurrencyFormat
                      value={Number(invDetails?.invGatePassFee || 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rs "}
                    />
                  </Text>
                </View>
              </View>
            ) : (
              <View></View>
            )}

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                // marginTop: 30,
              }}
            >
              <View style={{ textAlign: "right" }}>
                <Text style={styles.subtitle2}>Scanning Fee: </Text>
              </View>

              <View style={[styles.alignRight, styles.col30]}>
                <Text style={styles.body1}>
                  <CurrencyFormat
                    value={Number(invDetails?.invScanningFee || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rs "}
                  />
                </Text>
              </View>
            </View>

            {companyChosenObj?.data?.vatPercentage !== undefined &&
              companyChosenObj?.data?.vatPercentage !== null &&
              Number(companyChosenObj?.data?.vatPercentage || 0) > 0 &&
              (invDetails.invApplyVat === undefined ||
                invDetails.invApplyVat) && (
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <View style={{ textAlign: "right" }}>
                    <Text style={styles.subtitle2}>
                      15% VAT on Transport Fee:{" "}
                    </Text>
                  </View>

                  <View style={[styles.alignRight, styles.col30]}>
                    <Text style={styles.body1}>
                      <CurrencyFormat
                        value={Number(invDetails?.invVatFee || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"Rs "}
                      />
                    </Text>
                  </View>
                </View>
              )}

            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 15,
              }}
            >
              <View style={{ textAlign: "right" }}>
                <Text style={styles.subtitle2}>Total (MUR):</Text>
              </View>
              <View style={[styles.alignRight, styles.col30]}>
                <Text style={styles.body1}>
                  <CurrencyFormat
                    value={Number(invDetails?.invTotal || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rs "}
                  />
                </Text>
              </View>
            </View>
          </View>
        </View>

        {sigImage !== undefined && sigImage !== null && sigImage !== "" && (
          <View style={[styles.gridContainer, styles.mt20]}>
            <Text style={[styles.subtitle2, styles.lineHeightMain]}>
              <b>Signature: </b>
            </Text>
          </View>
        )}

        {sigImage !== undefined && sigImage !== null && sigImage !== "" && (
          <View style={[styles.gridContainer, styles.mb15]}>
            <Image
              source={sigImage}
              style={{ width: "150px", height: "90px" }}
            />
          </View>
        )}
      </Page>
    </Document>
  );
}
