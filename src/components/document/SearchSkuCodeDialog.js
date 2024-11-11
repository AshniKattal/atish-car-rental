import {
  Autocomplete,
  Button,
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
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useDispatch, useSelector } from "react-redux";
import { selectDocument } from "src/features/documentSlice";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";

const FETCH_LIMIT = 50;

export default function SearchSkuCodeDialog({
  open,
  handleCloseDialog,
  documentDetails,
  setDocumentDetails,
  selectedRowIndex,
}) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { companyDetails, documentType } = useSelector(selectDocument);

  const [list, setList] = useState([]);

  const [lastDoc, setLastDoc] = useState(null); // Keep track of the last document for pagination

  const [hasMore, setHasMore] = useState(true); // Check if there are more documents

  const temp_fetchInventoryRef = useRef();

  const [selectedSkuFilter, set_selectedSkuFilter] = useState(null);

  const [skuCodeSearch, set_skuCodeSearch] = useState("");

  useEffect(() => {
    temp_fetchInventoryRef.current();
  }, []);

  const fetchInventory = async () => {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection("inventory")
      .orderBy("model")
      .limit(FETCH_LIMIT)
      .get()
      .then((result) => {
        if (result?.docs?.length > 0) {
          const lastVisible = result?.docs[result?.docs.length - 1];
          setLastDoc(lastVisible); // Save the last document for pagination

          let itemList = [];
          result.docs.forEach((doc) => {
            if (doc?.id !== "documentIndex") {
              itemList.push({
                id: doc.id,
                data: { ...doc.data() },
                sku: doc.data()?.sku || "",
                category: JSON.stringify(doc.data()?.category || null),
                model: doc.data()?.model || "",
                size: doc.data()?.size || "",
                materials: doc.data()?.materials || "",
                color: doc.data()?.color || "",
                stockHistory: doc.data()?.stockHistory || [],
                qty: doc.data()?.qty || "",
                qtySold: doc.data()?.qtySold || "",
                qtyRemaining: doc.data()?.qtyRemaining || "",
                unitPriceWithoutShipping:
                  doc.data()?.unitPriceWithoutShipping || "",
                unitPriceWithShipping: doc.data()?.unitPriceWithShipping || "",
                totalPriceWithShipping:
                  doc.data()?.totalPriceWithShipping || "",
                unitSellingPrice: doc.data()?.unitSellingPrice || "",
                totalSellingPrice: doc.data()?.totalSellingPrice || "",
                companyName: doc.data()?.companyName || "",
                percentageProfit: doc.data()?.percentageProfit || "",
                percentageShipping: doc.data()?.percentageShipping || "",
              });
            }
          });

          setList(itemList);

          if (result?.docs?.length === FETCH_LIMIT) {
            setHasMore(true);
          }

          dispatch(setLoading(false));
        } else {
          setHasMore(false);
          setList([]);
          setLastDoc(null);

          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while fetching inventory items: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  temp_fetchInventoryRef.current = fetchInventory;

  const fetchMoreItems = async () => {
    if (!lastDoc) return; // Don't fetch if there's no last document

    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection("inventory")
      .orderBy("model")
      .startAfter(lastDoc)
      .limit(FETCH_LIMIT)
      .get()
      .then((result) => {
        if (result?.docs?.length > 0) {
          const lastVisible = result?.docs[result?.docs.length - 1];
          setLastDoc(lastVisible); // Save the last document for pagination

          let itemList = [];
          result.docs.forEach((doc) => {
            if (doc?.id !== "documentIndex") {
              itemList.push({
                id: doc.id,
                data: { ...doc.data() },
                sku: doc.data()?.sku || "",
                category: doc.data()?.category || null,
                model: doc.data()?.model || "",
                size: doc.data()?.size || "",
                materials: doc.data()?.materials || "",
                color: doc.data()?.color || "",
                stockHistory: doc.data()?.stockHistory || [],
                qty: doc.data()?.qty || "",
                qtySold: doc.data()?.qtySold || "",
                qtyRemaining: doc.data()?.qtyRemaining || "",
                unitPriceWithoutShipping:
                  doc.data()?.unitPriceWithoutShipping || "",
                unitPriceWithShipping: doc.data()?.unitPriceWithShipping || "",
                totalPriceWithShipping:
                  doc.data()?.totalPriceWithShipping || "",
                unitSellingPrice: doc.data()?.unitSellingPrice || "",
                totalSellingPrice: doc.data()?.totalSellingPrice || "",
                companyName: doc.data()?.companyName || "",
                percentageProfit: doc.data()?.percentageProfit || "",
                percentageShipping: doc.data()?.percentageShipping || "",
              });
            }
          });

          setList((prevProducts) => [...prevProducts, ...itemList]);

          if (result?.docs?.length === FETCH_LIMIT) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }

          dispatch(setLoading(false));
        } else {
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while fetching inventory items: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  async function searchSkuCode() {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection("inventory")
      .where("sku", "==", skuCodeSearch)
      .get()
      .then((result) => {
        if (result?.docs?.length > 0) {
          enqueueSnackbar(
            "The SKU code you entered is already present in the database.",
            { variant: "error" }
          );
          dispatch(setLoading(false));
        } else {
          enqueueSnackbar("SKU code is valid and is not present in database.");
          dispatch(setLoading(false));
        }
      });
  }

  function selectSkuCode(item) {
    if (selectedRowIndex !== null) {
      let newDocParticulars = [...(documentDetails?.docParticulars || [])];

      // add selected description with current description if present
      let newDesc =
        (newDocParticulars[selectedRowIndex]?.rowDescription || "") +
        (item?.sku ? `${item?.sku}, ` : "") +
        (item?.model ? `${item?.model}, ` : "") +
        (item?.color ? `${item?.color}, ` : "") +
        (item?.category?.title ? `${item?.category?.title}, ` : "") +
        (item?.size ? `${item?.size}, ` : "") +
        (item?.materials ? `${item?.materials}` : "");

      let unitpriceWithoutVAT = Number(item?.unitSellingPrice || 0);

      if (documentType?.id !== "cash_transaction") {
        // NOTE: This custom is applied to all SMART PROMOTE DOCS except CASH_TRANSACTION
        // all products are vat inclusive
        // for smart promote -> need to calculate the unitprice without vat
        unitpriceWithoutVAT = Number(item?.unitSellingPrice || 0) * 100;
        unitpriceWithoutVAT = unitpriceWithoutVAT / 115;
      }

      // update state using index
      newDocParticulars[selectedRowIndex] = {
        ...newDocParticulars[selectedRowIndex],
        rowDescription: newDesc,
        rowUnitPrice: Number(unitpriceWithoutVAT || 0),
        inventoryItemData: { ...item },
      };

      setDocumentDetails({
        ...documentDetails,
        docParticulars: newDocParticulars,
      });

      // close popup
      handleCloseDialog();
    }
  }

  return (
    <Dialog open={open} maxWidth="lg" fullWidth>
      <DialogTitle>Search SKU item</DialogTitle>
      <DialogContent>
        <Divider />
        <br />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              ListboxProps={{ style: { maxHeight: "70vh" } }}
              size="small"
              label="SKU filter"
              id="sku filter-drop-down"
              options={list || []}
              value={selectedSkuFilter}
              renderInput={(params) => (
                <TextField {...params} label={"SKU filter"} fullWidth />
              )}
              onChange={(e, value, reason) => {
                if (reason !== "removeOption" && reason !== "clear" && value) {
                  set_selectedSkuFilter(value);
                } else {
                  set_selectedSkuFilter(null);
                }
              }}
              getOptionLabel={(option) => option?.sku}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                name="skuCode"
                label="Search SKU Code"
                type="text"
                id="skuCode"
                value={skuCodeSearch || ""}
                onChange={(event) => {
                  set_skuCodeSearch(event.target.value);
                }}
              />

              <Tooltip title="Search SKU Code">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => searchSkuCode()}
                  sx={{ width: "150px" }}
                  disabled={!skuCodeSearch}
                >
                  Search
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table border={1}>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell align="center" size="small">
                      SKU Code
                    </TableCell>
                    <TableCell align="center" size="small">
                      Model
                    </TableCell>
                    <TableCell align="center" size="small">
                      Color
                    </TableCell>
                    <TableCell align="center" size="small">
                      Category
                    </TableCell>
                    <TableCell align="center" size="small">
                      Size
                    </TableCell>
                    <TableCell align="center" size="small">
                      Materials
                    </TableCell>
                    <TableCell align="center" size="small">
                      Selling Price
                    </TableCell>
                    <TableCell align="center" size="small">
                      Stock Qty
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list &&
                    list?.length > 0 &&
                    list
                      ?.filter(
                        (obj) =>
                          obj?.sku === selectedSkuFilter?.sku ||
                          !selectedSkuFilter?.sku
                      )
                      ?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" size="small">
                            <Button
                              onClick={() => selectSkuCode(item)}
                              variant="contained"
                              color="primary"
                            >
                              Select
                            </Button>
                          </TableCell>
                          <TableCell align="center" size="small">
                            {item?.sku || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {item?.model || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {item?.color || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {item?.category?.title || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {item?.size || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {item?.materials || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            <CurrencyFormat
                              value={Number(
                                item?.unitSellingPrice || 0
                              ).toFixed(2)}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </TableCell>
                          <TableCell align="center" size="small">
                            {item?.qtyRemaining || ""}
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
          variant="outlined"
          color="error"
          onClick={() => handleCloseDialog()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
