import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { Fragment, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../../features/globalSlice";
import CurrencyFormat from "react-currency-format";

export default function IncomeReportTable({
  clientList,
  reportDocType,
  us_invoicelist,
  totalSubtotalAmount,
  totalVat,
  totalInvoiceAmount,
  totalPaymentMadeAmount,
  totalAmountDue,
  uniqueDisbursementDescription,
  set_uniqueDisbursementDescription,
  set_us_col_width_income_report,
}) {
  const dispatch = useDispatch();

  const temp_getAllUniqueDisbursement_ref = useRef();

  useEffect(() => {
    temp_getAllUniqueDisbursement_ref.current();
  }, [us_invoicelist]);

  async function getAllUniqueDisbursement() {
    let uniqueDusbursement = [];

    if (us_invoicelist && us_invoicelist?.length > 0) {
      dispatch(setLoading(true));

      us_invoicelist.forEach((invoice) => {
        if (
          invoice?.data?.docDisbursementParticularsData &&
          invoice?.data?.docDisbursementParticularsData?.length > 0
        ) {
          invoice?.data?.docDisbursementParticularsData.forEach(
            (disbursement) => {
              let desc = disbursement?.description;
              uniqueDusbursement.push(desc.toLowerCase());
            }
          );
        }
      });

      let uniqueArray = [...new Set(uniqueDusbursement)];
      set_uniqueDisbursementDescription(uniqueArray);

      let counter = 16 + uniqueArray?.length;
      let result = "";
      for (let i = 0; i < counter; i++) {
        if (i !== counter - 1) {
          result = result + "20,";
        } else {
          result = result + "20";
        }
      }
      set_us_col_width_income_report(result);

      dispatch(setLoading(false));
    }
  }

  temp_getAllUniqueDisbursement_ref.current = getAllUniqueDisbursement;

  return (
    <Stack spacing={3}>
      <TableContainer>
        <Table border={1}>
          <TableHead>
            <TableRow>
              <TableCell
                size="small"
                align="center"
                colSpan={4}
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                Client Details
              </TableCell>
              <TableCell
                size="small"
                align="center"
                colSpan={5}
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                VAT
              </TableCell>
              <TableCell
                size="small"
                align="center"
                colSpan={3}
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                OTHERS
              </TableCell>
              <TableCell
                size="small"
                align="center"
                colSpan={
                  1 +
                    (uniqueDisbursementDescription &&
                      uniqueDisbursementDescription?.length) || 0
                }
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                REFUND
              </TableCell>
              <TableCell
                size="small"
                align="center"
                colSpan={4}
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                DEBTORS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                DATE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                CLIENTS
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                CLIENT VAT REG NO.
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                CLIENT BRN
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                VAT INVOICE NO.
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                SALES VALUE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                VAT AMOUNT
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                INVOICE VALUE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                TAXABLE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                ZERO RATED
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                FREIGHT (EXEMPT)
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                STD SUPPLIES TO EXEMPT BODIES
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                DISBURSEMENT AMOUNT
              </TableCell>

              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
                colSpan={
                  (uniqueDisbursementDescription &&
                    uniqueDisbursementDescription?.length) ||
                  1
                }
              >
                DISBURSEMENT DETAILS
              </TableCell>

              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                TOTAL VALUE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                DATE OF PAYMENT
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                AMOUNT PAID
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ whiteSpace: "nowrap", fontWeight: "bold" }}
              >
                AMOUNT DUE
              </TableCell>
            </TableRow>

            {uniqueDisbursementDescription &&
            uniqueDisbursementDescription?.length > 0 ? (
              <TableRow>
                <TableCell colSpan={12} />
                <TableCell />

                {uniqueDisbursementDescription &&
                  uniqueDisbursementDescription?.length > 0 &&
                  uniqueDisbursementDescription?.map((disbursement) => (
                    <TableCell
                      size="small"
                      align="center"
                      style={{
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      {disbursement}
                    </TableCell>
                  ))}

                <TableCell colSpan={4} />
              </TableRow>
            ) : (
              <></>
            )}

            {us_invoicelist &&
              us_invoicelist?.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {moment(invoice?.data?.docDate.toDate()).format(
                      "DD-MM-YYYY"
                    ) || ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {(clientList &&
                      clientList?.length > 0 &&
                      clientList.find(
                        (client) => client.id === invoice?.data?.clientId
                      )?.name) ||
                      "" ||
                      ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {(clientList &&
                      clientList?.length > 0 &&
                      clientList.find(
                        (client) => client.id === invoice?.data?.clientId
                      )?.data?.tan) ||
                      ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {(clientList &&
                      clientList?.length > 0 &&
                      clientList.find(
                        (client) => client.id === invoice?.data?.clientId
                      )?.data?.brn) ||
                      ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docString || ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotalTaxableWithoutVatParticulars || ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docVatFee ||
                      invoice?.data?.docTotalTaxableVatOnlyParticulars ||
                      ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotalTaxableParticulars || ""}
                  </TableCell>

                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotalTaxableParticulars || ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotalZeroRatedParticulars || ""}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotalExemptParticulars || ""}
                  </TableCell>

                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotalExemptBodiesParticulars || ""}
                  </TableCell>

                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotalDisbursementParticulars || ""}
                  </TableCell>

                  {uniqueDisbursementDescription &&
                    uniqueDisbursementDescription?.length > 0 &&
                    uniqueDisbursementDescription?.map((disbursement) => {
                      if (
                        invoice?.data?.docDisbursementParticularsData &&
                        invoice?.data?.docDisbursementParticularsData?.length >
                          0
                      ) {
                        let particularFound =
                          invoice?.data?.docDisbursementParticularsData.find(
                            (particular) =>
                              particular?.description.toLowerCase() ===
                              disbursement
                          );
                        if (particularFound) {
                          return (
                            <TableCell
                              size="small"
                              align="center"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {particularFound?.amount || ""}
                            </TableCell>
                          );
                        } else {
                          return <TableCell />;
                        }
                      } else {
                        return <TableCell />;
                      }
                    })}

                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.docTotal || 0}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.attachedPaymentNumber &&
                    invoice?.data?.attachedPaymentNumber?.length > 0
                      ? invoice?.data?.attachedPaymentNumber?.map(
                          (payment, index) => (
                            <Fragment key={index}>
                              {payment?.paymentDate}
                              <br />
                            </Fragment>
                          )
                        )
                      : "-"}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {invoice?.data?.attachedPaymentNumber &&
                    invoice?.data?.attachedPaymentNumber?.length > 0
                      ? invoice?.data?.attachedPaymentNumber?.map(
                          (payment, index) => (
                            <Fragment key={index}>
                              <CurrencyFormat
                                value={Number(
                                  payment?.paymentAmount || 0
                                ).toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                              <br />
                            </Fragment>
                          )
                        )
                      : "-"}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <CurrencyFormat
                      value={Number(invoice?.data?.totalAmountDue || 0).toFixed(
                        2
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

      <TableContainer>
        <Table border={1}>
          <TableBody>
            <TableRow>
              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                  width: "50px",
                  whiteSpace: "nowrap",
                }}
              >
                Total Amount (Sub-total)
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ width: "50px", whiteSpace: "nowrap" }}
              >
                <CurrencyFormat
                  value={Number(totalSubtotalAmount || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>

            {reportDocType &&
            /* reportDocType === "vat_invoice" */ reportDocType !==
              "invoice" ? (
              <TableRow>
                <TableCell
                  size="small"
                  align="center"
                  style={{
                    fontWeight: "bolder",
                    width: "50px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Total Vat
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  style={{ width: "50px", whiteSpace: "nowrap" }}
                >
                  <CurrencyFormat
                    value={Number(totalVat || 0).toFixed(2)}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                </TableCell>
              </TableRow>
            ) : (
              <></>
            )}

            <TableRow>
              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                  width: "50px",
                  whiteSpace: "nowrap",
                }}
              >
                {reportDocType &&
                (reportDocType === "invoice" || reportDocType === "vat_invoice")
                  ? "Total sales"
                  : "Total"}
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ width: "50px", whiteSpace: "nowrap" }}
              >
                <CurrencyFormat
                  value={Number(totalInvoiceAmount || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>

            {reportDocType &&
            (reportDocType === "invoice" || reportDocType === "vat_invoice") ? (
              <>
                <TableRow>
                  <TableCell
                    size="small"
                    align="center"
                    style={{
                      fontWeight: "bolder",
                      width: "50px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total payment made
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ width: "50px", whiteSpace: "nowrap" }}
                  >
                    <CurrencyFormat
                      value={Number(totalPaymentMadeAmount || 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    size="small"
                    align="center"
                    style={{
                      fontWeight: "bolder",
                      width: "50px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Total amount due
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    style={{ width: "50px", whiteSpace: "nowrap" }}
                  >
                    <CurrencyFormat
                      value={Number(totalAmountDue || 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
