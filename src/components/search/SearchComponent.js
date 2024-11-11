import {
  Autocomplete,
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/globalSlice";
import {
  selectDocument,
  setUpdateDocumentData,
} from "../../features/documentSlice";
import db from "src/firebase";
import { selectCompanyList } from "../../features/companySlice";
import moment from "moment";
import { useSnackbar } from "notistack";
import Iconify from "../Iconify";
import InvPdf from "../invoice-pdf/InvPdf";
import { pdf } from "@react-pdf/renderer";
import EditIcon from "@mui/icons-material/Edit";
import useAuth from "../../hooks/useAuth";
import DocumentInputDetails from "../document/DocumentInputDetails";
import CurrencyFormat from "react-currency-format";
import InvPdfCustom1 from "../invoice-pdf/InvPdfCustom1";
import { dynamicSortDesc } from "../core-functions/SelectionCoreFunctions";

export default function SearchComponent() {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { documents } = useSelector(selectDocument);

  const { companyList } = useSelector(selectCompanyList);

  const [companyDetails, set_companyDetails] = useState(null);

  const [documentSelected, setDocumentSelected] = useState(null);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [clientList, setClientList] = useState([]);

  const [openSearchListDialog, set_openSearchListDialog] = useState(false);

  const [searchInput, set_searchInput] = useState("");

  const [documentRetrieved, set_documentRetrieved] = useState([]);

  function onHandleCloseDialog() {
    set_openSearchListDialog(false);
  }

  const handleSelectChange = async (e, value, reason) => {
    e.preventDefault();
    if (reason !== "removeOption" && reason !== "clear" && value) {
      set_companyDetails(value);

      // retrieve all clients associated with the selected company
      await initializeClientList(value.id);
    } else if (reason === "removeOption" || reason === "clear") {
      set_companyDetails(null);
    }
  };

  const handleSelectDocumentChange = async (e, value, reason) => {
    e.preventDefault();
    if (reason !== "removeOption" && reason !== "clear" && value) {
      setDocumentSelected(value);
    } else if (reason === "removeOption" || reason === "clear") {
      setDocumentSelected(null);
    }
  };

  async function initializeClientList(companyId) {
    dispatch(setLoading(true));
    await db
      .collection("company")
      .doc(companyId)
      .collection("client")
      .orderBy("name", "asc")
      .get()
      .then((queryDocs) => {
        if (queryDocs?.docs?.length > 0) {
          let arr = [];
          queryDocs?.docs.forEach((doc) => {
            arr.push({
              id: doc?.id,
              name: doc?.data()?.name,
              data: { ...doc?.data() },
            });
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
          `Error occured while fetching clients: ${err?.message}`
        );
        dispatch(setLoading(false));
      });
  }

  async function search() {
    if (searchInput) {
      dispatch(setLoading(true));
      const searchInputSplit = searchInput.split(" ");
      if (searchInputSplit && searchInputSplit?.length > 0) {
        const promises = [];

        if (documentSelected) {
          promises.push(
            new Promise(async (resolve) => {
              await db
                .collection("company")
                .doc(companyDetails?.id)
                .collection(documentSelected?.id)
                .where("keywords", "array-contains-any", searchInputSplit)
                .limit(25)
                .get()
                .then((result) => {
                  if (result?.docs && result?.docs?.length > 0) {
                    let arr = [];
                    result?.docs.forEach((doc) => {
                      arr.push({
                        id: doc?.id,
                        documentType: document,
                        documentNumber: doc?.data()?.docString,
                        data: { ...doc?.data() },
                      });
                    });

                    arr.sort(dynamicSortDesc("documentNumber"));

                    resolve(arr);
                  } else {
                    resolve([]);
                  }
                });
            })
          );
        } else {
          documents.forEach((document) => {
            promises.push(
              new Promise(async (resolve) => {
                await db
                  .collection("company")
                  .doc(companyDetails?.id)
                  .collection(document?.id)
                  .where("keywords", "array-contains-any", searchInputSplit)
                  .limit(25)
                  .get()
                  .then((result) => {
                    if (result?.docs && result?.docs?.length > 0) {
                      let arr = [];
                      result?.docs.forEach((doc) => {
                        arr.push({
                          id: doc?.id,
                          documentType: document,
                          documentNumber: doc?.data()?.docString,
                          data: { ...doc?.data() },
                        });
                      });

                      arr.sort(dynamicSortDesc("documentNumber"));

                      resolve(arr);
                    } else {
                      resolve([]);
                    }
                  });
              })
            );
          });
        }

        Promise.all(promises).then((allDocuments) => {
          let allDocumentsData = [];
          if (allDocuments && allDocuments?.length > 0) {
            allDocuments.forEach((documents) => {
              if (documents && documents?.length > 0) {
                documents.forEach((doc) => {
                  allDocumentsData.push({ ...doc });
                });
              }
            });
          }

          if (allDocumentsData?.length === 0) {
            enqueueSnackbar("No document found", { variant: "warning" });
          }
          set_documentRetrieved(allDocumentsData);

          dispatch(setLoading(false));
        });
      }
    }
  }

  /*  async function rebuildDoc() {
    dispatch(setLoading(true));

    const promises = [];
    documents.forEach((document) => {
      promises.push(
        new Promise(async (resolve) => {
          await db
            .collection("company")
            .doc(companyDetails?.id)
            .collection(document?.id)
            .get()
            .then((result) => {
              if (result?.docs && result?.docs?.length > 0) {
                let arr = [];
                result?.docs.forEach((doc) => {
                  if (doc.id !== "documentIndex") {
                    arr.push({
                      id: doc?.id,
                      data: { ...doc?.data() },
                      documentId: document?.id,
                    });
                  }
                });
                resolve(arr);
              } else {
                resolve(null);
              }
            });
        })
      );
    });

    Promise.all(promises).then(async (allResult) => {
      //

      const promises = [];
      allResult.forEach(async (result) => {
        promises.push(
          new Promise(async (resolve) => {
            if (result && result?.length > 0) {
              result.forEach(async (doc) => {
                let allParticularsDescription = "";
                if (
                  doc?.data?.docParticulars &&
                  doc?.data?.docParticulars?.length > 0
                ) {
                  doc?.data?.docParticulars.forEach((docParticular) => {
                    allParticularsDescription =
                      allParticularsDescription +
                      (docParticular?.rowDescription || "");
                  });
                }

                let keywords = [];
                if (allParticularsDescription) {
                  const particularSplit = allParticularsDescription.split(" ");
                  let newParticularSplit = [];

                  particularSplit.forEach((particular) => {
                    newParticularSplit.push(particular.toLowerCase());
                  });

                  keywords = [...newParticularSplit];
                }

                if (doc?.data?.docBillTo) {
                  const docBillToSplit = doc?.data?.docBillTo.split(" ");

                  let newDocBillToSplit = [];

                  docBillToSplit.forEach((docBill) => {
                    newDocBillToSplit.push(docBill.toLowerCase());
                  });

                  keywords = [...keywords, ...newDocBillToSplit];
                }

                keywords = [...new Set(keywords)];

                await db
                  .collection("company")
                  .doc(companyDetails?.id)
                  .collection(doc.documentId)
                  .doc(doc.id)
                  .set(
                    {
                      keywords: keywords,
                    },
                    { merge: true }
                  )
                  .then(() => {
                    resolve(true);
                  })
                  .catch(() => {
                    resolve(true);
                  });
              });
            } else resolve(true);
          })
        );
      });

      Promise.all(promises).then(async () => {
        dispatch(setLoading(false));
      });
    });
  } */

  const handleCloseUpdateDialog = (isUpdateDone) => {
    dispatch(setUpdateDocumentData(undefined));
    setOpenUpdateDialog(false);

    if (isUpdateDone) {
      search();
    }
  };

  const handleViewDownload = async (content, type) => {
    try {
      let logoImage = await toDataUrl(companyDetails?.data?.imageUrl);
      let sigImage = await toDataUrl(companyDetails?.data?.sigUrl);

      const doc =
        process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE &&
        companyDetails?.id &&
        process.env.REACT_APP_CUSTOM_REQUIREMENT_WORLDLINK_EXAMPLE.includes(
          companyDetails?.id
        ) ? (
          <InvPdfCustom1
            companyChosenObj={content.companyChosenObj}
            clientChosenObj={content.clientChosenObj}
            invDetails={content.invDetails}
            logo={logoImage || ""}
            sigImage={sigImage || ""}
          />
        ) : (
          <InvPdf
            companyChosenObj={content.companyChosenObj}
            clientChosenObj={content.clientChosenObj}
            invDetails={content.invDetails}
            logo={logoImage || ""}
            sigImage={sigImage || ""}
          />
        );

      const blobPdf = pdf(doc);
      blobPdf.updateContainer(doc);
      const result = await blobPdf.toBlob();

      console.log(result);

      if (result) {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(result);

        if (type === "download") {
          link.download = `${content?.invDetails?.docTitle}_${content?.invDetails?.invoiceString}_Bill_to_${content?.clientChosenObj?.data?.name}.pdf`;
          link.click();
        } else if (type === "view") {
          window.open(link.href, "_blank");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error generating PDF");
    }
  };

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

  return (
    <>
      <Button
        startIcon={<SearchIcon />}
        variant="outlined"
        color="primary"
        onClick={() => set_openSearchListDialog(true)}
      >
        Search document
      </Button>

      <Dialog
        open={openSearchListDialog}
        onClose={() => onHandleCloseDialog()}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Search document</DialogTitle>
        <DialogContent style={{ minHeight: "70vh" }}>
          <hr />
          <br />
          <Stack spacing={3}>
            <Autocomplete
              ListboxProps={{ style: { maxHeight: "70vh" } }}
              size="small"
              label="Please choose a company"
              id="company-drop-down"
              options={companyList}
              value={companyDetails || null}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Please choose a company"
                  InputLabelProps={{ required: true }}
                />
              )}
              required
              onChange={(e, value, reason) =>
                handleSelectChange(e, value, reason)
              }
              getOptionLabel={(option) => option.name}
            />

            <Autocomplete
              ListboxProps={{ style: { maxHeight: "70vh" } }}
              size="small"
              label="Select type of document"
              id="document-drop-down"
              options={documents}
              value={documentSelected || null}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select type of document"
                  InputLabelProps={{ required: false }}
                />
              )}
              onChange={(e, value, reason) =>
                handleSelectDocumentChange(e, value, reason)
              }
              getOptionLabel={(option) => option?.title || ""}
            />

            <Stack spacing={3} direction={"row"} alignItems={"center"}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="searchInput"
                label="Search"
                type="text"
                id="searchInput"
                size="small"
                value={searchInput || ""}
                onChange={(event) => {
                  set_searchInput(event.target.value);
                }}
                disabled={!companyDetails}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    if (!searchInput) {
                      enqueueSnackbar("Wrong search input", {
                        variant: "error",
                      });
                    } else {
                      search();
                    }
                  }
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={() => search()}
                disabled={!companyDetails || !searchInput}
              >
                search
              </Button>
            </Stack>

            {documentRetrieved && documentRetrieved?.length > 0 ? (
              <>
                <TableContainer>
                  <Table border={1}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" size="small">
                          View/download
                        </TableCell>
                        <TableCell align="center" size="small">
                          Update
                        </TableCell>
                        <TableCell align="center" size="small">
                          Customer
                        </TableCell>
                        <TableCell align="center" size="small">
                          Document
                        </TableCell>
                        <TableCell align="center" size="small">
                          Number
                        </TableCell>
                        <TableCell align="center" size="small">
                          Date
                        </TableCell>
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
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Total amount
                        </TableCell>
                        <TableCell
                          size="small"
                          align="center"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Proforma Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documentRetrieved?.map((document) => (
                        <TableRow>
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
                                    {
                                      companyChosenObj: {
                                        id:
                                          companyDetails?.id &&
                                          companyDetails?.id !== ""
                                            ? companyDetails?.id
                                            : "",
                                        data: {
                                          ...companyDetails?.data,
                                        },
                                      },
                                      clientChosenObj: {
                                        data: {
                                          ...(clientList?.find(
                                            (client) =>
                                              client?.id ===
                                              document?.data?.clientId
                                          )?.data || {}),
                                        },
                                      },
                                      invDetails: {
                                        docTitle:
                                          document?.data?.docTitle || "",
                                        docType: document?.data?.docType || "",
                                        docQuoteNumber:
                                          document?.data?.docQuoteNumber || "",
                                        docPurchaseOrderNumber:
                                          document?.data
                                            ?.docPurchaseOrderNumber || "",
                                        docBillTo:
                                          document?.data?.docBillTo || "",
                                        docShipTo:
                                          document?.data?.docShipTo || "",
                                        docTermsAndCondition:
                                          document?.data
                                            ?.docTermsAndCondition || "",
                                        invDate:
                                          moment(
                                            document?.data?.docDate.toDate()
                                          ).format("DD-MM-YYYY") || "",
                                        invParticulars:
                                          document?.data?.docParticulars || [],
                                        invTotal: document?.data?.docTotal || 0,
                                        invoiceString:
                                          document?.data?.docString || "",
                                        invVatFee:
                                          document?.data?.docVatFee || 0,
                                        invSubTotal:
                                          document?.data?.docSubTotal || 0,
                                        paymentStatus:
                                          document?.data?.paymentStatus || "",

                                        docBLNumber:
                                          document?.data?.docBLNumber || "",
                                        docSupplier:
                                          document?.data?.docSupplier || "",
                                        docContainerNumber:
                                          document?.data?.docContainerNumber ||
                                          "",
                                        docPackages:
                                          document?.data?.docPackages || "",
                                        docDescription:
                                          document?.data?.docDescription || "",
                                        docGrossWeight:
                                          document?.data?.docGrossWeight || "",
                                        docVolume:
                                          document?.data?.docVolume || "",
                                        docPortOfLoading:
                                          document?.data?.docPortOfLoading ||
                                          "",
                                        docETA: document?.data?.docETA || "",
                                        docVesselName:
                                          document?.data?.docVesselName || "",
                                        docRoE: document?.data?.docRoE || "",
                                        docPlaceOfLanding:
                                          document?.data?.docPlaceOfLanding ||
                                          "",

                                        // flexitrans customs
                                        docShipper:
                                          document?.data?.docShipper || "",
                                        docMarkNos:
                                          document?.data?.docMarkNos || "",
                                        docCommodity:
                                          document?.data?.docCommodity || "",
                                        docHbl: document?.data?.docHbl || "",
                                        docDepot:
                                          document?.data?.docDepot || "",
                                      },
                                      /*  logo: logo || "",
                                      sigImage: sigImage || "", */
                                    },
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
                                    {
                                      companyChosenObj: {
                                        id:
                                          companyDetails?.id &&
                                          companyDetails?.id !== ""
                                            ? companyDetails?.id
                                            : "",
                                        data: {
                                          ...companyDetails?.data,
                                        },
                                      },
                                      clientChosenObj: {
                                        data: {
                                          ...(clientList?.find(
                                            (client) =>
                                              client?.id ===
                                              document?.data?.clientId
                                          )?.data || {}),
                                        },
                                      },
                                      invDetails: {
                                        docTitle:
                                          document?.data?.docTitle || "",
                                        docType: document?.data?.docType || "",
                                        docQuoteNumber:
                                          document?.data?.docQuoteNumber || "",
                                        docPurchaseOrderNumber:
                                          document?.data
                                            ?.docPurchaseOrderNumber || "",
                                        docBillTo:
                                          document?.data?.docBillTo || "",
                                        docShipTo:
                                          document?.data?.docShipTo || "",
                                        docTermsAndCondition:
                                          document?.data
                                            ?.docTermsAndCondition || "",
                                        invDate:
                                          moment(
                                            document?.data?.docDate.toDate()
                                          ).format("DD-MM-YYYY") || "",
                                        invParticulars:
                                          document?.data?.docParticulars || [],
                                        invTotal: document?.data?.docTotal || 0,
                                        invoiceString:
                                          document?.data?.docString || "",
                                        invVatFee:
                                          document?.data?.docVatFee || 0,
                                        invSubTotal:
                                          document?.data?.docSubTotal || 0,
                                        paymentStatus:
                                          document?.data?.paymentStatus || "",

                                        docBLNumber:
                                          document?.data?.docBLNumber || "",
                                        docSupplier:
                                          document?.data?.docSupplier || "",
                                        docContainerNumber:
                                          document?.data?.docContainerNumber ||
                                          "",
                                        docPackages:
                                          document?.data?.docPackages || "",
                                        docDescription:
                                          document?.data?.docDescription || "",
                                        docGrossWeight:
                                          document?.data?.docGrossWeight || "",
                                        docVolume:
                                          document?.data?.docVolume || "",
                                        docPortOfLoading:
                                          document?.data?.docPortOfLoading ||
                                          "",
                                        docETA: document?.data?.docETA || "",
                                        docVesselName:
                                          document?.data?.docVesselName || "",
                                        docRoE: document?.data?.docRoE || "",
                                        docPlaceOfLanding:
                                          document?.data?.docPlaceOfLanding ||
                                          "",

                                        // flexitrans customs
                                        docShipper:
                                          document?.data?.docShipper || "",
                                        docMarkNos:
                                          document?.data?.docMarkNos || "",
                                        docCommodity:
                                          document?.data?.docCommodity || "",
                                        docHbl: document?.data?.docHbl || "",
                                        docDepot:
                                          document?.data?.docDepot || "",
                                      },
                                      /*  logo: logo || "",
                                      sigImage: sigImage || "", */
                                    },
                                    "download"
                                  )
                                }
                              >
                                <Iconify icon={"eva:download-fill"} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                          <TableCell
                            align="center"
                            size="small"
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                dispatch(
                                  setUpdateDocumentData({
                                    ...document,
                                    documentTypeId: document?.data?.docType,
                                    documentTypeTitle: document?.data?.docTitle,
                                    keywords: document?.data?.keywords || [],
                                  })
                                );
                                setOpenUpdateDialog(true);
                              }}
                              disabled={
                                !user?.permissions[
                                  documents.find(
                                    (doc) => doc.id === document?.data?.docType
                                  )
                                ]?.assignedCompanyId?.includes(
                                  companyDetails?.id
                                ) ||
                                (document?.data &&
                                  document?.data?.isProformaConverted &&
                                  document?.data?.docType === "proforma")
                              }
                            >
                              <EditIcon color="primary" />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            align="center"
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {document?.data?.clientId
                              ? clientList?.find(
                                  (client) =>
                                    client?.id === document?.data?.clientId
                                )?.name
                              : ""}
                          </TableCell>
                          <TableCell
                            align="center"
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {document?.data?.docTitle || ""}
                          </TableCell>
                          <TableCell
                            align="center"
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {document?.data?.docString || ""}
                          </TableCell>
                          <TableCell
                            align="center"
                            size="small"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {document?.data?.docDate
                              ? moment(document?.data?.docDate.toDate()).format(
                                  "DD-MM-YYYY"
                                )
                              : ""}
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {document?.data?.docType === "invoice" ? (
                              "Not applicable"
                            ) : (
                              <CurrencyFormat
                                value={Number(
                                  document?.data?.docVatFee || 0
                                ).toFixed(2)}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            )}
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <CurrencyFormat
                              value={Number(
                                document?.data?.docSubTotal || 0
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
                                document?.data?.docTotal || 0
                              ).toFixed(2)}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </TableCell>
                          <TableCell
                            size="small"
                            align="center"
                            style={{
                              whiteSpace: "nowrap",
                              background:
                                document?.data &&
                                document?.data?.isProformaConverted
                                  ? "#FEFEBE"
                                  : "transparent",
                            }}
                          >
                            {document?.data?.docType &&
                            document?.data?.docType === "proforma" &&
                            document?.data?.isProformaConverted
                              ? `Converted to ${document?.data?.conversionDocTitle}`
                              : document?.data?.docType &&
                                document?.data?.docType === "proforma"
                              ? "Still Proforma"
                              : "Not applicable"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <></>
            )}

            {/*   <Button
              startIcon={<SearchIcon />}
              variant="contained"
              color="primary"
              onClick={() => rebuildDoc()}
            >
              rebuild document
            </Button> */}
          </Stack>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>

      {openUpdateDialog ? (
        <Dialog
          open={openUpdateDialog}
          onClose={() => handleCloseUpdateDialog(false)}
          maxWidth={"lg"}
          fullWidth
        >
          <DialogTitle>Update invoice</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <DocumentInputDetails
                action={"update"}
                handleCloseUpdateDialog={handleCloseUpdateDialog}
              />
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleCloseUpdateDialog(false)}
            >
              close
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
}
