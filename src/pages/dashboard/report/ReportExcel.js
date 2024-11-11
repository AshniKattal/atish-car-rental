import React, { Fragment } from "react";
import moment from "moment";
import CurrencyFormat from "react-currency-format";

function ReportExcel({ companyName, us_invoicelist, us_total }) {
  const {
    totalSubtotalAmount,
    totalInvoiceAmount,
    totalPaymentMadeAmount,
    totalAmountDue,
  } = us_total;

  return (
    <>
      <thead>
        <tr>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={12}
            data-f-bold={true}
            data-a-h="center"
          >
            {companyName || ""}
          </th>
        </tr>
        <tr>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={5}
            data-f-bold={true}
            data-a-h="center"
          >
            Vehicle Booking
          </th>

          <th data-b-a-s="thin" data-b-a-c="00000000"></th>
          <th
            data-b-a-s="thin"
            data-b-a-c="00000000"
            colSpan={4}
            data-f-bold={true}
            data-f-color="FFFF0000"
            data-a-h="center"
          >
            PAYMENT
          </th>
          <th data-b-a-s="thin" data-b-a-c="00000000"></th>
          <th data-b-a-s="thin" data-b-a-c="00000000"></th>
        </tr>
      </thead>
      {/** ------------------------------------------------------------ */}
      <tbody>
        <tr>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            BOOKING NUMBER
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            CUSTOMER
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            DATE
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            AMOUNT
          </td>

          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
          >
            TOTAL
          </td>

          <td data-b-a-s="thin" data-b-a-c="00000000"></td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-f-color="FFFF0000"
            data-a-h="center"
          >
            DATE
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-f-color="FFFF0000"
            data-a-h="center"
          >
            PAYMENT NO:
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-f-color="FFFF0000"
            data-a-h="center"
          >
            TYPE
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-f-color="FFFF0000"
            data-a-h="center"
          >
            AMOUNT
          </td>
          <td data-b-a-s="thin" data-b-a-c="00000000"></td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-f-color="FF00B0F0"
            data-a-h="center"
          >
            TOTAL AMOUNT DUE
          </td>
        </tr>
        {/** ------------------------------------------------------------ */}
        {us_invoicelist?.map((invoice, index) => (
          <tr key={index}>
            <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
              {invoice?.data?.bookingId || ""}
            </td>
            <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
              {invoice?.data?.clientName || ""}
            </td>
            <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
              {moment(invoice?.data?.dateCreated.toDate()).format(
                "DD-MM-YYYY"
              ) || ""}
            </td>
            <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
              <CurrencyFormat
                value={Number(invoice?.data?.docSubTotal || 0).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
              />
            </td>

            <td data-b-a-s="thin" data-b-a-c="00000000" data-a-h="center">
              <CurrencyFormat
                value={Number(invoice?.data?.bookingTotalAmount || 0).toFixed(
                  2
                )}
                displayType={"text"}
                thousandSeparator={true}
              />
            </td>

            <td data-b-a-s="thin" data-b-a-c="00000000"></td>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-color="FFFF0000"
              data-a-h="center"
            >
              {invoice?.data?.attachedPaymentNumber &&
              invoice?.data?.attachedPaymentNumber?.length > 0
                ? invoice?.data?.attachedPaymentNumber?.map(
                    (payment, index) => (
                      <Fragment key={index}>
                        {payment?.paymentDate || ""}
                        <br />
                      </Fragment>
                    )
                  )
                : "-"}
            </td>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-color="FFFF0000"
              data-a-h="center"
              data-a-wrap={false}
            >
              {invoice?.data?.attachedPaymentNumber &&
              invoice?.data?.attachedPaymentNumber?.length > 0
                ? invoice?.data?.attachedPaymentNumber?.map(
                    (payment, index) => (
                      <Fragment key={index}>
                        {`${payment?.paymentNumberString || ""}`}
                        <br />
                      </Fragment>
                    )
                  )
                : "-"}
            </td>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-color="FFFF0000"
              data-a-h="center"
              data-a-wrap={false}
            >
              {invoice?.data?.attachedPaymentNumber &&
              invoice?.data?.attachedPaymentNumber?.length > 0
                ? invoice?.data?.attachedPaymentNumber?.map(
                    (payment, index) => (
                      <Fragment key={index}>
                        {payment?.paymentType || ""}
                        <br />
                      </Fragment>
                    )
                  )
                : "-"}
            </td>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-color="FFFF0000"
              data-a-h="center"
              data-a-wrap={false}
            >
              {invoice?.data?.attachedPaymentNumber &&
              invoice?.data?.attachedPaymentNumber?.length > 0
                ? invoice?.data?.attachedPaymentNumber?.map(
                    (payment, index) => (
                      <Fragment key={index}>
                        <CurrencyFormat
                          value={Number(payment?.paymentAmount || 0).toFixed(2)}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                        <br />
                      </Fragment>
                    )
                  )
                : "-"}
            </td>
            <td data-b-a-s="thin" data-b-a-c="00000000"></td>
            <td
              data-b-a-s="thin"
              data-b-a-c="00000000"
              data-f-color="FF00B0F0"
              data-a-h="center"
            >
              <CurrencyFormat
                value={Number(invoice?.data?.totalAmountDue || 0).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
              />
            </td>
          </tr>
        ))}

        <tr>
          <td colSpan={12} />
        </tr>

        <tr>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={6}
          >
            Total Amount (Sub-total)
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={5}
          >
            <CurrencyFormat
              value={Number(totalSubtotalAmount || 0).toFixed(2)}
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
            colSpan={6}
          >
            Total
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={5}
          >
            <CurrencyFormat
              value={Number(totalInvoiceAmount || 0).toFixed(2)}
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
            colSpan={6}
          >
            Total payment made
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={5}
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
            colSpan={6}
          >
            Total amount due
          </td>
          <td
            data-b-a-s="thin"
            data-b-a-c="00000000"
            data-f-bold={true}
            data-a-h="center"
            colSpan={5}
          >
            <CurrencyFormat
              value={Number(totalAmountDue || 0).toFixed(2)}
              displayType={"text"}
              thousandSeparator={true}
            />
          </td>
        </tr>
      </tbody>
    </>
  );
}

export default ReportExcel;
