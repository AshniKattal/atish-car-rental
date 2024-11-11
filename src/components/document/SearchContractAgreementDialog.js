import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectDocument } from "../../features/documentSlice";
import Iconify from "../../components/Iconify";
import {
  dynamicSort,
  handleViewDownload,
  handleViewDownloadCustomSurvey,
  parseHTML,
} from "../../components/core-functions/SelectionCoreFunctions";
import { useEffect, useRef, useState } from "react";
import db from "../../firebase";
import { setLoading } from "../../features/globalSlice";
import { useSnackbar } from "notistack";
import { DatePicker } from "@mui/lab";
import firebase from "firebase/compat";

export default function SearchContractAgreementDialog({
  open,
  handleCloseDialog,
  documentDetails,
  setDocumentDetails,
  selectedRowIndex,
  logo,
  sigImage,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const temp_fetch_document_ref = useRef();

  const { companyDetails, clientDocumentObjectSelected } =
    useSelector(selectDocument);

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [us_documentlist, set_us_documentlist] = useState([]);

  const [lastVisibleId, set_lastVisibleId] = useState("");

  useEffect(() => {
    temp_fetch_document_ref.current();
  }, [us_fromDate, us_ToDate]);

  async function fetchDocument() {
    if (
      us_fromDate !== undefined &&
      us_fromDate !== "" &&
      us_ToDate !== undefined &&
      us_ToDate !== ""
    ) {
      if (new Date(us_fromDate) > new Date(us_ToDate)) {
        enqueueSnackbar(`Date incorrect. To Date cannot be before From Date.`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      } else if (
        companyDetails !== undefined &&
        clientDocumentObjectSelected !== undefined
      ) {
        dispatch(setLoading(true));

        const startDateISOString = us_fromDate.toISOString();
        const startDateStringSplit = startDateISOString.split("T");

        const endDateISOString = us_ToDate.toISOString();
        const endDateStringSplit = endDateISOString.split("T");

        const startDate = new Date(`${startDateStringSplit[0]}T00:00:00.000Z`); // The start date of the range
        const endDate = new Date(`${endDateStringSplit[0]}T23:59:59.000Z`); // The end date of the range

        await db
          .collection("company")
          .doc(companyDetails?.id)
          .collection("contractagreement")
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
          .then((querySnapshot) => {
            let docArray = [];
            if (querySnapshot?.docs?.length > 0) {
              querySnapshot?.docs.forEach((document) => {
                // filter by client selected
                if (
                  document?.data()?.clientId ===
                    clientDocumentObjectSelected?.id &&
                  !document?.data()?.deleted
                ) {
                  docArray.push({
                    id: document?.id,
                    docString: document?.data()?.docString,
                    data: document?.data(),
                    checked: false,
                  });
                }
              });

              if (docArray?.length === 25) {
                set_lastVisibleId(true);
              }

              docArray.sort(dynamicSort("docString"));

              set_us_documentlist(docArray);
            } else {
              set_us_documentlist([]);
            }
            dispatch(setLoading(false));
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while fetching documents: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    } else {
      dispatch(setLoading(false));
    }
  }

  temp_fetch_document_ref.current = fetchDocument;

  async function nextPagination() {
    dispatch(setLoading(true));

    const startDateISOString = us_fromDate.toISOString();
    const startDateStringSplit = startDateISOString.split("T");

    const endDateISOString = us_ToDate.toISOString();
    const endDateStringSplit = endDateISOString.split("T");

    const startDate = new Date(`${startDateStringSplit[0]}T00:00:00.000Z`); // The start date of the range
    const endDate = new Date(`${endDateStringSplit[0]}T23:59:59.000Z`); // The end date of the range

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection("contractagreement")
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
      .startAfter(lastVisibleId)
      .limit(25)
      .get()
      .then((querySnapshot) => {
        let docArray = [];
        if (querySnapshot?.docs?.length > 0) {
          querySnapshot?.docs.forEach((document) => {
            // filter by client selected
            if (
              document?.data()?.clientId === clientDocumentObjectSelected?.id &&
              !document?.data()?.deleted
            ) {
              docArray.push({
                id: document?.id,
                data: document?.data(),
                checked: false,
              });
            }
          });

          if (docArray?.length === 25) {
            set_lastVisibleId(true);
          } else {
            set_lastVisibleId(false);
          }

          let newArr = [...us_documentlist, ...docArray];

          set_us_documentlist(newArr);

          dispatch(setLoading(false));
        } else {
          set_lastVisibleId(false);

          dispatch(setLoading(false));
        }
      })
      .catch((err) => {
        enqueueSnackbar(
          `Error occured while fetching documents: ${err?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  async function onChooseQuotationNumber(data) {
    if (selectedRowIndex !== null) {
      let newDocParticulars = [...(documentDetails?.docParticulars || [])];

      let newString = "";

      let parsedTreatmentDefinition =
        (data?.treatmentDefinition &&
          (await parseHTML(data?.treatmentDefinition || ""))) ||
        "";

      if (parsedTreatmentDefinition) {
        let treatmentDefinition = parsedTreatmentDefinition;

        treatmentDefinition &&
          treatmentDefinition?.length > 0 &&
          treatmentDefinition?.map((htmlTag, mainIndex) => {
            if (htmlTag?.tag === undefined) {
              newString = newString + "\n";
            }
            if (htmlTag?.tag === "span") {
              let newText = htmlTag?.text.replace(/&nbsp;|\t/g, " ");
              newString = newString + newText + "\n";
            }
            if (htmlTag?.tag === "strong") {
              let newText = htmlTag?.text.replace(/&nbsp;|\t/g, " ");
              newString = newString + newText + "\n";
            } else if (htmlTag?.tag === "ul") {
              const regex =
                /<li class=\"ql-align-justify\"><span style=\"background-color: transparent;\">(.*?)<\/span><\/li>|<li>(.*?)<\/li>|/g;
              const matches = [...htmlTag?.text.matchAll(regex)].map(
                (match) => match[1]
              );
              if (matches && matches?.length > 0) {
                matches.forEach((text, index) => {
                  if (text) {
                    let newText = text.replace(/&nbsp;|\t/g, " ");
                    newString = newString + "-" + newText + "\n";
                  } else newString = newString + "";
                });
              }
            } else if (htmlTag?.tag === "ol") {
              const regex =
                /<li class=\"ql-align-justify\"><span style=\"background-color: transparent;\">(.*?)<\/span><\/li>|<li>(.*?)<\/li>|/g;
              const matches = [...htmlTag?.text.matchAll(regex)].map(
                (match) => match[1]
              );
              if (matches && matches?.length > 0) {
                matches.forEach((text, index) => {
                  if (text) {
                    let newText = text.replace(/&nbsp;|\t/g, " ");
                    newString = newString + "-" + newText + "\n";
                  } else newString = newString + "";
                });
              }
            } else {
              newString = newString + "";
            }
          });
      }

      if (newString) {
        // add selected description with current description if present
        let newDesc =
          (newDocParticulars[selectedRowIndex]?.rowDescription || "") +
          (newString ? `${newString}` : "");

        const convertToNumber = (str) => {
          // Remove "Rs.", "Rs", or "rs" (case-insensitive) and commas, then convert to a number
          const number = parseFloat(
            str.replace(/rs\.?/gi, "").replace(/,/g, "")
          );
          return number;
        };

        let unitPrice = convertToNumber(data?.annualTotalAmt);
        let totalAmount = Number(unitPrice || 0) * 1;

        // update state using index
        newDocParticulars[selectedRowIndex] = {
          ...newDocParticulars[selectedRowIndex],
          rowDescription: newDesc,
          rowUnitPrice: unitPrice || 0,
          rowQty: 1,
          rowAmount: totalAmount,
          rowDiscountedAmount: totalAmount,
          rowVatAmount: 0,
          rowTotalAmount: totalAmount,
        };

        setDocumentDetails({
          ...documentDetails,
          docParticulars: newDocParticulars,
        });

        // close popup
        handleCloseDialog();
      } else {
        // close popup
        handleCloseDialog();
      }
    }
  }

  return (
    <Dialog open={open} maxWidth={"md"} fullWidth>
      <DialogTitle>Search Contract Agreement Descriptions</DialogTitle>
      <DialogContent>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <hr />
            <br />
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
                renderInput={(params) => <TextField {...params} size="small" />}
                inputFormat="dd/MM/yyyy"
              />

              <DatePicker
                label="To"
                value={us_ToDate || ""}
                onChange={(newValue) => {
                  set_us_ToDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} size="small" />}
                inputFormat="dd/MM/yyyy"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={12}>
            <TableContainer>
              <Table border={1}>
                <TableHead>
                  <TableRow>
                    <TableCell size="small">
                      Contract Agreement number
                    </TableCell>
                    <TableCell size="small">Date created</TableCell>
                    <TableCell size="small">Preview</TableCell>
                    <TableCell size="small">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {us_documentlist &&
                    us_documentlist?.length > 0 &&
                    us_documentlist?.map((desc, index) => (
                      <TableRow key={index}>
                        <TableCell size="small">
                          <Typography>{desc?.id}</Typography>
                        </TableCell>
                        <TableCell size="small">
                          <Typography>
                            {desc?.data?.dateCreated
                              ? moment(desc?.data?.dateCreated.toDate()).format(
                                  "DD-MM-YYYY"
                                ) || ""
                              : ""}
                          </Typography>
                        </TableCell>
                        <TableCell size="small" align="center">
                          <Stack
                            spacing={2}
                            direction={"row"}
                            alignItems={"center"}
                          >
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleViewDownloadCustomSurvey(
                                  companyDetails,
                                  "view",
                                  desc?.data,
                                  "contractagreement",
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
                                  companyDetails,
                                  "download",
                                  desc?.data,
                                  "contractagreement",
                                  logo
                                )
                              }
                            >
                              <Iconify icon={"eva:download-fill"} />
                            </IconButton>
                          </Stack>
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

                  {lastVisibleId ? (
                    <TableRow>
                      <TableCell size="small" colSpan={4}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => nextPagination()}
                        >
                          Next
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )}
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
          onClick={() => handleCloseDialog()}
        >
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
