import {
  Button,
  Container,
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
import Page from "../../../components/Page";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useSettings from "../../../hooks/useSettings";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../features/globalSlice";
import { useSnackbar } from "notistack";
import { selectDocument } from "../../../features/documentSlice";
import db from "../../../firebase";
import firebase from "firebase/compat";
import {
  dynamicSortDesc,
  handleViewDownload,
} from "../../../components/core-functions/SelectionCoreFunctions";
import moment from "moment";
import { DatePicker } from "@mui/lab";
import Iconify from "../../../components/Iconify";

const CompanyClientSelection = lazy(() =>
  import("../../../components/selection-component/CompanyClientSelection")
);

export default function ConvertedProformaIndex() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { themeStretch } = useSettings();

  const { documents, companyDetails, convertedProformaDocType } =
    useSelector(selectDocument);

  const [us_invoicelist, set_us_invoicelist] = useState([]);

  const [us_fromDate, set_us_fromDate] = useState(new Date());

  const [us_ToDate, set_us_ToDate] = useState(new Date());

  const [clientList, setClientList] = useState([]);

  const [logo, setLogo] = useState("");

  const [sigImage, setSigImage] = useState("");

  const temp_fetch_invoice_ref = useRef();

  const temp_fetch_client_ref = useRef();

  const temp_logo_image_ref = useRef();

  const temp_signature_image_ref = useRef();

  useEffect(() => {
    temp_fetch_client_ref.current();
    // convert logo image to adaptable react-pdf image
    temp_logo_image_ref.current();
    // convert signature image to adaptable react-pdf image
    temp_signature_image_ref.current();
  }, [companyDetails]);

  useEffect(() => {
    temp_fetch_invoice_ref.current();
  }, [us_fromDate, us_ToDate, companyDetails, convertedProformaDocType]);

  async function fetchClient() {
    if (companyDetails) {
      dispatch(setLoading(true));
      await db
        .collection("company")
        .doc(process.env.REACT_APP_COMPANY_ID)
        .collection("client")
        .orderBy("name", "asc")
        .get()
        .then((snapshot) => {
          var arr = [];
          if (snapshot?.docs?.length > 0) {
            snapshot.docs.forEach((doc) => {
              if (doc.id !== "--counterStatus--") {
                arr.push({
                  id: doc?.id,
                  data: doc?.data(),
                });
              }
            });
            setClientList(arr);
            dispatch(setLoading(false));
          } else {
            setClientList([]);
            dispatch(setLoading(false));
          }
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while fetching clients: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  temp_fetch_client_ref.current = fetchClient;

  async function getLogoImage() {
    if (
      companyDetails?.data?.imageUrl &&
      companyDetails?.data?.imageUrl !== ""
    ) {
      dispatch(setLoading(true));
      let logoImage = await toDataUrl(companyDetails?.data?.imageUrl);
      setLogo(logoImage);
    }
  }

  temp_logo_image_ref.current = getLogoImage;

  async function getSignatureImage() {
    if (companyDetails?.data?.sigUrl && companyDetails?.data?.sigUrl !== "") {
      dispatch(setLoading(true));
      let sigImage = await toDataUrl(companyDetails?.data?.sigUrl);
      setSigImage(sigImage);
    }
  }

  temp_signature_image_ref.current = getSignatureImage;

  async function toDataUrl(url) {
    if (url === "") {
      return "";
    } else {
      try {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function fetchInvoice() {
    if (
      us_fromDate !== undefined &&
      us_fromDate !== "" &&
      us_ToDate !== undefined &&
      us_ToDate !== "" &&
      companyDetails &&
      convertedProformaDocType
    ) {
      if (new Date(us_fromDate) > new Date(us_ToDate)) {
        enqueueSnackbar(`Date incorrect. To Date cannot be before From Date.`, {
          variant: "error",
        });
        dispatch(setLoading(false));
      } else {
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
          .collection(convertedProformaDocType)
          .where(
            "docDate",
            ">=",
            firebase.firestore.Timestamp.fromDate(startDate)
          )
          .where(
            "docDate",
            "<=",
            firebase.firestore.Timestamp.fromDate(endDate)
          )
          .get()
          .then((querySnapshot) => {
            let invoiceArray = [];
            if (querySnapshot?.docs?.length > 0) {
              querySnapshot?.docs.forEach((invoiceDoc) => {
                if (invoiceDoc && invoiceDoc?.data()?.previousProformaDocId) {
                  invoiceArray.push({
                    id: invoiceDoc?.id,
                    previousProformaDocId:
                      invoiceDoc?.data()?.previousProformaDocId || "",
                    data: { ...invoiceDoc?.data() },
                  });
                }
              });
              invoiceArray.sort(dynamicSortDesc("previousProformaDocId"));
              set_us_invoicelist(invoiceArray);
              dispatch(setLoading(false));
            } else {
              set_us_invoicelist([]);
              dispatch(setLoading(false));
            }
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while fetching invoices: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
    } else {
      dispatch(setLoading(false));
    }
  }

  temp_fetch_invoice_ref.current = fetchInvoice;

  return (
    <>
      <Page title="Payment/Expense">
        <Container maxWidth={themeStretch ? false : "xl"}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Stack spacing={3} direction="row" alignItems={"center"}>
                <Button
                  startIcon={<KeyboardBackspaceIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(PATH_DASHBOARD.general.app1)}
                >
                  Back
                </Button>
                <Typography variant="h3">Converted proforma section</Typography>
              </Stack>
            </Grid>

            <Suspense fallback={<></>}>
              <CompanyClientSelection type={"convertedProforma"} />
            </Suspense>
            <br />
            <br />

            {companyDetails && convertedProformaDocType ? (
              <>
                <Grid item xs={12} md={12}>
                  <Stack spacing={3}>
                    <hr />
                    <Typography>
                      Please choose any invoices and insert an expense amount
                    </Typography>

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
                  </Stack>
                </Grid>

                <Grid item xs={12} md={12}>
                  <TableContainer>
                    <Table border={1}>
                      <TableHead>
                        <TableRow>
                          <TableCell size="small">Proforma number</TableCell>

                          <TableCell size="small">
                            {`${
                              documents?.find(
                                (doc) => doc.id === convertedProformaDocType
                              )?.title
                            } number`}
                          </TableCell>

                          <TableCell size="small">View/Download</TableCell>

                          <TableCell size="small">
                            Date time converted
                          </TableCell>
                          <TableCell size="small">User</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {us_invoicelist &&
                          us_invoicelist?.length > 0 &&
                          us_invoicelist?.map((invoice, index) => (
                            <TableRow key={index}>
                              <TableCell size="small">
                                {invoice?.data?.previousProformaDocId || ""}
                              </TableCell>

                              <TableCell size="small">
                                {invoice?.data?.docString || ""}
                              </TableCell>

                              <TableCell size="small">
                                <Stack
                                  direction={"row"}
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  spacing={2}
                                >
                                  <IconButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      handleViewDownload(
                                        companyDetails,
                                        clientList?.find(
                                          (client) =>
                                            client?.id ===
                                            invoice?.data?.clientId
                                        ),
                                        invoice,
                                        logo,
                                        sigImage,
                                        "view"
                                      )
                                    }
                                  >
                                    <Iconify icon={"carbon:view"} />
                                  </IconButton>

                                  <IconButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      handleViewDownload(
                                        companyDetails,
                                        clientList?.find(
                                          (client) =>
                                            client?.id ===
                                            invoice?.data?.clientId
                                        ),
                                        invoice,
                                        logo,
                                        sigImage,
                                        "download"
                                      )
                                    }
                                  >
                                    <Iconify icon={"eva:download-fill"} />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                              <TableCell size="small">
                                {(invoice?.data?.convertedByUserTime &&
                                  moment(
                                    invoice?.data?.convertedByUserTime.toDate()
                                  ).format("DD-MM-YYYY HH:mm:ss")) ||
                                  ""}
                              </TableCell>
                              <TableCell size="small">
                                {invoice?.data?.convertedByUserEmail || ""}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Container>
      </Page>
    </>
  );
}
