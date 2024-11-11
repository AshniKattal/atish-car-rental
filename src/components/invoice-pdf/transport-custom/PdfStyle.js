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
  emptyCell: { height: 14 },
  lineHeightMain: { lineHeight: 1.5 },
  col4: { width: "25%" },
  col35: { width: "35%" },
  col8: { width: "75%" },
  col6: { width: "50%" },
  col30: { width: "30%" },
  col40: { width: "40%" },
  mb8: { marginBottom: 8 },
  mb10: { marginBottom: 10 },
  mb15: { marginBottom: 15 },
  mb30: { marginBottom: 30 },
  mb40: { marginBottom: 40 },
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
    padding: "24px 24px 0 24px",
    fontSize: 9,
    lineHeight: 1.4,
    fontFamily: "Roboto",
    backgroundColor: "#fff",
    textTransform: "none",
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
  gridContainer: { width: "100%", flexDirection: "row" },
  gridContainer_align_right: { justifyContent: "flex-end" },
  table: { display: "flex", width: "100%" },
  middleTableHeight: { minHeight: "300px" },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#74a1c9",
  },
  tableBody: { display: "flex", width: "100%" },
  tableRow_header: {
    background: "#74a1c9",
  },
  tableRow: {
    width: "100%",
    padding: "3px",
    /* padding: '8px 0', */
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#DFE3E8",
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
    width: "40%",
    paddingLeft: "1em",
    color: "#000",
    fontSize: "12px",
    padding: "5px",
    fontWeight: 900,
  },
  tableCell_2_header: {
    width: "40%",
    color: "#000",
    fontSize: "12px",
    padding: "5px",
    fontWeight: 900,
  },
  tableCell_3_header: {
    width: "20%",
    color: "#000",
    fontSize: "12px",
    padding: "5px",
    fontWeight: 900,
  },
  tableCell_1: {
    width: "40%",
    paddingLeft: "1em",
    color: "#000",
    fontSize: "12px",
    /*  padding: '5px', */
    /*     borderBottom: '1px solid #dcdcdc', */
  },
  tableCell_2: {
    width: "40%",
    color: "#000",
    fontSize: "12px",
    /*  padding: '5px', */
    /*     borderBottom: '1px solid #dcdcdc', */
  },
  tableCell_3: {
    width: "20%",
    color: "#000",
    fontSize: "12px",

    /* padding: '5px', */
    /*     borderBottom: '1px solid #dcdcdc', */
  },
  bottomPlacement: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: "24px 24px 24px 24px",
  },

  footerTitle: {
    fontWeight: 900,
    fontSize: "12px",
  },
  footerTxt: {
    fontSize: "12px",
  },
});

export default styles;
