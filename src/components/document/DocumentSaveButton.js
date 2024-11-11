import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/globalSlice";
import { selectDocument } from "../../features/documentSlice";
import {
  checkIfCustomDocumentIdPresentInDB,
  formatDocumentIdNumber,
  incrementEBSGlobalInvoiceCounter,
} from "../core-functions/SelectionCoreFunctions";
import { useSnackbar } from "notistack";
import db from "../../firebase";
import firebase from "firebase/compat";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

export default function DocumentSaveButton({
  originalDocParticulars,
  documentDetails,
  savedDescriptions,
  us_s_quotationNumber,
  us_s_purchaseOrderNumber,
  set_us_showViewDocument,
  refreshTable,
  fetchDescription,
  displayDiscountColumns,
  partialPaymentAmount,
}) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const {
    documentType,
    companyIdSelected,
    companyDetails,
    clientDocumentObjectSelected,
  } = useSelector(selectDocument);

  const {
    docCustomIdNumber,
    docBillTo,
    docShipTo,
    docDate,
    docParticulars,
    docSubTotal,
    docVatFee,
    docTotal,
    docTermsAndCondition,

    //custom details
    docBLNumber,
    docSupplier,
    docContainerNumber,
    docPackages,
    docDescription,
    docGrossWeight,
    docVolume,
    docPortOfLoading,
    docETA,
    docVesselName,
    docRoE,
    docPlaceOfLanding,

    // MRA customs
    transactionType,
    personType,
    invoiceTypeDesc,
    invoiceRefIdentifier,
    downPayment,
    downPaymentInvoiceNumber,
    discountTotalAmount,
    discountedTotalAmount,
    docSalesTransaction,
    docReasonStated,

    // Fadil customs
    docTotalTaxableWithoutVatParticulars,
    docTotalTaxableVatOnlyParticulars,
    docTotalTaxableParticulars,
    docTotalZeroRatedParticulars,
    docTotalExemptParticulars,
    docTotalDisbursementParticulars,
    docTotalExemptBodiesParticulars,
    docDisbursementParticularsData,

    invJobRef,
    invStorageFee,
    invScanningFee,
    invGatePassFee,
    invVehicleNo,
    transportFees,
    transportDesc,
    invApplyVat,

    // flexitrans customs
    docShipper,
    docMarkNos,
    docCommodity,
    docHbl,
    docDepot,
  } = documentDetails;

  async function saveDocument() {
    dispatch(setLoading(true));

    if (docCustomIdNumber) {
      let isPresentInDB = await checkIfCustomDocumentIdPresentInDB(
        docCustomIdNumber,
        companyIdSelected,
        documentType?.id
      );

      if (isPresentInDB?.error) {
        enqueueSnackbar(isPresentInDB?.message, { variant: "error" });
      } else {
        dispatch(setLoading(true));

        performSaveTransaction(
          isPresentInDB?.documentNumber,
          isPresentInDB?.documentNumberDocString
        );
      }
    } else {
      var documentDocRef = db
        .collection("company")
        .doc(companyIdSelected)
        .collection(documentType?.id)
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
        .then(async (documentNumber) => {
          let documentNumberDocString = await formatDocumentIdNumber(
            documentNumber
          );

          if (documentNumberDocString) {
            performSaveTransaction(documentNumber, documentNumberDocString);
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while overall Invoice saving transactions: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  async function performSaveTransaction(
    documentNumber,
    documentNumberDocString
  ) {
    // define isused date time
    const issuedFirebaseDateTimeIssued = new Date();

    let keywords = [];

    let invoiceCounterResult = "";

    if (documentType?.id !== "quotation") {
      invoiceCounterResult = await incrementEBSGlobalInvoiceCounter(
        companyIdSelected
      );
    }

    let customTransportDocParticularsToSave = [];
    if (companyDetails?.data?.documentTemplate === "transport") {
      // check for new customDetail -> save as new doc in db if present
      let newInvParticulars = [];
      if (docParticulars?.length > 0) {
        docParticulars.forEach(async (particular) => {
          if (particular?.customDetail !== "") {
            let uniqueValueList = [
              ...particular?.valueList,
              particular?.customDetail,
            ];
            uniqueValueList = [...new Set(uniqueValueList)];
            uniqueValueList.sort();

            // save customDetail
            newInvParticulars.push({
              ...particular,
              valueList: uniqueValueList,
            });

            customTransportDocParticularsToSave.push({
              ...particular,
              valueList: [],
            });
          } else {
            newInvParticulars.push({ ...particular });

            customTransportDocParticularsToSave.push({
              ...particular,
              valueList: [],
            });
          }
        });
      }

      // check if company has collection particulars
      if (originalDocParticulars?.length === 0) {
        if (newInvParticulars?.length > 0) {
          newInvParticulars.forEach(async (particular) => {
            let uniqueValueList = [];
            if (particular?.valueList && particular?.valueList?.length > 0) {
              uniqueValueList = [...new Set(particular?.valueList)];
              uniqueValueList.sort();
            }

            await db
              .collection("company")
              .doc(companyIdSelected)
              .collection("particulars")
              .add({
                orderNum: particular?.orderNum || "",
                title: particular?.title || "",
                customDetail: particular?.customDetail || "",
                selectedValue: particular?.selectedValue || "",
                valueList: uniqueValueList,
                isChecked: particular?.isChecked || false,
                amount: particular?.amount || "",
              });
          });
        }
      } else {
        // update entire particulars list
        if (newInvParticulars?.length > 0) {
          newInvParticulars.forEach(async (particular) => {
            if (particular?.id && particular?.id !== "") {
              let uniqueValueList = [];
              if (particular?.valueList && particular?.valueList?.length > 0) {
                uniqueValueList = [...new Set(particular?.valueList)];
                uniqueValueList.sort();
              }

              await db
                .collection("company")
                .doc(companyIdSelected)
                .collection("particulars")
                .doc(particular?.id)
                .update(
                  {
                    ...particular,
                    valueList: uniqueValueList,
                  },
                  { merge: true }
                );
            }
          });
        }
      }

      // await db
      //   .collection("company")
      //   .doc(companyIdSelected)
      //   .collection("particulars")
      //   .get()
      //   .then(async (queryDocs) => {
      //     // save all particulars if no particulars present
      //     if (queryDocs?.docs?.length === 0) {
      //       if (newInvParticulars?.length > 0) {
      //         newInvParticulars.forEach(async (particular) => {
      //           let uniqueValueList = [];
      //           if (
      //             particular?.valueList &&
      //             particular?.valueList?.length > 0
      //           ) {
      //             uniqueValueList = [...new Set(particular?.valueList)];
      //             uniqueValueList.sort();
      //           }

      //           await db
      //             .collection("company")
      //             .doc(companyIdSelected)
      //             .collection("particulars")
      //             .add({
      //               orderNum: particular?.orderNum || "",
      //               title: particular?.title || "",
      //               customDetail: particular?.customDetail || "",
      //               selectedValue: particular?.selectedValue || "",
      //               valueList: uniqueValueList,
      //               isChecked: particular?.isChecked || false,
      //               amount: particular?.amount || "",
      //             });
      //         });
      //       }
      //     } else {
      //       // update entire particulars list
      //       if (newInvParticulars?.length > 0) {
      //         newInvParticulars.forEach(async (particular) => {
      //           if (particular?.id && particular?.id !== "") {
      //             let uniqueValueList = [];
      //             if (
      //               particular?.valueList &&
      //               particular?.valueList?.length > 0
      //             ) {
      //               uniqueValueList = [...new Set(particular?.valueList)];
      //               uniqueValueList.sort();
      //             }

      //             await db
      //               .collection("company")
      //               .doc(companyIdSelected)
      //               .collection("particulars")
      //               .doc(particular?.id)
      //               .update(
      //                 {
      //                   ...particular,
      //                   valueList: uniqueValueList,
      //                 },
      //                 { merge: true }
      //               );
      //           }
      //         });
      //       }
      //     }
      //   });
    } else if (companyDetails?.data?.documentTemplate !== "transport") {
      // save descriptions
      // get all descriptions
      let allDescriptionString = "";
      let allDescriptions = docParticulars.map(
        (particular) => particular?.rowDescription || ""
      );

      allDescriptions.forEach(async (description) => {
        if (description && description !== "") {
          allDescriptionString = allDescriptionString + " " + description;

          if (
            !savedDescriptions?.find(
              (desc) => desc?.description === description
            )
          ) {
            await db
              .collection("company")
              .doc(companyIdSelected)
              .collection("saved_descriptions")
              .add({
                text: description,
              });
          }
        }
      });

      if (allDescriptionString) {
        const particularSplit = allDescriptionString.split(" ");

        let newParticularSplit = [];
        particularSplit.forEach((particular) => {
          newParticularSplit.push(particular.toLowerCase());
        });

        keywords = [
          ...newParticularSplit,
          documentNumber.toString(),
          documentNumberDocString,
        ];
      }

      keywords = [...new Set(keywords)];
    }

    let documentData = {
      ebsGlobalInvoiceCounterReached:
        documentType?.id === "quotation" ? null : invoiceCounterResult,
      id: documentNumber.toString(),
      docString: documentNumberDocString,
      docCustomIdNumber: docCustomIdNumber,
      docTitle: documentType?.title,
      docType: documentType?.id,
      clientId: clientDocumentObjectSelected?.id,
      docDate: firebase.firestore.Timestamp.fromDate(new Date(docDate)),
      docDateTimeCreated: firebase.firestore.FieldValue.serverTimestamp(),
      docIssuedDateTime: issuedFirebaseDateTimeIssued,
      docParticulars:
        companyDetails?.data?.documentTemplate === "transport"
          ? customTransportDocParticularsToSave
          : docParticulars,
      docSubTotal: docSubTotal,
      docVatFee: docVatFee,
      docTotal: docTotal,
      docShipTo: docShipTo,
      docBillTo: docBillTo,
      docTermsAndCondition: docTermsAndCondition || "",
      // used in payment section
      paymentStatus: "Unpaid",
      docRemainingPaymentAmt: docTotal,
      attachedPaymentNumber: [],
      docQuoteNumber: us_s_quotationNumber || "",
      docPurchaseOrderNumber: us_s_purchaseOrderNumber || "",
      keywords: keywords,

      // MRA customs
      transactionType: transactionType || null,
      personType: personType || null,
      invoiceTypeDesc: invoiceTypeDesc || null,
      invoiceRefIdentifier: invoiceRefIdentifier || "",
      downPayment: downPayment || 0,
      downPaymentInvoiceNumber: downPaymentInvoiceNumber || "",
      discountTotalAmount: discountTotalAmount || 0,
      discountedTotalAmount: discountedTotalAmount || 0,
      docSalesTransaction: docSalesTransaction || null,
      docReasonStated: docReasonStated || "",

      displayDiscountColumns: displayDiscountColumns || false,

      createdByUserId: user?.id || "",
      createdByUserEmail: user?.email || "",
      createdByUserTime: new Date(),
    };

    if (companyDetails?.data?.documentTemplate === "transport") {
      documentData = {
        ...documentData,
        // transport template
        invJobRef: invJobRef || "",
        invStorageFee: invStorageFee || "",
        invScanningFee: invScanningFee || "",
        invGatePassFee: invGatePassFee || "",
        invVehicleNo: invVehicleNo || "",
        transportFees: transportFees || "",
        transportDesc: transportDesc || "",
        invApplyVat: invApplyVat || false,
      };
    } else if (companyDetails?.data?.documentTemplate === "flexitrans") {
      documentData = {
        ...documentData,
        //custom details
        docBLNumber: docBLNumber || "",
        docSupplier: docSupplier || "",
        docContainerNumber: docContainerNumber || "",
        docPackages: docPackages || "",
        docDescription: docDescription || "",
        docGrossWeight: docGrossWeight || "",
        docVolume: docVolume || "",
        docPortOfLoading: docPortOfLoading || "",
        docETA: docETA || "",
        docVesselName: docVesselName || "",
        docRoE: docRoE || "",
        docPlaceOfLanding: docPlaceOfLanding || "",

        //Fadil customs
        docTotalTaxableWithoutVatParticulars:
          docTotalTaxableWithoutVatParticulars || "",
        docTotalTaxableVatOnlyParticulars:
          docTotalTaxableVatOnlyParticulars || "",
        docTotalTaxableParticulars: docTotalTaxableParticulars || "",
        docTotalZeroRatedParticulars: docTotalZeroRatedParticulars || "",
        docTotalExemptParticulars: docTotalExemptParticulars || "",
        docTotalDisbursementParticulars: docTotalDisbursementParticulars || "",
        docTotalExemptBodiesParticulars: docTotalExemptBodiesParticulars || "",
        docDisbursementParticularsData: docDisbursementParticularsData || [],

        // flexitrans customs
        docShipper: docShipper || "",
        docMarkNos: docMarkNos || "",
        docCommodity: docCommodity || "",
        docHbl: docHbl || "",
        docDepot: docDepot || "",
      };
    } else if (
      companyDetails?.id === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID &&
      (documentData?.docType === "proforma" ||
        documentData?.docType === "invoice" ||
        documentData?.docType === "vat_invoice" ||
        documentData?.docType === "cash_transaction")
    ) {
      // update stock
      let docParticulars = [...(documentData?.docParticulars || [])];
      docParticulars.forEach(async (row) => {
        if (row?.inventoryItemData) {
          // update qty sold and quantity remaining

          // get latest stock remaining amount
          await db
            .collection("company")
            .doc(companyDetails?.id)
            .collection("inventory")
            .doc(row?.inventoryItemData?.id)
            .get()
            .then(async (doc) => {
              if (doc.exists) {
                let totalQty = Number(doc?.data()?.qtyRemaining || 0);
                let qtySold = Number(row?.rowQty || 0);
                let remainingQty = totalQty - qtySold;

                let newTotalQtySold =
                  qtySold + Number(doc?.data()?.qtySold || 0);

                let allInventoryItemTransactions = [
                  ...(doc?.data()?.allInventoryItemTransactions || []),
                ];

                let vatAmount = 0;
                if (invApplyVat) {
                  vatAmount =
                    Number(row?.rowDiscountedAmount || row?.rowAmount || 0) *
                    1.15;
                }

                allInventoryItemTransactions.push({
                  documentNumber: documentData?.id,
                  docString: documentData?.docString,
                  docCustomIdNumber: documentData?.docCustomIdNumber,
                  docTitle: documentData?.docTitle,
                  docType: documentData?.docType,
                  docDate: new Date(),
                  actualRemainingStockAmount: totalQty,
                  itemQtySold: qtySold,
                  itemId: row?.inventoryItemData?.id,
                  rowAmount: row?.rowAmount || 0,
                  rowDiscountAmount: row?.rowDiscountAmount || 0,
                  rowDiscountedAmount: row?.rowDiscountedAmount || 0,
                  rowAmountWithVAT: vatAmount,
                  rowUnitPrice: row?.rowUnitPrice || 0,
                });

                let newTotalAmountReceivedWithoutVAT =
                  Number(doc?.data()?.totalAmountReceivedWithoutVAT || 0) +
                  Number(row?.rowDiscountedAmount || row?.rowAmount || 0);

                let newTotalAmountReceivedWithVAT =
                  Number(doc?.data()?.totalAmountReceivedWithVAT || 0) +
                  vatAmount;

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
                      qtySold: newTotalQtySold || 0,
                      qtyRemaining: remainingQty || 0,
                      allInventoryItemTransactions:
                        allInventoryItemTransactions || [],
                    },
                    { merge: true }
                  )
                  .then(async () => {
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

    // save document
    await db
      .collection("company")
      .doc(companyIdSelected)
      .collection(documentType?.id)
      .doc(documentNumberDocString.toString())
      .set(
        {
          ...documentData,
        },
        { merge: true }
      )
      .then(async () => {
        /**
         * custom requirement for Smart Promote
         * make full payment automatically after following documents has been saved
         * vat invoice
         * invoice
         * cash transaction
         *  */
        if (
          (documentType?.id === "vat_invoice" ||
            documentType?.id === "invoice" ||
            documentType?.id === "cash_transaction") &&
          companyIdSelected === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID
        ) {
          await applyPayment(
            {
              id: documentNumberDocString.toString(),
              data: { ...documentData },
            },
            "FULL"
          );
        } else if (
          /**
           * custom requirement for Smart Promote
           * make partial payment if field partial payment has been filled
           * applicable only for Proforma
           */
          documentType?.id === "proforma" &&
          companyIdSelected === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID &&
          Number(partialPaymentAmount) > 0
        ) {
          await applyPayment(
            {
              id: documentNumberDocString.toString(),
              data: { ...documentData },
            },
            "PARTIAL"
          );
        }

        dispatch(setLoading(true));

        set_us_showViewDocument({
          showViewButton: true,
        });

        // reset table
        refreshTable();

        enqueueSnackbar(`${documentType?.title} saved successfully`);

        if (companyDetails?.data?.documentTemplate !== "transport") {
          fetchDescription();
        }

        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while saving document: ${err?.message}`,
          {
            variant: "error",
          }
        );
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
      } else if (paymentType === "PARTIAL") {
        paymentAmount = Number(partialPaymentAmount || 0);

        if (Number(invoiceSelected?.data?.docRemainingPaymentAmt || 0) > 0) {
          remainingAmount =
            Number(invoiceSelected?.data?.docRemainingPaymentAmt || 0) -
            Number(partialPaymentAmount);
        } else {
          remainingAmount =
            Number(invoiceSelected?.data?.docTotal || 0) -
            Number(partialPaymentAmount);
        }

        if (remainingAmount === Number(invoiceSelected?.data?.docTotal || 0)) {
          paymentStatus = "Unpaid";
        } else if (
          remainingAmount !== 0 &&
          remainingAmount < Number(invoiceSelected?.data?.docTotal || 0)
        ) {
          paymentStatus = "Partially paid";
        } else if (remainingAmount < 0) {
          paymentStatus = "Over paid";
        } else if (remainingAmount === 0) {
          paymentStatus = "Paid";
        }
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
        .collection(documentType?.id)
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
      <Button
        variant={"contained"}
        color={"primary"}
        onClick={() => saveDocument()}
        fullWidth
        disabled={!documentDetails?.docTotal}
      >
        {`Save ${documentType?.title}`}
      </Button>
    </>
  );
}
