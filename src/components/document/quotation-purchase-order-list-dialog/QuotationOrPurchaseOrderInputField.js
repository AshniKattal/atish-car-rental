import { IconButton, Stack, TextField } from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { lazy, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDocument } from "../../../features/documentSlice";
import { useSnackbar } from "notistack";
import { setLoading } from "../../../features/globalSlice";
import { formatDocumentIdNumber } from "../../core-functions/SelectionCoreFunctions";
import db from "src/firebase";

const QuotationOrPurchaseOrderListDialog = lazy(() =>
  import("./QuotationOrPurchaseOrderListDialog")
);

export default function QuotationOrPurchaseOrderInputField({
  fieldType,
  us_doc_number,
  set_us_doc_number,
  classes,
  logo,
  sigImage,
  documentDetails,
  setDocumentDetails,
}) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { companyIdSelected, clientDocumentObjectSelected } =
    useSelector(selectDocument);

  const [dialogListType, setDialogListType] = useState("");

  const [us_open_DocumentListDialog, set_us_open_DocumentListDialog] =
    useState(false);

  async function onHandleManualQuoteSubmit() {
    if (!us_doc_number) {
      enqueueSnackbar("Please provide a quotation number", {
        variant: "error",
      });
    } else {
      dispatch(setLoading(true));

      let documentNumberDocString = await formatDocumentIdNumber(us_doc_number);

      await db
        .collection("company")
        .doc(companyIdSelected)
        .collection(fieldType)
        .doc(documentNumberDocString)
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (
              clientDocumentObjectSelected &&
              clientDocumentObjectSelected?.id !== doc?.data()?.clientId
            ) {
              enqueueSnackbar(
                "The quotation number you have selected does not match with the client you have selected above.",
                { variant: "error" }
              );

              dispatch(setLoading(false));
            } else {
              enqueueSnackbar("Quotation found", {
                variant: "success",
              });

              // set document data
              setDocumentDetails({
                ...documentDetails,
                docBillTo:
                  doc?.data()?.docBillTo || documentDetails?.docBillTo || "",
                docShipTo:
                  doc?.data()?.docShipTo || documentDetails?.docShipTo || "",
                docParticulars: doc?.data()?.docParticulars || [],
                docSubTotal: doc?.data()?.docSubTotal || 0,
                docTotal: doc?.data()?.docTotal || 0,
                docVatFee: doc?.data()?.docVatFee || 0,
                docTermsAndCondition:
                  doc?.data()?.docTermsAndCondition ||
                  documentDetails?.docTermsAndCondition ||
                  "",
              });

              dispatch(setLoading(false));
            }
          } else {
            enqueueSnackbar(
              "Cannot find the quotation number in the database",
              { variant: "warning" }
            );

            dispatch(setLoading(false));
          }
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while fetching document: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  return (
    <>
      <Stack direction={"row"} spacing={1} alignItems="center">
        {/*  <Typography style={{ whiteSpace: "nowrap" }}>
          {fieldType === "quotation"
            ? "Quotation number"
            : fieldType === "purchase_order"
            ? "P.O number"
            : ""}
        </Typography> */}

        <TextField
          variant="outlined"
          name="docNumber"
          label={
            fieldType === "quotation"
              ? "Quotation number"
              : fieldType === "purchase_order"
              ? "P.O number"
              : ""
          }
          id="docNumber"
          type="text"
          value={us_doc_number}
          size="small"
          fullWidth
          InputProps={{ className: classes.input }}
          onChange={(e) => {
            set_us_doc_number(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter" && fieldType === "quotation") {
              onHandleManualQuoteSubmit();
            }
          }}
        />

        <IconButton
          color="primary"
          size="medium"
          onClick={() => {
            setDialogListType(fieldType);
            set_us_open_DocumentListDialog(true);
          }}
        >
          <FindInPageIcon />
        </IconButton>
      </Stack>

      {us_open_DocumentListDialog ? (
        <Suspense fallback={<></>}>
          <QuotationOrPurchaseOrderListDialog
            open={us_open_DocumentListDialog}
            type={dialogListType}
            setType={setDialogListType}
            setOpen={set_us_open_DocumentListDialog}
            logo={logo}
            sigImage={sigImage}
            documentDetails={documentDetails}
            setDocumentDetails={setDocumentDetails}
            set_us_doc_number={set_us_doc_number}
          />
        </Suspense>
      ) : (
        ""
      )}
    </>
  );
}
