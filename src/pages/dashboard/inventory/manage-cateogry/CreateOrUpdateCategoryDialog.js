import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Divider,
  Grid,
  TextField,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { setLoading } from "../../../../features/globalSlice";
import { useSnackbar } from "notistack";
import db from "src/firebase";

function CreateOrUpdateCategoryDialog({
  dialogType,
  openDialog,
  handleCloseDialog,
  state,
  setState,
  fetchData,
  companyId,
}) {
  const { id, title } = state;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const submitChanges = (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    if (!title) {
      enqueueSnackbar("Please provide a title", { variant: "error" });
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
      .collection("category")
      .add({ title: title })
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
      .collection("category")
      .doc(id)
      .set({ title: title }, { merge: true })
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
        onClose={handleCloseDialog}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {dialogType && dialogType === "add" ? "Create item" : "Update item"}
        </DialogTitle>
        <DialogContent>
          <Divider />
          <br />
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                variant="outlined"
                size="small"
                required
                fullWidth
                name="title"
                label="Title"
                type="text"
                id={"title"}
                value={title || ""}
                onChange={(event) => {
                  setState((prev) => {
                    return { ...prev, title: event.target.value };
                  });
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack spacing={2} direction="row">
            <Button
              onClick={(e) => submitChanges(e)}
              color="primary"
              variant="contained"
            >
              {dialogType && dialogType === "add" ? "Add" : "Update"}
            </Button>

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

export default CreateOrUpdateCategoryDialog;
