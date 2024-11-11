import { Box, Dialog, DialogActions, IconButton, Tooltip } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import Iconify from "../../../components/Iconify";
import InvPdf from "../../../components/invoice-pdf/InvPdf";

export default function PdfDialog({ open, close, content }) {
  return (
    <>
      <Dialog fullScreen open={open} onClose={close}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: "12px !important",
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={() => close()}>
                <Iconify icon={"eva:close-fill"} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: "100%", overflow: "hidden" }}>
            <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
              <InvPdf
                companyChosenObj={content.companyChosenObj}
                clientChosenObj={content.clientChosenObj}
                invDetails={content.invDetails}
                logo={content.logo}
                sigImage={content.sigImage}
              />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
