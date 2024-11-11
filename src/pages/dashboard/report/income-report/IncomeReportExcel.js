import React, { Fragment } from "react";
import moment from "moment";
import CurrencyFormat from "react-currency-format";

function IncomeReportExcel({
  clientList,
  reportDocType,
  us_invoicelist,
  totalSubtotalAmount,
  totalVat,
  totalInvoiceAmount,
  totalPaymentMadeAmount,
  totalAmountDue,
  uniqueDisbursementDescription,
}) {
  return (
    <>
      <thead>
        <tr>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={4}
            data-f-bold={true}
            data-a-h="center"
          >
            Client Details
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={5}
            data-f-bold={true}
            data-a-h="center"
          >
            VAT
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={3}
            data-f-bold={true}
            data-a-h="center"
          >
            OTHERS
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={
              1 +
                (uniqueDisbursementDescription &&
                  uniqueDisbursementDescription?.length) || 0
            }
            data-f-bold={true}
            data-a-h="center"
          >
            REFUND
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={4}
            data-f-bold={true}
            data-a-h="center"
          >
            DEBTORS
          </th>
        </tr>

        <tr>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            DATE
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            CLIENTS
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            CLIENT VAT REG NO.
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            CLIENT BRN
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            VAT INVOICE NO.
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            SALES VALUE
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            VAT AMOUNT
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            INVOICE VALUE
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            TAXABLE
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            ZERO RATED
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            FREIGHT (EXEMPT)
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            STD SUPPLIES TO EXEMPT BODIES
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            DISBURSEMENT AMOUNT
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={
              (uniqueDisbursementDescription &&
                uniqueDisbursementDescription?.length) ||
              1
            }
          >
            DISBURSEMENT DETAILS
          </th>

          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            TOTAL VALUE
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            DATE OF PAYMENT
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            AMOUNT PAID
          </th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            AMOUNT DUE
          </th>
        </tr>
      </thead>
      {/** ------------------------------------------------------------ */}
      <tbody>
        {uniqueDisbursementDescription &&
        uniqueDisbursementDescription?.length > 0 ? (
          <tr>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
              colSpan={12}
            />
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
            />

            {uniqueDisbursementDescription &&
              uniqueDisbursementDescription?.length > 0 &&
              uniqueDisbursementDescription?.map((disbursement) => (
                <td
                  data-b-a-s="thin"
                  data-b-a-c="00000000"
                  data-f-bold={true}
                  data-a-h="center"
                >
                  {(disbursement && disbursement.toUpperCase()) || ""}
                </td>
              ))}
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
              colSpan={4}
            />
          </tr>
        ) : (
          <></>
        )}

        {us_invoicelist &&
          us_invoicelist?.map((invoice, index) => (
            <tr key={index}>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {moment(invoice?.data?.docDate.toDate()).format("DD-MM-YYYY") ||
                  ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {(clientList &&
                  clientList?.length > 0 &&
                  clientList.find(
                    (client) => client.id === invoice?.data?.clientId
                  )?.name) ||
                  "" ||
                  ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {(clientList &&
                  clientList?.length > 0 &&
                  clientList.find(
                    (client) => client.id === invoice?.data?.clientId
                  )?.data?.tan) ||
                  ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {(clientList &&
                  clientList?.length > 0 &&
                  clientList.find(
                    (client) => client.id === invoice?.data?.clientId
                  )?.data?.brn) ||
                  ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docString || ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {Number(
                  invoice?.data?.docTotalTaxableWithoutVatParticulars || 0
                )}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docVatFee ||
                  invoice?.data?.docTotalTaxableVatOnlyParticulars ||
                  ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docTotalTaxableParticulars || ""}
              </td>

              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docTotalTaxableParticulars || ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docTotalZeroRatedParticulars || ""}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docTotalExemptParticulars || ""}
              </td>

              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docTotalExemptBodiesParticulars || ""}
              </td>

              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docTotalDisbursementParticulars || ""}
              </td>

              {uniqueDisbursementDescription &&
                uniqueDisbursementDescription?.length > 0 &&
                uniqueDisbursementDescription?.map((disbursement) => {
                  if (
                    invoice?.data?.docDisbursementParticularsData &&
                    invoice?.data?.docDisbursementParticularsData?.length > 0
                  ) {
                    let particularFound =
                      invoice?.data?.docDisbursementParticularsData.find(
                        (particular) =>
                          particular?.description.toLowerCase() === disbursement
                      );
                    if (particularFound) {
                      return (
                        <td
                          data-b-a-s="thin"
                          data-b-a-c="00000000"
                          data-a-h="center"
                        >
                          {particularFound?.amount || ""}
                        </td>
                      );
                    } else {
                      return <td />;
                    }
                  } else {
                    return <td />;
                  }
                })}

              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.docTotal || 0}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
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
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                {invoice?.data?.attachedPaymentNumber &&
                invoice?.data?.attachedPaymentNumber?.length > 0
                  ? invoice?.data?.attachedPaymentNumber?.map(
                      (payment, index) => (
                        <Fragment key={index}>
                          <CurrencyFormat
                            value={Number(payment?.paymentAmount || 0).toFixed(
                              2
                            )}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                          <br />
                        </Fragment>
                      )
                    )
                  : "-"}
              </td>
              <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
                <CurrencyFormat
                  value={Number(invoice?.data?.totalAmountDue || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </td>
            </tr>
          ))}
        <tr>
          <td
            colSpan={
              reportDocType && reportDocType === "vat_invoice"
                ? 13
                : reportDocType && reportDocType === "invoice"
                ? 12
                : 6
            }
          />
        </tr>
        <tr>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={
              reportDocType && reportDocType === "vat_invoice"
                ? 7
                : reportDocType && reportDocType === "invoice"
                ? 6
                : 3
            }
          >
            Total Amount (Sub-total)
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={
              reportDocType && reportDocType === "vat_invoice"
                ? 6
                : reportDocType && reportDocType === "invoice"
                ? 5
                : 3
            }
          >
            <CurrencyFormat
              value={Number(totalSubtotalAmount || 0).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
            />
          </td>
        </tr>

        {reportDocType && reportDocType !== "invoice" ? (
          <tr>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
              colSpan={
                reportDocType && reportDocType === "vat_invoice"
                  ? 7
                  : reportDocType && reportDocType === "invoice"
                  ? 6
                  : 3
              }
            >
              Total Vat
            </td>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-bold={true}
              data-a-h="center"
              colSpan={
                reportDocType && reportDocType === "vat_invoice"
                  ? 6
                  : reportDocType && reportDocType === "invoice"
                  ? 5
                  : 3
              }
            >
              <CurrencyFormat
                value={Number(totalVat || 0).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
              />
            </td>
          </tr>
        ) : (
          <></>
        )}

        <tr>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={
              reportDocType && reportDocType === "vat_invoice"
                ? 7
                : reportDocType && reportDocType === "invoice"
                ? 6
                : 3
            }
          >
            {reportDocType &&
            (reportDocType === "invoice" || reportDocType === "vat_invoice")
              ? "Total sales"
              : "Total"}
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={
              reportDocType && reportDocType === "vat_invoice"
                ? 6
                : reportDocType && reportDocType === "invoice"
                ? 5
                : 3
            }
          >
            <CurrencyFormat
              value={Number(totalInvoiceAmount || 0).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
            />
          </td>
        </tr>

        {reportDocType &&
        (reportDocType === "vat_invoice" || reportDocType === "invoice") ? (
          <>
            <tr>
              <td
                data-b-a-s="thin"
                data-b-a-c="00000000"
                data-f-bold={true}
                data-a-h="center"
                colSpan={
                  reportDocType && reportDocType === "vat_invoice" ? 7 : 6
                }
              >
                Total payment made
              </td>
              <td
                data-b-a-s="thin"
                data-b-a-c="00000000"
                data-f-bold={true}
                data-a-h="center"
                colSpan={
                  reportDocType && reportDocType === "vat_invoice" ? 6 : 5
                }
              >
                <CurrencyFormat
                  value={Number(totalPaymentMadeAmount || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </td>
            </tr>
            <tr>
              <td
                data-b-a-s="thin"
                data-b-a-c="00000000"
                data-f-bold={true}
                data-a-h="center"
                colSpan={
                  reportDocType && reportDocType === "vat_invoice" ? 7 : 6
                }
              >
                Total amount due
              </td>
              <td
                data-b-a-s="thin"
                data-b-a-c="00000000"
                data-f-bold={true}
                data-a-h="center"
                colSpan={
                  reportDocType && reportDocType === "vat_invoice" ? 6 : 5
                }
              >
                <CurrencyFormat
                  value={Number(totalAmountDue || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </td>
            </tr>
          </>
        ) : (
          <></>
        )}
      </tbody>
    </>
  );
}

export default IncomeReportExcel;
