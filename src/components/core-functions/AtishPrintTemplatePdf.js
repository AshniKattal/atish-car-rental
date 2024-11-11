import { Page, View, Text, Image } from "@react-pdf/renderer";
//
import styles from "./PdfStyle";

import vehicleInspectionPng from "./atish-image/vehicleInspection.png";
import fuelInspectionPng from "./atish-image/fuelInspection.png";
import logoImg from "./atish-image/Logo.png";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// ----------------------------------------------------------------------

export default function AtishPrintTemplatePdf() {
  const verificationList = [
    "Front lights / Faux avant",
    "Rear lights / Faux arrière",
    "Antenna / Antenna",
    "Toolkits / Outils",
    "Spare wheels / Roues de secours",
    "Wheel disc / Enjoliveur",
    "Jack / Crique",
    "Triangular reflector / Réflecteur triangulaire",
    "Exterior mirror / Rétroviseur éxterieur",
    "Windscreen / Pare-brise",
    "GPS",
    "Car seat / Siège bébé",
    "Radio",
    "Seats / Sièges",
  ];

  return (
    <Page size="A4" style={styles.page} wrap={false}>
      {/*      {invDetails?.docType &&
        (invDetails?.docType === "invoice" ||
          invDetails?.docType === "vat_invoice") &&
        invDetails?.paymentStatus &&
        invDetails?.paymentStatus === "Paid" ? (
          <View style={styles.background}>
            <Image source={paidStamp} style={styles.stampCss} />
          </View>
        ) : (
          <View />
        )} */}

      <View
        style={[
          styles.gridContainer,
          //styles.gridContainerMainTitle,
          styles.mb15,
        ]}
      >
        <View style={styles.col6}>
          <Image
            source={logoImg}
            style={{
              width: "190px",
              height: "80px",
              backgroundSize: "cover",
              paddingRight: "10px",
            }}
          />
          {/* <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={logoImg}
              style={{
                width: "40px",
                height: "20px",
                backgroundSize: "cover",
                paddingRight: "10px",
              }}
            />
            <Text style={styles.h3}>
              <b>Reaching Heights Ltd</b>
            </Text>
          </View> */}
        </View>
        <View style={[styles.col6, styles.alignRight]}>
          <Text style={styles.h3} align="right">
            <b>VEHICLE INSPECTION SHEET</b>
          </Text>
        </View>
      </View>

      <View style={[styles.gridContainer, styles.mb30]}>
        <View style={[styles.col40, styles.alignCenter]}>
          <Text style={styles.h4}>DELIVERY / LIVRAISON</Text>
          <Image
            source={vehicleInspectionPng}
            style={{
              width: "auto",
              height: "235px",
              backgroundSize: "cover",
            }}
          />
          <Text style={styles.h4}>ODO OUT:</Text>
        </View>
        <View style={[styles.col20, styles.alignCenter]}>
          <Text>D = Dents / Coups</Text>
          <Text>S = Scratch / Rayure</Text>
          <Text>R = Rust / Rouille</Text>
          <Text>M = Missing / Manquant</Text>

          <Image
            source={fuelInspectionPng}
            style={{
              width: "60px",
              height: "100px",
              backgroundSize: "cover",
              position: "absolute",
              bottom: 0,
              alignSelf: "center",
            }}
          />
        </View>
        <View style={[styles.col40, styles.alignCenter]}>
          <Text style={styles.h4} align="right">
            COLLECTION / REPRISE
          </Text>
          <Image
            source={vehicleInspectionPng}
            style={{
              width: "auto",
              height: "235px",
              backgroundSize: "cover",
            }}
          />
          <Text style={styles.h4}>ODO IN:</Text>
        </View>
      </View>

      <View>
        <View>
          <Text style={styles.h4}>REMARKS:</Text>
        </View>
        <View style={[styles.gridContainer, styles.mb8]}>
          <View style={[styles.tableAutoWidth, styles.mb8, styles.tableNew]}>
            {/*  <View
              style={[
                styles.rowNewTable,
                styles.boldNewTable,
                styles.headerNewTable,
              ]}
            >
              <Text style={styles.headerColumnDescription}>
                Details of damaged and/or missing parts{"\n"}
                Détails des pièces endommagées et/ou manquantes{"\n"}
              </Text>
              <Text style={[styles.headerColumn, styles.mergedColSpan]}>
                VERIFICATION
              </Text>
              <Text style={styles.headerColumnDescription}>
                Details of damaged and/or missing parts{"\n"}
                Détails des pièces endommagées et/ou manquantes{"\n"}
              </Text>
            </View> */}

            <View
              style={[
                styles.headerNewTable,
                { flexDirection: "row", height: "200px" },
              ]}
              wrap={true}
            >
              <Text style={[styles.column]}>{""}</Text>
            </View>

            {/* {verificationList?.map((verification, index) => {
              if (index === verificationList?.length - 2) {
                return (
                  <View
                    style={{ flexDirection: "row" }}
                    wrap={true}
                    key={index}
                  >
                    <Text style={[styles.column25]}>AGENT:</Text>
                    <Text style={[styles.column]}>{""}</Text>
                    <Text style={[styles.column75]}>{verification}</Text>
                    <Text style={[styles.column]}>{""}</Text>
                    <Text style={[styles.column25]}>AGENT:</Text>
                  </View>
                );
              } else
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottom:
                        index === verificationList?.length - 1
                          ? "0.5px solid #000"
                          : undefined,
                    }}
                    wrap={true}
                    key={index}
                  >
                    <Text style={[styles.column25]}>{""}</Text>
                    <Text style={[styles.column]}>{""}</Text>
                    <Text style={[styles.column75]}>{verification}</Text>
                    <Text style={[styles.column]}>{""}</Text>
                    <Text style={[styles.column25]}>{""}</Text>
                  </View>
                );
            })} */}
          </View>
        </View>
      </View>

      <View style={[styles.gridContainer, styles.mb8]}>
        <View style={[styles.col12, styles.alignCenter]}>
          <Text style={styles.h6}>
            <b>
              I have inspected the vehicle and agree the only damage is what is
              listed in the above checklist.
            </b>
          </Text>
          <Text style={styles.h6}>
            <b>
              J'ai inspecté le véhicule et reconnais que les seuls dommages sont
              ceux indiqués sur la liste d'inspection ci-dessus.
            </b>
          </Text>
        </View>
      </View>

      <View style={[styles.gridContainer, styles.mb8]}>
        <View style={[styles.tableAutoWidth, styles.mb8, styles.tableNew]}>
          <View style={styles.rowNewTableSignature} wrap={true}>
            <View style={[styles.columnSignature]}>
              <Text>
                <b>Name / Nom & Signature</b>
              </Text>
            </View>
            <View style={[styles.columnSignature]}>
              <Text>
                <b>Name / Nom & Signature</b>
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/*  <View style={[styles.gridContainer]}>
            <View style={styles.col8}>
              {companyChosenObj &&
              companyChosenObj?.data &&
              companyChosenObj?.data?.brn ? (
                <Text style={{ fontSize: "10px" }}>
                  <span style={styles.body3Bold}>BRN: </span>
                  {`${companyChosenObj?.data?.brn || ""}`}
                </Text>
              ) : (
                <View />
              )}

              {companyChosenObj &&
              companyChosenObj?.data &&
              companyChosenObj?.data?.tan ? (
                <Text style={{ fontSize: "10px" }}>
                  <span style={styles.body3Bold}>VAT: </span>
                  {`Vat${companyChosenObj?.data?.tan}`}
                </Text>
              ) : (
                <View />
              )}

              {companyChosenObj &&
              companyChosenObj?.data &&
              companyChosenObj?.data?.address ? (
                <Text style={{ fontSize: "10px" }}>
                  <span style={styles.body3Bold}>Address: </span>
                  {companyChosenObj?.data?.address || ""}
                </Text>
              ) : (
                <View />
              )}

              {companyChosenObj &&
              companyChosenObj?.data &&
              (companyChosenObj?.data?.contactNumber ||
                companyChosenObj?.data?.mobileNumber) ? (
                <Text style={{ fontSize: "10px" }}>
                  <span style={styles.body3Bold}>Tel: </span>
                  {companyChosenObj?.data?.contactNumber || ""}{" "}
                  {companyChosenObj?.data?.mobileNumber
                    ? `/ ${companyChosenObj?.data?.mobileNumber}`
                    : ""}
                </Text>
              ) : (
                <View />
              )}

              {companyChosenObj &&
              companyChosenObj?.data &&
              companyChosenObj?.data?.email ? (
                <Text style={{ fontSize: "10px" }}>
                  <span style={styles.body3Bold}>Email: </span>
                  {companyChosenObj?.data?.email || ""}
                </Text>
              ) : (
                <View />
              )}
            </View>

            {logo !== undefined && logo !== null && logo !== "" ? (
              <View style={[styles.col4, styles.imageContainer, styles.mb8]}>
                <Image
                  source={logo}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                  }}
                />
              </View>
            ) : (
              <View />
            )}
          </View>

          <View style={[styles.gridContainer, styles.mb8]}>
            <View style={styles.col35}>
              <Text style={styles.body3Bold}>Bill To: </Text>

              {invDetails && invDetails?.docBillTo ? (
                <Text style={{ fontSize: "10px" }}>
                  {invDetails?.docBillTo || ""}
                </Text>
              ) : (
                <View />
              )}

              {!invDetails.docBillTo && (
                <Text style={{ fontSize: "10px" }}>{`Vat no: Vat${
                  clientChosenObj?.data?.tan || ""
                }`}</Text>
              )}

              {!invDetails.docBillTo && (
                <Text style={{ fontSize: "10px" }}>{`BRN: ${
                  clientChosenObj?.data?.brn || ""
                }`}</Text>
              )}
            </View>

            <View style={styles.col30}>
              <Text style={styles.body3Bold}>Location: </Text>

              <Text style={{ fontSize: "10px" }}>
                {invDetails?.docShipTo || ""}
              </Text>
            </View>

            <View style={styles.col35}>
              <View style={styles.gridContainer}>
                <View style={styles.col6}>
                  <Text style={styles.body3Bold}>{`${
                    invDetails?.docTitle || ""
                  } #:`}</Text>
                </View>
                <View style={[styles.col6, styles.alignRight]}>
                  <Text style={{ fontSize: "10px" }}>
                    {invDetails?.invoiceString !== undefined &&
                    invDetails?.invoiceString !== null
                      ? invDetails?.invoiceString
                      : ""}
                  </Text>
                </View>
              </View>

              <View style={styles.gridContainer}>
                <View style={styles.col6}>
                  <Text style={styles.body3Bold}>Date</Text>
                </View>
                <View style={[styles.col6, styles.alignRight]}>
                  <Text style={{ fontSize: "10px" }}>
                    {(invDetails?.invDate !== undefined &&
                      invDetails?.invDate !== null &&
                      invDetails?.invDate) ||
                      ""}
                  </Text>
                </View>
              </View>

              {invDetails && invDetails.docQuoteNumber ? (
                <View style={styles.gridContainer}>
                  <View style={styles.col6}>
                    <Text style={styles.body3Bold}>Quotation #:</Text>
                  </View>
                  <View style={[styles.col6, styles.alignRight]}>
                    <Text style={{ fontSize: "10px" }}>
                      {invDetails?.docQuoteNumber || ""}
                    </Text>
                  </View>
                </View>
              ) : (
                <View />
              )}

              {invDetails && invDetails.docPurchaseOrderNumber ? (
                <View style={styles.gridContainer}>
                  <View style={styles.col6}>
                    <Text style={styles.body3Bold}>P.O. #:</Text>
                  </View>
                  <View style={[styles.col6, styles.alignRight]}>
                    <Text style={{ fontSize: "10px" }}>
                      {invDetails?.docPurchaseOrderNumber || ""}
                    </Text>
                  </View>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>

          {customTemplate1 ? (
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
                <Text style={styles.body3}>
                  {invDetails?.docBLNumber || ""}
                </Text>
                <Text style={styles.body3}>
                  {invDetails?.docSupplier || ""}
                </Text>
                <Text style={styles.body3}>
                  {invDetails?.docContainerNumber || ""}
                </Text>
                <Text style={styles.body3}>
                  {invDetails?.docPackages || ""}
                </Text>
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
          ) : (
            <View />
          )}

          <View>
            <View
              style={[
                styles.tableAutoWidth,
                // styles.middleTableHeight,
                styles.mb8,
              ]}
            >
              {customTemplate1 || newTemplate ? (
                <View
                  style={[
                    styles.rowNewTable,
                    styles.boldNewTable,
                    styles.headerNewTable,
                  ]}
                >
                  <Text style={styles.headerColumnDescription}>
                    DESCRIPTION
                  </Text>
                  <Text style={styles.headerColumn}>UNIT PRICE</Text>
                  <Text style={styles.headerColumn}>QUANTITY</Text>
                  <Text style={styles.headerColumn}>AMOUNT</Text>
                  <Text style={styles.headerColumn}>DISCOUNT</Text>
                  <Text style={styles.headerColumn}>DISCOUNTED AMT</Text>
                  <Text style={styles.headerColumn}>VAT</Text>
                  <Text style={styles.headerColumn}>TOTAL</Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.rowNewTable,
                    styles.boldNewTable,
                    styles.headerNewTable,
                  ]}
                >
                  <Text style={styles.headerColumn1}>QTY</Text>
                  <Text style={styles.headerColumn2}>DESCRIPTION</Text>
                  <Text style={styles.headerColumn3}>UNIT PRICE</Text>
                  <Text style={styles.headerColumn4}>AMOUNT</Text>
                </View>
              )}

              {invDetails?.invParticulars &&
                invDetails?.invParticulars?.length > 0 &&
                invDetails?.invParticulars.map((particular, index) => (
                  <View style={styles.rowNewTable} key={index} wrap={true}>
                    {customTemplate1 || newTemplate ? (
                      <>
                        <Text style={styles.columnDescription}>
                          {particular?.rowDescription || ""}
                        </Text>
                        <Text style={styles.column}>
                          <CurrencyFormat
                            value={Number(
                              particular?.rowUnitPrice || 0
                            ).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                        <Text style={styles.column}>
                          {particular?.rowQty || ""}
                        </Text>
                        <Text style={styles.column}>
                          <CurrencyFormat
                            value={Number(particular?.rowAmount || 0).toFixed(
                              2
                            )}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                        <Text style={styles.column}>
                          <CurrencyFormat
                            value={Number(
                              particular?.rowDiscountAmount || 0
                            ).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                        <Text style={styles.column}>
                          <CurrencyFormat
                            value={Number(
                              particular?.rowDiscountedAmount || 0
                            ).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                        <Text style={styles.column}>
                          <CurrencyFormat
                            value={Number(
                              particular?.rowVatAmount || 0
                            ).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                        <Text style={styles.column}>
                          <CurrencyFormat
                            value={Number(
                              particular?.rowTotalAmount || 0
                            ).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.column1}>
                          {particular?.rowQty || ""}
                        </Text>
                        <Text style={styles.column2}>
                          {particular?.rowDescription || ""}
                        </Text>
                        <Text style={styles.column3}>
                          <CurrencyFormat
                            value={Number(
                              particular?.rowUnitPrice || 0
                            ).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                        <Text style={styles.column4}>
                          <CurrencyFormat
                            value={Number(particular?.rowAmount || 0).toFixed(
                              2
                            )}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </Text>
                      </>
                    )}
                  </View>
                ))}
            </View>
          </View>

          {customTemplate1 || newTemplate ? (
            <View style={styles.gridContainer}>
              <View style={styles.col6}>
                {qrCodeUri !== undefined &&
                  qrCodeUri !== null &&
                  qrCodeUri !== "" && (
                    <View style={[styles.gridContainer, styles.mb8]}>
                      <Image
                        source={qrCodeUri}
                        style={{ width: "150px", height: "150px" }}
                      />
                    </View>
                  )}
              </View>
              <View style={styles.col6}>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <View
                    style={[styles.rowNewTableSummary, styles.alignRight]}
                    wrap={true}
                  >
                    <Text style={styles.customSummaryColumnTopLeft}>
                      Subtotal
                    </Text>
                    <Text style={styles.customSummaryColumnTopRight}>
                      <CurrencyFormat
                        value={Number(invDetails?.invSubTotal || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                  </View>

                  <View
                    style={[styles.rowNewTableSummary, styles.alignRight]}
                    wrap={true}
                  >
                    <Text style={styles.customSummaryColumnTopLeft}>
                      Discount
                    </Text>
                    <Text style={styles.customSummaryColumnTopRight}>
                      <CurrencyFormat
                        value={Number(
                          invDetails?.discountTotalAmount || 0
                        ).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                  </View>

                  <View
                    style={[styles.rowNewTableSummary, styles.alignRight]}
                    wrap={true}
                  >
                    <Text style={styles.customSummaryColumnTopLeft}>
                      Discounted Amount
                    </Text>
                    <Text style={styles.customSummaryColumnTopRight}>
                      <CurrencyFormat
                        value={Number(
                          invDetails?.discountedTotalAmount || 0
                        ).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                  </View>

                  <View
                    style={[styles.rowNewTableSummary, styles.alignRight]}
                    wrap={true}
                  >
                    <Text style={styles.customSummaryColumnTopLeft}>VAT</Text>
                    <Text style={styles.customSummaryColumnTopRight}>
                      <CurrencyFormat
                        value={Number(invDetails?.invVatFee || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                  </View>

                  <View
                    style={[styles.rowNewTableSummary, styles.alignRight]}
                    wrap={true}
                  >
                    <Text style={styles.customSummaryColumnBottomLeft}>
                      Total
                    </Text>
                    <Text style={styles.customSummaryColumnBottomRight}>
                      <CurrencyFormat
                        value={Number(invDetails?.invTotal || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.summaryRow} wrap={true}>
                <Text style={styles.summaryColum1}></Text>
                <Text style={styles.summaryColum2}></Text>
                <Text style={styles.summaryColum3}>Subtotal</Text>
                <Text style={styles.summaryColum4}>
                  <CurrencyFormat
                    value={Number(invDetails?.invSubTotal || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>

              <View style={styles.summaryRow} wrap={true}>
                <Text style={styles.summaryColum1}></Text>
                <Text style={styles.summaryColum2}></Text>
                <Text style={styles.summaryColum3}>Vat 15.0 %</Text>
                <Text style={styles.summaryColum4}>
                  <CurrencyFormat
                    value={Number(invDetails?.invVatFee || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </Text>
              </View>

              <View style={styles.summaryRow} wrap={true}>
                <Text style={styles.summaryColum1}></Text>
                <Text style={styles.summaryColum2}></Text>
                <Text style={styles.column3Total}>TOTAL</Text>
                <Text style={styles.column4Total}>
                  <CurrencyFormat
                    value={Number(invDetails?.invTotal || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix="Rs "
                  />
                </Text>
              </View>
            </>
          )}

          <View style={styles.mb8}>
            <Text style={styles.body3Bold}>Terms and conditions</Text>
            <Text style={{ fontSize: "10px" }}>
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
            <View style={[styles.gridContainer, styles.mb8]}>
              <Image
                source={sigImage}
                style={{ width: "150px", height: "90px" }}
              />
            </View>
          )} */}
    </Page>
  );
}
