import {
  Autocomplete,
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import ManageStockHistory from "../../manage-stock-history/ManageStockHistory";
import { useDispatch } from "react-redux";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import ViewAllSoldTransactionsDialog from "./ViewAllSoldTransactionsDialog";
import SetUpAmountReceivedDialog from "./SetUpAmountReceivedDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ItemForm({
  state,
  setState,
  categoryList,
  companyId,
  dialogType,
  fetchData,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const {
    id,
    sku,
    model,
    category,
    size,
    materials,
    color,
    stockHistory,
    allInventoryItemTransactions,
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

  const [openSetUpAmountReceivedDialog, setOpenSetUpAmountReceivedDialog] =
    useState(false);

  const fields = [
    {
      label: "SKU",
      name: "sku",
      type: "text",
      required: true,
    },
    {
      type: "divider",
    },
    {
      label: "Model",
      name: "model",
      type: "text",
      required: false,
    },
    {
      label: "Category",
      name: "category",
      type: "autocomplete",
      required: false,
    },
    { label: "Size", name: "size", type: "text", required: false },
    { label: "Materials", name: "materials", type: "text", required: false },
    { label: "Color", name: "color", type: "text", required: false },
    {
      label: "Company name",
      name: "companyName",
      type: "text",
      required: false,
    },

    {
      type: "divider",
    },

    { label: "Stock Quantity", name: "qty", type: "number", required: false },
    {
      label: "Quantity sold",
      name: "qtySold",
      type: "number",
      required: false,
    },
    {
      label: "Quantity remaining",
      name: "qtyRemaining",
      type: "number",
      readOnly: true,
    },

    {
      type: "divider",
    },

    {
      label: "Total Amount Received (exclu. VAT)",
      name: "totalAmountReceivedWithoutVAT",
      type: "text",
      readOnly: true,
    },

    {
      label: "Total Amount Received (Inclu. VAT)",
      name: "totalAmountReceivedWithVAT",
      type: "text",
      readOnly: true,
    },
    {
      label: "View recent transactions",
      name: "recentTransactions",
      type: "text",
      readOnly: true,
    },

    {
      type: "divider",
    },

    {
      label: "Unit price without shipping",
      name: "unitPriceWithoutShipping",
      type: "text",
      readOnly: true,
    },
    {
      label: "Unit price with shipping",
      name: "unitPriceWithShipping",
      type: "text",
      readOnly: true,
    },
    {
      label: "Total price with shipping",
      name: "totalPriceWithShipping",
      type: "text",
      readOnly: true,
    },
    {
      type: "divider",
    },
    {
      label: "Unit selling price",
      name: "unitSellingPrice",
      type: "text",
      required: false,
    },
    {
      label: "Total selling price",
      name: "totalSellingPrice",
      type: "text",
      readOnly: true,
    },

    {
      type: "divider",
    },

    {
      label: "Percentage profit",
      name: "percentageProfit",
      type: "text",
      required: false,
    },
    {
      label: "Percentage shipping",
      name: "percentageShipping",
      type: "text",
      required: false,
    },
  ];

  const [openAllTransactionDialog, set_openAllTransactionDialog] =
    useState(false);

  const temp_calculateQtyRemainingRef = useRef();
  const temp_calculatePriceWithShippingRef = useRef();
  const temp_calculateTotalPriceWithShippingRef = useRef();
  // const temp_calculateSellingPriceRef = useRef();
  const temp_calculateTotalSellingPriceRef = useRef();

  // calculate remaining quantity
  useEffect(() => {
    temp_calculateQtyRemainingRef.current();
  }, [qty, qtySold]);

  // calculate price with shipping
  useEffect(() => {
    temp_calculatePriceWithShippingRef.current();
  }, [unitPriceWithoutShipping, percentageShipping]);

  // calculate total price with shipping
  useEffect(() => {
    temp_calculateTotalPriceWithShippingRef.current();
  }, [unitPriceWithShipping, /* qtyRemaining */ qty]);

  // calculate selling price
  /*   useEffect(() => {
    temp_calculateSellingPriceRef.current();
  }, [unitPriceWithShipping, percentageProfit]); */

  // calculate total selling price
  useEffect(() => {
    temp_calculateTotalSellingPriceRef.current();
  }, [unitSellingPrice, qty]);

  function calculateQtyRemaining() {
    let remaining = Number(qty || 0) - Number(qtySold || 0);
    setState((prev) => {
      return { ...prev, qtyRemaining: remaining };
    });
  }

  temp_calculateQtyRemainingRef.current = calculateQtyRemaining;

  function calculatePriceWithShipping() {
    //let percentage = Number(percentageShipping || 0) / 100;
    // percentage = percentage + 1;
    let priceWithShipping =
      Number(percentageShipping || 0) * Number(unitPriceWithoutShipping || 0);

    setState((prev) => {
      return { ...prev, unitPriceWithShipping: priceWithShipping.toFixed(2) };
    });
  }

  temp_calculatePriceWithShippingRef.current = calculatePriceWithShipping;

  function calculateTotalPriceWithShipping() {
    let totalPrice = Number(qty || 0) * Number(unitPriceWithShipping || 0);

    setState((prev) => {
      return { ...prev, totalPriceWithShipping: totalPrice.toFixed(2) };
    });
  }

  temp_calculateTotalPriceWithShippingRef.current =
    calculateTotalPriceWithShipping;

  /* function calculateSellingPrice() {
    // let percentage = Number(percentageProfit || 0) / 100;
    // percentage = percentage + 1;
    let sellingPrice =
      Number(percentageProfit || 0) * Number(unitPriceWithShipping || 0);

    setState((prev) => {
      return { ...prev, unitSellingPrice: sellingPrice.toFixed(2) };
    });
  }

  temp_calculateSellingPriceRef.current = calculateSellingPrice; */

  function calculateTotalSellingPrice() {
    let totalPrice = Number(qty || 0) * Number(unitSellingPrice || 0);

    setState((prev) => {
      return { ...prev, totalSellingPrice: totalPrice.toFixed(2) };
    });
  }

  temp_calculateTotalSellingPriceRef.current = calculateTotalSellingPrice;

  async function generateSkuCode() {
    if (!model || !color) {
      enqueueSnackbar(
        "Please fill in the fields Model and Color in order to generate the SKU Code.",
        {
          variant: "warning",
        }
      );
    } else {
      dispatch(setLoading(true));

      var documentDocRef = db
        .collection("company")
        .doc(companyId)
        .collection("inventory")
        .doc("documentIndex");

      db.runTransaction((transaction) => {
        return transaction.get(documentDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
            // throw "Document does not exist!";
            transaction.update(documentDocRef, {
              documentIndex: 1,
            });
            return 1;
          }

          var newDocumentNumber = Number(sfDoc.data().documentIndex) + 1;
          transaction.update(documentDocRef, {
            documentIndex: newDocumentNumber,
          });
          return newDocumentNumber;
        });
      })
        .then(async (documentNumber) => {
          let modelString = model;
          let colorString = color;

          // Split the string by spaces
          const words = modelString.split(" ");

          // Function to retrieve the first alphabet character from a word
          const getFirstAlphabet = (word) => word.match(/[a-zA-Z]/)?.[0] || "";

          // Initialize an array to hold the first alphabet characters
          let result = "";

          // Iterate through the words to get the first alphabet from the first two words
          for (let i = 0; i < words.length && result.length < 2; i++) {
            const firstChar = getFirstAlphabet(words[i]);
            if (firstChar) {
              result = result + firstChar;
            }
          }

          const lastCharacter = colorString.slice(-1); // or str.charAt(str.length - 1)
          const formattedDocNumber = Number(documentNumber)
            .toString()
            .padStart(3, "0");
          let skuCode = `${result.toUpperCase()}${formattedDocNumber}${lastCharacter.toUpperCase()}`;
          setState((prev) => {
            return { ...prev, sku: skuCode };
          });

          dispatch(setLoading(false));
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while generating sku code : ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  async function checkSkuCode() {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyId)
      .collection("inventory")
      .where("sku", "==", sku)
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

  return (
    <Grid container spacing={3}>
      {fields &&
        fields?.map((field) => {
          if (field?.type === "divider") {
            return (
              <Grid item xs={12} md={12}>
                <Divider />
              </Grid>
            );
          } else {
            return (
              <Grid item xs={12} md={field?.name === "sku" ? 5 : 4}>
                {field?.name === "recentTransactions" ? (
                  <>
                    {allInventoryItemTransactions &&
                    allInventoryItemTransactions?.length > 0 ? (
                      <Tooltip title="View all transactions made for this item.">
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => set_openAllTransactionDialog(true)}
                          fullWidth
                        >
                          View all recent transactions
                        </Button>
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </>
                ) : field?.name === "totalAmountReceivedWithoutVAT" ||
                  field?.name === "totalAmountReceivedWithVAT" ? (
                  <Stack
                    spacing={2}
                    direction={"row"}
                    alignItems={"center"}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    <TextField
                      variant="outlined"
                      size="small"
                      required={field?.required || false}
                      fullWidth
                      name={field?.name}
                      label={field?.label}
                      type="text"
                      id={field?.name}
                      value={state[field?.name] || "0"}
                      onChange={(event) => {
                        setState((prev) => {
                          return { ...prev, [field?.name]: event.target.value };
                        });
                      }}
                      readOnly={field?.readOnly}
                      disabled={dialogType === "view"}
                    />

                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => {
                        setOpenSetUpAmountReceivedDialog({
                          open: true,
                          type: field?.name,
                          typeLabel: field?.label,
                          companyId: companyId,
                          inventoryId: id,
                        });
                      }}
                    >
                      {dialogType === "view" ? "View" : "Set up"}
                    </Button>
                  </Stack>
                ) : field?.name === "qtySold" ||
                  field?.name === "qty" ||
                  field?.name === "qtyRemaining" ? (
                  <Stack
                    spacing={2}
                    direction={"row"}
                    alignItems={"center"}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    <TextField
                      variant="outlined"
                      size="small"
                      required={field?.required || false}
                      fullWidth
                      name={field?.name}
                      label={field?.label}
                      type="text"
                      id={field?.name}
                      value={state[field?.name] || "0"}
                      onChange={(event) => {
                        setState((prev) => {
                          return { ...prev, [field?.name]: event.target.value };
                        });
                      }}
                      readOnly={field?.readOnly}
                      disabled={dialogType === "view"}
                    />
                  </Stack>
                ) : field?.name === "sku" ? (
                  <Stack
                    spacing={2}
                    direction={"row"}
                    alignItems={"center"}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    <TextField
                      variant="outlined"
                      size="small"
                      required={field?.required || false}
                      fullWidth
                      name={field?.name}
                      label={field?.label}
                      type="text"
                      id={field?.name}
                      value={state[field?.name] || ""}
                      onChange={(event) => {
                        setState((prev) => {
                          return { ...prev, [field?.name]: event.target.value };
                        });
                      }}
                      readOnly={field?.readOnly}
                      disabled={dialogType === "view"}
                    />

                    <Tooltip title="Generate SKU code based on the model and colour you entered.">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => generateSkuCode()}
                        sx={{ width: "150px" }}
                        disabled={sku || dialogType === "view"}
                      >
                        Auto-SKU
                      </Button>
                    </Tooltip>

                    <Tooltip title="Check if the SKU code you entered is already present in the database.">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => checkSkuCode()}
                        sx={{ width: "150px" }}
                        disabled={!sku || dialogType === "view"}
                      >
                        Check-SKU
                      </Button>
                    </Tooltip>
                  </Stack>
                ) : field?.type === "text" || field?.type === "number" ? (
                  <TextField
                    variant="outlined"
                    size="small"
                    required={field?.required || false}
                    fullWidth
                    name={field?.name}
                    label={field?.label}
                    type="text"
                    id={field?.name}
                    value={state[field?.name] || ""}
                    onChange={(event) => {
                      if (field?.name === "unitSellingPrice") {
                        let percentageProfitValue =
                          Number(event.target.value || 0) /
                          Number(unitPriceWithShipping || 0);

                        setState((prev) => {
                          return {
                            ...prev,
                            unitSellingPrice: event.target.value,
                            percentageProfit: percentageProfitValue.toFixed(2),
                          };
                        });
                      } else if (field?.name === "percentageProfit") {
                        let sellingPrice =
                          Number(event.target.value || 0) *
                          Number(unitPriceWithShipping || 0);

                        setState((prev) => {
                          return {
                            ...prev,
                            percentageProfit: event.target.value,
                            unitSellingPrice: sellingPrice.toFixed(2),
                          };
                        });
                      } else {
                        setState((prev) => {
                          return { ...prev, [field?.name]: event.target.value };
                        });
                      }
                    }}
                    readOnly={field?.readOnly}
                    disabled={dialogType === "view"}
                  />
                ) : field?.type === "autocomplete" ? (
                  <Autocomplete
                    size="small"
                    fullWidth
                    value={state[field?.name] || null}
                    onChange={(e, value, reason) => {
                      if (
                        reason !== "removeOption" &&
                        reason !== "clear" &&
                        value
                      ) {
                        setState((prev) => {
                          return { ...prev, [field?.name]: value };
                        });
                      } else {
                        setState((prev) => {
                          return { ...prev, [field?.name]: null };
                        });
                      }
                    }}
                    options={categoryList || []}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={field?.label}
                        fullWidth
                        disabled={dialogType === "view"}
                      />
                    )}
                    getOptionLabel={(option) => option?.title}
                    disabled={dialogType === "view"}
                  />
                ) : (
                  <></>
                )}
              </Grid>
            );
          }
        })}

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>

      <ManageStockHistory
        stockHistory={stockHistory}
        state={state}
        setState={setState}
        dialogType={dialogType}
      />

      {openAllTransactionDialog ? (
        <ViewAllSoldTransactionsDialog
          open={openAllTransactionDialog}
          setOpen={set_openAllTransactionDialog}
          allTransactions={allInventoryItemTransactions}
        />
      ) : (
        <></>
      )}

      {openSetUpAmountReceivedDialog ? (
        <SetUpAmountReceivedDialog
          data={openSetUpAmountReceivedDialog}
          setData={setOpenSetUpAmountReceivedDialog}
          dialogType={dialogType}
          fetchData={fetchData}
          setState={setState}
        />
      ) : (
        <></>
      )}
    </Grid>
  );
}
