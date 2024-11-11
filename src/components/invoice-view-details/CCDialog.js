import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Alert,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function CCDialog({
  open,
  close,
  us_openCCDialog,
  sendMultipleEmail,
}) {
  const [ccField, set_ccField] = useState("");

  return (
    <Dialog open={open} onClose={() => close()} maxWidth={"sm"} fullWidth>
      <DialogTitle>CC confirmation</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Alert severity="info">The CC field is optional</Alert>
          <TextField
            variant="outlined"
            margin="normal"
            name="ccField"
            label="CC Email address"
            id="ccField"
            type="text"
            value={ccField || ""}
            size="small"
            onChange={(event) => set_ccField(event.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            if (us_openCCDialog?.type === "single") {
              sendMultipleEmail(
                us_openCCDialog?.type,
                us_openCCDialog?.invoiceContent,
                ccField
              );
            } else {
              sendMultipleEmail(us_openCCDialog?.type, null, ccField);
            }
          }}
        >
          confirm
        </Button>
        <Button variant="contained" color="error" onClick={() => close()}>
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
