import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
} from "@mui/material";
import { useEffect, useRef } from "react";
import CurrencyFormat from "react-currency-format";

export default function SummaryIncomeReportTable({
  us_invoicelist,
  totalObject,
  set_totalObject,
}) {
  const temp_calculateTotal_ref = useRef();

  const {
    incomeSummaryTotalTaxableSubtotal,
    incomeSummaryTotalTaxableVat,
    incomeSummaryTotalTaxable,
    incomeSummaryTotalZeroRated,
    incomeSummaryTotalExempt,
    incomeSummaryTotalDisbursement,
    incomeSummaryTotalExemptBodies,

    // table footer
    incomeSummaryTotalSubtotal,
    incomeSummaryTotalVat,
    incomeSummaryTotalOverallAmount,
  } = totalObject;

  useEffect(() => {
    temp_calculateTotal_ref.current();
  }, [us_invoicelist]);

  function calculateTotal() {
    if (us_invoicelist && us_invoicelist?.length > 0) {
      let totalTaxableSubtotalCal = 0;
      let totalTaxableVatCal = 0;
      let totalTaxableCal = 0;
      let totalZeroRatedCal = 0;
      let totalExemptCal = 0;
      let totalDisbursementCal = 0;
      let totalExemptBodiesCal = 0;

      // table footer
      let totalSubtotalCal = 0;
      let totalVatCal = 0;
      let totalOverallAmountCal = 0;

      us_invoicelist.forEach((invoice) => {
        invoice?.data?.docParticulars.forEach((particular) => {
          if (particular?.rowTaxCode?.id === "TC01") {
            totalTaxableSubtotalCal =
              totalTaxableSubtotalCal + Number(particular?.rowAmount || 0);
            totalTaxableVatCal =
              totalTaxableVatCal + Number(particular?.rowVatAmount || 0);
            totalTaxableCal =
              totalTaxableCal + (particular?.rowTotalAmount || 0);
          }
        });

        totalZeroRatedCal =
          totalZeroRatedCal +
          Number(invoice?.data?.docTotalZeroRatedParticulars || 0);
        totalExemptCal =
          totalExemptCal +
          Number(invoice?.data?.docTotalExemptParticulars || 0);
        totalDisbursementCal =
          totalDisbursementCal +
          Number(invoice?.data?.docTotalDisbursementParticulars || 0);
        totalExemptBodiesCal =
          totalExemptBodiesCal +
          Number(invoice?.data?.docTotalExemptBodiesParticulars || 0);
      });

      totalSubtotalCal =
        totalSubtotalCal +
        totalTaxableSubtotalCal +
        totalZeroRatedCal +
        totalExemptCal +
        totalDisbursementCal +
        totalExemptBodiesCal;

      totalVatCal = totalTaxableVatCal;

      totalOverallAmountCal = totalSubtotalCal + totalVatCal;

      set_totalObject({
        incomeSummaryTotalTaxableSubtotal: totalTaxableSubtotalCal,
        incomeSummaryTotalTaxableVat: totalTaxableVatCal,
        incomeSummaryTotalTaxable: totalTaxableCal,
        incomeSummaryTotalZeroRated: totalZeroRatedCal,
        incomeSummaryTotalExempt: totalExemptCal,
        incomeSummaryTotalDisbursement: totalDisbursementCal,
        incomeSummaryTotalExemptBodies: totalExemptBodiesCal,

        // table footer
        incomeSummaryTotalSubtotal: totalSubtotalCal,
        incomeSummaryTotalVat: totalVatCal,
        incomeSummaryTotalOverallAmount: totalOverallAmountCal,
      });
    }
  }

  temp_calculateTotal_ref.current = calculateTotal;
  return (
    <>
      <TableContainer>
        <Table border={1}>
          <TableHead>
            <TableRow>
              <TableCell size="small" align="center">
                SALES-LOCAL
              </TableCell>
              <TableCell size="small" align="center">
                AMOUNT
              </TableCell>
              <TableCell size="small" align="center">
                VAT
              </TableCell>
              <TableCell size="small" align="center">
                TOTAL
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell size="small" align="center">
                TAXABLE
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalTaxableSubtotal || 0).toFixed(
                    2
                  )}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalTaxableVat || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalTaxable || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="small" align="center">
                ZERO-RATED
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalZeroRated || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell size="small" align="center">
                -
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalZeroRated || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="small" align="center">
                EXEMPT
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalExempt || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell size="small" align="center">
                -
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalExempt || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="small" align="center">
                DISBURSEMENT
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalDisbursement || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell size="small" align="center">
                -
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalDisbursement || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="small" align="center">
                TAXABLE SUPPLIES ON EXEMPT BODIES
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalExemptBodies || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell size="small" align="center">
                -
              </TableCell>
              <TableCell size="small" align="center">
                <CurrencyFormat
                  value={Number(incomeSummaryTotalExemptBodies || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell size="small" align="center"></TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ fontWeight: "bold", fontSize: "1em" }}
              >
                <CurrencyFormat
                  value={Number(incomeSummaryTotalSubtotal || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ fontWeight: "bold", fontSize: "1em" }}
              >
                <CurrencyFormat
                  value={Number(incomeSummaryTotalVat || 0).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
              <TableCell
                size="small"
                align="center"
                style={{ fontWeight: "bold", fontSize: "1em" }}
              >
                <CurrencyFormat
                  value={Number(incomeSummaryTotalOverallAmount || 0).toFixed(
                    2
                  )}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
