import { Page, View, Text, Image, Document } from "@react-pdf/renderer";
//
import styles from "./PdfStyle";
import CurrencyFormat from "react-currency-format";
import PropTypes from "prop-types";
import paidStamp from "../../images/paid.png";
import moment from "moment";

// ----------------------------------------------------------------------

InvFlexitransTemplatePdf.propTypes = {
  companyChosenObj: PropTypes.object,
  clientChosenObj: PropTypes.object,
  invDetails: PropTypes.object,
  logo: PropTypes.string,
  sigImage: PropTypes.string,
};

export default function InvFlexitransTemplatePdf({
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
          {/* <View
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
          </View> */}

          <View style={[styles.gridContainer, styles.mb8]}>
            {logo !== undefined && logo !== null && logo !== "" && (
              <View style={[styles.col60, styles.pr15, styles.pl15]}>
                <Image
                  source={logo}
                  style={{ width: "100%", height: "75px" }}
                />
              </View>
            )}

            <View style={[styles.col40, styles.alignCenter]}>
              {companyChosenObj?.data?.address ? (
                <Text style={styles.h5}>
                  <b>{companyChosenObj?.data?.address || ""}</b>
                </Text>
              ) : (
                <View></View>
              )}

              {companyChosenObj?.data?.contactNumber ? (
                <Text style={styles.h5}>
                  {"Tel: "}
                  {companyChosenObj?.data?.contactNumber || ""}
                </Text>
              ) : (
                <View></View>
              )}

              {companyChosenObj?.data?.mobileNumber ? (
                <Text style={styles.h5}>
                  {"Mob: "}
                  {companyChosenObj?.data?.mobileNumber || ""}
                </Text>
              ) : (
                <View></View>
              )}

              {companyChosenObj?.data?.email ? (
                <Text style={styles.h5}>
                  {companyChosenObj?.data?.email || ""}
                </Text>
              ) : (
                <View></View>
              )}

              {companyChosenObj?.data?.brn ? (
                <Text style={styles.h5}>
                  {"BRN: "}
                  {companyChosenObj?.data?.brn || ""}
                </Text>
              ) : (
                <View></View>
              )}

              {companyChosenObj?.data?.tan ? (
                <Text style={styles.h5}>
                  {"VAT: "}
                  {companyChosenObj?.data?.tan || ""}
                </Text>
              ) : (
                <View></View>
              )}
            </View>
          </View>

          <View
            style={[
              styles.gridContainer,
              styles.gridContainerMainTitle,
              styles.mb15,
            ]}
          >
            <View style={[styles.col12, styles.alignCenter]}>
              <Text style={styles.h5}>
                <b>
                  {invDetails?.docTitle && invDetails?.docTitle !== ""
                    ? invDetails?.docTitle.toUpperCase()
                    : ""}
                </b>
              </Text>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <View style={styles.col6}>
              <View style={[styles.gridContainer, styles.mb8]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>CONSIGNEE:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {clientChosenObj?.data?.name || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer, styles.mb8]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>ADDRESS:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {clientChosenObj?.data?.address || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer, styles.mb8]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>BRN NO:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {clientChosenObj?.data?.brn || ""}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.col6}>
              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>DATE:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.invDate || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>
                    {invDetails?.docTitle && invDetails?.docTitle !== ""
                      ? invDetails?.docTitle.toUpperCase()
                      : ""}
                    :
                  </Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>{`FLEX ${
                    invDetails?.invoiceString
                  } - ${moment(invDetails?.invDate, "DD-MM-YYYY").format(
                    "YYYY"
                  )}`}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <View style={styles.col6}>
              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>SHIPPER:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docShipper || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>CONTAINER NO:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docContainerNumber || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>VESSEL:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docVesselName || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>MARK & NOS:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docMarkNos || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>COMMODITY:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docCommodity || ""}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.col6}>
              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>HBL:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docHbl || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>VOLUME:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docVolume || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>GROSS WEIGHT:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docGrossWeight || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>PACKAGES:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docPackages || ""}
                  </Text>
                </View>
              </View>

              <View style={[styles.gridContainer]}>
                <View style={styles.col4}>
                  <Text style={[styles.h5]}>DEPOT:</Text>
                </View>
                <View style={styles.col8}>
                  <Text style={[styles.h5Normal]}>
                    {invDetails?.docDepot || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* <View style={[styles.gridContainer, styles.mb15]}>
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
          </View> */}

          <View>
            <View style={[styles.tableAutoWidth, styles.middleTableHeight]}>
              <View
                style={[
                  styles.rowNewTable,
                  styles.boldNewTable,
                  styles.headerNewTable,
                ]}
              >
                <Text style={styles.headerColumnDescription}>DETAILS</Text>
                <Text style={styles.headerColumn}>RATE</Text>
                <Text style={styles.headerColumn}>CUR</Text>
                <Text style={styles.headerColumn}>UNIT</Text>
                <Text style={styles.headerColumn}>GROSS TOTAL</Text>
                <Text style={styles.headerColumn}>VAT 15%</Text>
                <Text style={styles.headerColumn}>TOTAL MUR</Text>
              </View>

              {invDetails?.invParticulars &&
                invDetails?.invParticulars?.length > 0 &&
                invDetails?.invParticulars.map((particular, index) => (
                  <View style={styles.rowNewTable} key={index} wrap={true}>
                    <Text style={[styles.columnBold, styles.alignLeft]}>
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

              <View style={styles.rowNewTableNoBorder} wrap={true}>
                <Text
                  style={[
                    styles.summaryColumnNoBorderDescription,
                    styles.alignLeft,
                  ]}
                >
                  {""}
                </Text>
                <Text style={styles.summaryColumnNoBorder}>{""}</Text>
                <Text style={styles.summaryColumnNoBorder}>{""}</Text>
                <Text style={[styles.summaryColumn, styles.h5]}>TOTAL</Text>
                <Text style={styles.summaryColumnBottomRight}>
                  <CurrencyFormat
                    value={Number(invDetails?.invSubTotal || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
                <Text style={styles.summaryColumnBottomRight}>
                  <CurrencyFormat
                    value={Number(invDetails?.invVatFee || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
                <Text style={styles.summaryColumnBottomRight}>
                  <CurrencyFormat
                    value={Number(invDetails?.invTotal || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>

              {/* <View style={styles.summaryRow} wrap={true}>
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
              </View> */}
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
            <View style={[styles.col6, styles.mb15]}>
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

          <View
            style={[
              styles.gridContainer,
              styles.gridContainerMainTitle,
              styles.mb15,
            ]}
          >
            <View style={[styles.col12, styles.alignCenter]}>
              <Text style={styles.h5}>
                <b>THANK YOU FOR YOUR BUSINESS</b>
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
