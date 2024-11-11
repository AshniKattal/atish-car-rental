import {
  Button,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Page from "../../../components/Page";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import useSettings from "../../../hooks/useSettings";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { PATH_DASHBOARD } from "../../../routes/paths";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { selectDocument } from "../../../features/documentSlice";
import { setLoading } from "../../../features/globalSlice";
import db from "../../../firebase";
import moment from "moment";

const CompanyClientSelection = lazy(() =>
  import("../../../components/selection-component/CompanyClientSelection")
);

export default function MRAUnfiscalisedDocumentIndex() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { companyDetails } = useSelector(selectDocument);

  const temp_initUnfiscalisedDocList_ref = useRef();

  const [errorDocuments, set_errorDocuments] = useState([]);

  useEffect(() => {
    if (companyDetails?.id) {
      temp_initUnfiscalisedDocList_ref.current();
    }
  }, [companyDetails]);

  const initUnfiscalisedDocList = async () => {
    dispatch(setLoading(true));

    const documentTypes = [
      "vat_invoice",
      "purchase_order",
      "proforma",
      "credit_note",
      "debit_note",
    ];

    const promisesError = [];
    documentTypes.forEach(async (documentType) => {
      promisesError.push(
        new Promise(async (resolve) => {
          await db
            .collection("company")
            .doc(companyDetails?.id)
            .collection(documentType)
            .where("mraCompliantStatus", "==", "error")
            .get()
            .then((result) => {
              let arr = [];
              if (result?.docs?.length > 0) {
                result?.docs.forEach((doc) => {
                  arr.push({
                    id: doc?.id,
                    documentType: documentType,
                    data: { ...doc?.data() },
                  });

                  resolve(arr);
                });
              } else {
                resolve(arr);
              }
            });
        })
      );
    });

    Promise.all(promisesError).then((allDocs) => {
      let allErrorDocs = [];
      if (allDocs?.length > 0) {
        allDocs.forEach((errorDocArray) => {
          if (errorDocArray?.length > 0) {
            errorDocArray.forEach((doc) => {
              allErrorDocs.push({ ...doc });
            });
          }
        });
      }

      set_errorDocuments(allErrorDocs);
      dispatch(setLoading(false));
    });
  };

  temp_initUnfiscalisedDocList_ref.current = initUnfiscalisedDocList;

  return (
    <>
      <Page title="Document">
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
                <Typography variant="h4">
                  Unfiscalised MRA documents section
                </Typography>
              </Stack>
            </Grid>

            <Suspense fallback={<></>}>
              <CompanyClientSelection type={"unfiscalised"} />
            </Suspense>

            <Grid
              item
              xs={12}
              md={12}
              style={{
                display:
                  companyDetails &&
                  companyDetails?.id &&
                  errorDocuments &&
                  errorDocuments?.length > 0
                    ? ""
                    : "none",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" size="small">
                        Document Type
                      </TableCell>
                      <TableCell align="center" size="small">
                        Document Number
                      </TableCell>
                      <TableCell align="center" size="small">
                        Status
                      </TableCell>
                      <TableCell align="center" size="small">
                        Message
                      </TableCell>
                      <TableCell align="center" size="small">
                        Last time updated
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errorDocuments &&
                      errorDocuments?.length > 0 &&
                      errorDocuments?.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" size="small">
                            {doc?.documentType || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {doc?.data?.docString || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {doc?.data?.mraCompliantStatus || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {doc?.data?.mraCompliantMessage || ""}
                          </TableCell>
                          <TableCell align="center" size="small">
                            {(doc?.data?.mraCompliantDateTime &&
                              moment(
                                doc?.data?.mraCompliantDateTime.toDate()
                              ).format("DD-MM-YYYY HH:mm:ss")) ||
                              ""}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </>
  );
}
