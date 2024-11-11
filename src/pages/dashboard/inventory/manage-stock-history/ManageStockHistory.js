import { DatePicker } from "@mui/lab";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Stack,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CurrencyFormat from "react-currency-format";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

export default function ManageStockHistory({ state, setState, dialogType }) {
  const temp_initStockHistoryRef = useRef();

  const [stockHistoryList, setStockHistoryList] = useState([]);

  const [totalRow, setTotalRow] = useState({
    totalQty: 0,
    totalUnitPrice: 0,
    totalPrice: 0,
  });

  const [meanRow, setMeanRow] = useState({
    meanUnitPrice: 0,
    meanPercentageConversion: 0,
    meanShippingPercentage: 0,
  });

  useEffect(() => {
    temp_initStockHistoryRef.current();
  }, []);

  function initStockHistory() {
    if (
      state?.stockHistory &&
      state?.stockHistory?.historyList &&
      state?.stockHistory?.historyList?.length > 0
    ) {
      let historyWithDateFormat = [];

      state?.stockHistory?.historyList.forEach((history) => {
        historyWithDateFormat.push({
          ...history,
          dateCreated: history?.dateCreated
            ? history?.dateCreated.toDate()
            : "",
        });
      });

      setStockHistoryList([...(historyWithDateFormat || [])]);

      setTotalRow({
        totalQty: state?.stockHistory?.totalQty || 0,
        totalUnitPrice: state?.stockHistory?.totalUnitPrice || 0,
        totalPrice: state?.stockHistory?.totalPrice || 0,
      });

      setMeanRow({
        meanUnitPrice: state?.stockHistory?.meanUnitPrice || 0,
        meanPercentageConversion:
          state?.stockHistory?.meanPercentageConversion || 0,
        meanShippingPercentage:
          state?.stockHistory?.meanShippingPercentage || 0,
      });
    }
  }

  temp_initStockHistoryRef.current = initStockHistory;

  function addRow() {
    let newHistoryList = [...(stockHistoryList || [])];
    newHistoryList.push({
      dateCreated: "",
      unitPrice: "",
      qty: "",
      shippingPercentage: "",
      percentageConversion: "",
      totalPriceWithShipping: "",
    });

    setStockHistoryList(newHistoryList);
  }

  function onHandleChange(value, name, index) {
    let newHistoryList = [...(stockHistoryList || [])];

    let rowData = { ...newHistoryList[index] };

    let unitPrice =
      name === "unitPrice"
        ? Number(value || 0)
        : Number(rowData?.unitPrice || 0);

    let qty = name === "qty" ? Number(value || 0) : Number(rowData?.qty || 0);

    /* let shippingPercentage =
      name === "shippingPercentage"
        ? Number(value || 0)
        : Number(rowData?.shippingPercentage || 0); */

    // let percentageToTake = Number(shippingPercentage) + 100;

    // let percentageConversion = percentageToTake / 100;

    let percentageConversion =
      name === "percentageConversion"
        ? Number(value || 0)
        : Number(rowData?.percentageConversion || 0);

    let totalPrice = unitPrice * qty * percentageConversion;

    newHistoryList[index] = {
      ...newHistoryList[index],
      [name]: value,
      totalPriceWithShipping: totalPrice || 0,
    };

    setStockHistoryList(newHistoryList);

    calculateTotal(newHistoryList);
  }

  function deleteRow(index) {
    let newHistoryList = [...(stockHistoryList || [])];
    newHistoryList.splice(index, 1);

    setStockHistoryList(newHistoryList);

    calculateTotal(newHistoryList);
  }

  function calculateTotal(newHistoryList) {
    let totalQtyCal = 0;
    let totalUnitPriceCal = 0;
    let totalPriceCal = 0;

    if (newHistoryList && newHistoryList?.length > 0) {
      // qty * shipping (% converted)
      let totalQtyWithShippingConverted = 0;

      newHistoryList.forEach((row) => {
        totalQtyCal = totalQtyCal + Number(row?.qty || 0);
        totalUnitPriceCal = totalUnitPriceCal + Number(row?.unitPrice || 0);
        totalPriceCal =
          totalPriceCal + Number(row?.totalPriceWithShipping || 0);

        totalQtyWithShippingConverted =
          totalQtyWithShippingConverted +
          Number(row?.qty || 0) * Number(row?.percentageConversion || 0);
      });

      let meanUnitPriceCal = totalPriceCal / totalQtyWithShippingConverted;

      let meanPercentageConversionCal =
        totalQtyWithShippingConverted / totalQtyCal;

      //  let meanShippingPercentageCal = (meanPercentageConversionCal - 1) * 100;

      setTotalRow({
        totalQty: totalQtyCal,
        totalUnitPrice: totalUnitPriceCal,
        totalPrice: totalPriceCal,
      });

      setMeanRow({
        meanUnitPrice: meanUnitPriceCal || 0,
        meanPercentageConversion: meanPercentageConversionCal || 0,
        // meanShippingPercentage: meanShippingPercentageCal || 0,
      });

      setState((prev) => {
        return {
          ...prev,
          qty: totalQtyCal,
          stockHistory: {
            historyList: newHistoryList,
            totalQty: totalQtyCal,
            totalUnitPrice: totalUnitPriceCal,
            totalPrice: totalPriceCal,
            meanUnitPrice: meanUnitPriceCal || 0,
            meanPercentageConversion: meanPercentageConversionCal || 0,
            // meanShippingPercentage: meanShippingPercentageCal || 0,
          },
        };
      });
    } else {
      setTotalRow({
        totalQty: 0,
        totalUnitPrice: 0,
        totalPrice: 0,
      });

      setMeanRow({
        meanUnitPrice: 0,
        meanPercentageConversion: 0,
        meanShippingPercentage: 0,
      });

      setState((prev) => {
        return {
          ...prev,
          qty: totalQtyCal,
          stockHistory: {
            historyList: [],
            totalQty: 0,
            totalUnitPrice: 0,
            totalPrice: 0,
            meanUnitPrice: 0,
            meanPercentageConversion: 0,
            meanShippingPercentage: 0,
          },
        };
      });
    }
  }

  return (
    <>
      <Grid item xs={12} md={12}>
        <Typography variant="subtitle1">
          Stock History - keep track of stock arrivals and calculate mean
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => addRow()}
            sx={{ width: "200px" }}
            disabled={dialogType === "view"}
          >
            Add stock row
          </Button>

          <TableContainer>
            <Table border={1}>
              <TableHead>
                <TableRow>
                  <TableCell size="small" align="center">
                    Delete
                  </TableCell>
                  <TableCell size="small" align="center">
                    Date Created
                  </TableCell>
                  <TableCell size="small" align="center">
                    Unit Price
                  </TableCell>
                  <TableCell size="small" align="center">
                    Quantity
                  </TableCell>
                  <TableCell size="small" align="center">
                    % Shipping
                  </TableCell>
                  <TableCell
                    size="small"
                    align="center"
                    sx={{ minWidth: "200px" }}
                  >
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockHistoryList &&
                  stockHistoryList?.length > 0 &&
                  stockHistoryList?.map((stockHistoryData, index) => (
                    <TableRow key={index}>
                      <TableCell size="small" align="center">
                        <IconButton
                          color="error"
                          onClick={() => deleteRow(index)}
                          disabled={dialogType === "view"}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell size="small" align="center">
                        <DatePicker
                          value={stockHistoryData?.dateCreated}
                          onChange={(newValue) => {
                            onHandleChange(newValue, "dateCreated", index);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              disabled={dialogType === "view"}
                            />
                          )}
                          inputFormat="dd/MM/yyyy"
                          disabled={dialogType === "view"}
                        />
                      </TableCell>
                      <TableCell size="small" align="center">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="unitPrice"
                          label="Unit Price"
                          type="text"
                          id="unitPrice"
                          value={stockHistoryData?.unitPrice || ""}
                          onChange={(event) => {
                            onHandleChange(
                              event.target.value,
                              "unitPrice",
                              index
                            );
                          }}
                          disabled={dialogType === "view"}
                        />
                      </TableCell>
                      <TableCell size="small" align="center">
                        <TextField
                          variant="outlined"
                          size="small"
                          fullWidth
                          name="qty"
                          label="Quantity"
                          type="text"
                          id="qty"
                          value={stockHistoryData?.qty || ""}
                          onChange={(event) => {
                            onHandleChange(event.target.value, "qty", index);
                          }}
                          disabled={dialogType === "view"}
                        />
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <Stack
                          spacing={3}
                          direction={"row"}
                          alignItems={"center"}
                        >
                          <TextField
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="percentageConversion"
                            label="% Shipping"
                            type="text"
                            id="percentageConversion"
                            value={stockHistoryData?.percentageConversion || ""}
                            onChange={(event) => {
                              onHandleChange(
                                event.target.value,
                                "percentageConversion",
                                index
                              );
                            }}
                            disabled={dialogType === "view"}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell size="small" align="right">
                        <CurrencyFormat
                          value={Number(
                            stockHistoryData?.totalPriceWithShipping || 0
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
                  <TableCell size="small" align="center" colSpan={2}>
                    <Typography variant="subtitle1">TOTAL</Typography>
                  </TableCell>
                  <TableCell size="small">
                    <Typography variant="subtitle1">
                      <CurrencyFormat
                        value={Number(totalRow?.totalUnitPrice || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell size="small">
                    <Typography variant="subtitle1">
                      {totalRow?.totalQty || 0}
                    </Typography>
                  </TableCell>

                  <TableCell />

                  <TableCell size="small" align="right">
                    <Typography variant="subtitle1">
                      <CurrencyFormat
                        value={Number(totalRow?.totalPrice || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell size="small" colSpan={2} align="center">
                    <Typography variant="subtitle1">
                      MEAN Calculation
                    </Typography>
                  </TableCell>
                  <TableCell size="small">
                    <Typography variant="subtitle1">
                      <CurrencyFormat
                        value={Number(meanRow?.meanUnitPrice || 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Typography>
                  </TableCell>
                  <TableCell size="small"></TableCell>
                  <TableCell size="small">
                    <Typography variant="subtitle1">
                      {`${Number(
                        meanRow?.meanPercentageConversion || 0
                      ).toFixed(4)} (4 d.p)`}
                      {/* ${Number(
                        meanRow?.meanShippingPercentage || 0
                      ).toFixed(4)} ---> */}
                    </Typography>
                  </TableCell>
                  <TableCell size="small"></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Stack>
      </Grid>
    </>
  );
}
