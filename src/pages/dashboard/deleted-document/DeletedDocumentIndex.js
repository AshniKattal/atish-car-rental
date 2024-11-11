import { lazy, Suspense, useEffect, useRef, useState } from "react";
// @mui
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
  Typography,
} from "@mui/material";
// hooks
// import useAuth from "../../hooks/useAuth";
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { PATH_DASHBOARD } from "../../../routes/paths";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { selectDocument } from "../../../features/documentSlice";
import { useSnackbar } from "notistack";
import { setLoading } from "../../../features/globalSlice";
import db from "../../../firebase";
// import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import moment from "moment";
import Iconify from "../../../components/Iconify";
import CurrencyFormat from "react-currency-format";
import { handleViewDownload } from "../../../components/core-functions/SelectionCoreFunctions";

const CompanyClientSelection = lazy(() =>
  import("../../../components/selection-component/CompanyClientSelection")
);

// ----------------------------------------------------------------------

export default function DeletedDocumentIndex() {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { themeStretch } = useSettings();

  const { documents, companyDetails, deletedDocType, clientList } =
    useSelector(selectDocument);

  const temp_fetch_invoice_ref = useRef();

  const [deletedDocuments, set_deletedDocuments] = useState([]);

  const [logo, setLogo] = useState("");

  const [sigImage, setSigImage] = useState("");

  const temp_logo_image_ref = useRef();

  const temp_signature_image_ref = useRef();

  useEffect(() => {
    // convert logo image to adaptable react-pdf image
    temp_logo_image_ref.current();
    // convert signature image to adaptable react-pdf image
    temp_signature_image_ref.current();
  }, [companyDetails]);

  useEffect(() => {
    temp_fetch_invoice_ref.current();
  }, [companyDetails, deletedDocType]);

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
    if (companyDetails && deletedDocType) {
      dispatch(setLoading(true));

      // format collection name
      let deletedCollectionName = `deleted${deletedDocType}`;

      await db
        .collection("company")
        .doc(companyDetails?.id)
        .collection(deletedCollectionName)
        .orderBy("docDate", "desc")
        .get()
        .then(async (querySnapshot) => {
          if (querySnapshot?.docs?.length > 0) {
            let arr = [];
            querySnapshot?.docs.forEach((doc) => {
              arr.push({
                id: doc?.id,
                data: { ...doc?.data() },
              });
            });
            set_deletedDocuments(arr);
            dispatch(setLoading(false));
          } else {
            enqueueSnackbar(`No deleted documents found`, {
              variant: "error",
            });
            set_deletedDocuments([]);
            dispatch(setLoading(false));
          }
        })
        .catch((err) => {
          set_deletedDocuments([]);
          enqueueSnackbar(
            `Error occured while fetching ${deletedDocType}: ${err?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    }
  }

  temp_fetch_invoice_ref.current = fetchInvoice;

  /*   const restoreDocument = async (documentId) => {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection(deletedDocType)
      .doc(documentId)
      .set({ deleted: false }, { merge: true })
      .then(() => {
        enqueueSnackbar("Document restored successfully", {
          variant: "success",
        });
        fetchInvoice();
        dispatch(setLoading(false));
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while restoring document: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  };

  async function rebuilddeleted() {
    dispatch(setLoading(true));

    await db
      .collection("company")
      .doc(companyDetails?.id)
      .collection(deletedDocType)
      .where("deleted", "==", true)
      .get()
      .then((result) => {
        if (result && result?.docs && result?.docs?.length > 0) {
          const promises = [];

          result?.docs.forEach(async (doc) => {
            promises.push(
              new Promise(async (resolve) => {
                // format collection name
                let deletedCollectionName = `deleted${deletedDocType}`;

                await db
                  .collection("company")
                  .doc(companyDetails?.id)
                  .collection(deletedCollectionName)
                  .add({
                    id: doc?.id,
                    ...doc?.data(),
                  })
                  .then(async () => {
                    await db
                      .collection("company")
                      .doc(companyDetails?.id)
                      .collection(deletedDocType)
                      .doc(doc?.id)
                      .delete()
                      .then(() => {
                        resolve(true);
                      });
                  });
              })
            );
          });

          Promise.all(promises).then(() => {
            enqueueSnackbar("Done");
            dispatch(setLoading(false));
          });
        } else {
          enqueueSnackbar("Done");
          dispatch(setLoading(false));
        }
      });
  } */

  return (
    <Page title="Deleted document">
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
              <Typography variant="h3">{`Deleted document section`}</Typography>
            </Stack>
          </Grid>

          <Suspense fallback={<></>}>
            <CompanyClientSelection type={"deletedDocument"} />
          </Suspense>

          {/*   <Button onClick={() => rebuilddeleted()}>
            rebuild deleted database
          </Button> */}

          {deletedDocuments && deletedDocuments?.length > 0 ? (
            <Grid item xs={12} md={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/*  <TableCell size="small" align="center">
                        Restore
                      </TableCell> */}
                      <TableCell
                        size="small"
                        align="center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Date time created
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Client
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {`${
                          documents &&
                          documents?.length > 0 &&
                          documents.find(
                            (document) => document.id === deletedDocType
                          )?.title
                        } number`}
                      </TableCell>
                      <TableCell
                        size="small"
                        align="center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        View/download
                      </TableCell>

                      {deletedDocType !== "invoice" ? (
                        <>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Vat amount
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Subtotal amount
                          </TableCell>
                        </>
                      ) : (
                        <></>
                      )}

                      <TableCell
                        size="small"
                        align="center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Total amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deletedDocuments?.map((doc) => (
                      <TableRow>
                        {/* <TableCell size="small" align="center">
                          <IconButton onClick={() => restoreDocument(doc?.id)}>
                            <SettingsBackupRestoreIcon color="success" />
                          </IconButton>
                        </TableCell> */}
                        <TableCell
                          align="center"
                          size="small"
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {moment(doc?.data?.docDate.toDate()).format(
                            "DD-MM-YYYY, HH:MM:ss"
                          )}
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {clientList &&
                            clientList?.length > 0 &&
                            clientList?.find(
                              (client) => client.id === doc?.data?.clientId
                            )?.name}
                        </TableCell>
                        <TableCell
                          align="center"
                          size="small"
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >{`${doc?.data?.docString}`}</TableCell>
                        <TableCell
                          align="center"
                          size="small"
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
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
                                  {
                                    data:
                                      clientList &&
                                      clientList?.length > 0 &&
                                      clientList?.find(
                                        (client) =>
                                          client.id === doc?.data?.clientId
                                      )
                                        ? {
                                            ...clientList?.find(
                                              (client) =>
                                                client.id ===
                                                doc?.data?.clientId
                                            )?.data,
                                          }
                                        : null,
                                  },
                                  doc,
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
                                  {
                                    data:
                                      clientList &&
                                      clientList?.length > 0 &&
                                      clientList?.find(
                                        (client) =>
                                          client.id === doc?.data?.clientId
                                      )
                                        ? {
                                            ...clientList?.find(
                                              (client) =>
                                                client.id ===
                                                doc?.data?.clientId
                                            )?.data,
                                          }
                                        : null,
                                  },
                                  doc,
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

                        {deletedDocType !== "invoice" ? (
                          <>
                            <TableCell
                              size="small"
                              align="center"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <CurrencyFormat
                                value={Number(
                                  doc?.data?.docVatFee || 0
                                ).toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </TableCell>
                            <TableCell
                              size="small"
                              align="center"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              <CurrencyFormat
                                value={Number(
                                  doc?.data?.docSubTotal || 0
                                ).toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </TableCell>
                          </>
                        ) : (
                          <></>
                        )}

                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <CurrencyFormat
                            value={Number(doc?.data?.docTotal || 0).toFixed(2)}
                            displayType={"text"}
                            thousandSeparator={true}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
