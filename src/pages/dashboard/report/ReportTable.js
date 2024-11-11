import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import moment from "moment";
import CurrencyFormat from "react-currency-format";
import Iconify from "../../../components/Iconify";
import { handleViewDownload } from "../../../components/core-functions/SelectionCoreFunctions";

function ReportTable({
  logo,
  sigImage,
  companyDetails,
  clientDocumentObjectSelected,
  documents,
  reportDocType,
  us_invoicelist,
  totalSubtotalAmount,
  totalStorage,
  totalScanning,
  totalVat,
  totalInvoiceAmount,
  totalPaymentMadeAmount,
  totalAmountDue,
  clientList,
}) {
  const [us_filter, set_us_filter] = useState("");

  return (
    <Stack spacing={3}>
      {(reportDocType === "invoice" ||
        reportDocType === "vat_invoice" ||
        reportDocType === "proforma" ||
        reportDocType === "cash_transaction") && (
        <FormControl
          fullWidth
          variant="outlined"
          size="small"
          style={{ width: "300px" }}
          disabled={!us_invoicelist || us_invoicelist?.length === 0}
        >
          <InputLabel id="paymentType-select-label">Filter</InputLabel>
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
            <MenuItem value={"Partially paid"}>Partially paid</MenuItem>
            <MenuItem value={"Over paid"}>Over paid</MenuItem>
            <MenuItem value={"Paid"}>Paid</MenuItem>
          </Select>
        </FormControl>
      )}

      <TableContainer>
        <Table border={1}>
          <TableBody>
            <TableRow>
              <TableCell
                size="small"
                align="center"
                colSpan={5}
                style={{
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                Booking
              </TableCell>

              <TableCell size="small" align="center" />
              <TableCell
                size="small"
                align="center"
                colSpan={4}
                style={{
                  color: "red",
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                PAYMENT
              </TableCell>
              <TableCell size="small" align="center" />
              <TableCell size="small" align="center" />
            </TableRow>
            <TableRow>
              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                BOOKING NUMBER
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                }}
              >
                CUSTOMER
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                DATE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                AMOUNT
              </TableCell>

              <TableCell
                size="small"
                align="center"
                style={{
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                TOTAL
              </TableCell>

              <TableCell
                size="small"
                align="center"
                style={{ width: "50px" }}
              />
              <TableCell
                size="small"
                align="center"
                style={{
                  color: "red",
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                DATE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{
                  color: "red",
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                PAYMENT NO:
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{
                  color: "red",
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                TYPE
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{
                  color: "red",
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                AMOUNT
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ width: "50px" }}
              />
              <TableCell
                size="small"
                align="center"
                style={{
                  color: "#00B0F0",
                  fontWeight: "bolder",
                  whiteSpace: "nowrap",
                }}
              >
                TOTAL AMOUNT DUE
              </TableCell>
            </TableRow>
            {us_invoicelist &&
              us_invoicelist?.length > 0 &&
              us_invoicelist
                .filter(
                  (obj) =>
                    (us_filter === "" && obj?.data?.paymentStatus !== "") ||
                    (us_filter !== "" && obj?.data?.paymentStatus === us_filter)
                )
                ?.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        spacing={2}
                      >
                        <Typography>{`${invoice?.data?.bookingId}`}</Typography>
                      </Stack>
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
                      {moment(invoice?.data?.dateCreated.toDate()).format(
                        "DD-MM-YYYY"
                      ) || ""}
                    </TableCell>
                    <TableCell
                      size="small"
                      align="center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <CurrencyFormat
                        value={Number(invoice?.data?.docSubTotal || 0).toFixed(
                          2
                        )}
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
                          invoice?.data?.bookingTotalAmount || 0
                        ).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </TableCell>

                    <TableCell
                      size="small"
                      align="center"
                      style={{ width: "50px" }}
                    />

                    <TableCell
                      size="small"
                      align="center"
                      style={{
                        color: "red",
                        whiteSpace: "nowrap",
                      }}
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
                      style={{
                        color: "red",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {invoice?.data?.attachedPaymentNumber &&
                      invoice?.data?.attachedPaymentNumber?.length > 0
                        ? invoice?.data?.attachedPaymentNumber?.map(
                            (payment, index) => (
                              <Fragment key={index}>
                                {payment?.paymentNumberString}
                                <br />
                              </Fragment>
                            )
                          )
                        : "-"}
                    </TableCell>

                    <TableCell
                      size="small"
                      align="center"
                      style={{
                        color: "red",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {invoice?.data?.attachedPaymentNumber &&
                      invoice?.data?.attachedPaymentNumber?.length > 0
                        ? invoice?.data?.attachedPaymentNumber?.map(
                            (payment, index) => (
                              <Fragment key={index}>
                                {payment?.paymentType}
                                <br />
                              </Fragment>
                            )
                          )
                        : "-"}
                    </TableCell>

                    <TableCell
                      size="small"
                      align="center"
                      style={{
                        color: "red",
                        whiteSpace: "nowrap",
                      }}
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
                      style={{ width: "50px" }}
                    />
                    <TableCell
                      size="small"
                      align="center"
                      style={{ color: "#00B0F0" }}
                    >
                      <CurrencyFormat
                        value={Number(
                          invoice?.data?.totalAmountDue || 0
                        ).toFixed(2)}
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
                Total
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
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default ReportTable;
