import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";

export default function CreateOrUpdateCheckboxDialog({
  dialogType,
  openDialog,
  handleCloseDialog,
  rowDetail,
  setRowDetail,
  fetchRows,
  title,
  collectionName,
  companyId,
}) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  async function addRow() {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyId)
      .collection(collectionName)
      .add({
        title: rowDetail?.title || "",
        name: rowDetail?.name || "",
      })
      .then(() => {
        fetchRows();
        enqueueSnackbar("Changes saved successfully");
        dispatch(setLoading(false));
        handleCloseDialog();
      })
      .catch((error) => {
        enqueueSnackbar(`Error occured while saving row: ${error?.message}`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      });
  }

  async function updateRow() {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyId)
      .collection(collectionName)
      .doc(rowDetail?.id)
      .set(
        {
          title: rowDetail?.title || "",
          name: rowDetail?.name || "",
        },
        { merge: true }
      )
      .then(() => {
        fetchRows();
        enqueueSnackbar("Changes updated successfully");
        dispatch(setLoading(false));
        handleCloseDialog();
      })
      .catch((error) => {
        enqueueSnackbar(`Error occured while updating row: ${error?.message}`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      });
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={openDialog}>
      <DialogTitle>{`${
        dialogType === "update" ? "Update" : "Add new"
      } ${title}`}</DialogTitle>
      <DialogContent>
        <Divider />
        <br />

        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="title"
              label="Title"
              id="title"
              type="text"
              value={rowDetail?.title || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setRowDetail((previous) => {
                  return {
                    ...previous,
                    title: event.target.value,
                  };
                });
              }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <TextField
              variant="outlined"
              name="name"
              label="Name Id"
              id="name"
              type="text"
              value={rowDetail?.name || ""}
              size="small"
              fullWidth
              onChange={(event) => {
                setRowDetail((previous) => {
                  return {
                    ...previous,
                    name: event.target.value,
                  };
                });
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (dialogType === "add") {
              addRow();
            } else if (dialogType === "update") {
              updateRow();
            }
          }}
        >
          {dialogType === "add"
            ? "Submit changes"
            : dialogType === "update"
            ? "Update form"
            : ""}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => handleCloseDialog()}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
