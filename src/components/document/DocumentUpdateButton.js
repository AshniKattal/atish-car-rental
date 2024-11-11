import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/globalSlice";
import { selectDocument } from "../../features/documentSlice";
import { checkIfCustomDocumentIdPresentInDB } from "../core-functions/SelectionCoreFunctions";
import { useSnackbar } from "notistack";
import db from "../../firebase";
import firebase from "firebase/compat";
import useAuth from "../../hooks/useAuth";

export default function DocumentUpdateButton({
  updateDocumentData,
  documentDetails,
  us_s_quotationNumber,
  us_s_purchaseOrderNumber,
  handleCloseUpdateDialog,
  displayDiscountColumns,
}) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { documentType, companyIdSelected, companyDetails } =
    useSelector(selectDocument);

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

  async function updateDocument() {
    dispatch(setLoading(true));

    if (docCustomIdNumber) {
      // check if custom document Id is already present in database
      let isPresentInDB = await checkIfCustomDocumentIdPresentInDB(
        docCustomIdNumber,
        companyIdSelected,
        documentType?.id
      );

      if (isPresentInDB?.error) {
        enqueueSnackbar(isPresentInDB?.message, { variant: "error" });
      } else {
        performUpdateTransaction(
          updateDocumentData?.id,
          updateDocumentData?.keywords || []
        );
      }
    } else {
      performUpdateTransaction(
        updateDocumentData.id,
        updateDocumentData?.keywords || []
      );
    }
  }

  async function performUpdateTransaction(updatedDocId, storedKeywords) {
    // calculate remaining payment amount
    let remainingPaymentAmount = Number(docTotal);
    if (
      updateDocumentData?.data?.attachedPaymentNumber &&
      updateDocumentData?.data?.attachedPaymentNumber?.length > 0
    ) {
      updateDocumentData?.data?.attachedPaymentNumber.forEach((paymentDone) => {
        remainingPaymentAmount =
          remainingPaymentAmount - Number(paymentDone?.paymentAmount);
      });
    }

    let keywords = [...storedKeywords];

    if (companyDetails?.data?.documentTemplate !== "transport") {
      let allDescriptionString = "";
      let allDescriptions = docParticulars.map(
        (particular) => particular?.rowDescription || ""
      );
      allDescriptions.forEach(async (description) => {
        if (description && description !== "") {
          allDescriptionString = allDescriptionString + " " + description;
        }
      });

      if (allDescriptionString) {
        const particularSplit = allDescriptionString.split(" ");

        let newParticularSplit = [];
        particularSplit.forEach((particular) => {
          newParticularSplit.push(particular.toLowerCase());
        });

        keywords = [...keywords, ...newParticularSplit];
      }

      keywords = [...new Set(keywords)];
    }

    let customTransportDocParticularsToSave = [];
    if (companyDetails?.data?.documentTemplate === "transport") {
      if (docParticulars?.length > 0) {
        docParticulars.forEach((particular) => {
          customTransportDocParticularsToSave.push({
            ...particular,
            valueList: [],
          });
        });
      }
    }

    let documentData = {
      docQuoteNumber: us_s_quotationNumber || "",
      docPurchaseOrderNumber: us_s_purchaseOrderNumber || "",
      docParticulars:
        companyDetails?.data?.documentTemplate === "transport"
          ? customTransportDocParticularsToSave
          : docParticulars,
      docSubTotal: docSubTotal,
      docVatFee: docVatFee,
      docTotal: docTotal,
      docRemainingPaymentAmt: remainingPaymentAmount,
      docBillTo: docBillTo,
      docShipTo: docShipTo,
      docTermsAndCondition: docTermsAndCondition || "",
      docCustomIdNumber: docCustomIdNumber,
      docDate: firebase.firestore.Timestamp.fromDate(new Date(docDate)),
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

      updatedByUserId: user?.id || "",
      updatedByUserEmail: user?.email || "",
      updatedByUserTime: new Date(),
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
    }

    if (
      companyDetails?.id === process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID &&
      (documentType?.id === "proforma" ||
        documentType?.id === "invoice" ||
        documentType?.id === "vat_invoice" ||
        documentType?.id === "cash_transaction")
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
                // get previous transactions for that inventory
                let allInventoryItemTransactionsData =
                  doc?.data()?.allInventoryItemTransactions || [];

                // check the qty sold for that item with the same doc id
                let isDocFoundIndex = -1;

                if (allInventoryItemTransactionsData.length > 0) {
                  isDocFoundIndex = allInventoryItemTransactionsData.findIndex(
                    (transaction) =>
                      transaction.docString === updatedDocId &&
                      transaction?.docType === documentType?.id
                  );
                }

                let totalQtySold = Number(doc?.data()?.qtySold || 0);
                let totalQtyRemaining = Number(doc?.data()?.qtyRemaining || 0);
                let qtySold = Number(row?.rowQty || 0); // new updated qty

                let newTotalAmountReceivedWithoutVAT = Number(
                  doc?.data()?.totalAmountReceivedWithoutVAT || 0
                );
                let newTotalAmountReceivedWithVAT = Number(
                  doc?.data()?.totalAmountReceivedWithVAT || 0
                );

                let vatAmount = 0;
                if (doc?.data()?.invApplyVat) {
                  vatAmount =
                    Number(row?.rowDiscountedAmount || row?.rowAmount || 0) *
                    1.15;
                }

                if (isDocFoundIndex > -1) {
                  // get the qty Sold
                  let OldQtySold = Number(
                    allInventoryItemTransactionsData[isDocFoundIndex]
                      ?.itemQtySold || 0
                  );

                  // rebuild total qty
                  totalQtyRemaining = totalQtyRemaining + OldQtySold;

                  totalQtySold = totalQtySold - OldQtySold;

                  // remove old values from total
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

                // remove new values from total
                newTotalAmountReceivedWithoutVAT =
                  newTotalAmountReceivedWithoutVAT +
                  Number(row?.rowDiscountedAmount || row?.rowAmount || 0);

                newTotalAmountReceivedWithVAT =
                  newTotalAmountReceivedWithVAT + vatAmount;

                // calculate new remaining qty
                let remainingQty = totalQtyRemaining - qtySold;

                // calculate new total qty sold
                let newTotalQtySold = qtySold + totalQtySold;

                let allInventoryItemTransactions = [
                  ...(doc?.data()?.allInventoryItemTransactions || []),
                ];

                if (isDocFoundIndex > -1) {
                  // update data if already present
                  allInventoryItemTransactions = [
                    ...(allInventoryItemTransactionsData || []),
                  ];
                  allInventoryItemTransactions[isDocFoundIndex] = {
                    ...allInventoryItemTransactions[isDocFoundIndex],
                    actualRemainingStockAmount: remainingQty,
                    itemQtySold: qtySold,
                    rowAmount: row?.rowAmount || 0,
                    rowDiscountAmount: row?.rowDiscountAmount || 0,
                    rowDiscountedAmount: row?.rowDiscountedAmount || 0,
                    rowAmountWithVAT: vatAmount,
                    rowUnitPrice: row?.rowUnitPrice || 0,
                  };
                } else {
                  // add new entry
                  allInventoryItemTransactions = [
                    ...(allInventoryItemTransactionsData || []),
                  ];

                  allInventoryItemTransactions.push({
                    documentNumber: documentData?.id,
                    docString: documentData?.docString,
                    docCustomIdNumber: documentData?.docCustomIdNumber,
                    docTitle: documentData?.docTitle,
                    docType: documentType?.id,
                    docDate: new Date(),
                    itemId: row?.inventoryItemData?.id,
                    rowAmount: row?.rowAmount || 0,
                    rowDiscountAmount: row?.rowDiscountAmount || 0,
                    rowDiscountedAmount: row?.rowDiscountedAmount || 0,
                    rowAmountWithVAT: vatAmount,
                    rowUnitPrice: row?.rowUnitPrice || 0,
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
                      qtySold: newTotalQtySold || 0,
                      qtyRemaining: remainingQty || 0,
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

    // update document
    await db
      .collection("company")
      .doc(companyIdSelected)
      .collection(updateDocumentData?.documentTypeId)
      .doc(updatedDocId)
      .set(
        {
          ...documentData,
        },
        { merge: true }
      )
      .then(() => {
        enqueueSnackbar(
          `${updateDocumentData?.documentTypeTitle} updated successfully`
        );
        if (handleCloseUpdateDialog) {
          handleCloseUpdateDialog(true);
        }

        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while updating ${updateDocumentData?.documentTypeTitle}: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  return (
    <>
      <Button
        variant={"contained"}
        color={"primary"}
        onClick={() => updateDocument()}
        fullWidth
        disabled={!documentDetails?.docTotal}
      >
        {`Update ${documentType?.title}`}
      </Button>
    </>
  );
}
