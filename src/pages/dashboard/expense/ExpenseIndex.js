import { lazy, Suspense, useRef, useState, useEffect, Fragment } from "react";
// @mui
import {
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import db, { firebaseApp } from "../../../firebase";
import firebase from "firebase/compat";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DeleteIcon from "@mui/icons-material/Delete";

import { DatePicker } from "@mui/lab";
import { selectDocument } from "../../../features/documentSlice";
import CurrencyFormat from "react-currency-format";
import useAuth from "../../../hooks/useAuth";
import Iconify from "../../../components/Iconify";
import { handleViewDownload } from "../../../components/core-functions/SelectionCoreFunctions";

const CompanyClientSelection = lazy(() =>
  import("../../../components/selection-component/CompanyClientSelection")
);

// ----------------------------------------------------------------------

export default function ExpenseIndex() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const temp_fetch_invoice_ref = useRef();

  const [logo, setLogo] = useState("");

  const [sigImage, setSigImage] = useState("");

  const temp_logo_image_ref = useRef();

  const temp_signature_image_ref = useRef();

  /*   const { companyPaymentSelected, clientPaymentSelected } =
    useSelector(selectPaymentSection); */

  const { companyDetails, clientDocumentObjectSelected, paymentDocType } =
    useSelector(selectDocument);

  const [us_invoicelist, set_us_invoicelist] = useState([]);

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [us_open_screenshot_dialog, set_us_open_screenshot_dialog] =
    useState(false);

  const [us_screenshot_invoice_data, set_us_screenshot_invoice_data] =
    useState(null);

  const [us_open_expense_dialog, set_us_open_expense_dialog] = useState(false);

  const [us_display_add_expense, set_us_display_add_expense] = useState(false);

  const [us_add_expense_data, set_us_add_expense_data] = useState({
    expenseAmt: 0,
    expenseDesc: "",
  });

  const [us_expense_invoice_data, set_us_expense_invoice_data] = useState(null);

  useEffect(() => {
    // convert logo image to adaptable react-pdf image
    temp_logo_image_ref.current();
    // convert signature image to adaptable react-pdf image
    temp_signature_image_ref.current();
  }, [companyDetails]);

  useEffect(() => {
    temp_fetch_invoice_ref.current();
  }, [
    us_fromDate,
    us_ToDate,
    companyDetails,
    clientDocumentObjectSelected,
    paymentDocType,
  ]);

  async function getLogoImage() {
    if (
      companyDetails?.data?.imageUrl &&
      companyDetails?.data?.imageUrl !== ""
    ) {
      dispatch(setLoading(true));
      let logoImage = await toDataUrl(companyDetails?.data?.imageUrl);
      setLogo(logoImage);
    }
  }

  temp_logo_image_ref.current = getLogoImage;

  async function getSignatureImage() {
    if (companyDetails?.data?.sigUrl && companyDetails?.data?.sigUrl !== "") {
      dispatch(setLoading(true));
      let sigImage = await toDataUrl(companyDetails?.data?.sigUrl);
      setSigImage(sigImage);
    }
  }

  temp_signature_image_ref.current = getSignatureImage;

  async function toDataUrl(url) {
    if (url === "") {
      return "";
    } else {
      try {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function fetchInvoice() {
    if (
      us_fromDate !== undefined &&
      us_fromDate !== "" &&
      us_ToDate !== undefined &&
      us_ToDate !== "" &&
      companyDetails &&
      clientDocumentObjectSelected &&
      paymentDocType
    ) {
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
          .collection("company")
          .doc(companyDetails?.id)
          .collection(paymentDocType)
          .where(
            "docDate",
            ">=",
            firebase.firestore.Timestamp.fromDate(startDate)
          )
          .where(
            "docDate",
            "<=",
            firebase.firestore.Timestamp.fromDate(endDate)
          )
          .get()
          .then((querySnapshot) => {
            let invoiceArray = [];
            if (querySnapshot?.docs?.length > 0) {
              querySnapshot?.docs.forEach((invoiceDoc) => {
                if (
                  invoiceDoc?.data()?.clientId ===
                    clientDocumentObjectSelected?.id &&
                  !invoiceDoc?.data()?.deleted
                ) {
                  let valid = false;

                  // if its proforma - check if its has been converted
                  if (
                    paymentDocType === "proforma" &&
                    invoiceDoc?.data()?.isProformaConverted
                  ) {
                    valid = false;
                  } else {
                    // for report - we take all documents
                    valid = true;
                  }

                  if (valid) {
                    let remainingAmt = Number(
                      invoiceDoc?.data()?.docRemainingPaymentAmt || 0
                    );

                    let totalExpenseAmountForInvoice = 0;

                    if (
                      invoiceDoc?.data()?.invoiceExpensetData &&
                      invoiceDoc?.data()?.invoiceExpensetData?.length > 0
                    ) {
                      invoiceDoc
                        ?.data()
                        ?.invoiceExpensetData.forEach((expense) => {
                          totalExpenseAmountForInvoice =
                            totalExpenseAmountForInvoice +
                            Number(expense?.expenseAmt || 0);
                        });
                    }

                    invoiceArray.push({
                      checked: false,
                      id: invoiceDoc?.id,
                      data: {
                        ...invoiceDoc?.data(),
                      },
                      paymentAmt: 0,
                      paymentType: "",
                      docRemainingPaymentAmt: remainingAmt,
                      totalExpenseAmountForInvoice:
                        totalExpenseAmountForInvoice,
                    });
                  }
                }
              });
              set_us_invoicelist(invoiceArray);
            } else {
              set_us_invoicelist([]);
            }
            dispatch(setLoading(false));
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while fetching invoices: ${err?.message}`,
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

  const onFileChange = async (e, type) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      dispatch(setLoading(true));

      let fileUrl = "";
      const todayDate = new Date();
      const todayISOString = todayDate.toISOString();
      const screenshotStoragePath = `/screenshot/${companyDetails?.id}/${us_screenshot_invoice_data?.invoiceData?.docType}/${todayISOString}`;
      const file = e.target.files[0];
      const storageRef = firebaseApp.storage().ref();
      const fileRef = storageRef.child(screenshotStoragePath);

      //upload screenshot in firebase storage
      await fileRef.put(file);
      fileUrl = await fileRef.getDownloadURL();

      if (fileUrl) {
        let newScreenshotList = [
          ...(us_screenshot_invoice_data?.invoiceScreenshotData || []),
        ];
        newScreenshotList.push({
          dateString: todayISOString,
          screenshotUrl: fileUrl,
          screenshotStoragePath: screenshotStoragePath,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        });

        // store download link url in firestore
        await db
          .collection("company")
          .doc(companyDetails?.id)
          .collection(us_screenshot_invoice_data?.invoiceData?.docType)
          .doc(us_screenshot_invoice_data?.invoiceId)
          .set(
            {
              invoiceScreenshotData: newScreenshotList,
            },
            { merge: true }
          )
          .then(() => {
            set_us_screenshot_invoice_data({
              ...us_screenshot_invoice_data,
              invoiceScreenshotData: newScreenshotList,
            });
            enqueueSnackbar("Sreenshot uploaded successfully");
            dispatch(setLoading(false));

            fetchInvoice();
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while uploading screenshot: ${err?.message || ""}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      } else {
        enqueueSnackbar(`Error occured while getting screenshot storage url`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      }
    }
  };

  async function deleteScreenshot(screenshot) {
    if (screenshot?.screenshotStoragePath) {
      dispatch(setLoading(true));

      // Create a reference to the file to delete
      const storageRef = firebaseApp.storage().ref();
      var desertRef = storageRef.child(screenshot?.screenshotStoragePath);

      // Delete the file
      await desertRef
        .delete()
        .then(async () => {
          // File deleted successfully
          // remove from firestore doc
          let newScreenshotList = [
            ...(us_screenshot_invoice_data?.invoiceScreenshotData || []),
          ];

          newScreenshotList = newScreenshotList.filter(
            (shot) =>
              shot?.screenshotStoragePath !== screenshot?.screenshotStoragePath
          );

          // update doc
          await db
            .collection("company")
            .doc(companyDetails?.id)
            .collection(us_screenshot_invoice_data?.invoiceData?.docType)
            .doc(us_screenshot_invoice_data?.invoiceId)
            .set(
              {
                invoiceScreenshotData: newScreenshotList,
              },
              { merge: true }
            )
            .then(() => {
              set_us_screenshot_invoice_data({
                ...us_screenshot_invoice_data,
                invoiceScreenshotData: newScreenshotList,
              });

              enqueueSnackbar("Sreenshot deleted successfully");
              dispatch(setLoading(false));

              fetchInvoice();
            })
            .catch((err) => {
              enqueueSnackbar(
                `Error occured while deleting screenshot: ${
                  err?.message || ""
                }`,
                { variant: "error" }
              );
              dispatch(setLoading(false));
            });
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          enqueueSnackbar(
            `Error occured while deleting screenshot: ${error?.message || ""}`,
            {
              variant: "error",
            }
          );
          dispatch(setLoading(false));
        });
    }
  }

  function onExpenseFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      const todayDate = new Date();
      const todayISOString = todayDate.toISOString();
      const expenseStoragePath = `/expense/${companyDetails?.id}/${us_expense_invoice_data?.invoiceData?.docType}/${todayISOString}`;
      const file = e.target.files[0];
      set_us_add_expense_data({
        ...us_add_expense_data,
        dateString: todayISOString,
        expenseStoragePath: expenseStoragePath,
        expenseFile: file,
      });
    }
  }

  async function addExpense() {
    /* if (
      !us_add_expense_data?.expenseStoragePath ||
      us_add_expense_data?.expenseStoragePath !== "" ||
      us_add_expense_data?.expenseFile
    ) { */
    dispatch(setLoading(true));

    let fileUrl = "";

    let newExpenseList = [
      ...(us_expense_invoice_data?.invoiceData?.invoiceExpensetData || []),
    ];

    if (us_add_expense_data?.expenseStoragePath) {
      const storageRef = firebaseApp.storage().ref();
      const fileRef = storageRef.child(us_add_expense_data?.expenseStoragePath);

      //upload expense file in firebase storage
      await fileRef.put(us_add_expense_data?.expenseFile);
      fileUrl = await fileRef.getDownloadURL();
    }

    if (fileUrl) {
      newExpenseList.push({
        dateString: us_add_expense_data?.dateString,
        expenseAmt: us_add_expense_data?.expenseAmt,
        expenseDesc: us_add_expense_data?.expenseDesc,
        expenseUrl: fileUrl,
        expenseStoragePath: us_add_expense_data?.expenseStoragePath,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      });
    } else {
      newExpenseList.push({
        dateString: "",
        expenseAmt: us_add_expense_data?.expenseAmt,
        expenseDesc: us_add_expense_data?.expenseDesc,
        expenseUrl: "",
        expenseStoragePath: "",
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      });
    }

    // store download link url in firestore
    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection(us_expense_invoice_data?.invoiceData?.docType)
      .doc(us_expense_invoice_data?.invoiceId)
      .set(
        {
          invoiceExpensetData: newExpenseList,
        },
        { merge: true }
      )
      .then(() => {
        set_us_expense_invoice_data({
          ...us_expense_invoice_data,
          invoiceData: {
            ...us_expense_invoice_data?.invoiceData,
            invoiceExpensetData: newExpenseList,
          },
        });

        fetchInvoice();
        enqueueSnackbar("Expense uploaded successfully");
        set_us_display_add_expense(false);
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while uploading expense: ${err?.message || ""}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  async function deleteExpense(expense, index) {
    dispatch(setLoading(true));

    if (expense?.expenseStoragePath) {
      // Create a reference to the file to delete
      const storageRef = firebaseApp.storage().ref();
      var desertRef = storageRef.child(expense?.expenseStoragePath);

      // Delete the file
      await desertRef
        .delete()
        .then(async () => {
          enqueueSnackbar("Image Url deleted successfully");
          dispatch(setLoading(false));
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          enqueueSnackbar(
            `Error occured while deleting expense: ${error?.message || ""}`,
            {
              variant: "error",
            }
          );
          dispatch(setLoading(false));
        });
    }

    dispatch(setLoading(true));
    // remove from firestore doc
    let newExpenseList = [];

    us_expense_invoice_data?.invoiceData?.invoiceExpensetData.forEach(
      (expenseData) => {
        if (
          expenseData?.expenseDesc !== expense?.expenseDesc &&
          ((expenseData.timestamp &&
            moment(expenseData.timestamp.toDate()).format(
              "DD-MM-YYYY, HH:MM:ss"
            )) ||
            "") !==
            ((expense.timestamp &&
              moment(expense.timestamp.toDate()).format(
                "DD-MM-YYYY, HH:MM:ss"
              )) ||
              "")
        ) {
          newExpenseList.push({ ...expense });
        }
      }
    );

    // update doc
    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection(us_expense_invoice_data?.invoiceData?.docType)
      .doc(us_expense_invoice_data?.invoiceId)
      .set(
        {
          invoiceExpensetData: newExpenseList,
        },
        { merge: true }
      )
      .then(() => {
        set_us_expense_invoice_data({
          ...us_expense_invoice_data,
          invoiceData: {
            ...us_expense_invoice_data?.invoiceData,
            invoiceExpensetData: newExpenseList,
          },
        });

        fetchInvoice();

        enqueueSnackbar("Expense deleted successfully");
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while deleting expense: ${err?.message || ""}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  return (
    <Page title="Payment/Expense">
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
              <Typography variant="h3">Expense section</Typography>
            </Stack>
          </Grid>

          <Suspense fallback={<></>}>
            <CompanyClientSelection type={"expense"} />
          </Suspense>
          <br />
          <br />

          {companyDetails && clientDocumentObjectSelected && paymentDocType && (
            <>
              <Grid item xs={12} md={12}>
                <Stack spacing={3}>
                  <hr />
                  <Typography>
                    Please choose any invoices and insert an expense amount
                  </Typography>

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

                  <Card>
                    <Stack style={{ padding: "10px" }}>
                      <TableContainer>
                        <Table border={1}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Add/update/delete Expense
                              </TableCell>

                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                View/Download
                              </TableCell>

                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Invoice Number
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Datetime created
                              </TableCell>

                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Bill to
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Invoice amount
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {us_invoicelist &&
                              us_invoicelist?.length > 0 &&
                              us_invoicelist?.map((invoice, index) => (
                                <TableRow key={index}>
                                  <TableCell
                                    size="small"
                                    align="center"
                                    style={{
                                      whiteSpace: "nowrap",
                                      background:
                                        Number(
                                          invoice?.totalExpenseAmountForInvoice ||
                                            0
                                        ) >=
                                        Number(invoice?.data?.docTotal || 0)
                                          ? "#FEC3BE"
                                          : "transparent",
                                    }}
                                  >
                                    <Stack
                                      spacing={2}
                                      direction="row"
                                      alignItems={"center"}
                                    >
                                      <CurrencyFormat
                                        value={Math.round(
                                          Number(
                                            invoice?.totalExpenseAmountForInvoice ||
                                              0
                                          )
                                        )}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                      />

                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                          set_us_open_expense_dialog(true);
                                          set_us_expense_invoice_data({
                                            invoiceId: invoice?.id,
                                            invoiceData: {
                                              ...invoice?.data,
                                            },
                                            totalExpenseAmountForInvoice:
                                              invoice?.totalExpenseAmountForInvoice ||
                                              0,
                                          });
                                        }}
                                        style={{
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        Show expense
                                      </Button>
                                    </Stack>
                                  </TableCell>

                                  <TableCell
                                    align="center"
                                    size="small"
                                    style={{
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <Stack
                                      direction={"row"}
                                      alignItems={"center"}
                                      justifyContent={"center"}
                                      spacing={2}
                                    >
                                      <IconButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          handleViewDownload(
                                            companyDetails,
                                            clientDocumentObjectSelected,
                                            invoice,
                                            logo,
                                            sigImage,
                                            "view"
                                          )
                                        }
                                      >
                                        <Iconify icon={"carbon:view"} />
                                      </IconButton>

                                      <IconButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          handleViewDownload(
                                            companyDetails,
                                            clientDocumentObjectSelected,
                                            invoice,
                                            logo,
                                            sigImage,
                                            "download"
                                          )
                                        }
                                      >
                                        <Iconify icon={"eva:download-fill"} />
                                      </IconButton>
                                    </Stack>
                                  </TableCell>
                                  <TableCell
                                    size="small"
                                    align="center"
                                    style={{
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {invoice?.data?.docString}
                                  </TableCell>
                                  <TableCell
                                    size="small"
                                    align="center"
                                    style={{
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {moment(
                                      invoice?.data?.docDate.toDate()
                                    ).format("DD-MM-YYYY, HH:MM:ss")}
                                  </TableCell>

                                  <TableCell
                                    size="small"
                                    align="center"
                                    style={{
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {/* {invoice?.data?.clientDetails?.name ||
                                          "" */}
                                    {clientDocumentObjectSelected?.name || ""}
                                  </TableCell>

                                  <TableCell
                                    size="small"
                                    align="center"
                                    style={{
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <CurrencyFormat
                                      value={Math.round(
                                        Number(invoice?.data?.docTotal || 0)
                                      )}
                                      displayType={"text"}
                                      thousandSeparator={true}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </>
          )}
        </Grid>
      </Container>

      {us_open_screenshot_dialog ? (
        <>
          <Dialog
            open={us_open_screenshot_dialog}
            onClose={() => {
              set_us_open_screenshot_dialog(false);
              set_us_screenshot_invoice_data(null);
            }}
            fullWidth
            maxWidth={"md"}
          >
            <DialogTitle>Payment screenshots</DialogTitle>
            <DialogContent>
              <br />
              <Typography>
                Upload Screenshot{" "}
                <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
              </Typography>
              <TextField
                className="uploadInput"
                variant="outlined"
                size="small"
                fullWidth
                name="image"
                type="file"
                id="image"
                accept=".png,.jpeg"
                onChange={(event) => onFileChange(event)}
              />
              <br />
              <br />
              <TableContainer>
                <Table border={1}>
                  <TableHead>
                    <TableRow>
                      <TableCell size="small">Date</TableCell>
                      <TableCell size="small">View</TableCell>
                      <TableCell size="small">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {us_screenshot_invoice_data?.invoiceScreenshotData &&
                      us_screenshot_invoice_data?.invoiceScreenshotData
                        ?.length > 0 &&
                      us_screenshot_invoice_data?.invoiceScreenshotData?.map(
                        (screenshot, index) => (
                          <TableRow key={index}>
                            <TableCell size="small">
                              {screenshot?.dateString || ""}
                            </TableCell>
                            <TableCell size="small">
                              {screenshot?.screenshotUrl &&
                              screenshot?.screenshotUrl !== "" ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  href={`${screenshot?.screenshotUrl}`}
                                  target="_blank"
                                >
                                  open
                                </Button>
                              ) : (
                                <Typography>No url found</Typography>
                              )}
                            </TableCell>
                            <TableCell size="small">
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => deleteScreenshot(screenshot)}
                              >
                                delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  set_us_open_screenshot_dialog(false);
                  set_us_screenshot_invoice_data(null);
                }}
                variant="contained"
                color="error"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <></>
      )}

      {us_open_expense_dialog ? (
        <>
          <Dialog
            open={us_open_expense_dialog}
            onClose={() => {
              set_us_open_expense_dialog(false);
              set_us_display_add_expense(false);
              set_us_expense_invoice_data(null);
            }}
            fullWidth
            maxWidth={"md"}
          >
            <DialogTitle>Expenses</DialogTitle>
            <DialogContent>
              <br />
              {!us_display_add_expense && (
                <Button
                  onClick={() => set_us_display_add_expense(true)}
                  variant="contained"
                  color="primary"
                  disabled={
                    !user?.permissions?.addExpense?.assignedCompanyId?.includes(
                      companyDetails?.id
                    )
                  }
                >
                  Add expense
                </Button>
              )}

              {us_display_add_expense && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="expenseAmount"
                      type="text"
                      id="expenseAmount"
                      label={"Expense amount"}
                      onChange={(event) => {
                        set_us_add_expense_data({
                          ...us_add_expense_data,
                          expenseAmt: event.target.value,
                        });
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="expenseDesc"
                      type="text"
                      id="expenseDesc"
                      label={"Expense description"}
                      onChange={(event) => {
                        set_us_add_expense_data({
                          ...us_add_expense_data,
                          expenseDesc: event.target.value,
                        });
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography>
                      Upload expense{" "}
                      <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
                    </Typography>
                    <TextField
                      className="uploadInput"
                      variant="outlined"
                      size="small"
                      fullWidth
                      name="image"
                      type="file"
                      id="image"
                      accept=".png,.jpeg,.pdf"
                      onChange={(event) => onExpenseFileChange(event)}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Button
                      onClick={() => addExpense()}
                      variant="contained"
                      color="primary"
                      disabled={
                        !us_add_expense_data?.expenseAmt ||
                        !us_add_expense_data?.expenseDesc ||
                        !user?.permissions?.addExpense
                        // !us_add_expense_data?.expenseStoragePath ||
                        // !us_add_expense_data?.expenseFile
                      }
                    >
                      add expense
                    </Button>
                  </Grid>
                </Grid>
              )}

              <br />
              <br />
              <TableContainer>
                <Table border={1}>
                  <TableHead>
                    <TableRow>
                      <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
                        Date
                      </TableCell>
                      <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
                        Amount
                      </TableCell>
                      <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
                        Description
                      </TableCell>
                      <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
                        View uploaded image
                      </TableCell>
                      <TableCell size="small" style={{ whiteSpace: "nowrap" }}>
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {us_expense_invoice_data?.invoiceData
                      ?.invoiceExpensetData &&
                      us_expense_invoice_data?.invoiceData?.invoiceExpensetData
                        ?.length > 0 &&
                      us_expense_invoice_data?.invoiceData?.invoiceExpensetData?.map(
                        (expense, index) => (
                          <TableRow key={index}>
                            <TableCell
                              size="small"
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              {expense?.dateString ||
                                (expense.timestamp &&
                                  moment(expense.timestamp.toDate()).format(
                                    "DD-MM-YYYY, HH:MM:ss"
                                  )) ||
                                ""}
                            </TableCell>
                            <TableCell
                              size="small"
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              <CurrencyFormat
                                value={Math.round(
                                  Number(expense?.expenseAmt || 0)
                                )}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </TableCell>
                            <TableCell
                              size="small"
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              {expense?.expenseDesc || ""}
                            </TableCell>
                            <TableCell
                              size="small"
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              {expense?.expenseUrl &&
                              expense?.expenseUrl !== "" ? (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  href={`${expense?.expenseUrl}`}
                                  target="_blank"
                                >
                                  open
                                </Button>
                              ) : (
                                <Typography>No url found</Typography>
                              )}
                            </TableCell>
                            <TableCell
                              size="small"
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              <IconButton
                                color="error"
                                onClick={() => {
                                  deleteExpense(expense, index);
                                }}
                                disabled={
                                  !user?.permissions?.deleteExpense?.assignedCompanyId?.includes(
                                    companyDetails?.id
                                  )
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  set_us_open_expense_dialog(false);
                  set_us_display_add_expense(false);
                  set_us_expense_invoice_data(null);
                }}
                variant="contained"
                color="error"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <></>
      )}
    </Page>
  );
}
