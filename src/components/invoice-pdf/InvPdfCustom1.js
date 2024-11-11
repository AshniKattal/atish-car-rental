import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
//
import styles from "./PdfStyle";
import CurrencyFormat from "react-currency-format";
import PropTypes from "prop-types";
import paidStamp from "../images/paid.png";

// ----------------------------------------------------------------------

InvPdfCustom1.propTypes = {
  companyChosenObj: PropTypes.object,
  clientChosenObj: PropTypes.object,
  invDetails: PropTypes.object,
  logo: PropTypes.string,
  sigImage: PropTypes.string,
};

export default function InvPdfCustom1({
  companyChosenObj,
  clientChosenObj,
  invDetails,
  logo,
  sigImage,
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {invDetails?.docType &&
        (invDetails?.docType === "invoice" ||
          invDetails?.docType === "vat_invoice") &&
        invDetails?.paymentStatus &&
        invDetails?.paymentStatus === "Paid" ? (
          <Image source={paidStamp} style={styles.background} />
        ) : (
          <View></View>
        )}

        <View>
          <View
            style={[
              styles.gridContainer,
              styles.gridContainerMainTitle,
              styles.mb15,
            ]}
          >
            <View style={styles.col6}>
              <Text style={styles.h3}>
                <b>{companyChosenObj?.data?.name || ""}</b>
              </Text>
            </View>
            <View style={[styles.col6, styles.alignRight]}>
              <Text style={styles.h3} align="right">
                <b>
                  {invDetails?.docTitle && invDetails?.docTitle !== ""
                    ? invDetails?.docTitle.toUpperCase()
                    : ""}
                </b>
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            {logo !== undefined && logo !== null && logo !== "" && (
              <View style={[styles.col6, styles.imageContainer]}>
                <Image
                  source={logo}
                  style={{ width: "125px", height: "50px" }}
                />
              </View>
            )}

            <View style={[styles.col6]}>
              <Text style={styles.body3}>
                {"Tel: "}
                {companyChosenObj?.data?.contactNumber || ""}
              </Text>

              <Text style={styles.body3}>
                {"Mob: "}
                {companyChosenObj?.data?.mobileNumber
                  ? `${companyChosenObj?.data?.mobileNumber}`
                  : ""}
              </Text>

              <Text style={styles.body3}>
                {"Email: "}
                {companyChosenObj?.data?.email
                  ? `${companyChosenObj?.data?.email}`
                  : ""}
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={styles.col6}>
              <Text style={styles.h6}>Bill To: </Text>
              {invDetails.docBillTo && (
                <Text style={styles.body3}>{invDetails?.docBillTo || ""}</Text>
              )}
              {!invDetails.docBillTo && (
                <Text style={styles.body3}>{`${
                  clientChosenObj?.data?.address || ""
                }`}</Text>
              )}
              {!invDetails.docBillTo && (
                <Text style={styles.body3}>{`Vat no: Vat${
                  clientChosenObj?.data?.tan || ""
                }`}</Text>
              )}
              {!invDetails.docBillTo && (
                <Text style={styles.body3}>{`BRN: ${
                  clientChosenObj?.data?.brn || ""
                }`}</Text>
              )}
            </View>

            <View style={styles.col6}>
              <Text style={styles.h6}>From: </Text>
              <Text style={styles.body3Bold}>
                {companyChosenObj?.data?.name || ""}
              </Text>
              <Text style={styles.body3}>
                {companyChosenObj?.data?.address || ""}
              </Text>
              {!companyChosenObj?.data?.tan && (
                <Text style={styles.body3}>{`Vat no: Vat${
                  companyChosenObj?.data?.tan || ""
                }`}</Text>
              )}
              {!companyChosenObj?.data?.brn && (
                <Text style={styles.body3}>{`BRN: ${
                  companyChosenObj?.data?.brn || ""
                }`}</Text>
              )}
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={styles.col4}>
              <Text style={styles.body3}>
                <span style={styles.body3Bold}>Date: </span>
                {` ${
                  (invDetails?.invDate !== undefined &&
                    invDetails?.invDate !== null &&
                    invDetails?.invDate) ||
                  ""
                }`}
              </Text>
            </View>
            <View style={styles.col8}></View>
            <View style={styles.col4}>
              <Text style={styles.body3}>
                <span style={styles.body3Bold}>INV NUM: </span>
                {` ${
                  invDetails?.invoiceString !== undefined &&
                  invDetails?.invoiceString !== null
                    ? invDetails?.invoiceString
                    : ""
                }`}
              </Text>

              {invDetails && invDetails.docQuoteNumber ? (
                <Text style={styles.body3}>
                  <span style={styles.body3Bold}>Quotation #: </span>
                  {` ${invDetails?.docQuoteNumber || ""}`}
                </Text>
              ) : (
                <View />
              )}

              {invDetails && invDetails.docQuoteNumber ? (
                <Text style={styles.body3}>
                  <span style={styles.body3Bold}>P.O. #: </span>
                  {` ${invDetails?.docPurchaseOrderNumber || ""}`}
                </Text>
              ) : (
                <View />
              )}
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb15]}>
            <View style={styles.col20}>
              <Text style={styles.body3Bold}>BL Number</Text>
              <Text style={styles.body3Bold}>Supplier</Text>
              <Text style={styles.body3Bold}>Container Number</Text>
              <Text style={styles.body3Bold}>Packages</Text>
              <Text style={styles.body3Bold}>Description</Text>
              <Text style={styles.body3Bold}>Gross Weight</Text>
              <Text style={styles.body3Bold}>Volume</Text>
              <Text style={styles.body3Bold}>Port Of Loading</Text>
            </View>
            <View style={styles.col30}>
              <Text style={styles.body3}>{invDetails?.docBLNumber || ""}</Text>
              <Text style={styles.body3}>{invDetails?.docSupplier || ""}</Text>
              <Text style={styles.body3}>
                {invDetails?.docContainerNumber || ""}
              </Text>
              <Text style={styles.body3}>{invDetails?.docPackages || ""}</Text>
              <Text style={styles.body3}>
                {invDetails?.docDescription || ""}
              </Text>
              <Text style={styles.body3}>
                {invDetails?.docGrossWeight || ""}
              </Text>
              <Text style={styles.body3}>{invDetails?.docVolume || ""}</Text>
              <Text style={styles.body3}>
                {invDetails?.docPortOfLoading || ""}
              </Text>
            </View>
            <View style={styles.col20}>
              <Text style={styles.body3Bold}>ETA</Text>
              <Text style={styles.body3Bold}>Vessel Name</Text>
              <Text style={styles.body3Bold}>RoE</Text>
              <Text style={styles.body3Bold}>Place Of Landing</Text>
            </View>
            <View style={styles.col30}>
              <Text style={styles.body3}>{invDetails?.docETA || ""}</Text>
              <Text style={styles.body3}>
                {invDetails?.docVesselName || ""}
              </Text>
              <Text style={styles.body3}>{invDetails?.docRoE || ""}</Text>
              <Text style={styles.body3}>
                {invDetails?.docPlaceOfLanding || ""}
              </Text>
            </View>
          </View>

          <View>
            <View style={[styles.tableAutoWidth, styles.middleTableHeight]}>
              <View
                style={[
                  styles.rowNewTable,
                  styles.boldNewTable,
                  styles.headerNewTable,
                ]}
              >
                <Text style={styles.headerColumn}>DETAILS</Text>
                <Text style={styles.headerColumn}>CHARGEABLE</Text>
                <Text style={styles.headerColumn}>CURRENCY</Text>
                <Text style={styles.headerColumn}>UNIT</Text>
                <Text style={styles.headerColumn}>AMOUNT MUR</Text>
                <Text style={styles.headerColumn}>VAT</Text>
                <Text style={styles.headerColumn}>TOTAL MUR</Text>
              </View>

              {invDetails?.invParticulars &&
                invDetails?.invParticulars?.length > 0 &&
                invDetails?.invParticulars.map((particular, index) => (
                  <View style={styles.rowNewTable} key={index} wrap={true}>
                    <Text style={styles.column}>
                      {particular?.rowDescription || ""}
                    </Text>
                    <Text style={styles.column}>
                      <CurrencyFormat
                        value={Number(particular?.rowUnitPrice || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                    <Text style={styles.column}>{"MUR"}</Text>
                    <Text style={styles.column}>
                      {particular?.rowQty || ""}
                    </Text>
                    <Text style={styles.column}>
                      <CurrencyFormat
                        value={Number(particular?.rowAmount || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                    <Text style={styles.column}>
                      <CurrencyFormat
                        value={Number(particular?.rowVatAmount || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                    <Text style={styles.column}>
                      <CurrencyFormat
                        value={Number(particular?.rowTotalAmount || 0).toFixed(
                          2
                        )}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                  </View>
                ))}

              <View style={styles.summaryRow} wrap={true}>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnRightBorder}>Subtotal</Text>
                <Text style={styles.summaryColumn}>
                  <CurrencyFormat
                    value={Number(invDetails?.invSubTotal || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.summaryRow} wrap={true}>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnRightBorder}>Total VAT</Text>
                <Text style={styles.summaryColumn}>
                  <CurrencyFormat
                    value={Number(invDetails?.invVatFee || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
              <View style={styles.summaryRow} wrap={true}>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnNoBorder}></Text>
                <Text style={styles.summaryColumnRightBorder}>
                  Total Amount
                </Text>
                <Text style={styles.summaryColumn}>
                  <CurrencyFormat
                    value={Number(invDetails?.invTotal || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.mb15}>
            <Text style={styles.subtitle2}>Terms and conditions</Text>
            <Text style={styles.body3}>
              {invDetails?.docTermsAndCondition || ""}
            </Text>
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
                <Text style={styles.footerTitle}>Bank details</Text>
                <Text style={styles.footerTxt}>
                  Beneficiary name:{"  "}
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
                  Account number:{"  "}
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
        </View>
      </Page>
    </Document>
  );
}
