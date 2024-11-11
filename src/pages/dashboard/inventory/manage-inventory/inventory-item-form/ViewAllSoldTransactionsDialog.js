import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import CurrencyFormat from "react-currency-format";

export default function ViewAllSoldTransactionsDialog({
  open,
  setOpen,
  allTransactions,
}) {
  const temp_calculateTotalRef = useRef();

  const [total, setTotal] = useState({
    totalWithoutVAT: 0,
    totalWithVAT: 0,
  });

  useEffect(() => {
    temp_calculateTotalRef.current();
  }, [open, allTransactions]);

  function calculateTotal() {
    if (open && allTransactions?.length > 0) {
      let totalWithoutVATCal = 0;
      let totalWithVATCal = 0;

      allTransactions.forEach((transaction) => {
        totalWithoutVATCal =
          totalWithoutVATCal + transaction?.rowDiscountedAmount || 0;
        totalWithVATCal = totalWithVATCal + transaction?.rowAmountWithVAT || 0;
      });

      setTotal({
        totalWithoutVAT: totalWithoutVATCal,
        totalWithVAT: totalWithVATCal,
      });
    }
  }

  temp_calculateTotalRef.current = calculateTotal;

  return (
    <Dialog open={open} maxWidth={"lg"} fullWidth>
      <DialogTitle>All the sold transactions made for this item</DialogTitle>
      <DialogContent>
        <Divider />
        <br />

        <TableContainer>
          <Table border={1}>
            <TableHead>
              <TableRow>
                <TableCell size="small" align="center">
                  Document Type
                </TableCell>
                <TableCell size="small" align="center">
                  Document Number
                </TableCell>
                <TableCell size="small" align="center">
                  Date created
                </TableCell>
                <TableCell size="small" align="center">
                  Unit Price
                </TableCell>
                <TableCell size="small" align="center">
                  Qty Sold
                </TableCell>
                <TableCell size="small" align="center">
                  Amount
                </TableCell>
                <TableCell size="small" align="center">
                  Discount
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Amount (VAT excluded)
                </TableCell>
                <TableCell
                  size="small"
                  align="center"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Amount (VAT included)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTransactions &&
                allTransactions?.length > 0 &&
                allTransactions?.map((transaction) => (
                  <TableRow>
                    <TableCell size="small" align="center">
                      {transaction?.profomaConverted
                        ? `Proforma ${transaction?.previousProformaNumber} -> ${transaction?.docTitle}`
                        : transaction?.docTitle || ""}
                    </TableCell>
                    <TableCell size="small" align="center">
                      {transaction?.docString || ""}
                    </TableCell>
                    <TableCell size="small" align="center">
                      {transaction?.docDate
                        ? moment(transaction?.docDate?.toDate()).format(
                            "DD-MM-YYYY HH:mm:ss"
                          )
                        : ""}
                    </TableCell>
                    <TableCell size="small" align="center">
                      <CurrencyFormat
                        value={Number(transaction?.rowUnitPrice || 0).toFixed(
                          2
                        )}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </TableCell>
                    <TableCell size="small" align="center">
                      {transaction?.itemQtySold || ""}
                    </TableCell>
                    <TableCell size="small" align="center">
                      <CurrencyFormat
                        value={Number(transaction?.rowAmount || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </TableCell>
                    <TableCell size="small" align="center">
                      <CurrencyFormat
                        value={Number(
                          transaction?.rowDiscountAmount || 0
                        ).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </TableCell>
                    <TableCell size="small" align="center">
                      <CurrencyFormat
                        value={Number(
                          transaction?.rowDiscountedAmount || 0
                        ).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </TableCell>
                    <TableCell size="small" align="center">
                      <CurrencyFormat
                        value={Number(
                          transaction?.rowAmountWithVAT || 0
                        ).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} align="right">
                  <Typography variant="h6">TOTAL</Typography>
                </TableCell>
                <TableCell size="small" align="center">
                  <Typography variant="h6">
                    <CurrencyFormat
                      value={Number(total?.totalWithoutVAT || 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </Typography>
                </TableCell>
                <TableCell size="small" align="center">
                  <Typography variant="h6">
                    <CurrencyFormat
                      value={Number(total?.totalWithVAT || 0).toFixed(2)}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setOpen(false);
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
