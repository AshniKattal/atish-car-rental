import { Suspense, lazy, useEffect, useRef, useState } from "react";
// @mui
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
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
import db from "../../firebase";
import { useSnackbar } from "notistack";
import { setLoading } from "../../features/globalSlice";
import moment from "moment";
import {
  dynamicSort,
  getBillToDefaultValue,
  getParticularsDefaultValue,
  toDataUrl,
} from "../core-functions/SelectionCoreFunctions";
import { selectDocument } from "../../features/documentSlice";
import { makeStyles } from "@material-ui/core/styles";
import palette from "../../theme/palette";
import useSettings from "../../hooks/useSettings";
import SearchSkuCodeDialog from "./SearchSkuCodeDialog";
import SearchContractAgreementDialog from "./SearchContractAgreementDialog";
import l from "@linways/table-to-excel";

const QuotationOrPurchaseOrderInputField = lazy(() =>
  import(
    "./quotation-purchase-order-list-dialog/QuotationOrPurchaseOrderInputField"
  )
);
const DocumentConversion = lazy(() =>
  import("./document-conversion/DocumentConversion")
);
const DocumentTableStandard = lazy(() => import("./DocumentTableStandard"));
const DocumentTableTransport = lazy(() => import("./DocumentTableTransport"));
const DocumentSummaryTotal = lazy(() => import("./DocumentSummaryTotal"));
const DocumentSaveButton = lazy(() => import("./DocumentSaveButton"));
const DocumentUpdateButton = lazy(() => import("./DocumentUpdateButton"));
const FlexitransCustom = lazy(() =>
  import("./custom-flexitrans/FlexitransCustom")
);
const WorldLinkCustom = lazy(() =>
  import("./custom-worldlink/WorldLinkCustom")
);

const useStyles = (themeMode, palette) =>
  makeStyles(() => ({
    input: {
      background:
        themeMode === "light"
          ? palette.light.background.default
          : palette.dark.background.default,
    },
    multilineInput: {
      background:
        themeMode === "light"
          ? palette.light.background.default
          : palette.dark.background.default,
      resize: "both",
    },
  }));

// ----------------------------------------------------------------------

