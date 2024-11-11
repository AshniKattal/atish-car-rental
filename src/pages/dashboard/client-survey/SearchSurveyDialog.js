import { DatePicker } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import firebase from "firebase/compat";
import moment from "moment";
import Iconify from "src/components/Iconify";
import {
  getDefaultCheckBoxOptions,
  handleViewDownloadCustomSurvey,
} from "src/components/core-functions/SelectionCoreFunctions";

export default function SearchSurveyDialog({
  open,
  setOpen,
  companyId,
  collectionName,
  title,
  logo,
  companyDetails,
  setSurveyDetail,
  setValue,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [tableRows, setTableRows] = useState([]);

  const temp_fetchDataRef = useRef();

  useEffect(() => {
    temp_fetchDataRef.current();
  }, [companyId, collectionName, us_fromDate, us_ToDate]);

  async function fetchData() {
    if (companyId && collectionName && us_fromDate && us_ToDate) {
      dispatch(setLoading(true));

      if (new Date(us_fromDate) > new Date(us_ToDate)) {
        enqueueSnackbar(`Date incorrect. To Date cannot be before From Date.`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      } else {
        const startDateISOString = us_fromDate.toISOString();
        const startDateStringSplit = startDateISOString.split("T");

        const endDateISOString = us_ToDate.toISOString();
        const endDateStringSplit = endDateISOString.split("T");

        const startDate = new Date(`${startDateStringSplit[0]}T00:00:00.000Z`); // The start date of the range
        const endDate = new Date(`${endDateStringSplit[0]}T23:59:59.000Z`); // The end date of the range

        await db
          .collection("company")
          .doc(companyId)
          .collection(collectionName)
          .where(
            "dateCreated",
            ">=",
            firebase.firestore.Timestamp.fromDate(startDate)
          )
          .where(
            "dateCreated",
            "<=",
            firebase.firestore.Timestamp.fromDate(endDate)
          )
          .get()
          .then((queryDocs) => {
            if (queryDocs?.docs?.length > 0) {
              let arr = [];
              queryDocs?.docs.forEach((doc) => {
                arr.push({
                  id: doc?.id,
                  data: { ...doc?.data() },
                });
              });
              setTableRows(arr);
              dispatch(setLoading(false));
            } else {
              setTableRows([]);
              dispatch(setLoading(false));
            }
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while fetching clients: ${err?.message}`
            );
            dispatch(setLoading(false));
          });
      }
    }
  }

  temp_fetchDataRef.current = fetchData;

  async function chooseDocument(row) {
    let defaultOptions = await getDefaultCheckBoxOptions();

    let treatmentDefinition = "";

    let controlOfOptions = [];
    let treatedLocationOptions = [];

    defaultOptions.controlOfCheckboxList.forEach((type) => {
      if (row?.data?.controlOf[type.name] === true) {
        /* treatmentDefinition =
          treatmentDefinition + `<ul><li>${type?.title}</li><ul>`; */
        controlOfOptions.push(type?.title);
      }
    });

    defaultOptions.locationTreatedCheckboxList.forEach((type) => {
      if (row?.data?.locationTreated[type.name] === true) {
        /*  treatmentDefinition =
          treatmentDefinition + `<ul><li>${type?.title}</li><li></li>`; */
        treatedLocationOptions.push(type?.title);
      }
    });

    if (controlOfOptions && controlOfOptions?.length > 0) {
      treatmentDefinition =
        treatmentDefinition + "<p>Pest to be controlled:</p><p><br></p>";

      treatmentDefinition = treatmentDefinition + "<ul>";

      controlOfOptions.forEach((text) => {
        treatmentDefinition = treatmentDefinition + `<li>${text}</li>`;
      });

      treatmentDefinition = treatmentDefinition + "</ul>";
    }

    if (treatedLocationOptions && treatedLocationOptions?.length > 0) {
      treatmentDefinition = treatmentDefinition + "<p><br></p>";

      treatmentDefinition =
        treatmentDefinition + "<p>Area to be controlled:</p><p><br></p>";

      treatmentDefinition = treatmentDefinition + "<ul>";

      treatedLocationOptions.forEach((text) => {
        treatmentDefinition = treatmentDefinition + `<li>${text}</li>`;
      });

      treatmentDefinition = treatmentDefinition + "</ul>";
    }

    treatmentDefinition = treatmentDefinition + "<p><br></p>";

    setSurveyDetail((prev) => {
      return {
        ...prev,
        customerName: row?.data?.customerName || "",
        clientSigName: row?.data?.customerName || "",
        address: row?.data?.address || "",
        email: row?.data?.email || "",
        phone: row?.data?.phone || "",
        surveyNumberSelected: row?.id,
        treatmentDefinition: treatmentDefinition,
        clientId: row?.data?.clientId || "",
      };
    });

    if (setValue) {
      setValue("treatmentDefinition", treatmentDefinition);
    }

    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} fullWidth maxWidth={"md"}>
        <DialogTitle>
          <Typography>Search {title}</Typography>
        </DialogTitle>
        <DialogContent>
          <Divider />
          <br />

          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Typography>Please choose a date</Typography>
            </Grid>

            <Grid item xs={12} md={12} style={{ width: "100%" }}>
              <Stack direction={"row"} spacing={3} alignItems={"center"}>
                <DatePicker
                  label="From"
                  value={us_fromDate || ""}
                  onChange={(newValue) => {
                    set_us_fromDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                  inputFormat="dd/MM/yyyy"
                />

                <DatePicker
                  label="To"
                  value={us_ToDate || ""}
                  onChange={(newValue) => {
                    set_us_ToDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                  inputFormat="dd/MM/yyyy"
                />
              </Stack>
            </Grid>
          </Grid>

          {tableRows && tableRows?.length > 0 ? (
            <>
              <br />
              <TableContainer>
                <Table border={1}>
                  <TableHead>
                    <TableRow>
                      <TableCell size="small" align="center">
                        Choose
                      </TableCell>
                      <TableCell size="small" align="center">
                        Date Created
                      </TableCell>
                      <TableCell size="small" align="center">
                        {title} number
                      </TableCell>
                      <TableCell size="small" align="center">
                        Customer name
                      </TableCell>
                      <TableCell size="small" align="center">
                        View/Download PDF
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableRows &&
                      tableRows?.length > 0 &&
                      tableRows?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell size="small" align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => chooseDocument(row)}
                            >
                              Choose
                            </Button>
                          </TableCell>
                          <TableCell size="small" align="center">
                            {row?.data?.dateCreated
                              ? moment(row?.data?.dateCreated.toDate()).format(
                                  "DD-MM-YYYY HH:mm:ss"
                                )
                              : ""}
                          </TableCell>
                          <TableCell size="small" align="center">
                            {row?.id || ""}
                          </TableCell>
                          <TableCell size="small" align="center">
                            {row?.data?.customerName || ""}
                          </TableCell>
                          <TableCell size="small" align="center">
                            <Stack
                              spacing={2}
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"center"}
                            >
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleViewDownloadCustomSurvey(
                                    companyDetails,
                                    "view",
                                    row?.data,
                                    collectionName,
                                    logo
                                  )
                                }
                              >
                                <Iconify icon={"carbon:view"} />
                              </IconButton>

                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleViewDownloadCustomSurvey(
                                    "download",
                                    row?.data,
                                    collectionName,
                                    logo
                                  )
                                }
                              >
                                <Iconify icon={"eva:download-fill"} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>
              <br />
              <Typography>No data found for the selected date</Typography>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
