import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Suspense, lazy, useState } from "react";

const InvViewDetails = lazy(() =>
  import("../invoice-view-details/InvViewDetails")
);

export default function DocumentSummaryTotal({
  documentType,
  documentDetails,
  action,
  companyMRATemplateFlag,
  documentMRATemplateApplied,
  companyId,
  setDocumentDetails,
  documentTemplate,
  displayDiscountColumns,
  calculateTotal,
}) {
  const {
    // downPayment,
    // downPaymentInvoiceNumber,
    discountTotalAmount,
    discountedTotalAmount,
    docSubTotal,
    docVatFee,
    docTotal,
    docSalesTransaction,
    invScanningFee,
    invGatePassFee,
    invStorageFee,
    invApplyVat,
    transportFees,
  } = documentDetails;

  const [openInvoiceSearchDialog, set_openInvoiceSearchDialog] =
    useState(false);

  const chooseDocument = (doc) => {
    if (doc && doc?.data) {
      setDocumentDetails({
        ...documentDetails,
        downPayment: doc?.data?.docTotal,
        downPaymentInvoiceNumber: doc?.data?.docString,
      });

      set_openInvoiceSearchDialog(false);
    }
  };

  function handleAdditionalFeesChange(value, fee) {
    if (Number(value) >= 0) {
      setDocumentDetails({ ...documentDetails, [fee]: value });
    }
  }

  function onHandleTransportFeeChange(invApplyVatValue, value) {
    if (Number(value) >= 0) {
      if (invApplyVatValue) {
        let vatFee = 0;
        vatFee = 0.15 * Number(value);

        setDocumentDetails((previous) => {
          return {
            ...previous,
            docVatFee: vatFee,
          };
        });
      }
    } else {
      setDocumentDetails((previous) => {
        return {
          ...previous,
          docVatFee: 0,
        };
      });
    }
  }

  function onHandleApplyVATChange(invApplyVatValue, value) {
    if (Number(value) >= 0) {
      if (invApplyVatValue) {
        let vatFee = 0;
        let subTotalAmt = Number(docSubTotal || 0);
        vatFee = 0.15 * subTotalAmt;

        setDocumentDetails((previous) => {
          return {
            ...previous,
            docVatFee: vatFee,
          };
        });
      }
    } else {
      setDocumentDetails((previous) => {
        return {
          ...previous,
          docVatFee: 0,
        };
      });
    }
  }

  function customSmartPromoteDiscount(value) {
    if (Number(value) <= 0) {
      let newDocParticulars = [];

      documentDetails?.docParticulars.forEach((row) => {
        let rowDiscountAmount = 0;
        let rowDiscountedAmount = Number(row?.rowAmount) - rowDiscountAmount;
        newDocParticulars.push({
          ...row,
          rowDiscountAmount: rowDiscountAmount,
          rowDiscountedAmount: rowDiscountedAmount,
        });
      });

      setDocumentDetails((previousState) => {
        return {
          ...previousState,
          discountTotalAmount: 0,
          docParticulars: newDocParticulars,
        };
      });

      calculateTotal();
    } else {
      let originalTotal = 0;
      documentDetails?.docParticulars.forEach((row) => {
        originalTotal = originalTotal + Number(row?.rowAmount || 0);
      });
      originalTotal = originalTotal * 1.15;

      let percentageDiscount = Number(value) / originalTotal;

      let newDocParticulars = [];

      documentDetails?.docParticulars.forEach((row) => {
        let rowDiscountAmount = percentageDiscount * Number(row?.rowAmount);
        rowDiscountAmount = Number(rowDiscountAmount).toFixed(2);
        let rowDiscountedAmount =
          Number(row?.rowAmount) - Number(rowDiscountAmount);

        newDocParticulars.push({
          ...row,
          rowDiscountAmount: Number(rowDiscountAmount),
          rowDiscountedAmount: rowDiscountedAmount,
        });
      });

      setDocumentDetails((previousState) => {
        return {
          ...previousState,
          discountTotalAmount: value,
          docParticulars: newDocParticulars,
        };
      });

      calculateTotal();
    }
  }

  return (
    <>
      <Grid
        item
        xs={12}
        md={12}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Grid container justifyContent={"flex-end"}>
          <Grid item xs={12} md={5}>
            <Card>
              <Stack sx={{ padding: "20px", width: "100%" }}>
                <TableContainer>
                  <Typography>Total Summary</Typography>
                  <Table>
                    <TableBody>
                      {documentType?.id === "vat_invoice" &&
                      companyMRATemplateFlag ? (
                        <TableRow>
                          <TableCell size="small" colSpan={2}>
                            <Autocomplete
                              ListboxProps={{ style: { maxHeight: "70vh" } }}
                              size="small"
                              label="Choose Sales Transaction"
                              id="sales-transaction-drop-down"
                              options={
                                process.env
                                  .REACT_APP_EBS_SALES_TRANSACTION_VALUES
                                  ? JSON.parse(
                                      process.env
                                        .REACT_APP_EBS_SALES_TRANSACTION_VALUES
                                    )
                                  : []
                              }
                              value={docSalesTransaction || null}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Choose Sales Transaction"
                                  multiline
                                  minRows={1}
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
                                    docSalesTransaction: value,
                                  });
                                } else if (
                                  reason === "removeOption" ||
                                  reason === "clear"
                                ) {
                                  setDocumentDetails({
                                    ...documentDetails,
                                    docSalesTransaction: null,
                                  });
                                }
                              }}
                              getOptionLabel={(option) => option?.title || ""}
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      ) : (
                        <></>
                      )}

                      {documentTemplate === "transport" ? (
                        <>
                          <TableRow>
                            <TableCell
                              size="small"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <Typography>Transport fee</Typography>
                            </TableCell>
                            <TableCell size="small">
                              <Typography>
                                {(transportFees &&
                                  Number(transportFees) > 0 &&
                                  Number(transportFees).toFixed(2)) ||
                                  0}
                              </Typography>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell
                              size="small"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <Typography>
                                {companyId &&
                                companyId ===
                                  process.env.REACT_APP_CUSTOM_SOREFAN_ID
                                  ? "Storage Fee"
                                  : "Gate Pass / Storage Fee"}
                              </Typography>
                            </TableCell>
                            <TableCell size="small">
                              <TextField
                                variant="outlined"
                                name="invStorageFee"
                                id="invStorageFee"
                                type="text"
                                value={invStorageFee || ""}
                                size="small"
                                onChange={(event) =>
                                  handleAdditionalFeesChange(
                                    event.target.value,
                                    "invStorageFee"
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                          </TableRow>

                          {companyId &&
                          companyId ===
                            process.env.REACT_APP_CUSTOM_SOREFAN_ID ? (
                            <TableRow>
                              <TableCell
                                size="small"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                <Typography>Gate Pass Fee</Typography>
                              </TableCell>
                              <TableCell size="small">
                                <TextField
                                  variant="outlined"
                                  name="invGatePassFee"
                                  id="invGatePassFee"
                                  type="text"
                                  value={invGatePassFee || ""}
                                  size="small"
                                  onChange={(event) =>
                                    handleAdditionalFeesChange(
                                      event.target.value,
                                      "invGatePassFee"
                                    )
                                  }
                                  fullWidth
                                />
                              </TableCell>
                            </TableRow>
                          ) : (
                            <></>
                          )}

                          <TableRow>
                            <TableCell
                              size="small"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <Typography>Scanning Fee</Typography>
                            </TableCell>
                            <TableCell size="small">
                              <TextField
                                variant="outlined"
                                name="invScanningFee"
                                id="invScanningFee"
                                type="text"
                                value={invScanningFee || ""}
                                size="small"
                                onChange={(event) =>
                                  handleAdditionalFeesChange(
                                    event.target.value,
                                    "invScanningFee"
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <></>
                      )}

                      {(documentTemplate && documentTemplate !== "transport") ||
                      (process.env
                        .REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE &&
                        companyId &&
                        process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE.includes(
                          companyId
                        )) ? (
                        <TableRow>
                          <TableCell size="small">
                            <Typography>Sub total</Typography>
                          </TableCell>
                          <TableCell size="small" align="right">
                            {(docSubTotal &&
                              Number(docSubTotal) > 0 &&
                              Number(docSubTotal).toFixed(2)) ||
                              0}
                          </TableCell>
                        </TableRow>
                      ) : (
                        <></>
                      )}

                      {companyMRATemplateFlag && displayDiscountColumns ? (
                        <>
                          <TableRow>
                            <TableCell size="small">
                              <Typography>Total discount</Typography>
                            </TableCell>
                            <TableCell size="small" align="right">
                              {(discountTotalAmount &&
                                Number(discountTotalAmount) > 0 &&
                                Number(discountTotalAmount).toFixed(2)) ||
                                0}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell size="small">
                              <Typography>Discounted amount</Typography>
                            </TableCell>
                            <TableCell size="small" align="right">
                              {(discountedTotalAmount &&
                                Number(discountedTotalAmount) > 0 &&
                                Number(discountedTotalAmount).toFixed(2)) ||
                                0}
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <></>
                      )}

                      {documentTemplate && documentTemplate === "transport" ? (
                        <TableRow>
                          <TableCell
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Stack direction="row" alignItems={"center"}>
                              <Checkbox
                                checked={invApplyVat}
                                onChange={(e) => {
                                  let value = e.target.checked;

                                  if (value) {
                                    setDocumentDetails((previous) => {
                                      return {
                                        ...previous,
                                        invApplyVat: e.target.checked,
                                      };
                                    });

                                    onHandleTransportFeeChange(
                                      e.target.checked,
                                      transportFees
                                    );
                                  } else {
                                    setDocumentDetails((previous) => {
                                      return {
                                        ...previous,
                                        invApplyVat: e.target.checked,
                                        docVatFee: value ? docVatFee : 0,
                                      };
                                    });
                                  }
                                }}
                              />
                              <Typography>15% VAT on Transport Fee</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell size="small">
                            <TextField
                              variant="outlined"
                              name="docVatFee"
                              id="docVatFee"
                              type="text"
                              value={
                                docVatFee ? Number(docVatFee).toFixed(2) : ""
                              }
                              size="small"
                              fullWidth
                              disabled
                            />
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {documentType?.id &&
                          documentType?.id === "vat_invoice" ? (
                            <TableRow>
                              <TableCell size="small">
                                <Typography>Total VAT</Typography>
                              </TableCell>
                              <TableCell size="small" align="right">
                                {docVatFee ? Number(docVatFee).toFixed(2) : 0}
                              </TableCell>
                            </TableRow>
                          ) : documentType?.id &&
                            documentType?.id !== "invoice" ? (
                            <TableRow>
                              <TableCell
                                size="small"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                <Stack direction="row" alignItems={"center"}>
                                  <Checkbox
                                    checked={invApplyVat}
                                    onChange={(e) => {
                                      let value = e.target.checked;

                                      if (value) {
                                        setDocumentDetails((previous) => {
                                          return {
                                            ...previous,
                                            invApplyVat: e.target.checked,
                                          };
                                        });

                                        onHandleApplyVATChange(
                                          e.target.checked
                                        );
                                      } else {
                                        setDocumentDetails((previous) => {
                                          return {
                                            ...previous,
                                            invApplyVat: e.target.checked,
                                            docVatFee: value ? docVatFee : 0,
                                          };
                                        });
                                      }
                                    }}
                                  />

                                  <Typography>15% VAT</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell size="small" align="right">
                                {docVatFee ? Number(docVatFee).toFixed(2) : 0}
                              </TableCell>
                            </TableRow>
                          ) : (
                            <></>
                          )}
                        </>
                      )}

                      <TableRow>
                        <TableCell size="small">
                          <Typography>Total</Typography>
                        </TableCell>
                        <TableCell size="small" align="right">
                          {(docTotal &&
                            Number(docTotal) > 0 &&
                            Number(docTotal).toFixed(2)) ||
                            0}
                        </TableCell>
                      </TableRow>

                      {documentTemplate === "smart_promote" ? (
                        <TableRow>
                          <TableCell
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Typography>Discount applied</Typography>
                          </TableCell>
                          <TableCell size="small" align="right">
                            <TextField
                              variant="outlined"
                              name="discountTotalAmount"
                              id="discountTotalAmount"
                              type="text"
                              value={
                                discountTotalAmount
                                  ? Number(discountTotalAmount)
                                  : ""
                              }
                              size="small"
                              fullWidth
                              onChange={(event) =>
                                customSmartPromoteDiscount(event.target.value)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ) : (
                        <></>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {openInvoiceSearchDialog ? (
        <>
          <Dialog
            maxWidth="xl"
            fullWidth
            open={openInvoiceSearchDialog}
            onClose={() => set_openInvoiceSearchDialog(false)}
          >
            <DialogTitle>Search invoice/vat invoice number</DialogTitle>

            <br />
            <DialogContent>
              <Suspense fallback={<></>}>
                <InvViewDetails
                  viewOnly={true}
                  searchAndChoose={true}
                  chooseDocument={chooseDocument}
                />
              </Suspense>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => set_openInvoiceSearchDialog(false)}
              >
                close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
