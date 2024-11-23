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
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import { isEmpty } from "lodash";

import { DatePicker } from "@mui/lab";
import { selectDocument } from "../../../features/documentSlice";
import CurrencyFormat from "react-currency-format";
import useAuth from "../../../hooks/useAuth";
import Iconify from "../../../components/Iconify";

import { setBookingData } from "src/features/bookingSlice";
import UpdateVehicleBookingDialog from "src/pages/car-rental-atish/car-rental/booking/UpdateVehicleBookingDialog";

const CompanyClientSelection = lazy(() =>
  import("../../../components/selection-component/CompanyClientSelection")
);

// ----------------------------------------------------------------------

export default function PaymentIndex() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const temp_fetch_invoice_ref = useRef();

  // const [logo, setLogo] = useState("");

  // const [sigImage, setSigImage] = useState("");

  // const temp_logo_image_ref = useRef();

  // const temp_signature_image_ref = useRef();

  /*   const { companyPaymentSelected, clientPaymentSelected } =
    useSelector(selectPaymentSection); */

  const { companyDetails, clientDocumentObjectSelected, paymentDocType } =
    useSelector(selectDocument);

  const [us_invoicelist, set_us_invoicelist] = useState([]);

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [us_filter, set_us_filter] = useState("");

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

  const [partialPaymentAmountInvoiceId, set_partialPaymentAmountInvoiceId] =
    useState("");

  const [partialPaymentAmount, set_partialPaymentAmount] = useState("");

  const [partialPaymentType, set_partialPaymentType] = useState("");

  const [openPartialPaymentFieldDialog, set_openPartialPaymentFieldDialog] =
    useState(false);

  // useEffect(() => {
  //   // convert logo image to adaptable react-pdf image
  //   temp_logo_image_ref.current();
  //   // convert signature image to adaptable react-pdf image
  //   temp_signature_image_ref.current();
  // }, [companyDetails]);

  useEffect(() => {
    temp_fetch_invoice_ref.current();
  }, [
    us_fromDate,
    us_ToDate,
    companyDetails,
    clientDocumentObjectSelected,
    paymentDocType,
  ]);

  // async function getLogoImage() {
  //   if (
  //     companyDetails?.data?.imageUrl &&
  //     companyDetails?.data?.imageUrl !== ""
  //   ) {
  //     dispatch(setLoading(true));
  //     let logoImage = await toDataUrl(companyDetails?.data?.imageUrl);
  //     setLogo(logoImage);
  //   }
  // }

  // temp_logo_image_ref.current = getLogoImage;

  // async function getSignatureImage() {
  //   if (companyDetails?.data?.sigUrl && companyDetails?.data?.sigUrl !== "") {
  //     dispatch(setLoading(true));
  //     let sigImage = await toDataUrl(companyDetails?.data?.sigUrl);
  //     setSigImage(sigImage);
  //   }
  // }

  // temp_signature_image_ref.current = getSignatureImage;

  // async function toDataUrl(url) {
  //   if (url === "") {
  //     return "";
  //   } else {
  //     try {
  //       const data = await fetch(url);
  //       const blob = await data.blob();
  //       return new Promise((resolve) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(blob);
  //         reader.onloadend = () => {
  //           const base64data = reader.result;
  //           resolve(base64data);
  //         };
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }

  async function fetchInvoice() {
    if (
      us_fromDate !== undefined &&
      us_fromDate !== "" &&
      us_ToDate !== undefined &&
      us_ToDate !== "" &&
      companyDetails
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
          /* .collection("company")
          .doc(companyDetails?.id) */
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
          .then((querySnapshot) => {
            let invoiceArray = [];
            if (querySnapshot?.docs?.length > 0) {
              querySnapshot?.docs.forEach((invoiceDoc) => {
                let remainingAmt = Number(
                  invoiceDoc?.data()?.docRemainingPaymentAmt || 0
                );

                let totalExpenseAmountForInvoice = 0;

                if (
                  invoiceDoc?.data()?.invoiceExpensetData &&
                  invoiceDoc?.data()?.invoiceExpensetData?.length > 0
                ) {
                  invoiceDoc?.data()?.invoiceExpensetData.forEach((expense) => {
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
                  totalExpenseAmountForInvoice: totalExpenseAmountForInvoice,
                });
              });
              set_us_invoicelist(invoiceArray);
            } else {
              set_us_invoicelist([]);
            }
            dispatch(setLoading(false));
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while fetching bookings: ${err?.message}`,
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

  function addPartialPayment() {
    if (us_invoicelist && us_invoicelist?.length > 0) {
      dispatch(setLoading(true));

      let selectedLineData = [];

      us_invoicelist.forEach((invoice) => {
        if (invoice?.data?.bookingId === partialPaymentAmountInvoiceId) {
          let remainingAmount = 0;

          if (Number(invoice?.data?.docRemainingPaymentAmt || 0) > 0) {
            remainingAmount =
              Number(invoice?.data?.docRemainingPaymentAmt || 0) -
              Number(partialPaymentAmount);
          } else {
            remainingAmount =
              Number(invoice?.data?.bookingTotalAmount || 0) -
              Number(partialPaymentAmount);
          }

          let paymentStatus = "";
          if (
            remainingAmount === Number(invoice?.data?.bookingTotalAmount || 0)
          ) {
            paymentStatus = "Unpaid";
          } else if (
            remainingAmount !== 0 &&
            remainingAmount < Number(invoice?.data?.bookingTotalAmount || 0)
          ) {
            paymentStatus = "Partially paid";
          } else if (remainingAmount < 0) {
            paymentStatus = "Over paid";
          } else if (remainingAmount === 0) {
            paymentStatus = "Paid";
          }

          /*    let newTermsAndCondition = invoice?.data?.termsAndCondition || "";
          // only for SMART PROMOTE
          // only for proforma - display the down payment done in terms and condition
          if (
            companyDetails?.id ===
              process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID &&
            paymentDocType === "proforma"
          ) {
            newTermsAndCondition =
              newTermsAndCondition +
              "\n" +
              `Down payment of Rs${Number(partialPaymentAmount).toFixed(
                2
              )} done.`;
          } */

          selectedLineData.push({
            ...invoice,
            paymentAmount: partialPaymentAmount,
            paymentType: partialPaymentType,
            data: {
              ...invoice.data,
              paymentStatus: paymentStatus,
              // termsAndCondition: newTermsAndCondition,
            },
            docRemainingPaymentAmt: remainingAmount,
          });
        }
      });

      // create a payment doc using transaction to check if paymentCounter exists
      // Create a reference to the SF doc.
      var paymentCounterDocRef = db
        .collection("company")
        .doc(companyDetails.id)
        .collection("payment")
        .doc("paymentCounter");

      db.runTransaction(async (transaction) => {
        return transaction.get(paymentCounterDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
            return null;
          }

          var newPaymentCounter = Number(sfDoc.data().paymentCounter || 0) + 1;
          return newPaymentCounter;
        });
      })
        .then(async (result) => {
          if (result === null) {
            await db
              .collection("company")
              .doc(companyDetails.id)
              .collection("payment")
              .doc("paymentCounter")
              .set({ paymentCounter: 1 })
              .then(() => {
                executeBatchUpdate(1, selectedLineData);
              })
              .catch((err) => {
                enqueueSnackbar(
                  `Error occured while creating payment counter: ${err?.message}`,
                  { variant: "error" }
                );
                dispatch(setLoading(false));
              });
          } else if (result && Number(result) > 0) {
            executeBatchUpdate(result, selectedLineData);
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while executing payment transaction: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  function executeBatchUpdate(result, checkedLines) {
    let finalcheckedLines = [];

    let paymentNumberDoc = result.toString();
    if (paymentNumberDoc?.length === 1) {
      paymentNumberDoc = `0000${paymentNumberDoc}`;
    } else if (paymentNumberDoc?.length === 2) {
      paymentNumberDoc = `000${paymentNumberDoc}`;
    } else if (paymentNumberDoc?.length === 3) {
      paymentNumberDoc = `00${paymentNumberDoc}`;
    } else if (paymentNumberDoc?.length === 4) {
      paymentNumberDoc = `0${paymentNumberDoc}`;
    }

    // Get a new write batch
    var batch = db.batch();

    // store payment made
    const paymentdocRefId = result.toString();

    var paymentCounterDocRef = db
      .collection("company")
      .doc(companyDetails.id)
      .collection("payment")
      .doc("paymentCounter");

    var paymentDocRef = db
      .collection("company")
      .doc(companyDetails.id)
      .collection("payment")
      .doc(paymentdocRefId);

    checkedLines.forEach((invoice) => {
      var invoiceRef = db.collection("vehiclebooking").doc(invoice.id);

      let newInvRemainingPaymentAmt = Number(
        invoice?.docRemainingPaymentAmt || 0
      );

      let newAttachedPaymentNumber = [];
      if (
        invoice?.data?.attachedPaymentNumber &&
        invoice?.data?.attachedPaymentNumber?.length > 0
      ) {
        newAttachedPaymentNumber = [
          ...invoice?.data?.attachedPaymentNumber,
          {
            paymentNumber: paymentdocRefId,
            paymentNumberString: paymentNumberDoc,
            paymentType: invoice?.paymentType, // us_paymentType,
            paymentAmount: invoice?.paymentAmount, // us_i_amount,
            paymentRemainingAmount: newInvRemainingPaymentAmt,
            paymentDate: moment(new Date()).format("DD-MM-YYYY"),
          },
        ];
      } else {
        newAttachedPaymentNumber.push({
          paymentNumber: paymentdocRefId,
          paymentNumberString: paymentNumberDoc,
          paymentType: invoice?.paymentType, // us_paymentType,
          paymentAmount: invoice?.paymentAmount, // us_i_amount,
          paymentRemainingAmount: newInvRemainingPaymentAmt,
          paymentDate: moment(new Date()).format("DD-MM-YYYY"),
        });
      }

      let paymentStatus = "";
      if (
        newInvRemainingPaymentAmt ===
        Number(invoice?.data?.bookingTotalAmount || 0)
      ) {
        paymentStatus = "Unpaid";
      } else if (
        newInvRemainingPaymentAmt > 0 &&
        newInvRemainingPaymentAmt <
          Number(invoice?.data?.bookingTotalAmount || 0)
      ) {
        paymentStatus = "Partially paid";
      } else if (newInvRemainingPaymentAmt < 0) {
        paymentStatus = "Over paid";
      } else if (newInvRemainingPaymentAmt === 0) {
        paymentStatus = "Paid";
      }

      finalcheckedLines.push({
        invoiceId: invoice?.id,
        ...invoice?.data,
        attachedPaymentNumber: newAttachedPaymentNumber,
        paymentStatus: paymentStatus,
        docRemainingPaymentAmt: newInvRemainingPaymentAmt,
      });

      batch.set(
        invoiceRef,
        {
          docRemainingPaymentAmt: newInvRemainingPaymentAmt,
          attachedPaymentNumber: newAttachedPaymentNumber,
          paymentStatus: paymentStatus,
        },
        { merge: true }
      );
    });

    // update payment counter
    batch.set(
      paymentCounterDocRef,
      { paymentCounter: Number(result) },
      { merge: true }
    );

    // add new payment doc
    batch.set(
      paymentDocRef,
      {
        invoiceList: finalcheckedLines,
        paymentDate: moment(new Date()).format("DD-MM-YYYY"),
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
      },
      { merge: true }
    );

    // Commit the batch
    batch.commit().then(async () => {
      enqueueSnackbar("Payment stored successfully");

      set_partialPaymentAmountInvoiceId("");
      set_partialPaymentAmount("");
      set_partialPaymentType("");
      set_openPartialPaymentFieldDialog(false);

      await fetchInvoice();
      dispatch(setLoading(false));
    });
  }

  async function deletePayment(
    recentPaymentMade,
    attachedPaymentNumber,
    docRemainingPaymentAmt,
    invoiceId,
    bookingTotalAmount
  ) {
    dispatch(setLoading(true));
    // remove payment from attachedPaymentNumber array
    if (attachedPaymentNumber && attachedPaymentNumber?.length > 0) {
      // search and remove recent payement made
      let newAttachedPaymentNumber = [];
      attachedPaymentNumber.forEach((paymentMade) => {
        if (paymentMade?.paymentNumber !== recentPaymentMade?.paymentNumber) {
          newAttachedPaymentNumber.push({ ...paymentMade });
        }
      });

      let newInvRemainingPaymentAmt = 0;
      // calculate new remaining invoice amount
      if (
        docRemainingPaymentAmt !== undefined &&
        docRemainingPaymentAmt !== null
      ) {
        newInvRemainingPaymentAmt =
          Number(recentPaymentMade?.paymentAmount) +
          Number(docRemainingPaymentAmt);
      }

      let paymentStatus = "";
      if (newInvRemainingPaymentAmt === Number(bookingTotalAmount || 0)) {
        paymentStatus = "Unpaid";
      } else if (
        newInvRemainingPaymentAmt > 0 &&
        newInvRemainingPaymentAmt < Number(bookingTotalAmount || 0)
      ) {
        paymentStatus = "Partially paid";
      } else if (newInvRemainingPaymentAmt < 0) {
        paymentStatus = "Over paid";
      } else if (newInvRemainingPaymentAmt === 0) {
        paymentStatus = "Paid";
      }

      // create batch to update invoice document and payment document

      // Get a new write batch
      var batch = db.batch();

      var invoiceRef = db.collection("vehiclebooking").doc(invoiceId);

      var paymentDocRef = db
        .collection("company")
        .doc(companyDetails.id)
        .collection("payment")
        .doc(recentPaymentMade?.paymentNumber);

      // update invoice document
      batch.set(
        invoiceRef,
        {
          attachedPaymentNumber: newAttachedPaymentNumber,
          docRemainingPaymentAmt: newInvRemainingPaymentAmt,
          paymentStatus: paymentStatus,
        },
        { merge: true }
      );

      // update payment document
      batch.set(
        paymentDocRef,
        {
          isDeleted: true,
          deletedTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Commit the batch
      batch
        .commit()
        .then(async () => {
          enqueueSnackbar("Payment removed and Invoice updated successfully.");
          await fetchInvoice();
          dispatch(setLoading(false));
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while executing batch: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      dispatch(setLoading(false));
    }
  }

  async function handleDoFullPayment(invoiceId) {
    // get selected invoice
    let invoiceSelected = us_invoicelist.find(
      (invoice) => invoice.id === invoiceId
    );

    if (!isEmpty(invoiceSelected)) {
      dispatch(setLoading(true));
      // create a payment doc using transaction to check if paymentCounter exists
      // Create a reference to the SF doc.
      var paymentCounterDocRef = db
        .collection("company")
        .doc(companyDetails.id)
        .collection("payment")
        .doc("paymentCounter");

      db.runTransaction(async (transaction) => {
        return transaction.get(paymentCounterDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
            return null;
          }

          var newPaymentCounter = Number(sfDoc.data().paymentCounter || 0) + 1;
          return newPaymentCounter;
        });
      })
        .then(async (result) => {
          if (result === null) {
            await db
              .collection("company")
              .doc(companyDetails.id)
              .collection("payment")
              .doc("paymentCounter")
              .set({ paymentCounter: 1 })
              .then(async () => {
                await executeInvoiceUpdateFullPayment(1, invoiceSelected);
              })
              .catch((err) => {
                enqueueSnackbar(
                  `Error occured while creating payment counter: ${err?.message}`,
                  { variant: "error" }
                );
                dispatch(setLoading(false));
              });
          } else if (result && Number(result) > 0) {
            await executeInvoiceUpdateFullPayment(result, invoiceSelected);
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while executing payment transaction: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  async function executeInvoiceUpdateFullPayment(result, invoiceSelected) {
    let paymentNumberDoc = result.toString();
    if (paymentNumberDoc?.length === 1) {
      paymentNumberDoc = `0000${paymentNumberDoc}`;
    } else if (paymentNumberDoc?.length === 2) {
      paymentNumberDoc = `000${paymentNumberDoc}`;
    } else if (paymentNumberDoc?.length === 3) {
      paymentNumberDoc = `00${paymentNumberDoc}`;
    } else if (paymentNumberDoc?.length === 4) {
      paymentNumberDoc = `0${paymentNumberDoc}`;
    }

    // Get a new write batch
    var batch = db.batch();

    // store payment made
    const paymentdocRefId = result.toString();

    var paymentCounterDocRef = db
      .collection("company")
      .doc(companyDetails.id)
      .collection("payment")
      .doc("paymentCounter");

    var paymentDocRef = db
      .collection("company")
      .doc(companyDetails.id)
      .collection("payment")
      .doc(paymentdocRefId);

    var invoiceDocRef = db.collection("vehiclebooking").doc(invoiceSelected.id);

    // update payment counter
    batch.set(
      paymentCounterDocRef,
      { paymentCounter: Number(result) },
      { merge: true }
    );

    // add new payment doc
    batch.set(
      paymentDocRef,
      {
        invoiceList: [{ ...invoiceSelected }],
        paymentDate: moment(new Date()).format("DD-MM-YYYY"),
        dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
      },
      { merge: true }
    );

    batch.set(
      invoiceDocRef,
      {
        paymentStatus: "Paid",
        docRemainingPaymentAmt: 0,
        attachedPaymentNumber: [
          {
            paymentNumber: paymentdocRefId,
            paymentNumberString: paymentNumberDoc,
            paymentType: "",
            paymentAmount: invoiceSelected?.data?.bookingTotalAmount || 0,
            paymentRemainingAmount: 0,
            paymentDate: moment(new Date()).format("DD-MM-YYYY"),
          },
        ],
      },
      { merge: true }
    );

    // Commit the batch
    batch.commit().then(async () => {
      enqueueSnackbar("Full payment stored successfully");
      await fetchInvoice();
      dispatch(setLoading(false));
    });
  }

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
          .collection("vehiclebooking")
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

            .collection("vehiclebooking")
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

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

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
              <Typography variant="h3">Payment/Expense section</Typography>
            </Stack>
          </Grid>

          <Suspense fallback={<></>}>
            <CompanyClientSelection type={"payment"} />
          </Suspense>
          <br />
          <br />

          {companyDetails && (
            <>
              <Grid item xs={12} md={12}>
                <Stack spacing={3}>
                  <hr />
                  <Typography>
                    Please choose any booking and insert an amount
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
                      <br />
                      <FormControl
                        fullWidth
                        variant="outlined"
                        size="small"
                        style={{ width: "300px" }}
                        disabled={
                          !us_invoicelist || us_invoicelist?.length === 0
                        }
                      >
                        <InputLabel id="paymentType-select-label">
                          Filter
                        </InputLabel>
                        <Select
                          labelId="paymentType-select-label"
                          label="Filter"
                          value={us_filter || ""}
                          onChange={(event) => {
                            set_us_filter(event.target.value);
                          }}
                        >
                          <MenuItem value={""}>All</MenuItem>
                          <MenuItem value={"Unpaid"}>Unpaid</MenuItem>
                          <MenuItem value={"Partially paid"}>
                            Partially paid
                          </MenuItem>
                          <MenuItem value={"Over paid"}>Over paid</MenuItem>
                          <MenuItem value={"Paid"}>Paid</MenuItem>
                        </Select>
                      </FormControl>

                      <br />
                      <TableContainer>
                        <Table border={1}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Status
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                View booking details
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Booking Number
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Datetime created
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Do full payment
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Add partial payment
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Bill to
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Booking amount
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Remaining amount
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Recent payment made
                              </TableCell>
                              <TableCell
                                size="small"
                                align="center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Upload/view screenshot
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {us_invoicelist &&
                              us_invoicelist?.length > 0 &&
                              us_invoicelist
                                .filter(
                                  (obj) =>
                                    (us_filter === "" &&
                                      obj?.data?.paymentStatus !== "") ||
                                    (us_filter !== "" &&
                                      obj?.data?.paymentStatus === us_filter)
                                )
                                ?.map((invoice, index) => (
                                  <TableRow key={index}>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      {invoice?.data?.paymentStatus ||
                                        "Un Paid"}
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
                                          onClick={() => {
                                            dispatch(
                                              setBookingData({
                                                ...invoice?.data,
                                                bookingPickupDate:
                                                  invoice?.data?.bookingPickupDate.toDate(),

                                                bookingReturnDate:
                                                  invoice?.data?.bookingReturnDate.toDate(),
                                              })
                                            );
                                            setOpenUpdateDialog(true);
                                          }}
                                        >
                                          <Iconify icon={"carbon:view"} />
                                        </IconButton>
                                      </Stack>
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      {invoice?.data?.bookingId || ""}
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      {moment(
                                        invoice?.data?.dateCreated.toDate()
                                      ).format("DD-MM-YYYY, HH:MM:ss")}
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                          handleDoFullPayment(invoice?.id)
                                        }
                                        disabled={
                                          (Number(
                                            invoice?.data
                                              ?.docRemainingPaymentAmt
                                          ) <
                                            Number(
                                              invoice?.data?.bookingTotalAmount
                                            ) &&
                                            Number(
                                              invoice?.data
                                                ?.docRemainingPaymentAmt
                                            ) > 0) ||
                                          Number(
                                            invoice?.data
                                              ?.docRemainingPaymentAmt
                                          ) === 0
                                        }
                                      >
                                        Make full payment
                                      </Button>
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                          set_partialPaymentAmountInvoiceId(
                                            invoice?.id
                                          );
                                          set_openPartialPaymentFieldDialog(
                                            true
                                          );
                                        }}
                                        disabled={
                                          Number(
                                            invoice?.data
                                              ?.docRemainingPaymentAmt
                                          ) === 0
                                        }
                                      >
                                        Add partial-payment
                                      </Button>
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      {invoice?.data?.clientName || ""}
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      <CurrencyFormat
                                        value={Number(
                                          invoice?.data?.bookingTotalAmount || 0
                                        ).toFixed(2)}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                      />
                                    </TableCell>

                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{
                                        whiteSpace: "nowrap",
                                        background:
                                          Number(
                                            invoice?.docRemainingPaymentAmt || 0
                                          ) === 0
                                            ? "#C6FEBE" // success flag
                                            : Number(
                                                invoice?.docRemainingPaymentAmt ||
                                                  0
                                              ) < 0
                                            ? "#FEC3BE" // error flag
                                            : "#FEFEBE", // warning flag
                                      }}
                                    >
                                      {Number(
                                        invoice?.docRemainingPaymentAmt || 0
                                      ).toFixed(2)}
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      {invoice?.data?.attachedPaymentNumber &&
                                      invoice?.data?.attachedPaymentNumber
                                        ?.length > 0
                                        ? invoice?.data?.attachedPaymentNumber?.map(
                                            (recentPayment, index) => (
                                              <Fragment key={index}>
                                                <Stack
                                                  direction={"row"}
                                                  alignItems={"center"}
                                                >
                                                  <IconButton
                                                    onClick={() =>
                                                      deletePayment(
                                                        recentPayment,
                                                        invoice?.data
                                                          ?.attachedPaymentNumber,
                                                        invoice?.docRemainingPaymentAmt,
                                                        invoice?.id,
                                                        invoice?.data
                                                          ?.bookingTotalAmount
                                                      )
                                                    }
                                                    disabled={
                                                      !user?.permissions?.deleteFullPartialPaymentChk?.assignedCompanyId?.includes(
                                                        companyDetails?.id
                                                      )
                                                    }
                                                  >
                                                    <DeleteIcon color="error" />
                                                  </IconButton>
                                                  <Typography>{`Date: ${
                                                    recentPayment?.paymentDate
                                                  }, Payment: ${Number(
                                                    recentPayment?.paymentAmount
                                                  ).toFixed(2)}`}</Typography>
                                                </Stack>
                                                <Divider />
                                              </Fragment>
                                            )
                                          )
                                        : "No recent payment made"}
                                    </TableCell>
                                    <TableCell
                                      size="small"
                                      align="center"
                                      style={{ whiteSpace: "nowrap" }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                          set_us_open_screenshot_dialog(true);
                                          set_us_screenshot_invoice_data({
                                            invoiceId: invoice?.id,
                                            invoiceScreenshotData:
                                              invoice?.data
                                                ?.invoiceScreenshotData || null,
                                            invoiceData: { ...invoice?.data },
                                          });
                                        }}
                                      >
                                        upload/view
                                      </Button>
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
                              style={{ whiteSpace: "nowrap" }}
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
                              style={{ whiteSpace: "nowrap" }}
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
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {expense?.expenseDesc || ""}
                            </TableCell>
                            <TableCell
                              size="small"
                              style={{ whiteSpace: "nowrap" }}
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
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <IconButton
                                onClick={() => {
                                  deleteExpense(expense, index);
                                }}
                                disabled={!user?.permissions?.deleteExpense}
                                color="error"
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

      {openPartialPaymentFieldDialog ? (
        <>
          <Dialog
            open={openPartialPaymentFieldDialog}
            onClose={() => {
              set_partialPaymentAmountInvoiceId("");
              set_partialPaymentAmount("");
              set_partialPaymentType("");
              set_openPartialPaymentFieldDialog(false);
            }}
            fullWidth
            maxWidth={"sm"}
          >
            <DialogTitle>Add partial payment</DialogTitle>
            <DialogContent>
              <br />
              <Stack spacing={3}>
                <TextField
                  variant="outlined"
                  name="payment"
                  label="Payment amount"
                  id="payment"
                  type="text"
                  value={partialPaymentAmount || ""}
                  size="small"
                  fullWidth
                  onChange={(event) =>
                    set_partialPaymentAmount(event.target.value)
                  }
                  required
                />

                <FormControl
                  fullWidth
                  variant="outlined"
                  size="small"
                  style={{
                    background:
                      Number(partialPaymentAmount || 0) > 0 &&
                      partialPaymentType === ""
                        ? "#FEFEBE"
                        : "transparent",
                  }}
                  disabled={
                    !partialPaymentAmount ||
                    Number(partialPaymentAmount || 0) === 0 ||
                    Number(partialPaymentAmount || 0) < 0
                  }
                >
                  <InputLabel required id="paymentType-select-label">
                    Choose type
                  </InputLabel>
                  <Select
                    required
                    labelId="paymentType-select-label"
                    label="Choose type"
                    value={partialPaymentType || ""}
                    onChange={(event) => {
                      set_partialPaymentType(event.target.value);
                    }}
                  >
                    <MenuItem value={""}>Choose a payment type</MenuItem>
                    <MenuItem value={"cheque"}>Cheque</MenuItem>
                    <MenuItem value={"cash"}>Cash</MenuItem>
                    <MenuItem value={"JUICE"}>JUICE</MenuItem>
                    <MenuItem value={"Bank Transfer"}>Bank Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => addPartialPayment()}
                variant="contained"
                color="primary"
                disabled={
                  !partialPaymentAmountInvoiceId ||
                  !partialPaymentAmount ||
                  !partialPaymentType
                }
              >
                Add
              </Button>
              <Button
                onClick={() => {
                  set_partialPaymentAmountInvoiceId("");
                  set_partialPaymentAmount("");
                  set_partialPaymentType("");
                  set_openPartialPaymentFieldDialog(false);
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

      {openUpdateDialog ? (
        <UpdateVehicleBookingDialog
          open={openUpdateDialog}
          setOpen={setOpenUpdateDialog}
          fetchBooking={fetchInvoice}
          viewOnly={true}
        />
      ) : (
        <></>
      )}
    </Page>
  );
}
