import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Divider,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { setLoading } from "../../../../features/globalSlice";
import { useSnackbar } from "notistack";
import ItemForm from "./inventory-item-form/ItemForm";
import db from "src/firebase";
import { useEffect, useRef, useState } from "react";

function CreateOrUpdateInventoryDialog({
  dialogType,
  openDialog,
  handleCloseDialog,
  state,
  setState,
  fetchData,
  companyId,
}) {
  const {
    id,
    sku,
    model,
    category,
    size,
    materials,
    color,
    stockHistory,
    qty,
    qtySold,
    qtyRemaining,
    unitPriceWithoutShipping,
    unitPriceWithShipping,
    totalPriceWithShipping,
    unitSellingPrice,
    totalSellingPrice,
    companyName,
    percentageProfit,
    percentageShipping,
  } = state;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [categoryList, setCategoryList] = useState([]);

  const temp_fetchCategoryRef = useRef();

  useEffect(() => {
    temp_fetchCategoryRef.current();
  }, []);

  async function fetchCategory() {
    if (openDialog) {
      dispatch(setLoading(true));

      await db
        .collection("company")
        .doc(companyId)
        .collection("category")
        .orderBy("title")
        .get()
        .then((result) => {
          if (result?.docs?.length > 0) {
            const itemList = result.docs.map((doc) => ({
              id: doc.id,
              data: { ...doc.data() },
              title: doc?.data()?.title || "",
            }));

            setCategoryList(itemList);

            dispatch(setLoading(false));
          } else {
            setCategoryList([]);

            dispatch(setLoading(false));
          }
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while fetching categories: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  temp_fetchCategoryRef.current = fetchCategory;

  const submitChanges = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    if (!sku) {
      enqueueSnackbar("Please provide a SKU code", { variant: "error" });
      dispatch(setLoading(false));
    } else {
      if (dialogType === "add") {
        performAdd();
      } else if (dialogType === "update") {
        performUpdate();
      }
    }
  };

  async function performAdd() {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyId)
      .collection("inventory")
      .add({
        sku: sku || "",
        category: category || null,
        model: model || "",
        size: size || "",
        materials: materials || "",
        color: color || "",
        stockHistory: stockHistory || [],
        qty: qty || "",
        qtySold: qtySold || "",
        qtyRemaining: qtyRemaining || "",
        unitPriceWithoutShipping: unitPriceWithoutShipping || "",
        unitPriceWithShipping: unitPriceWithShipping || "",
        totalPriceWithShipping: totalPriceWithShipping || "",
        unitSellingPrice: unitSellingPrice || "",
        totalSellingPrice: totalSellingPrice || "",
        companyName: companyName || "",
        percentageProfit: percentageProfit || "",
        percentageShipping: percentageShipping || "",
      })
      .then(async () => {
        enqueueSnackbar("Category added successfully");
        await fetchData();
        handleCloseDialog();
        dispatch(setLoading(false));
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while adding category: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  async function performUpdate() {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyId)
      .collection("inventory")
      .doc(id)
      .set(
        {
          id: id,
          sku: sku || "",
          category: category || null,
          model: model || "",
          size: size || "",
          materials: materials || "",
          color: color || "",
          stockHistory: stockHistory || [],
          qty: qty || "",
          qtySold: qtySold || "",
          qtyRemaining: qtyRemaining || "",
          unitPriceWithoutShipping: unitPriceWithoutShipping || "",
          unitPriceWithShipping: unitPriceWithShipping || "",
          totalPriceWithShipping: totalPriceWithShipping || "",
          unitSellingPrice: unitSellingPrice || "",
          totalSellingPrice: totalSellingPrice || "",
          companyName: companyName || "",
          percentageProfit: percentageProfit || "",
          percentageShipping: percentageShipping || "",
        },
        { merge: true }
      )
      .then(async () => {
        enqueueSnackbar("Category updated successfully");
        await fetchData();
        handleCloseDialog();
        dispatch(setLoading(false));
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while updating category: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  return (
    <>
      <Dialog
        open={openDialog}
        // onClose={handleCloseDialog}
        maxWidth={"lg"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType === "view"
            ? "View item"
            : dialogType === "add"
            ? "Create item"
            : "Update item"}
        </DialogTitle>
        <DialogContent>
          <Divider />
          <br />
          <ItemForm
            state={state}
            setState={setState}
            categoryList={categoryList}
            companyId={companyId}
            dialogType={dialogType}
            fetchData={fetchData}
          />
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} direction="row">
            {dialogType !== "view" ? (
              <Button
                onClick={(e) => submitChanges(e)}
                color="primary"
                variant="contained"
              >
                {dialogType && dialogType === "add" ? "Add" : "Update"}
              </Button>
            ) : (
              <></>
            )}

            <Button
              onClick={() => handleCloseDialog()}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateOrUpdateInventoryDialog;
