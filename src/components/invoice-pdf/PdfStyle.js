import { Font, StyleSheet } from "@react-pdf/renderer";

// ----------------------------------------------------------------------

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/Roboto-Regular.ttf" },
    { src: "/fonts/Roboto-Bold.ttf", fontWeight: 900 },
  ],
});

const styles = StyleSheet.create({
  emptyCell: { height: 16 },
  lineHeightMain: { lineHeight: 1.5 },
  col15: { width: "15%" },
  col20: { width: "20%" },
  col4: { width: "25%" },
  col30: { width: "30%" },
  col35: { width: "35%" },
  col40: { width: "40%" },
  col6: { width: "50%" },
  col8: { width: "75%" },
  mb8: { marginBottom: 8 },
  mb10: { marginBottom: 10 },
  mb15: { marginBottom: 15 },
  mb30: { marginBottom: 30 },
  mb40: { marginBottom: 40 },
  mb60: { marginBottom: 60 },
  mt20: { marginTop: 20 },
  mt40: { marginTop: 40 },
  pb4: { paddingBottom: 4 },
  pt4: { paddingTop: 4 },
  main_title_payslip: { fontSize: 12, fontWeight: 900 },
  underline: {
    width: "100%",
    borderBottom: "1px solid #dcdcdc",
    paddingTop: "2em",
    paddingBottom: "2em",
  },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 900,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  h3: {
    fontSize: "14px",
    lineHeight: "normal",
    fontWeight: 900,
  },
  h4: {
    color: "#878787",
    lineHeight: "normal",
    fontSize: "12px" /*  marginTop: '-12px' */,
  },
  h5: {
    fontSize: "11px",
    fontWeight: "bold",
    lineHeight: "2px",
  },
  h6: {
    fontSize: "10px",
    fontWeight: "bold",
    textDecoration: "underline",
  },
  body2: {
    fontSize: "11px",
    lineHeight: "2px",
  },
  body3: {
    fontSize: "10px",
  },
  body3Bold: {
    fontSize: "10px",
    fontWeight: "bold",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "125px",
    height: "125px",
  },

  imageContainerCustomBugsBeGone: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "125px",
    height: "125px",
  },
  imageContainerCustomSmartPromote: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "125px",
    height: "40px",
    marginTop: 10,
  },

  body1: { fcolor: "#000", lineHeight: "normal", fontSize: "12px" },
  body1_bold: {
    color: "#000",
    lineHeight: "normal",
    fontSize: "9px",
    fontWeight: 900,
  },
  subtitle2: { fontSize: "12px", fontWeight: 900 },
  alignRight: { textAlign: "right" },
  alignCenter: { textAlign: "center" },
  alignLeft: { textAlign: "left" },
  page: {
    width: "100%",
    padding: "20px 20px 20px 20px",
    fontSize: 9,
    lineHeight: 1.4,
    fontFamily: "Roboto",
    // backgroundColor: "#fff",
    textTransform: "none",
    position: "relative",
  },
  background: {
    position: "absolute",
    top: "375px",
    left: "15%",
    opacity: 0.2, // Adjust opacity here
    zIndex: 9999999,
  },
  stampCss: {
    width: "400px",
    height: "200px",
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: "auto",
    borderTopWidth: 1,
    borderStyle: "solid",
    position: "absolute",
    borderColor: "#DFE3E8",
  },
  gridContainerMainTitle: {
    backgroundColor: "#3574C5",
    alignItems: "center",
    height: "25px",
    color: "#ffffff",
    padding: "15px",
    fontWeight: "bold",
  },
  gridContainerMainTitleCustomSmartPromote: {
    backgroundColor: "#114870",
    alignItems: "center",
    height: "25px",
    color: "#ffffff",
    padding: "15px",
    fontWeight: "bold",
  },

  gridContainer: { width: "100%", flexDirection: "row" },
  gridContainer_align_right: { justifyContent: "flex-end" },
  table: { display: "flex", width: "100%" },
  middleTableHeight: { minHeight: "300px" },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    zIndex: 100,
  },
  tableRow_header: {
    background: "#74a1c9",
  },
  tableRow: {
    display: "flex",
    width: "100%",
    // padding: "3px",
    /* padding: '8px 0', */
    flexDirection: "row",
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderStyle: "solid",
    // borderColor: "#DFE3E8",
  },
  tableRowSummary: {
    width: "40%",
    padding: "3px",
    /* padding: '8px 0', */
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#DFE3E8",
  },

  tableRowSummaryGreyBorder: {
    width: "40%",
    padding: "3px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTop: "1px solid #dcdcdc",
    borderBottom: "1px solid #dcdcdc",
  },
  borderline: {
    width: "35%",
    border: "1px solid #dcdcdc",
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  greyBorder: {
    borderBottom: "1px solid #dcdcdc",
    borderTop: "1px solid #dcdcdc",
  },
  tableCell_1_header: {
    minHeight: "27px",
    width: "15%",
    color: "#000",
    fontSize: "10px",
    padding: "5px",
    fontWeight: 900,
    borderTop: "0.5px solid black",
    borderLeft: "0.5px solid black",
    borderBottom: "0.5px solid black",
  },
  tableCell_2_header: {
    minHeight: "27px",
    width: "50%",
    color: "#000",
    fontSize: "10px",
    padding: "5px",
    fontWeight: 900,
    borderTop: "0.5px solid black",
    borderLeft: "0.5px solid black",
    borderBottom: "0.5px solid black",
  },
  tableCell_3_header: {
    minHeight: "27px",
    width: "25%",
    color: "#000",
    fontSize: "10px",
    padding: "5px",
    fontWeight: 900,
    borderTop: "0.5px solid black",
    borderLeft: "0.5px solid black",
    borderBottom: "0.5px solid black",
  },
  tableCell_4_header: {
    minHeight: "27px",
    width: "30%",
    color: "#000",
    fontSize: "10px",
    padding: "5px",
    fontWeight: 900,
    border: "0.5px solid black",
  },
  tableCellEmpty: {
    fontSize: "11px",
    padding: "5px",
    minHeight: "27px",
  },
  tableCellSummaryAmount: {
    fontSize: "11px",
    padding: "5px",
    minHeight: "27px",
    borderLeft: "0.5px solid black",
    borderRight: "0.5px solid black",
  },
  tableCellTotalAmountTitle: {
    fontSize: "15px",
    padding: "5px",
    minHeight: "27px",
    fontWeight: 900,
  },
  tableCellTotalAmount: {
    fontSize: "15px",
    padding: "5px",
    minHeight: "27px",
    border: "0.5px solid black",
    fontWeight: 900,
    backgroundColor: "#F6F6F6",
  },
  tableCell_1: {
    minHeight: "27px",
    fontSize: "11px",
    width: "15%",
    color: "#000",
    padding: "5px",
    borderLeft: "0.5px solid black",
    borderBottom: "0.5px solid black",
  },
  tableCell_2: {
    width: "50%",
    color: "#000",
    fontSize: "11px",
    padding: "5px",
    borderLeft: "0.5px solid black",
    borderBottom: "0.5px solid black",
    minHeight: "27px",
  },
  tableCell_3: {
    minHeight: "27px",
    width: "25%",
    color: "#000",
    fontSize: "11px",
    padding: "5px",
    borderLeft: "0.5px solid black",
    borderBottom: "0.5px solid black",
  },
  tableCell_4: {
    minHeight: "27px",
    width: "30%",
    color: "#000",
    fontSize: "11px",
    padding: "5px",
    borderLeft: "0.5px solid black",
    borderRight: "0.5px solid black",
    borderBottom: "0.5px solid black",
  },
  bottomPlacement: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: "24px 24px 24px 24px",
  },

  footerTitle: {
    fontSize: "12px",
    fontWeight: 900,
  },
  footerTxt: {
    fontSize: "12px",
  },
  tableAutoWidth: { display: "table", width: "auto" },
  tableAutoWidthRight: { display: "table", width: "auto", textAlign: "right" },
  tableNew: {
    width: "100%",
  },
  rowNewTable: {
    // display: "flex",
    flexDirection: "row",
    borderBottom: "0.5px solid #000",
  },
  rowNewTableSummary: {
    // display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  boldNewTable: {
    fontWeight: 900,
  },

  headerNewTable: {
    borderTop: "0.5px solid #000",
    backgroundColor: "#F6F6F6",
    zIndex: 100,
  },
  headerColumnDescription: {
    // flex: 1,
    textAlign: "center",
    fontSize: "8px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    width: "25%",
    padding: 3,
  },
  headerColumn: {
    flex: 1,
    textAlign: "center",
    fontSize: "8px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
  },
  columnDescription: {
    // flex: 1,
    textAlign: "center",
    fontSize: "9px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
    width: "25%",
  },
  column: {
    flex: 1,
    textAlign: "center",
    fontSize: "9px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
  },

  headerColumn1Transport: {
    width: "30%",
    textAlign: "center",
    ontSize: "11px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 5,
  },
  headerColumn2Transport: {
    width: "50%",
    textAlign: "center",
    ontSize: "11px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 5,
  },
  headerColumn3Transport: {
    width: "20%",
    textAlign: "center",
    fontSize: "11px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 5,
  },
  column1Transport: {
    width: "30%",
    textAlign: "center",
    fontSize: "10px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
  },
  column2Transport: {
    width: "50%",
    textAlign: "center",
    fontSize: "10px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
  },
  column3Transport: {
    width: "20%",
    textAlign: "center",
    fontSize: "10px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
  },

  headerColumn1: {
    width: "10%",
    textAlign: "center",
    fontSize: "9px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },
  headerColumn2: {
    width: "50%",
    fontSize: "9px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },
  headerColumn3: {
    width: "20%",
    textAlign: "center",
    fontSize: "9px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },
  headerColumn4: {
    width: "20%",
    textAlign: "right",
    fontSize: "9px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },

  column1: {
    width: "10%",
    textAlign: "center",
    fontSize: "10px",
    borderLeft: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },
  column2: {
    width: "50%",
    fontSize: "10px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },
  column3: {
    width: "20%",
    textAlign: "center",
    fontSize: "10px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },
  column4: {
    width: "20%",
    textAlign: "right",
    fontSize: "10px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },

  summaryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  summaryColumn: {
    flex: 1,
    textAlign: "center",
    fontSize: "9px",
    borderRight: "0.5px solid #000",
    borderBottom: "0.5px solid #000",
    height: "100%",
    padding: 3,
    fontWeight: "bold",
    width: "100%",
  },
  summaryColumnNoBorderDescription: {
    textAlign: "center",
    fontSize: "9px",
    height: "100%",
    padding: 3.5,
    fontWeight: "bold",
    width: "25%",
    alignItems: "center",
  },
  summaryColumnNoBorder: {
    flex: 1,
    textAlign: "center",
    fontSize: "9px",
    height: "100%",
    padding: 3.5,
    fontWeight: "bold",
    width: "100%",
    alignItems: "center",
  },
  summaryColumnRightBorder: {
    flex: 1,
    textAlign: "center",
    fontSize: "9px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
    fontWeight: "bold",
    width: "100%",
    alignItems: "center",
  },

  customSummaryColumnTopLeft: {
    backgroundColor: "#F6F6F6",
    textAlign: "center",
    fontSize: "9px",
    borderTop: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    borderLeft: "0.5px solid #000",
    height: "100%",
    padding: 3,
    fontWeight: "bold",
    width: "30%",
    alignItems: "center",
  },

  customSummaryColumnTopRight: {
    textAlign: "center",
    fontSize: "9px",
    borderTop: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 3,
    fontWeight: "bold",
    width: "30%",
    alignItems: "center",
  },

  customSummaryColumnBottomRight: {
    textAlign: "center",
    fontSize: "9px",
    borderTop: "0.5px solid #000",
    borderRight: "0.5px solid #000",
    borderLeft: "0.5px solid #000",
    borderBottom: "0.5px solid #000",
    height: "100%",
    padding: 3.5,
    fontWeight: "bold",
    width: "30%",
    alignItems: "center",
  },

  customSummaryColumnBottomLeft: {
    backgroundColor: "#F6F6F6",
    textAlign: "center",
    fontSize: "9px",
    borderTop: "0.5px solid #000",
    borderLeft: "0.5px solid #000",
    borderBottom: "0.5px solid #000",
    height: "100%",
    padding: 2.5,
    fontWeight: "bold",
    width: "30%",
    alignItems: "center",
  },
  summaryColum1: {
    width: "10%",
    height: "100%",
    fontSize: "9px",
  },
  summaryColum2: {
    width: "10%",
    height: "100%",
    fontSize: "9px",
  },
  summaryColum3: {
    width: "20%",
    textAlign: "center",
    fontSize: "9px",
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },
  summaryColum4: {
    width: "20%",
    textAlign: "right",
    fontSize: "9px",
    borderRight: "0.5px solid #000",
    borderBottom: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },

  column3Total: {
    width: "20%",
    textAlign: "center",
    fontSize: "11px",
    fontWeight: 900,
    borderRight: "0.5px solid #000",
    height: "100%",
    padding: 8,
  },

  column4Total: {
    width: "20%",
    textAlign: "right",
    fontSize: "11px",
    fontWeight: 900,
    borderRight: "0.5px solid #000",
    borderBottom: "0.5px solid #000",
    height: "100%",
    padding: 8,
    backgroundColor: "#F6F6F6",
    zIndex: 100,
  },
});

export default styles;