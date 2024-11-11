import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

export default function FullDescriptionDialog({
  open,
  setOpen,
  serviceDescription,
}) {
  return (
    <Dialog open={open} fullWidth maxWidth={"sm"}>
      <DialogTitle>Full description</DialogTitle>
      <DialogContent>
        <Divider />
        <br />
        <Typography>{serviceDescription || ""}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
