import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { handleViewDownload } from "../../../components/core-functions/SelectionCoreFunctions";

export default function QuotationListDialog() {
  return (
    <Dialog
      open={us_open_quotationListDialog}
      onClose={() => set_us_open_quotationListDialog(false)}
      maxWidth={"md"}
      fullWidth
    >
      <DialogTitle>
        Associate a quotation number to current document
      </DialogTitle>
      <DialogContent>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table border={1}>
                <TableHead>
                  <TableRow>
                    <TableCell size="small">Quote number</TableCell>
                    <TableCell size="small">Date created</TableCell>
                    <TableCell size="small">Preview</TableCell>
                    <TableCell size="small">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {us_quotationList?.map((desc, index) => (
                    <TableRow key={index}>
                      <TableCell size="small">
                        <Typography>{desc?.data?.docString}</Typography>
                      </TableCell>
                      <TableCell size="small">
                        <Typography>
                          {desc?.data?.docDate
                            ? moment(desc?.data?.docDate.toDate()).format(
                                "DD-MM-YYYY"
                              ) || ""
                            : ""}
                        </Typography>
                      </TableCell>
                      <TableCell size="small">
                        <IconButton
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleViewDownload(
                              companyDetails,
                              clientDocumentObjectSelected,
                              doc,
                              logo,
                              sigImage,
                              "view"
                            )
                          }
                        >
                          <Iconify icon={"carbon:view"} />
                        </IconButton>
                      </TableCell>
                      <TableCell size="small">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => onChooseQuotationNumber(desc?.data)}
                        >
                          select
                        </Button>
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
          variant="contained"
          color="error"
          onClick={() => set_us_open_quotationListDialog(false)}
        >
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
