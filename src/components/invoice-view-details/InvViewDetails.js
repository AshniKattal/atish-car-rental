import { Suspense, useEffect, useRef, useState, lazy } from "react";
// @mui
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import db, { functions } from "../../firebase";
import { useSnackbar } from "notistack";
import { setLoading } from "../../features/globalSlice";
import firebase from "firebase/compat";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker } from "@mui/lab";
import {
  selectDocument,
  setUpdateDocumentData,
} from "../../features/documentSlice";
import DocumentInputDetails from "../document/DocumentInputDetails";
import useAuth from "../../hooks/useAuth";
import Iconify from "../Iconify";
import CurrencyFormat from "react-currency-format";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleViewDownload } from "../core-functions/SelectionCoreFunctions";
import emailjs from "@emailjs/browser";
import { pdf } from "@react-pdf/renderer";
import InvTransportTemplatePdf from "../invoice-pdf/transport-custom/InvTransportTemplatePdf";
import InvPdf from "../invoice-pdf/InvPdf";

const CCDialog = lazy(() => import("./CCDialog"));

/* const PdfDialog = lazy(() => import("./pdf-dialog/PdfDialog")); */

// ----------------------------------------------------------------------

export default function InvViewDetails({
  viewOnly,
  searchAndChoose,
  chooseDocument,
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { user } = useAuth();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const {
    documentType,
    companyIdSelected,
    companyDetails,
    clientDocumentObjectSelected,
  } = useSelector(selectDocument);

  /*   const [openPdf, set_openPdf] = useState(false); */

  /*   const [pdfContent, set_pdfContent] = useState(null);

  const [downloadPdf, set_downloadPdf] = useState(false); */

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [logo, setLogo] = useState("");

  const [sigImage, setSigImage] = useState("");

  const [us_documentlist, set_us_documentlist] = useState([]);

  const temp_logo_image_ref = useRef();

  const temp_signature_image_ref = useRef();

  const temp_fetch_document_ref = useRef();

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [us_open_convertTo_dialog, set_us_open_convertTo_dialog] =
    useState(false);

  const [conversionValue, set_conversionValue] = useState("vat_invoice");

  const [selectedProformaDoc, set_selectedProformaDoc] = useState(null);

  const [selectedProformaFilter, set_selectedProformaFilter] = useState(null);

  const [us_openCCDialog, set_us_openCCDialog] = useState({
    open: false,
    type: "",
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // convert logo image to adaptable react-pdf image
    temp_logo_image_ref.current();
    // convert signature image to adaptable react-pdf image
    temp_signature_image_ref.current();
  }, [companyDetails]);

  useEffect(() => {
    temp_fetch_document_ref.current();
  }, [
    documentType,
    us_fromDate,
    us_ToDate,
    companyDetails,
    clientDocumentObjectSelected,
  ]);

  async function fetchDocument() {
    if (
      us_fromDate !== undefined &&
      us_fromDate !== "" &&
      us_ToDate !== undefined &&
      us_ToDate !== "" &&
      documentType?.id &&
      documentType?.id !== ""
    ) {
      if (new Date(us_fromDate) > new Date(us_ToDate)) {
        enqueueSnackbar(`Date incorrect. To Date cannot be before From Date.`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      } else if (
        companyDetails !== undefined &&
        clientDocumentObjectSelected !== undefined
      ) {
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
          .collection(documentType?.id)
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
            let docArray = [];
            if (querySnapshot?.docs?.length > 0) {
              querySnapshot?.docs.forEach((document) => {
                // filter by client selected
                if (
                  document?.data()?.clientId ===
                    clientDocumentObjectSelected?.id &&
                  !document?.data()?.deleted
                ) {
                  let valid = true;
                  if (
                    documentType?.id === "proforma" &&
                    document?.data()?.isProformaConverted
                  ) {
                    valid = false;
                  }

                  if (valid) {
                    docArray.push({
                      id: document?.id,
                      data: document?.data(),
                      checked: false,
                    });
                  }
                }
              });
              set_us_documentlist(docArray);
            } else {
              set_us_documentlist([]);
            }
            dispatch(setLoading(false));
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while fetching ${documentType?.title} documents: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    } else {
      dispatch(setLoading(false));
    }
  }

  temp_fetch_document_ref.current = fetchDocument;

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

  /*   async function applyVoid(voidBool, invoiceId) {
    if (documentType?.id === "vat_invoice" || documentType?.id === "invoice") {
      dispatch(setLoading(true));
      await db
        .collection("company")
        .doc(companyDetails?.id)
        .collection(documentType?.id)
        .doc(invoiceId)
        .set({ isVoid: voidBool }, { merge: true })
        .then(async () => {
          await fetchDocument();
          enqueueSnackbar(`${documentType?.title} updated successfully`, {
            variant: "success",
          });
          dispatch(setLoading(false));
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while updating void: ${err?.message}`,
            {
              variant: "error",
            }
          );
          dispatch(setLoading(false));
        });
    }
  } */

  const handleCloseUpdateDialog = (isUpdateDone) => {
    dispatch(setUpdateDocumentData(undefined));
    setOpenUpdateDialog(false);

    if (isUpdateDone) {
      fetchDocument();
    }
  };

  async function confirmConversion() {
    if (conversionValue) {
      dispatch(setLoading(true));

      // update status of proforma to "converted to Invoice or vatInvoice"
      let invoiceDocumentData = {
        ...selectedProformaDoc?.data,
        createdFromProfroma: true,
        previousProformaDocId: selectedProformaDoc?.id,
      };

      var documentDocRef = db
        .collection("company")
        .doc(companyIdSelected)
        .collection(conversionValue)
        .doc("documentIndex");

      db.runTransaction((transaction) => {
        return transaction.get(documentDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
            // throw "Document does not exist!";
            transaction.update(documentDocRef, {
              documentIndex: 1,
            });
            return 1;
          }

          var newDocumentNumber = Number(sfDoc.data().documentIndex) + 1;
          transaction.update(documentDocRef, {
            documentIndex: newDocumentNumber,
          });
          return newDocumentNumber;
        });
      })
        .then(async (newDocumentNumber) => {
          let documentNumber = newDocumentNumber.toString();
          if (documentNumber?.length === 1) {
            documentNumber = `0000${documentNumber}`;
          } else if (documentNumber?.length === 2) {
            documentNumber = `000${documentNumber}`;
          } else if (documentNumber?.length === 3) {
            documentNumber = `00${documentNumber}`;
          } else if (documentNumber?.length === 4) {
            documentNumber = `0${documentNumber}`;
          }

          const documents = [
            {
              id: "quotation",
              title: "Quotation",
            },
            {
              id: "invoice",
              title: "Invoice",
            },
            {
              id: "vat_invoice",
              title: "VAT Invoice",
            },
            {
              id: "purchase_order",
              title: "Purchase order",
            },
            {
              id: "proforma",
              title: "Proforma",
            },
          ];

          let documentTitle = documents.find(
            (doc) => doc?.id === conversionValue
          )?.title;

          const newDocumentData = {
            ...invoiceDocumentData,
            id: newDocumentNumber.toString(),
            docString: documentNumber,
            docTitle: documentTitle,
            docType: conversionValue,
            docDate: firebase.firestore.Timestamp.fromDate(new Date()),
            convertedByUserId: user?.id || "",
            convertedByUserEmail: user?.email || "",
            convertedByUserTime: new Date(),
          };

          // smart promote
          // update all transactions list
          if (
            companyDetails?.id === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID
          ) {
            invoiceDocumentData.docParticulars.forEach(async (row) => {
              if (row?.inventoryItemData) {
                await db
                  .collection("company")
                  .doc(companyDetails?.id)
                  .collection("inventory")
                  .doc(row?.inventoryItemData?.id)
                  .get()
                  .then(async (itemData) => {
                    if (itemData.exists) {
                      let allInventoryItemTransactions =
                        itemData?.data()?.allInventoryItemTransactions || [];

                      // find proforma index
                      let newAllInventoryItemTransactions = [
                        ...(allInventoryItemTransactions || []),
                      ];
                      let proformaIndex =
                        allInventoryItemTransactions.findIndex(
                          (transaction) =>
                            transaction?.docType === "proforma" &&
                            transaction?.docString === selectedProformaDoc?.id
                        );

                      if (proformaIndex > -1) {
                        newAllInventoryItemTransactions[proformaIndex] = {
                          ...newAllInventoryItemTransactions[proformaIndex],
                          documentNumber: newDocumentNumber.toString(),
                          docString: documentNumber,
                          docTitle: documentTitle,
                          docType: conversionValue,
                          docDate: firebase.firestore.Timestamp.fromDate(
                            new Date()
                          ),
                          docDate: new Date(),
                          profomaConverted: true,
                          previousProformaNumber: selectedProformaDoc?.id,
                        };

                        await db
                          .collection("company")
                          .doc(companyDetails?.id)
                          .collection("inventory")
                          .doc(row?.inventoryItemData?.id)
                          .set(
                            {
                              allInventoryItemTransactions:
                                newAllInventoryItemTransactions || [],
                            },
                            { merge: true }
                          );
                      }
                    }
                  });
              }
            });
          }

          // save new invoice/Vat invoice document
          await db
            .collection("company")
            .doc(companyIdSelected)
            .collection(conversionValue)
            .doc(documentNumber.toString())
            .set(
              {
                ...newDocumentData,
              },
              { merge: true }
            )
            .then(async () => {
              enqueueSnackbar(
                `New ${documentTitle} document has been created successfully`
              );

              // apply full payment for smart promote
              if (
                companyIdSelected ===
                process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID
              ) {
                await applyPayment(
                  {
                    id: documentNumber.toString(),
                    data: { ...newDocumentData },
                  },
                  "FULL"
                );
              }

              //update proforma document status
              dispatch(setLoading(true));
              await db
                .collection("company")
                .doc(companyIdSelected)
                .collection("proforma")
                .doc(selectedProformaDoc?.id)
                .set(
                  {
                    conversionDocId: conversionValue,
                    conversionDocTitle: documentTitle,
                    isProformaConverted: true,
                  },
                  { merge: true }
                )
                .then(() => {
                  enqueueSnackbar(`Proforma status updated successfully`);

                  // close dialog
                  set_us_open_convertTo_dialog(false);

                  // reset dialog data
                  set_conversionValue("vat_invoice");
                  set_selectedProformaDoc(null);

                  fetchDocument();

                  dispatch(setLoading(false));
                })
                .catch((err) => {
                  enqueueSnackbar(
                    `Error occured while updating proforma status: ${err?.message}`,
                    { variant: "error" }
                  );
                  dispatch(setLoading(false));
                });
            })
            .catch((err) => {
              enqueueSnackbar(
                `Error occured while saving Invoice: ${err?.message}`,
                { variant: "error" }
              );
              dispatch(setLoading(false));
            });
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while overall Invoice saving transactions: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      enqueueSnackbar(`Please choose a conversion type`);
    }
  }

  const deleteDocument = async (documentId, data) => {
    dispatch(setLoading(true));

    // format collection name
    let deletedCollectionName = `deleted${documentType?.id}`;

    if (
      companyDetails?.id === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID &&
      (documentType?.id === "proforma" ||
        documentType?.id === "invoice" ||
        documentType?.id === "vat_invoice" ||
        documentType?.id === "cash_transaction")
    ) {
      // update stock
      let docParticulars = [...(data?.docParticulars || [])];
      docParticulars.forEach(async (row) => {
        if (row?.inventoryItemData) {
          // get latest stock remaining amount
          await db
            .collection("company")
            .doc(companyDetails?.id)
            .collection("inventory")
            .doc(row?.inventoryItemData?.id)
            .get()
            .then(async (doc) => {
              if (doc.exists) {
                // get previous transactions for that inventory
                let allInventoryItemTransactionsData =
                  doc?.data()?.allInventoryItemTransactions || [];

                // check the qty sold for that item with the same doc id
                let isDocFoundIndex = -1;

                if (allInventoryItemTransactionsData.length > 0) {
                  isDocFoundIndex = allInventoryItemTransactionsData.findIndex(
                    (transaction) =>
                      transaction.docString === documentId &&
                      transaction?.docType === documentType?.id
                  );
                }

                let totalQtySold = Number(doc?.data()?.qtySold || 0);
                let totalQtyRemaining = Number(doc?.data()?.qtyRemaining || 0);

                let newTotalAmountReceivedWithoutVAT = Number(
                  doc?.data()?.totalAmountReceivedWithoutVAT || 0
                );

                let newTotalAmountReceivedWithVAT = Number(
                  doc?.data()?.totalAmountReceivedWithVAT || 0
                );

                if (isDocFoundIndex > -1) {
                  // get the qty Sold
                  let OldQtySold = Number(
                    allInventoryItemTransactionsData[isDocFoundIndex]
                      ?.itemQtySold || 0
                  );

                  // rebuild total remaining qty
                  totalQtyRemaining = totalQtyRemaining + OldQtySold;

                  // rebuild qty sold
                  totalQtySold = totalQtySold - OldQtySold;

                  newTotalAmountReceivedWithoutVAT =
                    newTotalAmountReceivedWithoutVAT -
                    Number(
                      allInventoryItemTransactionsData[isDocFoundIndex]
                        ?.rowDiscountedAmount ||
                        allInventoryItemTransactionsData[isDocFoundIndex]
                          ?.rowAmount ||
                        0
                    );

                  newTotalAmountReceivedWithVAT =
                    newTotalAmountReceivedWithVAT -
                    Number(
                      allInventoryItemTransactionsData[isDocFoundIndex]
                        ?.rowAmountWithVAT || 0
                    );
                }

                let allInventoryItemTransactions = [];

                if (isDocFoundIndex > -1) {
                  // update data if already present

                  allInventoryItemTransactionsData.forEach((transaction) => {
                    let valid = false;
                    if (
                      transaction?.docString === documentId &&
                      transaction?.docType === documentType?.id
                    ) {
                      valid = false;
                    } else {
                      valid = true;
                    }

                    if (valid) {
                      allInventoryItemTransactions.push({ ...transaction });
                    }
                  });
                }

                await db
                  .collection("company")
                  .doc(companyDetails?.id)
                  .collection("inventory")
                  .doc(row?.inventoryItemData?.id)
                  .set(
                    {
                      totalAmountReceivedWithoutVAT: Number(
                        newTotalAmountReceivedWithoutVAT || 0
                      ).toFixed(2),
                      totalAmountReceivedWithVAT: Number(
                        newTotalAmountReceivedWithVAT || 0
                      ).toFixed(2),
                      qtySold: totalQtySold || 0,
                      qtyRemaining: totalQtyRemaining || 0,
                      allInventoryItemTransactions:
                        allInventoryItemTransactions || [],
                    },
                    { merge: true }
                  )
                  .then(() => {
                    enqueueSnackbar("Stock updated successfully");
                  })
                  .catch((error) => {
                    enqueueSnackbar(
                      `Error occured while updating quantity of inventory item: ${error?.message}`,
                      { variant: "error" }
                    );
                  });
              } else {
                enqueueSnackbar(
                  "Stock could not be updated as item could not be found, please check inventory",
                  { variant: "error" }
                );
              }
            });
        }
      });
    }

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection(deletedCollectionName)
      .add({
        deleted: true,
        deletedByUserId: user?.id,
        deletedByUserEmail: user?.email,
        deletedByUserTime: new Date(),
        id: documentId,
        ...data,
      })
      .then(async () => {
        await db
          .collection("company")
          .doc(companyDetails?.id)
          .collection(documentType?.id)
          .doc(documentId)
          .delete()
          .then(() => {
            enqueueSnackbar("Document deleted successfully", {
              variant: "success",
            });

            fetchDocument();
            dispatch(setLoading(false));
          })
          .catch((error) => {
            enqueueSnackbar(
              `Error occured while deleting document: ${error?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while deleting document: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  async function uploadToMRA(invoiceData) {
    if (!invoiceData?.data?.transactionType?.id) {
      enqueueSnackbar("Please choose a type of transaction.", {
        variant: "warning",
      });
    } else if (!companyDetails?.data?.vatOrNonVatRegistered?.id) {
      enqueueSnackbar(
        "Company VAT Registration status is missing, please update company details",
        {
          variant: "warning",
        }
      );
    } else if (!invoiceData?.data?.docIssuedDateTime) {
      enqueueSnackbar("Issue date of invoice is missing", {
        variant: "warning",
      });
    } else if (!invoiceData?.data?.invoiceTypeDesc?.id) {
      enqueueSnackbar("Type of Invoice is missing", {
        variant: "warning",
      });
    } else if (
      (invoiceData?.data?.invoiceTypeDesc?.id === "DRN" ||
        invoiceData?.data?.invoiceTypeDesc?.id === "CRN") &&
      !invoiceData?.data?.invoiceRefIdentifier
    ) {
      enqueueSnackbar("Invoice number is missing", {
        variant: "warning",
      });
    } else {
      if (isOnline) {
        const checkedInvoices = [{ ...invoiceData }];

        const submitMultipleInvoicesToMra = functions.httpsCallable(
          "submitmultipleinvoicestomra"
        );
        submitMultipleInvoicesToMra({
          user: JSON.stringify(user),
          invoices: JSON.stringify(checkedInvoices),
          companyIdSelected: companyIdSelected,
          documentType: JSON.stringify(documentType),
          brn: companyDetails?.data?.brn,
          companyDetails: JSON.stringify(companyDetails),
          clientDocumentObjectSelected: JSON.stringify(
            clientDocumentObjectSelected
          ),
        });

        fetchDocument();
        dispatch(setLoading(false));
      } else {
        enqueueSnackbar("You are currently offline.", { variant: "error" });
        dispatch(setLoading(false));
      }
    }
  }

  async function submitMultipleInvoiceToMRA() {
    if (!companyDetails?.data?.vatOrNonVatRegistered?.id) {
      enqueueSnackbar(
        "Company VAT Registration status is missing, please update company details",
        {
          variant: "warning",
        }
      );
    } else {
      const checkedInvoices = us_documentlist.filter(
        (doc) => doc?.checked === true
      );

      if (checkedInvoices && checkedInvoices.length > 0) {
        let errorFound = false;
        checkedInvoices.forEach((invoiceData) => {
          if (!invoiceData?.data?.transactionType?.id) {
            errorFound = true;
            enqueueSnackbar(
              `Error found, inv num ${invoiceData?.data?.docString}. Please choose a type of transaction.`,
              {
                variant: "warning",
              }
            );
          } else if (!invoiceData?.data?.docIssuedDateTime) {
            errorFound = true;
            enqueueSnackbar(
              `Error found, inv num ${invoiceData?.data?.docString}. Issued date of invoice is missing`,
              {
                variant: "warning",
              }
            );
          } else if (!invoiceData?.data?.invoiceTypeDesc?.id) {
            errorFound = true;
            enqueueSnackbar(
              `Error found, inv num ${invoiceData?.data?.docString}.Type of Invoice is missing`,
              {
                variant: "warning",
              }
            );
          }
        });

        if (!errorFound) {
          if (isOnline) {
            const submitMultipleInvoicesToMra = functions.httpsCallable(
              "submitmultipleinvoicestomra"
            );
            submitMultipleInvoicesToMra({
              user: JSON.stringify(user),
              invoices: JSON.stringify(checkedInvoices),
              companyIdSelected: companyIdSelected,
              documentType: JSON.stringify(documentType),
              brn: companyDetails?.data?.brn,
              companyDetails: JSON.stringify(companyDetails),
              clientDocumentObjectSelected: JSON.stringify(
                clientDocumentObjectSelected
              ),
            });

            fetchDocument();
            dispatch(setLoading(false));
          } else {
            enqueueSnackbar("You are currently offline.", { variant: "error" });
            dispatch(setLoading(false));
          }
        }
      }
    }
  }

  const sendMultipleEmail = (type, invoiceContent, ccField) => {
    dispatch(setLoading(true));

    if (!clientDocumentObjectSelected?.data?.name) {
      enqueueSnackbar("Client name is missing", { variant: "error" });
      dispatch(setLoading(false));
    } else if (!clientDocumentObjectSelected?.data?.name) {
      enqueueSnackbar("Your company name is missing", { variant: "error" });
      dispatch(setLoading(false));
    } else if (!clientDocumentObjectSelected?.data?.email) {
      enqueueSnackbar("Client email is missing", { variant: "error" });
      dispatch(setLoading(false));
    } else if (!clientDocumentObjectSelected?.data.email) {
      enqueueSnackbar("Your company email is missing", { variant: "error" });
      dispatch(setLoading(false));
    } else if (!companyDetails?.data?.serviceKey) {
      enqueueSnackbar("Service key is missing", { variant: "error" });
      dispatch(setLoading(false));
    } else if (!companyDetails?.data?.templateKey) {
      enqueueSnackbar("Template key is missing", { variant: "error" });
      dispatch(setLoading(false));
    } else {
      let selectedInvoices = [];

      if (type === "single") {
        selectedInvoices.push({ ...invoiceContent });
      } else {
        selectedInvoices = us_documentlist.filter(
          (invoice) => invoice.checked === true
        );
      }

      const promises = [];
      selectedInvoices.forEach((doc) => {
        promises.push(
          new Promise(async (resolve) => {
            const content = {
              companyChosenObj: {
                id:
                  companyDetails?.id && companyDetails?.id !== ""
                    ? companyDetails?.id
                    : "",
                data: {
                  ...companyDetails?.data,
                },
              },
              clientChosenObj: {
                data: {
                  ...clientDocumentObjectSelected?.data,
                },
              },
              invDetails: {
                docTitle: doc?.data?.docTitle || "",
                docType: doc?.data?.docType || "",
                docQuoteNumber: doc?.data?.docQuoteNumber || "",
                docPurchaseOrderNumber: doc?.data?.docPurchaseOrderNumber || "",
                docBillTo: doc?.data?.docBillTo || "",
                docShipTo: doc?.data?.docShipTo || "",
                docTermsAndCondition: doc?.data?.docTermsAndCondition || "",
                invDate:
                  moment(doc?.data?.docDate.toDate()).format("DD-MM-YYYY") ||
                  "",
                invParticulars: doc?.data?.docParticulars || [],
                invTotal: doc?.data?.docTotal || 0,
                invoiceString: doc?.data?.docString || "",
                invVatFee: doc?.data?.docVatFee || 0,
                invSubTotal: doc?.data?.docSubTotal || 0,
                paymentStatus: doc?.data?.paymentStatus || "",

                //custom details
                docBLNumber: doc?.data?.docBLNumber || "",
                docSupplier: doc?.data?.docSupplier || "",
                docContainerNumber: doc?.data?.docContainerNumber || "",
                docPackages: doc?.data?.docPackages || "",
                docDescription: doc?.data?.docDescription || "",
                docGrossWeight: doc?.data?.docGrossWeight || "",
                docVolume: doc?.data?.docVolume || "",
                docPortOfLoading: doc?.data?.docPortOfLoading || "",
                docETA: doc?.data?.docETA || "",
                docVesselName: doc?.data?.docVesselName || "",
                docRoE: doc?.data?.docRoE || "",
                docPlaceOfLanding: doc?.data?.docPlaceOfLanding || "",

                // MRA customs
                discountTotalAmount: doc?.data?.discountTotalAmount || "",
                discountedTotalAmount: doc?.data?.discountedTotalAmount || "",

                // transport template
                invJobRef: doc?.data?.invJobRef || "",
                invStorageFee: doc?.data?.invStorageFee || "",
                invScanningFee: doc?.data?.invScanningFee || "",
                invGatePassFee: doc?.data?.invGatePassFee || "",
                invVehicleNo: doc?.data?.invVehicleNo || "",
                transportFees: doc?.data?.transportFees || "",
                transportDesc: doc?.data?.transportDesc || "",
                invApplyVat: doc?.data?.invApplyVat || false,

                // flexitrans customs
                docShipper: doc?.data?.docShipper || "",
                docMarkNos: doc?.data?.docMarkNos || "",
                docCommodity: doc?.data?.docCommodity || "",
                docHbl: doc?.data?.docHbl || "",
                docDepot: doc?.data?.docDepot || "",
              },
              logo: logo || "",
              sigImage: sigImage || "",
            };

            let qrCodeUri = "";
            if (doc?.data?.mraFinalisationData?.fiscalisedInvoices) {
              let qrCode =
                doc?.data?.mraFinalisationData?.fiscalisedInvoices[0]?.qrCode;

              // Construct data URI data:image/png;base64,
              const dataUri = `data:image/jpeg/png;base64,${qrCode}`;

              qrCodeUri = dataUri;
            }

            const documentPdfComponent =
              companyDetails?.data?.documentTemplate === "transport" ? (
                <InvTransportTemplatePdf
                  companyChosenObj={content.companyChosenObj}
                  clientChosenObj={content.clientChosenObj}
                  invDetails={content.invDetails}
                  logo={content.logo}
                  sigImage={content.sigImage}
                />
              ) : (
                <InvPdf
                  // worldlink custom template
                  customTemplate1={
                    process.env
                      .REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE &&
                    companyDetails?.id &&
                    process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE.includes(
                      companyDetails?.id
                    )
                      ? true
                      : false
                  }
                  // new template with custom MRA changes
                  newTemplate={
                    companyDetails?.data?.MRATemplateFlag?.value ||
                    content?.invDetails?.data?.MRATemplateApplied
                      ? true
                      : false
                  }
                  companyChosenObj={content.companyChosenObj}
                  clientChosenObj={content.clientChosenObj}
                  invDetails={content.invDetails}
                  logo={content.logo}
                  sigImage={content.sigImage}
                  qrCodeUri={qrCodeUri || ""}
                />
              );

            let blobPDF = await pdf(documentPdfComponent).toBlob();

            if (blobPDF) {
              let blobResponse = await new Promise((resolve) => {
                var reader = new FileReader();
                reader.readAsDataURL(blobPDF);

                reader.onloadend = async () => {
                  var base64String = reader.result;
                  let sFormat = base64String.split(",");
                  resolve(sFormat[1]);
                };
              });

              if (blobResponse) {
                resolve(blobResponse);
              }
            }
          })
        );
      });

      Promise.all(promises).then((allPdfs) => {
        let invoiceNumberList = "";
        let invoiceNumberSubjectList = "";
        let invoice_number_customerName = "";
        selectedInvoices.forEach((invoice) => {
          invoiceNumberList =
            invoiceNumberList + `- ${invoice?.data?.docString} \n`;
          invoiceNumberSubjectList =
            invoiceNumberSubjectList + ` ${invoice?.data?.docString} `;

          if (companyDetails?.id === process.env.REACT_APP_CUSTOM_ASHLEY_ID) {
            let customerName = "";
            const particulars = invoice?.data?.docParticulars || [];
            if (particulars?.length > 0) {
              const customerParticular = particulars.find(
                (particular) => particular.title === "Customer's"
              );
              if (customerParticular) {
                customerName = customerParticular.customDetail;
              }
            }

            invoice_number_customerName =
              invoice_number_customerName +
              `- ${invoice?.data?.docString} for customer: ${customerName} \n `;
          }
        });

        let toEmail = clientDocumentObjectSelected?.data?.email || "";

        if (clientDocumentObjectSelected?.data?.email2) {
          toEmail = toEmail + `,${clientDocumentObjectSelected?.data?.email2}`;
        }
        if (clientDocumentObjectSelected?.data?.email3) {
          toEmail = toEmail + `,${clientDocumentObjectSelected?.data?.email3}`;
        }
        if (clientDocumentObjectSelected?.data?.email4) {
          toEmail = toEmail + `,${clientDocumentObjectSelected?.data?.email4}`;
        }

        let emailParameters = {
          from_name: companyDetails?.data?.name,
          to_name: clientDocumentObjectSelected?.data?.name,
          from_email: companyDetails?.data?.email,
          to_email: toEmail,
          reply_to: companyDetails?.data?.email,
          fileName: `${documentType?.title}.pdf`,
          content: allPdfs,
        };

        if (companyDetails.id === process.env.REACT_APP_CUSTOM_ASHLEY_ID) {
          emailParameters = {
            ...emailParameters,
            invoiceNumber: invoiceNumberSubjectList || "",
            invoice_number_customerName: invoice_number_customerName,
            subject: `${documentType?.title} ${invoiceNumberSubjectList} from ${companyDetails?.data?.name}`,
            documentType: documentType?.title,
          };
        } else {
          emailParameters = {
            ...emailParameters,
            invoice_number: invoiceNumberList,
            invoice_number_customerName: invoiceNumberList,
            subject: `${documentType?.title} from ${companyDetails?.data?.name}`,
            documentType: documentType?.title,
          };
        }

        if (ccField) {
          const seperatedByCommas = ccField.split(",");
          let newCC = "";
          if (seperatedByCommas?.length > 0) {
            for (let i = 0; i < seperatedByCommas?.length; i++) {
              newCC = newCC + seperatedByCommas[i] + ", ";
            }
          }

          emailParameters = {
            ...emailParameters,
            ccField: newCC,
          };
        }

        emailjs
          .send(
            companyDetails?.data?.serviceKey,
            companyDetails?.data?.templateKey,
            {
              ...emailParameters,
            },
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY
          )
          .then(
            async () => {
              if (us_openCCDialog?.open) {
                set_us_openCCDialog({
                  open: false,
                  type: "",
                  invoiceContent: null,
                });
              }

              const promisesEmailSent = [];
              selectedInvoices.forEach((doc) => {
                promisesEmailSent.push(
                  new Promise(async (resolveEmailSent) => {
                    await db
                      .collection("company")
                      .doc(companyDetails?.id)
                      .collection(documentType?.id)
                      .doc(doc?.id)
                      .set({ emailAlreadySent: true }, { merge: true })
                      .then(() => {
                        resolveEmailSent(true);
                      });
                  })
                );
              });

              Promise.all(promisesEmailSent).then(() => {
                enqueueSnackbar("Email sent successfully", {
                  variant: "success",
                });

                fetchDocument();

                dispatch(setLoading(false));
              });
            },
            (error) => {
              enqueueSnackbar(
                `Error occured while sending pdf: ${error.text}`,
                {
                  variant: "error",
                }
              );
              dispatch(setLoading(false));
            }
          );
      });
    }
  };

  async function applyVoid(voidBool, invoiceId) {
    dispatch(setLoading(true));
    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection(documentType?.id)
      .doc(invoiceId)
      .set({ isVoid: voidBool }, { merge: true })
      .then(async () => {
        await fetchDocument();
        enqueueSnackbar(`${documentType?.title} updated successfully`, {
          variant: "success",
        });
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(`Error occured while updating void: ${err?.message}`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      });
  }

  async function applyPayment(invoiceSelected, paymentType) {
    return await new Promise((resolve) => {
      dispatch(setLoading(true));
      // create a payment doc using transaction to check if paymentCounter exists
      // Create a reference to the SF doc.
      var paymentCounterDocRef = db
        .collection("company")
        .doc(companyIdSelected)
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
              .doc(companyIdSelected)
              .collection("payment")
              .doc("paymentCounter")
              .set({ paymentCounter: 1 })
              .then(async () => {
                let paymentResult = await executePayment(
                  1,
                  invoiceSelected,
                  paymentType
                );
                if (paymentResult) {
                  resolve(true);
                }
              })
              .catch((err) => {
                enqueueSnackbar(
                  `Error occured while creating payment counter: ${err?.message}`,
                  { variant: "error" }
                );
                dispatch(setLoading(false));
              });
          } else if (result && Number(result) > 0) {
            let paymentResult = await executePayment(
              result,
              invoiceSelected,
              paymentType
            );

            if (paymentResult) {
              resolve(true);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while executing payment transaction: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
          resolve(true);
        });
    });
  }

  async function executePayment(result, invoiceSelected, paymentType) {
    return await new Promise((resolve) => {
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

      let remainingAmount = 0;
      let paymentAmount = 0;
      let paymentStatus = "";

      if (paymentType === "FULL") {
        remainingAmount = 0;
        paymentAmount = invoiceSelected?.data?.docTotal;
        paymentStatus = "Paid";
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

      var invoiceDocRef = db
        .collection("company")
        .doc(companyDetails.id)
        .collection(conversionValue)
        .doc(invoiceSelected.id);

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
          invoiceList: [{ invoiceId: invoiceSelected?.id }],
          paymentDate: moment(new Date()).format("DD-MM-YYYY"),
          dateCreated: firebase.firestore.Timestamp.fromDate(new Date()),
        },
        { merge: true }
      );

      batch.set(
        invoiceDocRef,
        {
          paymentStatus: paymentStatus,
          docRemainingPaymentAmt: remainingAmount,
          attachedPaymentNumber: [
            {
              paymentNumber: paymentdocRefId,
              paymentNumberString: paymentNumberDoc,
              paymentType: "",
              paymentAmount: paymentAmount,
              paymentRemainingAmount: remainingAmount,
              paymentDate: moment(new Date()).format("DD-MM-YYYY"),
            },
          ],
        },
        { merge: true }
      );

      // Commit the batch
      batch
        .commit()
        .then(async () => {
          enqueueSnackbar(`${paymentType} payment applied successfully`);
          dispatch(setLoading(false));
          resolve(true);
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while making ${paymentType} payment: ${error?.message}`,
            {
              variant: "error",
            }
          );
          dispatch(setLoading(false));
          resolve(true);
        });
    });
  }

  return (
    <>
      <Grid item xs={12} md={12}>
        <hr />
        <br />
        <Typography>Please choose a date</Typography>
      </Grid>

      <Grid item xs={12} md={12} style={{ width: "100%" }}>
        <Stack direction={"row"} spacing={3} alignItems={"center"}>
          <DatePicker
            label="From"
            value={us_fromDate || ""}
            onChange={(newValue) => {
              set_us_fromDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
            inputFormat="dd/MM/yyyy"
          />

          <DatePicker
            label="To"
            value={us_ToDate || ""}
            onChange={(newValue) => {
              set_us_ToDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} size="small" />}
            inputFormat="dd/MM/yyyy"
          />
        </Stack>
      </Grid>

      <Grid
        item
        xs={12}
        md={12}
        style={{
          display: us_documentlist && us_documentlist?.length > 0 ? "" : "none",
          width: "100%",
        }}
      >
        {companyDetails?.data?.displayMRAFiscalisationButton ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => submitMultipleInvoiceToMRA()}
              disabled={
                us_documentlist &&
                us_documentlist?.length > 0 &&
                us_documentlist?.find((doc) => doc?.checked === true)
                  ? false
                  : true
              }
            >
              Send invoices to MRA
            </Button>
            <br />
            <br />
          </>
        ) : (
          <></>
        )}

        {companyDetails?.data?.sendEmail &&
        us_documentlist &&
        us_documentlist?.length > 0 &&
        us_documentlist.find((invoice) => invoice.checked === true) ? (
          <>
            <Stack spacing={3} direction={"row"} alignItems={"center"}>
              <Typography>
                {`${
                  us_documentlist.filter((invoice) => invoice.checked === true)
                    ?.length
                } seleted`}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  /* sendMultipleEmail() */ set_us_openCCDialog({
                    open: true,
                    type: "mulitple",
                  })
                }
                style={{ width: 300 }}
              >
                {`Send selected invoice(s) via email`}
              </Button>
            </Stack>
            <br />
          </>
        ) : (
          <></>
        )}

        {documentType && documentType?.id === "proforma" ? (
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Autocomplete
                  ListboxProps={{ style: { maxHeight: "70vh" } }}
                  size="small"
                  label="Proforma filter"
                  id="filter-drop-down"
                  options={[
                    "With P.O",
                    "With Quote number",
                    "With both P.O and Quote number",
                    "NONE",
                  ]}
                  value={selectedProformaFilter}
                  renderInput={(params) => (
                    <TextField {...params} label={"Proforma filter"} />
                  )}
                  onChange={(e, value, reason) => {
                    if (
                      reason !== "removeOption" &&
                      reason !== "clear" &&
                      value
                    ) {
                      set_selectedProformaFilter(value);
                    } else {
                      set_selectedProformaFilter(null);
                    }
                  }}
                  getOptionLabel={(option) => option}
                  fullWidth
                />
              </Grid>
            </Grid>
            <br />
          </Grid>
        ) : (
          <></>
        )}

        <TableContainer>
          <Table border={1}>
            <TableHead>
              <TableRow>
                {companyDetails?.data?.MRATemplateFlag ? (
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  ></TableCell>
                ) : (
                  <></>
                )}

                {viewOnly && searchAndChoose ? (
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Choose
                  </TableCell>
                ) : (
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Delete
                  </TableCell>
                )}

                {viewOnly && searchAndChoose ? (
                  <></>
                ) : (
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Update
                  </TableCell>
                )}

                <TableCell
                  size="small"
                  align="center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Date time created
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Client
                </TableCell>

                <TableCell
                  size="small"
                  align="center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {`${documentType?.title} number`}
                </TableCell>

                {companyDetails?.id ===
                process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
                  <TableCell
                    size="small"
                    align="center"
                    style={{
                      fontWeight: "bolder",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Customer's
                  </TableCell>
                ) : (
                  <></>
                )}

                {companyDetails?.id ===
                  process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
                clientDocumentObjectSelected?.id &&
                process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
                process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                  clientDocumentObjectSelected?.id
                ) ? (
                  <TableCell
                    size="small"
                    align="center"
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    Job Ref
                  </TableCell>
                ) : (
                  <></>
                )}

                {companyDetails?.data?.sendEmail ? (
                  <>
                    <TableCell size="small" align="center">
                      Send pdf to client
                    </TableCell>
                  </>
                ) : (
                  <></>
                )}

                {documentType && documentType?.id === "proforma" ? (
                  <>
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Quotation Number
                    </TableCell>
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      P.O Number
                    </TableCell>
                  </>
                ) : (
                  <></>
                )}

                {/* {user && user?.role === "super-admin" ? (
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Send to google drive
                  </TableCell>
                ) : (
                  <></>
                )} */}

                <TableCell
                  size="small"
                  align="center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  View/download
                </TableCell>

                {companyDetails?.data?.displayMRAFiscalisationButton ? (
                  <>
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      MRA Fiscalisation
                    </TableCell>
                  </>
                ) : (
                  <></>
                )}

                {documentType?.id && documentType?.id !== "invoice" ? (
                  <>
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Vat amount
                    </TableCell>
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Subtotal amount
                    </TableCell>
                  </>
                ) : (
                  <></>
                )}

                <TableCell
                  size="small"
                  align="center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Total amount
                </TableCell>

                {companyDetails?.data?.documentTemplate === "transport" &&
                documentType?.id === "vat_invoice" ? (
                  <TableCell size="small" align="center">
                    Apply/remove void
                  </TableCell>
                ) : (
                  <></>
                )}

                {documentType?.id && documentType?.id === "proforma" && (
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Proforma status
                  </TableCell>
                )}

                {documentType?.id &&
                  (documentType?.id === "proforma" ||
                    documentType?.id === "vat_invoice" ||
                    documentType?.id === "invoice") && (
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {documentType?.id === "proforma"
                        ? "Convert to Invoice/Vat Invoice"
                        : "Converted from Proforma"}
                    </TableCell>
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {us_documentlist &&
                us_documentlist?.length > 0 &&
                us_documentlist?.map((doc, index) => {
                  let displayBool = false;

                  if (documentType && documentType?.id === "proforma") {
                    if (
                      (selectedProformaFilter === "With Quote number" &&
                        doc?.data?.docQuoteNumber) ||
                      (selectedProformaFilter === "With P.O" &&
                        doc?.data?.docPurchaseOrderNumber) ||
                      (selectedProformaFilter ===
                        "With both P.O and Quote number" &&
                        doc?.data?.docQuoteNumber &&
                        doc?.data?.docPurchaseOrderNumber) ||
                      (selectedProformaFilter === "NONE" &&
                        !doc?.data?.docQuoteNumber &&
                        !doc?.data?.docPurchaseOrderNumbe) ||
                      !selectedProformaFilter
                    ) {
                      displayBool = true;
                    } else {
                      displayBool = false;
                    }
                  } else {
                    displayBool = true;
                  }

                  if (displayBool) {
                    return (
                      <TableRow key={index}>
                        {companyDetails?.data?.MRATemplateFlag ? (
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              background:
                                companyDetails?.data?.documentTemplate ===
                                  "transport" && doc?.data?.isVoid
                                  ? "#FEFEBE"
                                  : "transparent",
                            }}
                          >
                            <Checkbox
                              checked={doc?.checked}
                              onChange={(event) => {
                                let newDocumentlist = [...us_documentlist];
                                newDocumentlist[index] = {
                                  ...newDocumentlist[index],
                                  checked: event.target.checked,
                                };
                                set_us_documentlist(newDocumentlist);
                              }}
                            />
                          </TableCell>
                        ) : (
                          <></>
                        )}

                        {viewOnly && searchAndChoose ? (
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              background:
                                companyDetails?.data?.documentTemplate ===
                                  "transport" && doc?.data?.isVoid
                                  ? "#FEFEBE"
                                  : "transparent",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => chooseDocument(doc)}
                            >
                              Choose
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              background:
                                companyDetails?.data?.documentTemplate ===
                                  "transport" && doc?.data?.isVoid
                                  ? "#FEFEBE"
                                  : "transparent",
                            }}
                          >
                            <IconButton
                              color="error"
                              onClick={() =>
                                deleteDocument(doc?.id, { ...doc?.data })
                              }
                              disabled={
                                !user?.permissions[
                                  documentType?.deletePermission
                                ]?.assignedCompanyId?.includes(
                                  companyDetails?.id
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}

                        {viewOnly && searchAndChoose ? (
                          <></>
                        ) : (
                          <TableCell
                            align="center"
                            size="small"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                dispatch(
                                  setUpdateDocumentData({
                                    ...doc,
                                    documentTypeId: documentType?.id,
                                    documentTypeTitle: documentType?.title,
                                    keywords: doc?.data?.keywords || [],
                                  })
                                );
                                setOpenUpdateDialog(true);
                              }}
                              disabled={
                                !user?.permissions ||
                                !user?.permissions[
                                  documentType?.updatePermission
                                ]?.assignedCompanyId?.includes(
                                  companyDetails?.id
                                ) ||
                                (doc?.data &&
                                  doc?.data?.isProformaConverted &&
                                  documentType?.id === "proforma")
                              }
                            >
                              <EditIcon color="primary" />
                            </IconButton>
                          </TableCell>
                        )}

                        <TableCell
                          align="center"
                          size="small"
                          style={{
                            whiteSpace: "nowrap",
                            background:
                              companyDetails?.data?.documentTemplate ===
                                "transport" && doc?.data?.isVoid
                                ? "#FEFEBE"
                                : "transparent",
                          }}
                        >
                          {moment(doc?.data?.docDate.toDate()).format(
                            "DD-MM-YYYY, HH:MM:ss"
                          )}
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{
                            whiteSpace: "nowrap",
                            background:
                              companyDetails?.data?.documentTemplate ===
                                "transport" && doc?.data?.isVoid
                                ? "#FEFEBE"
                                : "transparent",
                          }}
                        >
                          {clientDocumentObjectSelected &&
                          clientDocumentObjectSelected?.name &&
                          clientDocumentObjectSelected?.name !== ""
                            ? clientDocumentObjectSelected?.name
                            : ""}
                        </TableCell>
                        {/* <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {doc?.data?.docBillTo || ""}
                        </TableCell> */}

                        <TableCell
                          align="center"
                          size="small"
                          style={{
                            whiteSpace: "nowrap",
                            background:
                              companyDetails?.data?.documentTemplate ===
                                "transport" && doc?.data?.isVoid
                                ? "#FEFEBE"
                                : "transparent",
                          }}
                        >{`${doc?.data?.docString}`}</TableCell>

                        {companyDetails?.id ===
                        process.env.REACT_APP_CUSTOM_ASHLEY_ID ? (
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc?.data?.docParticulars.find(
                              (particular) => particular.title === "Customer's"
                            )?.customDetail || ""}
                          </TableCell>
                        ) : (
                          <></>
                        )}

                        {companyDetails?.id ===
                          process.env.REACT_APP_CUSTOM_ASHLEY_ID &&
                        clientDocumentObjectSelected?.id &&
                        process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS &&
                        process.env.REACT_APP_ASHLEY_SOA_JOB_REF_CLIENTS.includes(
                          clientDocumentObjectSelected?.id
                        ) ? (
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc?.data?.invJobRef || ""}
                          </TableCell>
                        ) : (
                          <></>
                        )}

                        {companyDetails?.data?.sendEmail ? (
                          <TableCell
                            align="center"
                            size="small"
                            style={{
                              whiteSpace: "nowrap",
                              background:
                                doc?.data?.emailAlreadySent === true
                                  ? "#befed5"
                                  : companyDetails?.data?.documentTemplate ===
                                      "transport" && doc?.data?.isVoid
                                  ? "#FEFEBE"
                                  : "transparent",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                set_us_openCCDialog({
                                  open: true,
                                  type: "single",
                                  invoiceContent: doc,
                                })
                              }
                            >
                              send email
                            </Button>
                          </TableCell>
                        ) : (
                          <></>
                        )}

                        {documentType && documentType?.id === "proforma" ? (
                          <>
                            <TableCell
                              size="small"
                              align="center"
                              style={{
                                whiteSpace: "nowrap",
                                background:
                                  companyDetails?.data?.documentTemplate ===
                                    "transport" && doc?.data?.isVoid
                                    ? "#FEFEBE"
                                    : "transparent",
                              }}
                            >
                              {doc?.data?.docQuoteNumber || ""}
                            </TableCell>
                            <TableCell
                              size="small"
                              align="center"
                              style={{
                                whiteSpace: "nowrap",
                                background:
                                  companyDetails?.data?.documentTemplate ===
                                    "transport" && doc?.data?.isVoid
                                    ? "#FEFEBE"
                                    : "transparent",
                              }}
                            >
                              {doc?.data?.docPurchaseOrderNumber || ""}
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        <TableCell
                          align="center"
                          size="small"
                          style={{
                            whiteSpace: "nowrap",
                            background:
                              companyDetails?.data?.documentTemplate ===
                                "transport" && doc?.data?.isVoid
                                ? "#FEFEBE"
                                : "transparent",
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
                                  doc,
                                  logo,
                                  sigImage,
                                  "view"
                                )
                              }
                              disabled={
                                !user?.permissions[
                                  documentType?.viewPermission
                                ]?.assignedCompanyId?.includes(
                                  companyDetails?.id
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
                                  doc,
                                  logo,
                                  sigImage,
                                  "download"
                                )
                              }
                              disabled={
                                !user?.permissions[
                                  documentType?.viewPermission
                                ]?.assignedCompanyId?.includes(
                                  companyDetails?.id
                                )
                              }
                            >
                              <Iconify icon={"eva:download-fill"} />
                            </IconButton>
                          </Stack>
                        </TableCell>

                        {companyDetails?.data?.displayMRAFiscalisationButton ? (
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              background:
                                companyDetails?.data?.documentTemplate ===
                                  "transport" && doc?.data?.isVoid
                                  ? "#FEFEBE"
                                  : "transparent",
                            }}
                          >
                            {doc?.data?.mraCompliantStatus === "completed" ? (
                              <Typography>Completed</Typography>
                            ) : doc?.data?.mraCompliantStatus === "error" ? (
                              <Stack spacing={2} direction={"row"}>
                                <Tooltip title={doc?.data?.mraCompliantMessage}>
                                  <Typography>Error occured</Typography>
                                </Tooltip>

                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => uploadToMRA(doc)}
                                >
                                  Upload again
                                </Button>
                              </Stack>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => uploadToMRA(doc)}
                              >
                                Upload
                              </Button>
                            )}
                          </TableCell>
                        ) : (
                          <></>
                        )}

                        {documentType?.id && documentType?.id !== "invoice" ? (
                          <>
                            <TableCell
                              size="small"
                              align="center"
                              style={{
                                whiteSpace: "nowrap",
                                background:
                                  companyDetails?.data?.documentTemplate ===
                                    "transport" && doc?.data?.isVoid
                                    ? "#FEFEBE"
                                    : "transparent",
                              }}
                            >
                              <CurrencyFormat
                                value={Number(
                                  doc?.data?.docVatFee || 0
                                ).toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </TableCell>
                            <TableCell
                              size="small"
                              align="center"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <CurrencyFormat
                                value={Number(
                                  doc?.data?.docSubTotal || 0
                                ).toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        <TableCell
                          size="small"
                          align="center"
                          style={{
                            whiteSpace: "nowrap",
                            background:
                              companyDetails?.data?.documentTemplate ===
                                "transport" && doc?.data?.isVoid
                                ? "#FEFEBE"
                                : "transparent",
                          }}
                        >
                          <CurrencyFormat
                            value={Number(doc?.data?.docTotal || 0).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </TableCell>

                        {companyDetails?.data?.documentTemplate ===
                          "transport" && documentType?.id === "vat_invoice" ? (
                          <TableCell
                            align="center"
                            size="small"
                            style={{
                              background: doc?.data?.isVoid
                                ? "#FEFEBE"
                                : "transparent",
                            }}
                          >
                            {doc?.data?.isVoid ? (
                              <Button
                                variant="contained"
                                onClick={() => applyVoid(false, doc?.id)}
                                color="warning"
                              >
                                cancel void
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={() => applyVoid(true, doc?.id)}
                                color="primary"
                              >
                                void
                              </Button>
                            )}
                          </TableCell>
                        ) : (
                          <></>
                        )}

                        {documentType?.id && documentType?.id === "proforma" && (
                          <TableCell
                            align="center"
                            size="small"
                            style={{
                              background:
                                /* doc?.data?.isVoid || */
                                doc?.data && doc?.data?.isProformaConverted
                                  ? "#FEFEBE"
                                  : "transparent",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc?.data && doc?.data?.isProformaConverted
                              ? `Converted to ${doc?.data?.conversionDocTitle}`
                              : "Still Proforma"}
                          </TableCell>
                        )}

                        {documentType?.id && documentType?.id === "proforma" ? (
                          <TableCell
                            align="center"
                            size="small"
                            style={{
                              /* background: doc?.data?.isVoid
                            ? "#FEFEBE"
                            : "transparent", */
                              whiteSpace: "nowrap",
                              background:
                                companyDetails?.data?.documentTemplate ===
                                  "transport" && doc?.data?.isVoid
                                  ? "#FEFEBE"
                                  : "transparent",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                set_selectedProformaDoc({
                                  id: doc?.id,
                                  data: { ...doc?.data },
                                });
                                set_us_open_convertTo_dialog(true);
                              }}
                              disabled={
                                doc?.data?.isProformaConverted ||
                                (viewOnly && searchAndChoose)
                              }
                            >
                              Convert
                            </Button>
                          </TableCell>
                        ) : documentType?.id &&
                          (documentType?.id === "vat_invoice" ||
                            documentType?.id === "invoice") ? (
                          <TableCell
                            align="center"
                            size="small"
                            style={{
                              background: doc?.data?.createdFromProfroma
                                ? "#FEFEBE"
                                : "transparent",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {doc?.data?.createdFromProfroma ? "YES" : "NO"}
                          </TableCell>
                        ) : (
                          <></>
                        )}
                      </TableRow>
                    );
                  } else return <></>;
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12} md={12}>
        {!us_documentlist || us_documentlist?.length === 0 ? (
          <Alert severity="warning">No document retrieved found.</Alert>
        ) : (
          ""
        )}
      </Grid>

      <Dialog open={openUpdateDialog} maxWidth={"xl"} fullWidth>
        <DialogTitle>{`Update ${documentType?.title || ""}`}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <DocumentInputDetails
              action={"update"}
              handleCloseUpdateDialog={handleCloseUpdateDialog}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleCloseUpdateDialog(false)}
          >
            close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={us_open_convertTo_dialog} maxWidth={"sm"} fullWidth>
        <DialogTitle>Convert to Invoice/Vat Invoice</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  Conversion types
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={conversionValue}
                  onChange={(e) => set_conversionValue(e.target.value)}
                >
                  <FormControlLabel
                    value="invoice"
                    control={<Radio />}
                    label="Invoice"
                  />
                  <FormControlLabel
                    value="vat_invoice"
                    control={<Radio />}
                    label="VAT Invoice"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmConversion()}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => set_us_open_convertTo_dialog(false)}
          >
            close
          </Button>
        </DialogActions>
      </Dialog>
      {/* 
      {openPdf ? (
        <Suspense fallback={<></>}>
          <PdfDialog
            content={pdfContent}
            open={openPdf}
            close={() => set_openPdf(false)}
          />
        </Suspense>
      ) : (
        <></>
      )} */}

      <Suspense fallback={<></>}>
        <CCDialog
          open={us_openCCDialog?.open}
          close={() =>
            set_us_openCCDialog({
              open: false,
              type: "",
            })
          }
          us_openCCDialog={us_openCCDialog}
          sendMultipleEmail={sendMultipleEmail}
        />
      </Suspense>
    </>
  );
}
