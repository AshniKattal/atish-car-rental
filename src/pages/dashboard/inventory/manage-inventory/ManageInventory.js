import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDocument } from "src/features/documentSlice";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import CreateOrUpdateInventoryDialog from "./CreateOrUpdateInventoryDialog";

const FETCH_LIMIT = 50;

const TableCRUDTemplate = lazy(() =>
  import("src/components/table/TableCRUDTemplate")
);

export default function ManageInventory() {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { companyDetails } = useSelector(selectDocument);

  const headers = [
    { id: "list", label: "List" },
    { id: "view", label: "View" },
    { id: "update", label: "Update" },
    { id: "delete", label: "Delete" },
    { id: "sku", label: "SKU" },
    { id: "category", label: "Category" },
    { id: "model", label: "Model" },
    { id: "size", label: "Size" },
    { id: "materials", label: "Material" },
    { id: "color", label: "Color" },
    // { id: "stockHistory", label: "Stock history" },
    { id: "qty", label: "Quantity" },
    { id: "qtySold", label: "Quantity Sold" },
    { id: "qtyRemaining", label: "Quantity Remaining" },
    { id: "unitPriceWithoutShipping", label: "Unit price without shipping" },
    { id: "unitPriceWithShipping", label: "Unit price with shipping" },
    { id: "totalPriceWithShipping", label: "Total price with shipping" },
    { id: "unitSellingPrice", label: "Unit selling price" },
    { id: "totalSellingPrice", label: "Total Selling price" },
    { id: "companyName", label: "Company" },
    { id: "percentageProfit", label: "% Profit" },
    { id: "percentageShipping", label: "% Shipping" },
  ];

  const [openDialog, setOpenDialog] = useState(false);

  const [dialogType, setDialogType] = useState("");

  const [itemDetail, setItemDetail] = useState({
    sku: "",
    model: "",
    category: null,
    size: "",
    materials: "",
    color: "",
    stockHistory: [],
    qty: "",
    qtySold: "",
    qtyRemaining: "",
    unitPriceWithoutShipping: "",
    unitPriceWithShipping: "",
    totalPriceWithShipping: "",
    unitSellingPrice: "",
    totalSellingPrice: "",
    companyName: "",
    percentageProfit: "",
    percentageShipping: "",
    allInventoryItemTransactions: [],
  });

  const [list, setList] = useState([]);

  const [lastDoc, setLastDoc] = useState(null); // Keep track of the last document for pagination

  const [hasMore, setHasMore] = useState(true); // Check if there are more documents

  const temp_fetchInventoryRef = useRef();

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
                allInventoryItemTransactions:
                  doc?.data()?.allInventoryItemTransactions || [],
                totalAmountReceivedWithoutVAT:
                  doc.data()?.totalAmountReceivedWithoutVAT || "",
                totalAmountReceivedWithVAT:
                  doc.data()?.totalAmountReceivedWithVAT || "",
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
                allInventoryItemTransactions:
                  doc?.data()?.allInventoryItemTransactions || [],
                totalAmountReceivedWithoutVAT:
                  doc.data()?.totalAmountReceivedWithoutVAT || "",
                totalAmountReceivedWithVAT:
                  doc.data()?.totalAmountReceivedWithVAT || "",
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

  const addBtnFunc = () => {
    setDialogType("add");
    setOpenDialog(true);
    setItemDetail({
      ...itemDetail,
      id: "",
      sku: "",
      category: null,
      model: "",
      size: "",
      materials: "",
      color: "",
      stockHistory: [],
      qty: "",
      qtySold: "",
      qtyRemaining: "",
      unitPriceWithoutShipping: "",
      unitPriceWithShipping: "",
      totalPriceWithShipping: "",
      unitSellingPrice: "",
      totalSellingPrice: "",
      companyName: "",
      percentageProfit: "",
      percentageShipping: "",
      allInventoryItemTransactions: [],
      totalAmountReceivedWithoutVAT: "",
      totalAmountReceivedWithVAT: "",
    });
  };

  const updateBtnFunc = (id, data) => {
    setDialogType("update");
    setOpenDialog(true);
    setItemDetail({
      id: id,
      sku: data?.sku || "",
      category: data?.category || null,
      model: data?.model || "",
      size: data?.size || "",
      materials: data?.materials || "",
      color: data?.color || "",
      stockHistory: data?.stockHistory || [],
      qty: data?.qty || "",
      qtySold: data?.qtySold || "",
      qtyRemaining: data?.qtyRemaining || "",
      unitPriceWithoutShipping: data?.unitPriceWithoutShipping || "",
      unitPriceWithShipping: data?.unitPriceWithShipping || "",
      totalPriceWithShipping: data?.totalPriceWithShipping || "",
      unitSellingPrice: data?.unitSellingPrice || "",
      totalSellingPrice: data?.totalSellingPrice || "",
      companyName: data?.companyName || "",
      percentageProfit: data?.percentageProfit || "",
      percentageShipping: data?.percentageShipping || "",
      allInventoryItemTransactions: data?.allInventoryItemTransactions || [],
      totalAmountReceivedWithoutVAT: data?.totalAmountReceivedWithoutVAT || "",
      totalAmountReceivedWithVAT: data?.totalAmountReceivedWithVAT || "",
    });
  };

  const deleteBtnFunc = async (id) => {
    dispatch(setLoading(true));
    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection("inventory")
      .doc(id)
      .delete()
      .then(async () => {
        fetchInventory();
        dispatch(setLoading(false));
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while deleting a item: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  function handleCloseDialog() {
    setItemDetail({
      id: "",
      sku: "",
      category: null,
      model: "",
      size: "",
      materials: "",
      color: "",
      stockHistory: [],
      qty: "",
      qtySold: "",
      qtyRemaining: "",
      unitPriceWithoutShipping: "",
      unitPriceWithShipping: "",
      totalPriceWithShipping: "",
      unitSellingPrice: "",
      totalSellingPrice: "",
      companyName: "",
      percentageProfit: "",
      percentageShipping: "",
      allInventoryItemTransactions: [],
      totalAmountReceivedWithoutVAT: "",
      totalAmountReceivedWithVAT: "",
    });

    setOpenDialog(false);

    setDialogType("");
  }

  const viewBtnFunc = (id, data) => {
    setDialogType("view");
    setOpenDialog(true);
    setItemDetail({
      ...data,
      id: id,
    });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<p>Loading...</p>}>
              <TableCRUDTemplate
                companyId={companyDetails?.id}
                type="inventory"
                headers={headers}
                aCollection={list}
                addBtnDisplay={true}
                addBtnLabel={"Create an item"}
                addBtnFunc={addBtnFunc}
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                emptyColMsg={
                  "Sorry, not a single inventory item has been created yet. Please create a inventory item."
                }
                viewOption={true}
                viewBtnFunc={viewBtnFunc}
                updateBtnDisplay={true}
                deleteBtnDisplay={true}
                updateBtnFunc={updateBtnFunc}
                deleteBtnFunc={deleteBtnFunc}
              />
            </Suspense>
          </Grid>
        </Grid>
      </Grid>

      {openDialog ? (
        <CreateOrUpdateInventoryDialog
          dialogType={dialogType}
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          state={itemDetail}
          setState={setItemDetail}
          fetchData={fetchInventory}
          companyId={companyDetails?.id}
        />
      ) : (
        <></>
      )}
    </>
  );
}