export default function DocumentInputDetails({
  action,
  handleCloseUpdateDialog,
  set_us_actionChoice,
}) {
  const { themeMode } = useSettings();

  const classes = useStyles(themeMode, palette)();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const ref = useRef(null);

  const temp_logo_image_ref = useRef();

  const temp_signature_image_ref = useRef();

  const temp_applyUpdatedData_ref = useRef();

  // const temp_showNotUsedVatInvoiceNumber_ref = useRef();

  const temp_refreshTable_ref = useRef();

  const temp_fetch_saved_description_ref = useRef();

  const temp_calculateTotal_ref = useRef();

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [savedDescriptions, setSavedDescriptions] = useState([]);

  const [us_openDialog, set_us_openDialog] = useState(false);

  const [us_openDialogSKUCodeSearch, set_us_openDialogSKUCodeSearch] =
    useState(false);

  const [
    us_openDialogContractAgreementSearch,
    set_us_openDialogContractAgreementSearch,
  ] = useState(false);

  const [us_s_quotationNumber, set_us_s_quotationNumber] = useState("");

  const [us_s_purchaseOrderNumber, set_us_s_purchaseOrderNumber] = useState("");

  const [logo, setLogo] = useState(null);

  const [sigImage, setSigImage] = useState(null);

  // const [deletedButUnusedDocIds, set_deletedButUnusedDocIds] = useState([]);

  const [displayDiscountColumns, set_displayDiscountColumns] = useState(false);

  const [defaultParticularOptions, set_defaultParticularOptions] = useState([]);

  const [partialPaymentAmount, setPartialPaymentAmount] = useState("");

  const {
    documentType,
    companyIdSelected,
    companyDetails,
    clientDocumentObjectSelected,
    updateDocumentData,
  } = useSelector(selectDocument);

  const [originalDocParticulars, setOriginalDocParticulars] = useState([]);

  const [documentDetails, setDocumentDetails] = useState({
    docCompDetails: null,
    docClientDetails: null,
    docCustomIdNumber: "",
    docBillTo: "",
    docShipTo: "",
    docDate: moment(new Date()).format("yyyy-MM-DD"),
    docParticulars: [],
    docSubTotal: "",
    docVatFee: "",
    docTotal: "",
    docTermsAndCondition: "",

    // custom part
    docBLNumber: "",
    docSupplier: "",
    docContainerNumber: "",
    docPackages: "",
    docDescription: "",
    docGrossWeight: "",
    docVolume: "",
    docPortOfLoading: "",
    docETA: "",
    docVesselName: "",
    docRoE: "",
    docPlaceOfLanding: "",

    //MRA customs
    transactionType:
      (process.env.REACT_APP_EBS_TRANSACTION_TYPES &&
        JSON.parse(process.env.REACT_APP_EBS_TRANSACTION_TYPES)[0]) ||
      null,
    personType: null,
    invoiceTypeDesc: { id: "STD", type: "Standard" },
    invoiceRefIdentifier: "",

    downPayment: "",
    downPaymentInvoiceNumber: "",
    discountTotalAmount: "",
    discountedTotalAmount: "",

    docSalesTransaction: null,
    docReasonStated: "",

    // use only in update mode -> check boolean value to display MRA template (new template) or old template
    MRATemplateApplied: false,

    // Fadil customs
    docTotalTaxableWithoutVatParticulars: "",
    docTotalTaxableVatOnlyParticulars: "",
    docTotalTaxableParticulars: "",
    docTotalZeroRatedParticulars: "",
    docTotalExemptParticulars: "",
    docTotalDisbursementParticulars: "",
    docTotalExemptBodiesParticulars: "",
    docDisbursementParticularsData: [],

    // transport template
    invJobRef: "",
    invStorageFee: "",
    invScanningFee: "",
    invGatePassFee: "",
    invVehicleNo: "",
    transportFees: "",
    transportDesc: "",
    invApplyVat:
      companyDetails?.id === process.env.REACT_APP_CUSTOM_SOREFAN_ID
        ? true
        : documentType?.id === "invoice" ||
          documentType?.id === "cash_transaction"
        ? false
        : true,

    // flexitrans template
    docShipper: "",
    docMarkNos: "",
    docCommodity: "",
    docHbl: "",
    docDepot: "",
  });

  const {
    docCustomIdNumber,
    docBillTo,
    docShipTo,
    docDate,
    docParticulars,
    docVatFee,
    docTermsAndCondition,

    /*     //custom details
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
    docPlaceOfLanding, */

    // MRA customs
    transactionType,
    invoiceTypeDesc,
    invoiceRefIdentifier,
    docReasonStated,

    // use only in update mode -> check boolean value to display MRA template (new template) or old template
    MRATemplateApplied,

    invStorageFee,
    invScanningFee,
    transportFees,
    invGatePassFee,

    invApplyVat,
  } = documentDetails;

  const [us_showViewDocument, set_us_showViewDocument] = useState({
    showViewButton: false,
    savedDocument: null,
  });

  useEffect(() => {
    temp_logo_image_ref.current();
    temp_signature_image_ref.current();
  }, []);

  useEffect(() => {
    temp_applyUpdatedData_ref.current();
  }, [action, updateDocumentData]);

  useEffect(() => {
    temp_refreshTable_ref.current();
  }, [action, companyDetails, clientDocumentObjectSelected]);

  // fetch all saved description
  useEffect(() => {
    temp_fetch_saved_description_ref.current();
  }, [action]);

  // calculate total
  useEffect(() => {
    temp_calculateTotal_ref.current();
  }, [
    docParticulars,
    docVatFee,
    invStorageFee,
    invScanningFee,
    invGatePassFee,
    transportFees,
    invApplyVat,
  ]);

  async function getLogoImage() {
    if (
      companyDetails?.data?.imageUrl &&
      companyDetails?.data?.imageUrl !== ""
    ) {
      dispatch(setLoading(true));
      let logoImage = await toDataUrl(companyDetails?.data?.imageUrl);
      setLogo(logoImage);
      dispatch(setLoading(false));
    }
  }

  temp_logo_image_ref.current = getLogoImage;

  async function getSignatureImage() {
    if (companyDetails?.data?.sigUrl && companyDetails?.data?.sigUrl !== "") {
      dispatch(setLoading(true));
      let sigImageResult = await toDataUrl(companyDetails?.data?.sigUrl);
      setSigImage(sigImageResult);
      dispatch(setLoading(false));
    }
  }

  temp_signature_image_ref.current = getSignatureImage;

  async function applyUpdatedData() {
    if (action === "update" && updateDocumentData) {
      set_us_s_quotationNumber(updateDocumentData?.data?.docQuoteNumber || "");

      set_us_s_purchaseOrderNumber(
        updateDocumentData?.data?.docPurchaseOrderNumber || ""
      );

      setOriginalDocParticulars(
        updateDocumentData?.data?.docParticulars &&
          updateDocumentData?.data?.docParticulars?.length > 0
          ? [...updateDocumentData?.data?.docParticulars]
          : []
      );

      setDocumentDetails({
        ...documentDetails,
        docCompDetails: { ...companyDetails },
        docClientDetails: { ...clientDocumentObjectSelected },
        docCustomIdNumber: updateDocumentData?.data?.docCustomIdNumber || "",
        docBillTo: updateDocumentData?.data?.docBillTo || "",
        docShipTo: updateDocumentData?.data?.docShipTo || "",
        docDate:
          moment(updateDocumentData?.data?.docDate.toDate()).format(
            "yyyy-MM-DD"
          ) || moment(new Date()).format("yyyy-MM-DD"),
        docParticulars:
          updateDocumentData?.data?.docParticulars &&
          updateDocumentData?.data?.docParticulars?.length > 0
            ? [...updateDocumentData?.data?.docParticulars]
            : [],
        docSubTotal: updateDocumentData?.data?.docSubTotal || "",
        docVatFee: updateDocumentData?.data?.docVatFee || "",
        docTotal: updateDocumentData?.data?.docTotal || "",
        docTermsAndCondition:
          updateDocumentData?.data?.docTermsAndCondition || "",

        // custom part
        docBLNumber: updateDocumentData?.data?.docBLNumber || "",
        docSupplier: updateDocumentData?.data?.docSupplier || "",
        docContainerNumber: updateDocumentData?.data?.docContainerNumber || "",
        docPackages: updateDocumentData?.data?.docPackages || "",
        docDescription: updateDocumentData?.data?.docDescription || "",
        docGrossWeight: updateDocumentData?.data?.docGrossWeight || "",
        docVolume: updateDocumentData?.data?.docVolume || "",
        docPortOfLoading: updateDocumentData?.data?.docPortOfLoading || "",
        docETA: updateDocumentData?.data?.docETA || "",
        docVesselName: updateDocumentData?.data?.docVesselName || "",
        docRoE: updateDocumentData?.data?.docRoE || "",
        docPlaceOfLanding: updateDocumentData?.data?.docPlaceOfLanding || "",

        //MRA customs
        transactionType:
          updateDocumentData?.data?.transactionType ||
          (process.env.REACT_APP_EBS_TRANSACTION_TYPES &&
            JSON.parse(process.env.REACT_APP_EBS_TRANSACTION_TYPES)[0]) ||
          null,
        personType: updateDocumentData?.data?.personType || null,
        invoiceTypeDesc: updateDocumentData?.data?.invoiceTypeDesc || {
          id: "STD",
          type: "Standard",
        },
        invoiceRefIdentifier:
          updateDocumentData?.data?.invoiceRefIdentifier || "",

        downPayment: updateDocumentData?.data?.downPayment || "",
        downPaymentInvoiceNumber:
          updateDocumentData?.data?.downPaymentInvoiceNumber || "",
        discountTotalAmount:
          updateDocumentData?.data?.discountTotalAmount || "",
        discountedTotalAmount:
          updateDocumentData?.data?.discountedTotalAmount || "",

        docSalesTransaction:
          updateDocumentData?.data?.docSalesTransaction || null,
        docReasonStated: updateDocumentData?.data?.docReasonStated || "",

        // use only in update mode -> check boolean value to display MRA template (new template) or old template
        MRATemplateApplied:
          updateDocumentData?.data?.MRATemplateApplied || false,
        // Fadil customs
        docTotalTaxableWithoutVatParticulars:
          updateDocumentData?.data?.docTotalTaxableWithoutVatParticulars || "",
        docTotalTaxableVatOnlyParticulars:
          updateDocumentData?.data?.docTotalTaxableVatOnlyParticulars || "",
        docTotalTaxableParticulars:
          updateDocumentData?.data?.docTotalTaxableParticulars || "",
        docTotalZeroRatedParticulars:
          updateDocumentData?.data?.docTotalZeroRatedParticulars || "",
        docTotalExemptParticulars:
          updateDocumentData?.data?.docTotalExemptParticulars || "",
        docTotalDisbursementParticulars:
          updateDocumentData?.data?.docTotalDisbursementParticulars || "",
        docTotalExemptBodiesParticulars:
          updateDocumentData?.data?.docTotalExemptBodiesParticulars || "",
        docDisbursementParticularsData:
          updateDocumentData?.data?.docDisbursementParticularsData || [],

        // transport template
        invJobRef: updateDocumentData?.data?.invJobRef || "",
        invStorageFee: updateDocumentData?.data?.invStorageFee || "",
        invScanningFee: updateDocumentData?.data?.invScanningFee || "",
        invGatePassFee: updateDocumentData?.data?.invGatePassFee || "",
        invVehicleNo: updateDocumentData?.data?.invVehicleNo || "",
        transportFees: updateDocumentData?.data?.transportFees || "",
        transportDesc: updateDocumentData?.data?.transportDesc || "",
        invApplyVat:
          Number(updateDocumentData?.data?.docVatFee || 0) > 0
            ? true
            : updateDocumentData?.data?.invApplyVat || false,

        // flexitrans template
        docShipper: updateDocumentData?.data?.docShipper || "",
        docMarkNos: updateDocumentData?.data?.docMarkNos || "",
        docCommodity: updateDocumentData?.data?.docCommodity || "",
        docHbl: updateDocumentData?.data?.docHbl || "",
        docDepot: updateDocumentData?.data?.docDepot || "",
      });
    }
  }

  temp_applyUpdatedData_ref.current = applyUpdatedData;

  /* async function showNotUsedVatInvoiceNumber() {
        if (
            action &&
            action === 'add' &&
            documentType &&
            documentType?.id === 'vat_invoice'
        ) {
            dispatch(setLoading(true));
            await db
                .collection('company')
                .doc(companyIdSelected)
                .collection('deletedvat_invoice')
                .get()
                .then((result) => {
                    if (result?.docs && result?.docs?.length > 0) {
                        const promises = [];
                        result?.docs.forEach(async (doc) => {
                            promises.push(
                                new Promise(async (resolve) => {
                                    await db
                                        .collection('company')
                                        .doc(companyIdSelected)
                                        .collection('vat_invoice')
                                        .doc(doc?.data()?.docString || '')
                                        .get()
                                        .then((resultDoc) => {
                                            if (resultDoc?.exists) {
                                                resolve({
                                                    error: false,
                                                    exist: true,
                                                });
                                            } else {
                                                resolve({
                                                    error: false,
                                                    exist: false,
                                                    docString:
                                                        doc?.data()?.docString,
                                                });
                                            }
                                        })
                                        .catch(() => {
                                            resolve({
                                                error: true,
                                            });
                                        });
                                }),
                            );
                        });

                        Promise.all(promises).then(async (allResponse) => {
                            let arr = [];
                            if (allResponse && allResponse?.length > 0) {
                                allResponse.forEach((doc) => {
                                    if (doc && !doc?.error && !doc?.exist) {
                                        arr.push({ docString: doc?.docString });
                                    }
                                });
                            }

                            if (arr?.length > 0) {
                                arr.sort(dynamicSort('docString'));

                                set_deletedButUnusedDocIds(arr);
                                set_displayDeletedButUnusedDocIdsPopUp(true);

                                dispatch(setLoading(false));
                            } else {
                                set_deletedButUnusedDocIds([]);
                                set_displayDeletedButUnusedDocIdsPopUp(false);

                                dispatch(setLoading(false));
                            }
                        });
                    }
                });
        }
    } */

  // temp_showNotUsedVatInvoiceNumber_ref.current = showNotUsedVatInvoiceNumber;

  async function refreshTable() {
    if (action === "add" && companyDetails && clientDocumentObjectSelected) {
      let billToDefaultvalue = await getBillToDefaultValue(
        clientDocumentObjectSelected
      );

      let particularsDefaultValue = [];

      if (companyDetails?.data?.documentTemplate === "transport") {
        particularsDefaultValue = await getParticularsDefaultValue(
          companyDetails?.id,
          companyDetails?.data?.documentTemplate
        );
      } else {
        if (companyDetails?.data?.documentTemplate === "flexitrans") {
          let particularOptions = await getParticularsDefaultValue(
            companyDetails?.id,
            companyDetails?.data?.documentTemplate
          );
          set_defaultParticularOptions(particularOptions);
        }

        particularsDefaultValue = [
          {
            rowOrder: 1,
            rowQty: "",
            rowDescription: "",
            rowUnitPrice: "",
            rowAmount: "",
            rowSubTotalAmount: "",
            rowDiscountAmount: "",
            rowDiscountedAmount: "",
            rowIsVatable:
              documentType?.id === "invoice" ||
              documentType?.id === "cash_transaction"
                ? false
                : true,
            rowVatAmount: "",
            rowTotalAmount: "",
            rowTaxCode: null,
            rowNature: null,
            rowVatCheckBoxDisabled: false,
          },
        ];
      }

      let docTermsAndConditionValue = "";
      if (
        companyDetails &&
        companyDetails?.data?.documentTemplate === "flexitrans"
      ) {
        docTermsAndConditionValue =
          "a. Cheque to be drawn in favour of FLEXITRANS LOGISTICS LTD.\nb. Payment on cash or office cheques unless otherwise agreed by management.\nc. Interest rate above 2% bank rate will be claimed on overdue A/C.\nd. If recovered through an attorney, legal fees + 10% of amount due representing attorney's commission will be claimed.";
      } else if (
        companyDetails?.id === process.env.REACT_APP_CUSTOM_BUGSBEGONE_ID
      ) {
        docTermsAndConditionValue =
          "Le paiement doit être fait un jour avant pour le procaine controle.";
      }

      setOriginalDocParticulars(particularsDefaultValue);

      // refresh table
      setDocumentDetails({
        docCompDetails: { ...companyDetails },
        docClientDetails: { ...clientDocumentObjectSelected },
        docCustomIdNumber: "",
        docBillTo: billToDefaultvalue || "",
        docShipTo: "",
        docDate: moment(new Date()).format("yyyy-MM-DD"),
        docParticulars: particularsDefaultValue,
        docSubTotal: "",
        docVatFee: "",
        docTotal: "",
        docTermsAndCondition: docTermsAndConditionValue || "",

        //custom details
        docBLNumber: "",
        docSupplier: "",
        docContainerNumber: "",
        docPackages: "",
        docDescription: "",
        docGrossWeight: "",
        docVolume: "",
        docPortOfLoading: "",
        docETA: "",
        docVesselName: "",
        docRoE: "",
        docPlaceOfLanding: "",

        // MRA customs
        transactionType:
          (process.env.REACT_APP_EBS_TRANSACTION_TYPES &&
            JSON.parse(process.env.REACT_APP_EBS_TRANSACTION_TYPES)[0]) ||
          null,
        personType: null,
        invoiceTypeDesc: { id: "STD", type: "Standard" },
        invoiceRefIdentifier: "",
        downPayment: 0,
        downPaymentInvoiceNumber: "",
        discountTotalAmount: 0,
        discountedTotalAmount: 0,
        docSalesTransaction: null,
        docReasonStated: "",

        //Fadil customs
        docTotalTaxableWithoutVatParticulars: "",
        docTotalTaxableVatOnlyParticulars: "",
        docTotalTaxableParticulars: "",
        docTotalZeroRatedParticulars: "",
        docTotalExemptParticulars: "",
        docTotalDisbursementParticulars: "",
        docTotalExemptBodiesParticulars: "",
        docDisbursementParticularsData: [],

        // flexitrans customs
        docShipper: "",
        docMarkNos: "",
        docCommodity: "",
        docHbl: "",
        docDepot: "",

        invApplyVat:
          companyDetails?.id === process.env.REACT_APP_CUSTOM_SOREFAN_ID
            ? true
            : documentType?.id === "invoice" ||
              documentType?.id === "cash_transaction"
            ? false
            : true,
      });

      // set_previousNoteHash("");
    }
  }

  temp_refreshTable_ref.current = refreshTable;

  async function fetchDescription() {
    if (companyDetails?.data?.documentTemplate !== "transport") {
      dispatch(setLoading(true));

      await db
        .collection("company")
        .doc(companyIdSelected)
        .collection("saved_descriptions")
        .get()
        .then(async (querySnapshot) => {
          if (querySnapshot?.docs?.length > 0) {
            let arr = [];
            querySnapshot?.docs.forEach((doc) => {
              arr.push({
                id: doc.id,
                description: doc?.data()?.text || "",
              });
            });

            const uniqueObjects = getUniqueObjects(arr, "description");

            // sort by description
            uniqueObjects.sort(dynamicSort("description"));

            setSavedDescriptions(uniqueObjects);
            dispatch(setLoading(false));
          } else {
            dispatch(setLoading(false));
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching saved descriptions: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  temp_fetch_saved_description_ref.current = fetchDescription;

  // Function to get unique objects based on a property
  function getUniqueObjects(arr, prop) {
    return arr.filter(
      (obj, index, self) =>
        index === self.findIndex((t) => t[prop] === obj[prop])
    );
  }

  function calculateTotal() {
    if (docParticulars && docParticulars?.length > 0) {
      let subTotal = 0;
      let totalDiscount = 0;
      let totalDiscounted = 0;
      let vat = 0;
      let total = 0;
      let docTotalTaxableWithoutVat = 0;
      let docTotalTaxableVatOnly = 0;
      let docTotalTaxable = 0;
      let docTotalZeroRated = 0;
      let docTotalExempt = 0;
      let docTotalDisbursement = 0;
      let docTotalExemptBodies = 0;
      let docDisbursementParticularsDataArray = [];

      if (companyDetails?.data?.documentTemplate === "transport") {
        subTotal = subTotal + Number(transportFees || 0);

        // fees
        total =
          subTotal +
          Number(invStorageFee || 0) +
          Number(invScanningFee || 0) +
          Number(invGatePassFee || 0) +
          Number(docVatFee || 0);

        setDocumentDetails({
          ...documentDetails,
          docSubTotal: subTotal,
          docTotal: total,
        });
      } else if (companyDetails?.data?.documentTemplate === "smart_promote") {
        // total particulars
        if (docParticulars?.length > 0) {
          let newRowTotalDiscount = 0;
          let subtotalWithoutDiscount = 0;
          let vatWithoutDiscount = 0;
          let totalWithoutDiscount = 0;

          docParticulars.forEach((particular) => {
            subTotal = subTotal + Number(particular?.rowDiscountedAmount || 0);

            subtotalWithoutDiscount =
              subtotalWithoutDiscount + Number(particular?.rowAmount || 0);
          });

          if (invApplyVat || documentType?.id === "vat_invoice") {
            vat = 0.15 * Number(subTotal);

            vatWithoutDiscount = 0.15 * Number(subtotalWithoutDiscount);
          }

          total = subTotal + vat;

          totalWithoutDiscount = subtotalWithoutDiscount + vatWithoutDiscount;

          newRowTotalDiscount = totalWithoutDiscount - total;

          setDocumentDetails((previousState) => {
            return {
              ...previousState,
              docSubTotal: subTotal || 0,
              docVatFee: vat || 0,
              docTotal: total || 0,
              discountTotalAmount: Math.round(Number(newRowTotalDiscount || 0)),
            };
          });
        }
      } else if (
        /**
         * check if company chosen require old or new table template
         * template may alter depending on action -> add or update
         * if action === add -> check if company's MRATemplateFlag is true to apply new template or not
         * if action === update -> check if MRATemplateApplied to verify if the updated invoice has been saved with new template
         */
        (process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE &&
          companyIdSelected &&
          process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE.includes(
            companyIdSelected
          )) ||
        (action === "add" && companyDetails?.data?.MRATemplateFlag?.value) ||
        (action === "update" && MRATemplateApplied)
      ) {
        // total particulars
        if (docParticulars?.length > 0) {
          docParticulars.forEach((particular) => {
            if (
              particular &&
              particular?.rowTaxCode &&
              particular?.rowTaxCode?.id === "TC01"
            ) {
              docTotalTaxableWithoutVat =
                docTotalTaxableWithoutVat +
                Number(particular?.rowDiscountedAmount || 0);
              docTotalTaxableVatOnly =
                docTotalTaxableVatOnly + Number(particular?.rowVatAmount || 0);
              docTotalTaxable =
                docTotalTaxable + Number(particular?.rowTotalAmount || 0);
            } else if (
              particular &&
              particular?.rowTaxCode &&
              particular?.rowTaxCode?.id === "TC02"
            ) {
              docTotalZeroRated =
                docTotalZeroRated + Number(particular?.rowTotalAmount || 0);
            } else if (
              particular &&
              particular?.rowTaxCode &&
              particular?.rowTaxCode?.id === "TC03"
            ) {
              docTotalExempt =
                docTotalExempt + Number(particular?.rowTotalAmount || 0);
            } else if (
              particular &&
              particular?.rowTaxCode &&
              particular?.rowTaxCode?.id === "TC04"
            ) {
              docTotalDisbursement =
                docTotalDisbursement + Number(particular?.rowTotalAmount || 0);

              docDisbursementParticularsDataArray.push({
                description: particular?.rowDescription || "",
                amount: particular?.rowTotalAmount || "",
              });
            } else if (
              particular &&
              particular?.rowTaxCode &&
              particular?.rowTaxCode?.id === "TC05"
            ) {
              docTotalExemptBodies =
                docTotalExemptBodies + Number(particular?.rowTotalAmount || 0);
            }

            subTotal = subTotal + Number(particular?.rowAmount || 0);

            totalDiscounted =
              totalDiscounted + Number(particular?.rowDiscountedAmount || 0);

            totalDiscount =
              totalDiscount + Number(particular?.rowDiscountAmount || 0);

            vat = vat + Number(particular?.rowVatAmount || 0);

            total = total + Number(particular?.rowTotalAmount || 0);
          });
        }

        setDocumentDetails((previousState) => {
          return {
            ...previousState,
            docSubTotal: subTotal,
            discountTotalAmount: totalDiscount,
            discountedTotalAmount: totalDiscounted,
            docVatFee: vat,
            docTotal: total,
            docTotalTaxableWithoutVatParticulars: docTotalTaxableWithoutVat,
            docTotalTaxableVatOnlyParticulars: docTotalTaxableVatOnly,
            docTotalTaxableParticulars: docTotalTaxable,
            docTotalZeroRatedParticulars: docTotalZeroRated,
            docTotalExemptParticulars: docTotalExempt,
            docTotalDisbursementParticulars: docTotalDisbursement,
            docTotalExemptBodiesParticulars: docTotalExemptBodies,
            docDisbursementParticularsData: docDisbursementParticularsDataArray,
          };
        });
      } else {
        // total particulars
        if (docParticulars?.length > 0) {
          docParticulars.forEach((particular) => {
            subTotal = subTotal + Number(particular?.rowAmount || 0);
          });
        }

        if (invApplyVat || documentType?.id === "vat_invoice") {
          vat = 0.15 * Number(subTotal);
        }

        total = subTotal + vat;

        setDocumentDetails((previousState) => {
          return {
            ...previousState,
            docSubTotal: subTotal || 0,
            docVatFee: vat || 0,
            docTotal: total || 0,
          };
        });
      }
    }
  }

  temp_calculateTotal_ref.current = calculateTotal;

  const handleCloseDialog = () => {
    set_us_openDialog(false);
    set_us_openDialogSKUCodeSearch(false);
    set_us_openDialogContractAgreementSearch(false);
  };

  function handleInputChange(value, index, name) {
    let newDocParticulars = [...docParticulars];

    if (
      name === "rowQty" ||
      name === "rowUnitPrice" ||
      name === "rowDiscountAmount" ||
      name === "rowTaxCode"
    ) {
      let newAmount = 0;
      let rowDiscountedAmount = 0;
      let vatAmount = 0;
      let totalAmount = 0;

      if (name === "rowQty") {
        let docUnitPrice = Number(newDocParticulars[index]?.rowUnitPrice || 0);
        if (Number(value) >= 0 && docUnitPrice && Number(docUnitPrice > 0)) {
          newAmount = Number(value) * Number(docUnitPrice);
        }
      } else if (name === "rowUnitPrice") {
        let docQty = Number(newDocParticulars[index]?.rowQty || 0);
        if (docQty && Number(docQty > 0)) {
          newAmount = Number(value) * Number(docQty);
        }
      } else if (name === "rowDiscountAmount" || name === "rowTaxCode") {
        let docUnitPrice = Number(newDocParticulars[index]?.rowUnitPrice || 0);
        let docQty = Number(newDocParticulars[index]?.rowQty || 0);
        newAmount = Number(docUnitPrice) * Number(docQty);
      }

      /**
       * custom discount calculation for smart promote
       */
      if (companyDetails?.data?.documentTemplate === "smart_promote") {
        if (name === "rowDiscountAmount") {
          rowDiscountedAmount = Number(newAmount) - Number(value);
        } else {
          if (
            newDocParticulars[index]?.rowDiscountAmount &&
            Number(newDocParticulars[index]?.rowDiscountAmount) > 0
          ) {
            rowDiscountedAmount =
              Number(newAmount) -
              Number(newDocParticulars[index]?.rowDiscountAmount);
          } else {
            rowDiscountedAmount = Number(newAmount);
          }
        }

        newDocParticulars[index] = {
          ...newDocParticulars[index],
          [name]: value,
          rowAmount: newAmount,
          rowDiscountedAmount: rowDiscountedAmount,
        };
      } else if (
        /**
         * check if company chosen require old or new table template
         * template may alter depending on action -> add or update
         * if action === add -> check if company's MRATemplateFlag is true to apply new template or not
         * if action === update -> check if MRATemplateApplied to verify if the updated invoice has been saved with new template
         */
        (process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE &&
          companyIdSelected &&
          process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE.includes(
            companyIdSelected
          )) ||
        (action === "add" && companyDetails?.data?.MRATemplateFlag?.value) ||
        (action === "update" && MRATemplateApplied)
      ) {
        let isVatable = false;

        if (
          documentType?.id === "invoice" ||
          documentType?.id === "cash_transaction"
        ) {
          isVatable = false;
        } else if (name === "rowTaxCode") {
          if (value && value?.id === "TC01") {
            isVatable = true;
          } else {
            isVatable = false;
          }
        } else if (newDocParticulars[index]?.rowIsVatable === undefined) {
          isVatable = true;
        } else {
          isVatable = newDocParticulars[index]?.rowIsVatable;
        }

        // apply discount
        if (name === "rowDiscountAmount") {
          rowDiscountedAmount = Number(newAmount) - Number(value);
        } else {
          if (
            newDocParticulars[index]?.rowDiscountAmount &&
            Number(newDocParticulars[index]?.rowDiscountAmount) > 0
          ) {
            rowDiscountedAmount =
              Number(newAmount) -
              Number(newDocParticulars[index]?.rowDiscountAmount);
          } else {
            rowDiscountedAmount = Number(newAmount);
          }
        }

        if (isVatable) {
          vatAmount = 0.15 * Number(rowDiscountedAmount);
          totalAmount = vatAmount + rowDiscountedAmount;
        } else {
          totalAmount = rowDiscountedAmount;
        }

        let particularChange = {
          rowIsVatable: isVatable,
          rowAmount: newAmount,
          rowDiscountedAmount: rowDiscountedAmount,
          rowVatAmount: vatAmount,
          rowTotalAmount: totalAmount,
        };

        // check if checkbox needs to be disabled or not
        if (name === "rowTaxCode") {
          if (value && value?.id) {
            particularChange = {
              ...particularChange,
              rowVatCheckBoxDisabled: true,
            };
          } else {
            particularChange = {
              ...particularChange,
              rowVatCheckBoxDisabled: false,
            };
          }
        } else if (
          newDocParticulars[index]?.rowTaxCode &&
          newDocParticulars[index]?.rowTaxCode?.id
        ) {
          particularChange = {
            ...particularChange,
            rowVatCheckBoxDisabled: true,
          };
        } else {
          particularChange = {
            ...particularChange,
            rowVatCheckBoxDisabled: false,
          };
        }

        newDocParticulars[index] = {
          ...newDocParticulars[index],
          [name]: value,
          ...particularChange,
        };
      } else {
        if (documentType?.id !== "invoice") {
          vatAmount = 0.15 * Number(newAmount);
          totalAmount = vatAmount + Number(newAmount);
        } else {
          totalAmount = Number(newAmount);
        }

        newDocParticulars[index] = {
          ...newDocParticulars[index],
          [name]: value,
          rowAmount: newAmount,
          rowVatAmount: vatAmount,
          rowTotalAmount: totalAmount,
        };
      }
    } else {
      newDocParticulars[index] = {
        ...newDocParticulars[index],
        [name]: value,
      };
    }

    setDocumentDetails((previousState) => {
      return {
        ...previousState,
        docParticulars: newDocParticulars,
      };
    });

    if (
      name === "rowQty" ||
      name === "rowUnitPrice" ||
      name === "rowDiscountAmount" ||
      name === "rowTaxCode"
    ) {
      calculateTotal();
    }
  }

  function handleOrderChange(value, index) {
    // change order of row
    let newDocParticulars = [...(docParticulars || [])];
    const newOrderNumber = Number(value || 0);
    newDocParticulars[index] = {
      ...newDocParticulars[index],
      rowOrder: newOrderNumber,
    };

    // sort all rows by order number
    newDocParticulars.sort(dynamicSort("rowOrder"));

    setDocumentDetails({
      ...documentDetails,
      docParticulars: newDocParticulars,
    });
  }

  function handleIsVatableChange(index, value) {
    let newDocParticulars = [...(docParticulars || [])];

    let discountedAmount = 0;
    let vatAmount = 0;
    let totalAmount = 0;

    if (newDocParticulars[index]?.rowDiscountedAmount) {
      discountedAmount = Number(
        newDocParticulars[index]?.rowDiscountedAmount || 0
      );
    } else {
      discountedAmount = Number(newDocParticulars[index]?.rowAmount || 0);
    }

    if (value) {
      vatAmount = 0.15 * Number(discountedAmount);
      totalAmount = vatAmount + discountedAmount;
    } else {
      totalAmount = discountedAmount;
    }

    newDocParticulars[index] = {
      ...newDocParticulars[index],
      rowIsVatable: value,
      rowDiscountedAmount: discountedAmount,
      rowVatAmount: vatAmount,
      rowTotalAmount: totalAmount,
    };

    setDocumentDetails((previousState) => {
      return {
        ...previousState,
        docParticulars: newDocParticulars,
      };
    });

    calculateTotal();
  }

  async function deleteParticular(index) {
    // remove respectiv row from table
    let newDocParticulars = [...(docParticulars || [])];
    newDocParticulars.splice(index, 1);
    setDocumentDetails({
      ...documentDetails,
      docParticulars: newDocParticulars,
    });
  }

  function selectSavedDesription(selectedDescription) {
    if (selectedRowIndex !== null) {
      let newDocParticulars = [...(docParticulars || [])];

      // add selected description with current description if present
      let newDesc =
        (newDocParticulars[selectedRowIndex]?.rowDescription || "") +
          selectedDescription || "";

      // update state using index
      newDocParticulars[selectedRowIndex] = {
        ...newDocParticulars[selectedRowIndex],
        rowDescription: newDesc,
      };

      setDocumentDetails({
        ...documentDetails,
        docParticulars: newDocParticulars,
      });

      // close popup
      handleCloseDialog();
    }
  }

  /*   async function setup() {
    const defaultPart = [
      {
        rowOrder: 1,
        rowDescription: "CFS CHARGES",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 2,
        rowDescription: "LANDING CHARGES",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 3,
        rowDescription: "DOCUMENTATION FEES",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 4,
        rowDescription: "AGENCY FEES",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 5,
        rowDescription: "MACCS FEE",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 6,
        rowDescription: "THC",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 7,
        rowDescription: "CUSTOM VAT",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 8,
        rowDescription: "TRANSPORT",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 9,
        rowDescription: "OFFICE CHARGES",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 10,
        rowDescription: "MNS FEES",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 11,
        rowDescription: "GATE PASS",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
      {
        rowOrder: 12,
        rowDescription: "COLLECT FOR SHIPPER",
        rowQty: "",
        rowUnitPrice: "",
        rowAmount: "",
        rowDiscountAmount: "",
        rowDiscountedAmount: "",
        rowIsVatable: false,
        rowVatAmount: "",
        rowTotalAmount: "",
        rowTaxCode: null,
        rowNature: { id: "SERVICES", title: "Services" },
        rowVatCheckBoxDisabled: false,
      },
    ];

    defaultPart.forEach(async (part) => {
      await db
        .collection("company")
        .doc(companyDetails?.id)
        .collection("particulars")
        .add({ ...part })
        .then(() => {
          console.log("done");
        });
    });
  } */

  return (
    <>
      <Grid item xs={12} md={12}>
        <hr />
        <br />
        <Typography>{`Please enter details required for the ${documentType?.title}`}</Typography>
      </Grid>

      {/*       <Button onClick={() => setup()}>set up</Button> */}

      <Grid item xs={12} md={12}>
        <Card>
          <CardContent
            style={{
              background:
                themeMode && themeMode === "light"
                  ? "#E2F3FE"
                  : palette.dark.background.paper,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <TextField
                    variant="outlined"
                    name="billTo"
                    label="Bill to"
                    id="billTo"
                    type="text"
                    value={docBillTo || ""}
                    onChange={(event) => {
                      setDocumentDetails((previous) => {
                        return {
                          ...previous,
                          docBillTo: event.target.value,
                        };
                      });
                    }}
                    size="small"
                    fullWidth
                    multiline
                    minRows={5}
                    InputProps={{
                      className: classes.input,
                    }}
                  />

                  <TextField
                    variant="outlined"
                    name="shipTo"
                    label="Location"
                    id="shipTo"
                    type="text"
                    value={docShipTo || ""}
                    onChange={(event) => {
                      setDocumentDetails((previous) => {
                        return {
                          ...previous,
                          docShipTo: event.target.value,
                        };
                      });
                    }}
                    size="small"
                    fullWidth
                    multiline
                    minRows={5}
                    InputProps={{
                      className: classes.input,
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Grid container spacing={3}>
                  {action && action !== "update" ? (
                    <Grid item xs={12} md={12}>
                      <Suspense fallback={<></>}>
                        <DocumentConversion
                          documentDetails={documentDetails}
                          setDocumentDetails={setDocumentDetails}
                          set_us_actionChoice={set_us_actionChoice}
                          classStyle={classes.multilineInput}
                        />
                      </Suspense>
                    </Grid>
                  ) : (
                    <></>
                  )}

                  {action && action === "add" ? (
                    <Grid item xs={12} md={12}>
                      <TextField
                        variant="outlined"
                        name="docCustomIdNumber"
                        label={"Custom document Id number"}
                        id="docCustomIdNumber"
                        type="text"
                        value={docCustomIdNumber || ""}
                        size="small"
                        fullWidth
                        onChange={(event) => {
                          setDocumentDetails((previous) => {
                            return {
                              ...previous,
                              docCustomIdNumber: event.target.value,
                            };
                          });
                        }}
                        InputProps={{
                          className: classes.input,
                        }}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}

                  <Grid item xs={12} md={12}>
                    <TextField
                      variant="outlined"
                      name="invoiceDate"
                      label={`Date Of ${documentType?.title}`}
                      id="invoiceDate"
                      type="date"
                      value={docDate || ""}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      size="small"
                      fullWidth
                      // disabled
                      onChange={(event) => {
                        if (event.target.value) {
                          setDocumentDetails((previous) => {
                            return {
                              ...previous,
                              docDate: event.target.value,
                            };
                          });
                        }
                      }}
                      InputProps={{
                        className: classes.input,
                      }}
                      disabled={action === "update" ? false : true}
                    />
                  </Grid>

                  {/**
                   * Option to add quotation number
                   */}
                  {documentType?.id && documentType?.id !== "quotation" ? (
                    <Grid item xs={12} md={12}>
                      <Suspense fallback={<></>}>
                        <QuotationOrPurchaseOrderInputField
                          action={action}
                          fieldType={"quotation"}
                          us_doc_number={us_s_quotationNumber}
                          set_us_doc_number={set_us_s_quotationNumber}
                          classes={classes}
                          logo={logo}
                          sigImage={sigImage}
                          documentDetails={documentDetails}
                          setDocumentDetails={setDocumentDetails}
                        />
                      </Suspense>
                    </Grid>
                  ) : (
                    ""
                  )}

                  {/**
                   * Option to add purchase order number
                   */}
                  {documentType?.id &&
                  documentType?.id !== "quotation" &&
                  documentType?.id !== "purchase_order" ? (
                    <Grid item xs={12} md={12}>
                      <Suspense fallback={<></>}>
                        <QuotationOrPurchaseOrderInputField
                          fieldType={"purchase_order"}
                          us_doc_number={us_s_purchaseOrderNumber}
                          set_us_doc_number={set_us_s_purchaseOrderNumber}
                          classes={classes}
                          logo={logo}
                          sigImage={sigImage}
                          documentDetails={documentDetails}
                          setDocumentDetails={setDocumentDetails}
                        />
                      </Suspense>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              {documentType?.id !== "quotation" ? (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    className={classes.multilineInput}
                    style={{ borderRadius: "10px" }}
                    ListboxProps={{
                      style: { maxHeight: "70vh" },
                    }}
                    size="small"
                    label="Please define a type of transaction"
                    id="transaction-type-drop-down"
                    options={
                      process.env.REACT_APP_EBS_TRANSACTION_TYPES
                        ? JSON.parse(
                            process.env.REACT_APP_EBS_TRANSACTION_TYPES
                          )
                        : []
                    }
                    value={transactionType}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Please define a type of transaction"
                        required
                      />
                    )}
                    required
                    onChange={(e, value, reason) => {
                      e.preventDefault();
                      if (
                        reason !== "removeOption" &&
                        reason !== "clear" &&
                        value
                      ) {
                        setDocumentDetails({
                          ...documentDetails,
                          transactionType: value,
                        });
                      } else if (
                        reason === "removeOption" ||
                        reason === "clear"
                      ) {
                        setDocumentDetails({
                          ...documentDetails,
                          transactionType: null,
                        });
                      }
                    }}
                    getOptionLabel={(option) => option?.type || ""}
                    fullWidth
                  />
                </Grid>
              ) : (
                <></>
              )}

              {documentType?.id !== "quotation" ? (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    className={classes.multilineInput}
                    style={{ borderRadius: "10px" }}
                    ListboxProps={{
                      style: { maxHeight: "70vh" },
                    }}
                    size="small"
                    label="Please define type of document"
                    id="invoice-type-drop-down"
                    options={
                      documentType?.id === "vat_invoice" &&
                      process.env.REACT_APP_EBS_INVOICE_TYPE_DESC_INVOICE
                        ? JSON.parse(
                            process.env.REACT_APP_EBS_INVOICE_TYPE_DESC_INVOICE
                          )
                        : documentType?.id === "proforma" &&
                          process.env.REACT_APP_EBS_INVOICE_TYPE_DESC_PROFORMA
                        ? JSON.parse(
                            process.env.REACT_APP_EBS_INVOICE_TYPE_DESC_PROFORMA
                          )
                        : documentType?.id === "credit_note" &&
                          process.env
                            .REACT_APP_EBS_INVOICE_TYPE_DESC_CREDIT_NOTE
                        ? JSON.parse(
                            process.env
                              .REACT_APP_EBS_INVOICE_TYPE_DESC_CREDIT_NOTE
                          )
                        : documentType?.id === "debit_note" &&
                          process.env.REACT_APP_EBS_INVOICE_TYPE_DESC_DEBIT_NOTE
                        ? JSON.parse(
                            process.env
                              .REACT_APP_EBS_INVOICE_TYPE_DESC_DEBIT_NOTE
                          )
                        : []
                    }
                    value={invoiceTypeDesc || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Please define type of document"
                      />
                    )}
                    required
                    onChange={(e, value, reason) => {
                      e.preventDefault();
                      if (
                        reason !== "removeOption" &&
                        reason !== "clear" &&
                        value
                      ) {
                        setDocumentDetails({
                          ...documentDetails,
                          invoiceTypeDesc: value,
                        });
                      } else if (
                        reason === "removeOption" ||
                        reason === "clear"
                      ) {
                        setDocumentDetails({
                          ...documentDetails,
                          invoiceTypeDesc: null,
                        });
                      }
                    }}
                    getOptionLabel={(option) => option?.type || ""}
                    fullWidth
                  />
                </Grid>
              ) : (
                <></>
              )}

              {invoiceTypeDesc &&
              (invoiceTypeDesc?.id === "CRN" ||
                invoiceTypeDesc?.id === "DRN") ? (
                <>
                  {invoiceTypeDesc?.id === "CRN" ? (
                    <Grid item xs={12} md={4}>
                      <TextField
                        variant="outlined"
                        name="docReasonStated"
                        label="Reason"
                        id="docReasonStated"
                        type="text"
                        value={docReasonStated || ""}
                        size="small"
                        fullWidth
                        onChange={(event) => {
                          setDocumentDetails((previous) => {
                            return {
                              ...previous,
                              docReasonStated: event.target.value,
                            };
                          });
                        }}
                        InputProps={{
                          className: classes.input,
                        }}
                      />
                    </Grid>
                  ) : (
                    <></>
                  )}

                  <Grid item xs={12} md={4}>
                    <Tooltip title="This attribute defines the sequential number of an existing invoice. The attribute is mandatory if type of invoice is a Credit or a Debit">
                      <TextField
                        variant="outlined"
                        name="invoiceRefIdentifier"
                        label={"Invoice Ref Identier"}
                        id="invoiceRefIdentifier"
                        type="text"
                        value={invoiceRefIdentifier || ""}
                        size="small"
                        fullWidth
                        onChange={(event) => {
                          setDocumentDetails((previous) => {
                            return {
                              ...previous,
                              invoiceRefIdentifier: event.target.value,
                            };
                          });
                        }}
                        InputProps={{
                          className: classes.input,
                        }}
                      />
                    </Tooltip>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {companyDetails &&
              companyDetails?.data &&
              companyDetails?.data?.documentTemplate === "flexitrans" ? (
                <Suspense fallback={<></>}>
                  <FlexitransCustom
                    classes={classes}
                    documentDetails={documentDetails}
                    setDocumentDetails={setDocumentDetails}
                  />
                </Suspense>
              ) : (
                <></>
              )}

              {process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE &&
              companyDetails?.id &&
              process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE.includes(
                companyDetails?.id
              ) ? (
                <Suspense fallback={<></>}>
                  <WorldLinkCustom
                    classes={classes}
                    documentDetails={documentDetails}
                    setDocumentDetails={setDocumentDetails}
                  />
                </Suspense>
              ) : (
                <></>
              )}
              <Grid item xs={12} md={12}>
                <Divider flexItem />
              </Grid>

              {companyDetails &&
              companyDetails?.data?.documentTemplate === "transport" ? (
                <Suspense fallback={<></>}>
                  <DocumentTableTransport
                    action={action}
                    classes={classes}
                    companyDetails={companyDetails}
                    companyIdSelected={companyIdSelected}
                    documentDetails={documentDetails}
                    setDocumentDetails={setDocumentDetails}
                    deleteParticular={deleteParticular}
                    originalDocParticulars={originalDocParticulars}
                  />
                </Suspense>
              ) : (
                <Suspense fallback={<></>}>
                  <DocumentTableStandard
                    companyDetails={companyDetails}
                    documentDetails={documentDetails}
                    setDocumentDetails={setDocumentDetails}
                    documentType={documentType}
                    savedDescriptions={savedDescriptions}
                    set_us_openDialog={set_us_openDialog}
                    set_us_openDialogSKUCodeSearch={
                      set_us_openDialogSKUCodeSearch
                    }
                    set_us_openDialogContractAgreementSearch={
                      set_us_openDialogContractAgreementSearch
                    }
                    handleInputChange={handleInputChange}
                    handleOrderChange={handleOrderChange}
                    handleIsVatableChange={handleIsVatableChange}
                    deleteParticular={deleteParticular}
                    setSelectedRowIndex={setSelectedRowIndex}
                    action={action}
                    companyMRATemplateFlag={
                      companyDetails?.data?.MRATemplateFlag?.value
                    }
                    documentMRATemplateApplied={MRATemplateApplied}
                    displayDiscountColumns={displayDiscountColumns}
                    set_displayDiscountColumns={set_displayDiscountColumns}
                    defaultParticularOptions={defaultParticularOptions}
                  />
                </Suspense>
              )}

              <Suspense fallback={<></>}>
                <DocumentSummaryTotal
                  documentType={documentType}
                  documentDetails={documentDetails}
                  action={action}
                  companyMRATemplateFlag={
                    companyDetails?.data?.MRATemplateFlag?.value
                  }
                  documentMRATemplateApplied={MRATemplateApplied}
                  companyId={companyDetails?.id}
                  inputClass={classes.input}
                  setDocumentDetails={setDocumentDetails}
                  documentTemplate={
                    companyDetails?.data?.documentTemplate || ""
                  }
                  displayDiscountColumns={displayDiscountColumns}
                  calculateTotal={calculateTotal}
                />
              </Suspense>

              {action === "add" &&
              documentType?.id === "proforma" &&
              companyDetails?.id ===
                process.env.REACT_APP_CUSTOM_SMART_PROMOTE_ID ? (
                <Grid item xs={12} md={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        variant="outlined"
                        name="partialPaymentAmount"
                        label="Partial payment amount"
                        id="partialPaymentAmount"
                        type="text"
                        value={partialPaymentAmount || ""}
                        onChange={(event) => {
                          setPartialPaymentAmount(event.target.value);
                        }}
                        size="small"
                        fullWidth
                        InputProps={{ className: classes.input }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}

              <Grid item xs={12} md={4}>
                <TextField
                  variant="outlined"
                  name="termsAndCondition"
                  label="Terms and condition"
                  id="termsAndCondition"
                  type="text"
                  value={docTermsAndCondition || ""}
                  onChange={(event) => {
                    setDocumentDetails((previous) => {
                      return {
                        ...previous,
                        docTermsAndCondition: event.target.value,
                      };
                    });
                  }}
                  size="small"
                  fullWidth
                  multiline
                  minRows={5}
                  InputProps={{ className: classes.input }}
                />
              </Grid>
              <Grid item xs={12} md={12} style={{ width: "100%" }}>
                <Stack spacing={3} direction="row">
                  {action && action === "add" ? (
                    <Suspense fallback={<></>}>
                      <DocumentSaveButton
                        originalDocParticulars={originalDocParticulars}
                        documentDetails={documentDetails}
                        us_s_quotationNumber={us_s_quotationNumber}
                        us_s_purchaseOrderNumber={us_s_purchaseOrderNumber}
                        set_us_showViewDocument={set_us_showViewDocument}
                        refreshTable={refreshTable}
                        fetchDescription={fetchDescription}
                        displayDiscountColumns={displayDiscountColumns}
                        partialPaymentAmount={partialPaymentAmount}
                      />
                    </Suspense>
                  ) : action && action === "update" ? (
                    <Suspense fallback={<></>}>
                      <DocumentUpdateButton
                        updateDocumentData={updateDocumentData}
                        documentDetails={documentDetails}
                        us_s_quotationNumber={us_s_quotationNumber}
                        us_s_purchaseOrderNumber={us_s_purchaseOrderNumber}
                        handleCloseUpdateDialog={handleCloseUpdateDialog}
                        displayDiscountColumns={displayDiscountColumns}
                      />
                    </Suspense>
                  ) : (
                    <></>
                  )}

                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                      set_us_showViewDocument({
                        showViewButton: false,
                        savedDocument: null,
                      });

                      ref.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                    fullWidth
                    style={{
                      display: us_showViewDocument?.showViewButton
                        ? ""
                        : "none",
                    }}
                  >
                    {`Create new ${documentType?.title}`}
                  </Button>

                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                      set_us_actionChoice("view");
                    }}
                    fullWidth
                    style={{
                      display: us_showViewDocument?.showViewButton
                        ? ""
                        : "none",
                    }}
                  >
                    {`View ${documentType?.title}`}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {us_openDialogSKUCodeSearch ? (
        <SearchSkuCodeDialog
          open={us_openDialogSKUCodeSearch}
          handleCloseDialog={handleCloseDialog}
          documentDetails={documentDetails}
          setDocumentDetails={setDocumentDetails}
          selectedRowIndex={selectedRowIndex}
        />
      ) : (
        <></>
      )}

      {us_openDialogContractAgreementSearch ? (
        <SearchContractAgreementDialog
          open={us_openDialogContractAgreementSearch}
          handleCloseDialog={handleCloseDialog}
          documentDetails={documentDetails}
          setDocumentDetails={setDocumentDetails}
          selectedRowIndex={selectedRowIndex}
          logo={logo}
          sigImage={sigImage}
        />
      ) : (
        <></>
      )}

      {us_openDialog ? (
        <Dialog open={us_openDialog} maxWidth={"sm"} fullWidth>
          <DialogTitle>Saved description</DialogTitle>
          <DialogContent>
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TableContainer>
                  <Table border={1}>
                    <TableHead>
                      <TableRow>
                        <TableCell size="small">Description</TableCell>
                        <TableCell size="small">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {savedDescriptions?.map((desc, index) => (
                        <TableRow key={index}>
                          <TableCell size="small">
                            <Typography>{desc?.description}</Typography>
                          </TableCell>
                          <TableCell size="small">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                selectSavedDesription(desc?.description)
                              }
                            >
                              select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleCloseDialog()}
            >
              cancel
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
}
