import { lazy, Suspense, useRef, useState, useEffect } from "react";
// @mui
import {
  Alert,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// hooks
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useSnackbar } from "notistack";
import { setLoading } from "../../../features/globalSlice";
import db from "../../../firebase";
import firebase from "firebase/compat";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import TableToExcel from "@linways/table-to-excel";
import ReportExcel from "./ReportExcel";
import useResponsive from "../../../hooks/useResponsive";
import { DatePicker } from "@mui/lab";
import {
  selectDocument,
  setClientDocumentIdSelected,
  setClientDocumentObjectSelected,
  setClientList,
  setCompanyDetails,
  setCompanyIdSelected,
  setReportDocType,
} from "../../../features/documentSlice";

import { dynamicSortNumber } from "src/components/core-functions/SelectionCoreFunctions";

const ReportTable = lazy(() => import("./ReportTable"));

export default function ReportIndex() {
  const navigate = useNavigate();

  const { themeStretch } = useSettings();

  const isDesktop = useResponsive("up", "sm");

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const {
    documents,
    companyDetails,
    clientList,
    clientDocumentObjectSelected,
    reportDocType,
  } = useSelector(selectDocument);

  // const [logo, setLogo] = useState("");

  // const [sigImage, setSigImage] = useState("");

  const temp_fetch_invoice_ref = useRef();

  const temp_refresh_report_ref = useRef();

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [us_invoicelist, set_us_invoicelist] = useState([]);

  const actionType = "report";

  const [us_total, set_us_total] = useState({
    totalSubtotalAmount: 0,
    totalStorage: 0,
    totalScanning: 0,
    totalVat: 0,
    totalInvoiceAmount: 0,
    totalPaymentMadeAmount: 0,
    totalAmountDue: 0,
  });

  const {
    totalSubtotalAmount,
    totalStorage,
    totalScanning,
    totalVat,
    totalInvoiceAmount,
    totalPaymentMadeAmount,
    totalAmountDue,
  } = us_total;

  useEffect(() => {
    temp_refresh_report_ref.current();
  }, []);

  useEffect(() => {
    temp_fetch_invoice_ref.current();
  }, [
    us_fromDate,
    us_ToDate,
    clientDocumentObjectSelected,
    clientList,
    reportDocType,
  ]);

  function refreshReportSection() {
    dispatch(setCompanyIdSelected(undefined));
    dispatch(setCompanyDetails(null));
    dispatch(setClientDocumentIdSelected(undefined));
    dispatch(setClientDocumentObjectSelected(null));
    dispatch(setClientList([]));
    dispatch(setReportDocType(""));
    set_us_fromDate(new Date());
    set_us_ToDate(new Date());
    set_us_invoicelist([]);
  }

  temp_refresh_report_ref.current = refreshReportSection;

  async function fetchInvoice() {
    if (us_fromDate && us_ToDate) {
      if (new Date(us_fromDate) > new Date(us_ToDate)) {
        enqueueSnackbar(`Date incorrect. To Date cannot be before From Date.`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(true));

        const startDateISOString = us_fromDate.toISOString();
        const startDateStringSplit = startDateISOString.split("T");

        const endDateISOString = us_ToDate.toISOString();
        const endDateStringSplit = endDateISOString.split("T");

        const startDate = new Date(`${startDateStringSplit[0]}T00:00:00.000Z`); // The start date of the range
        const endDate = new Date(`${endDateStringSplit[0]}T23:59:59.000Z`); // The end date of the range

        await db
          .collection("vehiclebooking")
          .where(
            "dateCreated",
            ">=",
            firebase.firestore.Timestamp.fromDate(startDate)
          )
          .where(
            "dateCreated",
            "<=",
            firebase.firestore.Timestamp.fromDate(endDate)
          )
          .get()
          .then(async (querySnapshot) => {
            if (querySnapshot?.docs?.length > 0) {
              if (actionType === "report") {
                performData([], querySnapshot);
              }
            } else {
              set_us_total({
                totalSubtotalAmount: 0,
                totalStorageCal: 0,
                totalScanningCal: 0,
                totalVat: 0,
                totalInvoiceAmount: 0,
                totalPaymentMadeAmount: 0,
                totalAmountDue: 0,
              });
              set_us_invoicelist([]);
              dispatch(setLoading(false));
            }
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while fetching Bookings: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    } else {
      dispatch(setLoading(false));
    }
  }

  temp_fetch_invoice_ref.current = fetchInvoice;

  function performData(clientDataList, querySnapshot) {
    let invoiceArray = [];
    let totalSubtotalAmountCal = 0;
    let totalStorageCal = 0;
    let totalScanningCal = 0;
    let totalVatCal = 0;

    let totalInvoiceAmountCal = 0;
    let totalPaymentMadeAmountCal = 0;
    let totalAmountDueCal = 0;

    querySnapshot?.docs.forEach((invoiceDoc) => {
      if (!invoiceDoc?.data()?.isVoid && !invoiceDoc?.data()?.deleted) {
        let totalAmountDue = 0;
        if (
          invoiceDoc?.data()?.attachedPaymentNumber &&
          invoiceDoc?.data()?.attachedPaymentNumber?.length > 0
        ) {
          let totalPaymentDone = 0;
          invoiceDoc?.data()?.attachedPaymentNumber.forEach((payment) => {
            totalPaymentDone =
              totalPaymentDone + Number(payment?.paymentAmount);
          });

          totalAmountDue =
            Number(invoiceDoc?.data()?.bookingTotalAmount) - totalPaymentDone;

          totalPaymentMadeAmountCal =
            totalPaymentMadeAmountCal + Number(totalPaymentDone);
        } else {
          totalAmountDue = Number(invoiceDoc?.data()?.bookingTotalAmount);
        }

        invoiceArray.push({
          id: invoiceDoc?.id,
          data: {
            ...invoiceDoc?.data(),
            totalAmountDue: totalAmountDue,
          },
        });

        totalSubtotalAmountCal =
          totalSubtotalAmountCal +
          Number(invoiceDoc?.data()?.bookingTotalAmount);

        totalStorageCal =
          totalStorageCal + Number(invoiceDoc?.data()?.invStorageFee);

        totalScanningCal =
          totalScanningCal + Number(invoiceDoc?.data()?.invScanningFee);

        totalInvoiceAmountCal =
          totalInvoiceAmountCal +
          Number(invoiceDoc?.data()?.bookingTotalAmount);

        totalAmountDueCal = totalAmountDueCal + Number(totalAmountDue);
      }
    });
    set_us_total({
      totalSubtotalAmount: totalSubtotalAmountCal,
      totalStorage: totalStorageCal,
      totalScanning: totalScanningCal,
      totalVat: totalVatCal || 0,
      totalInvoiceAmount: totalInvoiceAmountCal,
      totalPaymentMadeAmount: totalPaymentMadeAmountCal,
      totalAmountDue: totalAmountDueCal,
    });

    invoiceArray.sort(dynamicSortNumber("id"));

    set_us_invoicelist(invoiceArray);
    dispatch(setLoading(false));
  }

  const downloadexcel = (id) => {
    let date_from = moment(us_fromDate).format("DD-MM-YYYY");
    let date_to = moment(us_ToDate).format("DD-MM-YYYY");

    if (id === "idStatementTable") {
      let table = document.getElementById(id);
      TableToExcel.convert(table, {
        name: `SOA_${clientDocumentObjectSelected?.name}_${date_from}_TO_${date_to}.xlsx`,
      });
    } else if (id === "idReportTable") {
      let table = document.getElementById(id);
      TableToExcel.convert(table, {
        name: `REPORT_${date_from}_TO_${date_to}.xlsx`,
      });
    } else if (id === "idIncomeReportTable") {
      let table = document.getElementById(id);
      TableToExcel.convert(table, {
        name: `Income_report_${date_from}_TO_${date_to}.xlsx`,
      });
    } else if (id === "idSummaryIncomeReportTable") {
      let table = document.getElementById(id);
      TableToExcel.convert(table, {
        name: `Summary_income_${date_from}_TO_${date_to}.xlsx`,
      });
    }
  };

  return (
    <Page title="Report">
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Stack spacing={3} direction="row" alignItems={"center"}>
              <Button
                startIcon={<KeyboardBackspaceIcon />}
                variant="outlined"
                color="primary"
                onClick={() => navigate(PATH_DASHBOARD.general.app1)}
              >
                Back
              </Button>
              <Typography variant="h3">Report section</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack spacing={3}>
              <hr />

              <Stack direction={"row"} spacing={3} alignItems={"center"}>
                <DatePicker
                  label="From"
                  value={us_fromDate || ""}
                  onChange={(newValue) => {
                    set_us_fromDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
                <DatePicker
                  label="To"
                  value={us_ToDate || ""}
                  onChange={(newValue) => {
                    set_us_ToDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </Stack>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            style={{
              display:
                us_invoicelist &&
                us_invoicelist?.length > 0 &&
                us_fromDate &&
                us_ToDate &&
                actionType === "report"
                  ? ""
                  : "none",
            }}
          >
            <Stack spacing={3}>
              <Stack direction={"row"} spacing={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => downloadexcel("idReportTable")}
                  style={{ width: isDesktop ? "200px" : "100%" }}
                >
                  Download as excel
                </Button>
              </Stack>

              <Suspense fallback={<></>}>
                <ReportTable
                  //  logo={logo}
                  // sigImage={sigImage}
                  companyDetails={companyDetails}
                  clientDocumentObjectSelected={clientDocumentObjectSelected}
                  documents={documents}
                  reportDocType={reportDocType}
                  companyDetail={companyDetails}
                  us_invoicelist={us_invoicelist || []}
                  totalSubtotalAmount={totalSubtotalAmount || 0}
                  totalStorage={totalStorage || 0}
                  totalScanning={totalScanning || 0}
                  totalVat={totalVat || 0}
                  totalInvoiceAmount={totalInvoiceAmount || 0}
                  totalPaymentMadeAmount={totalPaymentMadeAmount || 0}
                  totalAmountDue={totalAmountDue || 0}
                  clientList={clientList}
                />
              </Suspense>
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={12}
            style={{
              display:
                !us_fromDate || !us_ToDate
                  ? "none"
                  : companyDetails &&
                    (!us_invoicelist || us_invoicelist?.length === 0)
                  ? ""
                  : "none",
            }}
          >
            <Alert severity={"warning"}>
              {`No Bookings found for the chosen date`}
            </Alert>
          </Grid>
        </Grid>

        <table
          id="idReportTable"
          border="1"
          style={{ display: "none" }}
          data-cols-width={"20,20,20,20,20,10,20,20,20,20,10,20"}
        >
          <ReportExcel
            companyDetails={companyDetails}
            documents={documents}
            reportDocType={reportDocType}
            companyName={companyDetails?.name || ""}
            us_invoicelist={us_invoicelist || []}
            us_total={us_total || 0}
          />
        </table>
      </Container>
    </Page>
  );
}
