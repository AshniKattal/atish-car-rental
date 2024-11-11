import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import { setLoading } from "src/features/globalSlice";
import firebase from "firebase/compat";
import db, { storage } from "src/firebase";
import moment from "moment";
import useAuth from "src/hooks/useAuth";
import { formatDocumentIdNumber } from "src/components/core-functions/SelectionCoreFunctions";
import { DatePicker } from "@mui/lab";

const ContractAgreementForm = lazy(() => import("./ContractAgreementForm"));
const SurveyServiceReportForm = lazy(() => import("./SurveyServiceReportForm"));

export default function CreateOrUpdateClientSurveyDialog({
  dialogType,
  openDialog,
  handleCloseDialog,
  surveyDetail,
  setSurveyDetail,
  fetchClientSurvey,
  companyId,
  documentType,
  clientList,
  logo,
  companyDetails,
}) {
  const { user } = useAuth();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [clientDocumentObjectSelected, setClientDocumentObjectSelected] =
    useState(null);

  const [confirmationToCancelDialog, setConfirmationToCancelDialog] =
    useState(false);

  const [sigCanvasInstance, setSigCanvasInstance] = useState(null); // State to hold the SignatureCanvas instance

  const [sigClientCanvasInstance, setSigClientCanvasInstance] = useState(null); // State to hold the SignatureCanvas instance

  const [isCanvasReady, setIsCanvasReady] = useState(false); // Ensure canvas is ready

  const [isCanvasClientReady, setIsCanvasClientReady] = useState(false); // Ensure canvas is ready

  const temp_CanvasSigRef = useRef();
  const temp_CanvasSigClientRef = useRef();

  useEffect(() => {
    temp_CanvasSigRef.current();
  }, [dialogType, sigCanvasInstance]);

  useEffect(() => {
    temp_CanvasSigClientRef.current();
  }, [dialogType, sigClientCanvasInstance]);

  function canvasSig() {
    // Ensure the canvas ref is populated after the component mounts
    if (sigCanvasInstance && !isCanvasReady && dialogType === "update") {
      if (surveyDetail?.preparedBy) {
        const canvas = sigCanvasInstance.getCanvas();
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = surveyDetail?.preparedBy; // Ensure this image supports CORS
        img.onload = () => {
          /*  ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL();
          // Do something with dataUrl */
          // Calculate the scale to make the image fit the canvas dimensions
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );

          // Calculate the new width and height based on the scale
          const imgWidth = img.width * scale;
          const imgHeight = img.height * scale;

          // Calculate the position to center the image
          const x = canvas.width - imgWidth; /// 2;
          const y = canvas.height - imgHeight; /// 2;

          // Draw the image onto the canvas at the calculated position and size
          ctx.drawImage(img, x, y, imgWidth, imgHeight);

          const dataUrl = canvas.toDataURL();
          // Do something with dataUrl

          sigCanvasInstance.clear();
          sigCanvasInstance.fromDataURL(dataUrl);
          setIsCanvasReady(true);
        };
      }
    }
  }

  temp_CanvasSigRef.current = canvasSig;

  function canvasSigClient() {
    // Ensure the canvas ref is populated after the component mounts
    if (
      sigClientCanvasInstance &&
      !isCanvasClientReady &&
      dialogType === "update"
    ) {
      if (surveyDetail?.clientSig) {
        const canvas = sigClientCanvasInstance.getCanvas();
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = surveyDetail?.clientSig; // Ensure this image supports CORS
        img.onload = () => {
          /*  ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL();
          // Do something with dataUrl */
          // Calculate the scale to make the image fit the canvas dimensions
          const scale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );

          // Calculate the new width and height based on the scale
          const imgWidth = img.width * scale;
          const imgHeight = img.height * scale;

          // Calculate the position to center the image
          const x = canvas.width - imgWidth; /// 2;
          const y = canvas.height - imgHeight; /// 2;

          // Draw the image onto the canvas at the calculated position and size
          ctx.drawImage(img, x, y, imgWidth, imgHeight);

          const dataUrl = canvas.toDataURL();
          // Do something with dataUrl

          sigClientCanvasInstance.clear();
          sigClientCanvasInstance.fromDataURL(dataUrl);
          setIsCanvasClientReady(true);
        };
      }
    }
  }

  temp_CanvasSigClientRef.current = canvasSigClient;

  // Clear the signature pad
  const clearSignature = () => {
    //sigCanvas.current.clear();
    sigCanvasInstance.clear();
  };

  // Clear the signature pad
  const clearSignatureClient = () => {
    //sigCanvasClient.current.clear();
    sigClientCanvasInstance.clear();
  };

  async function addSurvey() {
    dispatch(setLoading(true));

    if (verifyFields()) {
      let dataToAdd = {
        clientId: clientDocumentObjectSelected?.id || "",
        createdByUserId: user?.id || "",
        createdByUserEmail: user?.email || "",
        ...surveyDetail,
      };

      let preparedByURL = sigCanvasInstance
        .getTrimmedCanvas()
        .toDataURL("image/png");
      let clientURL = sigClientCanvasInstance
        .getTrimmedCanvas()
        .toDataURL("image/png");

      // Create a reference to the file in Firebase Storage
      const storageRefPreparedBy = storage
        .ref()
        .child(
          `survey/signatures/${moment(new Date()).format(
            "DD-MM-YYYY"
          )}/${companyId}/${
            surveyDetail?.customerName
          }/signature_prepared_by_${Date.now()}.png`
        );
      const storageRefClient = storage
        .ref()
        .child(
          `survey/signatures/${moment(new Date()).format(
            "DD-MM-YYYY"
          )}/${companyId}/${
            surveyDetail?.customerName
          }/signature_client_${Date.now()}.png`
        );

      // Upload the Base64 dataURL string to Firebase
      storageRefPreparedBy
        .putString(preparedByURL, "data_url")
        .then(() => {
          console.log("Uploaded a prepared by data_url string!");

          // Get the download URL after upload is complete
          storageRefPreparedBy.getDownloadURL().then((downloadURL) => {
            dataToAdd = { ...dataToAdd, preparedBy: downloadURL };

            // Upload the Base64 dataURL string to Firebase
            storageRefClient
              .putString(clientURL, "data_url")
              .then(() => {
                console.log("Uploaded a client by data_url string!");

                // Get the download URL after upload is complete
                storageRefClient
                  .getDownloadURL()
                  .then(async (downloadURLClient) => {
                    dataToAdd = { ...dataToAdd, clientSig: downloadURLClient };

                    let collectionName = documentType?.id;

                    var documentDocRef = db
                      .collection("company")
                      .doc(companyId)
                      .collection(collectionName)
                      .doc("documentIndex");

                    db.runTransaction((transaction) => {
                      return transaction.get(documentDocRef).then((sfDoc) => {
                        if (!sfDoc.exists) {
                          // throw "Document does not exist!";
                          transaction.update(documentDocRef, {
                            documentIndex: 1,
                          });
                          return 1;
                        }

                        var newDocumentNumber =
                          Number(sfDoc.data().documentIndex) + 1;
                        transaction.update(documentDocRef, {
                          documentIndex: newDocumentNumber,
                        });
                        return newDocumentNumber;
                      });
                    })
                      .then(async (documentNumber) => {
                        let documentNumberDocString =
                          await formatDocumentIdNumber(documentNumber);

                        if (documentNumberDocString) {
                          await db
                            .collection("company")
                            .doc(companyId)
                            .collection(collectionName)
                            .doc(documentNumberDocString)
                            .set(
                              {
                                ...dataToAdd,
                                status: "Pending",
                                dateCreated:
                                  firebase.firestore.Timestamp.fromDate(
                                    new Date()
                                  ),
                              },
                              { merge: true }
                            )
                            .then(() => {
                              enqueueSnackbar(
                                `${documentType?.title} recorded successfully`
                              );

                              fetchClientSurvey(companyId, collectionName);
                              handleCloseDialog();
                              dispatch(setLoading(false));
                            })
                            .catch((error) => {
                              enqueueSnackbar(
                                `Error occured while saving ${documentType?.title}: ${error?.message}`,
                                { variant: "error" }
                              );
                              dispatch(setLoading(false));
                            });
                        }
                      })
                      .catch((err) => {
                        enqueueSnackbar(
                          `Error occured while overall Invoice saving transactions: ${err?.message}`,
                          { variant: "error" }
                        );
                        dispatch(setLoading(false));
                      });
                  });
              })
              .catch((error) => {
                //console.error("Error uploading client signature: ", error);
                enqueueSnackbar(
                  `Error occured while uploading signature of client: ${error?.message}`,
                  { variant: "error" }
                );
                dispatch(setLoading(false));
              });
          });
        })
        .catch((error) => {
          //console.error("Error uploading prepared by signature: ", error);
          enqueueSnackbar(
            `Error occured while uploading signature of prepared by: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      enqueueSnackbar(
        "Please check if all required fields have been filled correctly",
        { variant: "error" }
      );
      dispatch(setLoading(false));
    }
  }

  async function updateSurvey() {
    dispatch(setLoading(true));

    if (verifyFields()) {
      let dataToUpdate = {
        clientId: clientDocumentObjectSelected?.id || "",
        updatedByUserId: user?.id || "",
        updatedByUserEmail: user?.email || "",
        ...surveyDetail,
      };

      let preparedByURL = sigCanvasInstance
        .getTrimmedCanvas()
        .toDataURL("image/png");
      let clientURL = sigClientCanvasInstance
        .getTrimmedCanvas()
        .toDataURL("image/png");

      // Create a reference to the file in Firebase Storage
      const storageRefPreparedBy = storage
        .ref()
        .child(
          `survey/signatures/${moment(new Date()).format(
            "DD-MM-YYYY"
          )}/${companyId}/${
            surveyDetail?.customerName
          }/signature_prepared_by_${Date.now()}.png`
        );
      const storageRefClient = storage
        .ref()
        .child(
          `survey/signatures/${moment(new Date()).format(
            "DD-MM-YYYY"
          )}/${companyId}/${
            surveyDetail?.customerName
          }/signature_client_${Date.now()}.png`
        );

      // Upload the Base64 dataURL string to Firebase
      storageRefPreparedBy
        .putString(preparedByURL, "data_url")
        .then(() => {
          console.log("Uploaded a prepared by data_url string!");

          // Get the download URL after upload is complete
          storageRefPreparedBy.getDownloadURL().then((downloadURL) => {
            dataToUpdate = { ...dataToUpdate, preparedBy: downloadURL };

            // Upload the Base64 dataURL string to Firebase
            storageRefClient
              .putString(clientURL, "data_url")
              .then(() => {
                console.log("Uploaded a client by data_url string!");

                // Get the download URL after upload is complete
                storageRefClient
                  .getDownloadURL()
                  .then(async (downloadURLClient) => {
                    dataToUpdate = {
                      ...dataToUpdate,
                      clientSig: downloadURLClient,
                    };

                    let collectionName = documentType?.id;

                    await db
                      .collection("company")
                      .doc(companyId)
                      .collection(collectionName)
                      .doc(surveyDetail?.id)
                      .set(
                        {
                          ...dataToUpdate,
                        },
                        { merge: true }
                      )
                      .then(() => {
                        enqueueSnackbar(
                          `${documentType?.title} updated successfully`
                        );
                        fetchClientSurvey(companyId, collectionName);
                        handleCloseDialog();
                        dispatch(setLoading(false));
                      })
                      .catch((error) => {
                        enqueueSnackbar(
                          `Error occured while updating ${documentType?.title}: ${error?.message}`,
                          { variant: "error" }
                        );
                        dispatch(setLoading(false));
                      });
                  });
              })
              .catch((error) => {
                //console.error("Error uploading client signature: ", error);
                enqueueSnackbar(
                  `Error occured while uploading signature of client: ${error?.message}`,
                  { variant: "error" }
                );
                dispatch(setLoading(false));
              });
          });
        })
        .catch((error) => {
          //console.error("Error uploading prepared by signature: ", error);
          enqueueSnackbar(
            `Error occured while uploading signature of prepared by: ${error?.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      enqueueSnackbar(
        "Please check if all required fields have been filled correctly",
        { variant: "error" }
      );
      dispatch(setLoading(false));
    }
  }

  function verifyFields() {
    if (!surveyDetail?.customerName || !surveyDetail?.address) {
      return false;
    } else return true;
  }

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={openDialog}>
        <DialogTitle>{`${dialogType === "update" ? "Update" : "Add new"} ${
          documentType?.title
        }`}</DialogTitle>
        <DialogContent>
          <Divider
            sx={{
              borderStyle: "dotted",
            }}
          />
          <br />
          {dialogType === "update" ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    ListboxProps={{ style: { maxHeight: "70vh" } }}
                    size="small"
                    label="Update status"
                    id="status-drop-down"
                    options={["Pending", "Confirmed", "Rejected"]}
                    value={surveyDetail?.status || null}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Update status"
                        InputLabelProps={{ required: true }}
                        size="large"
                      />
                    )}
                    required
                    onChange={(e, value, reason) => {
                      e.preventDefault();
                      if (
                        reason !== "removeOption" &&
                        reason !== "clear" &&
                        value
                      ) {
                        setSurveyDetail((previous) => {
                          return {
                            ...previous,
                            status: value,
                          };
                        });
                      } else if (
                        reason === "removeOption" ||
                        reason === "clear"
                      ) {
                        setSurveyDetail((previous) => {
                          return {
                            ...previous,
                            status: null,
                          };
                        });
                      }
                    }}
                    getOptionLabel={(option) => option}
                  />
                </Grid>
              </Grid>

              <br />
              <Divider
                sx={{
                  borderStyle: "dotted",
                }}
              />
              <br />
            </>
          ) : (
            <></>
          )}

          {documentType?.title === "Contract Agreement" ? (
            <Suspense fallback={<></>}>
              <ContractAgreementForm
                clientList={clientList}
                clientDocumentObjectSelected={clientDocumentObjectSelected}
                setClientDocumentObjectSelected={
                  setClientDocumentObjectSelected
                }
                companyId={companyId}
                dialogType={dialogType}
                surveyDetail={surveyDetail}
                setSurveyDetail={setSurveyDetail}
                logo={logo}
                companyDetails={companyDetails}
              />
            </Suspense>
          ) : (
            <Suspense fallback={<></>}>
              <SurveyServiceReportForm
                clientList={clientList}
                clientDocumentObjectSelected={clientDocumentObjectSelected}
                setClientDocumentObjectSelected={
                  setClientDocumentObjectSelected
                }
                setSurveyDetail={setSurveyDetail}
                surveyDetail={surveyDetail}
                dialogType={dialogType}
                documentType={documentType}
              />
            </Suspense>
          )}

          <br />
          <br />
          <Divider
            sx={{
              borderStyle: "dotted",
            }}
          />
          <br />

          <Grid container spacing={3}>
            {documentType?.title === "Contract Agreement" ? (
              <Grid item xs={12} md={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      label="Signature date"
                      value={
                        surveyDetail?.signatureDate?.seconds
                          ? new Date(surveyDetail?.signatureDate.toDate())
                          : surveyDetail?.signatureDate
                          ? surveyDetail?.signatureDate
                          : ""
                      }
                      onChange={(newValue) => {
                        setSurveyDetail((previous) => {
                          return {
                            ...previous,
                            signatureDate: newValue,
                          };
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} size="large" />
                      )}
                      inputFormat="dd/MM/yyyy"
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}

            <Grid item xs={12} md={6}>
              {dialogType === "view" /* || dialogType === "update"  */ ? (
                <Stack spacing={3}>
                  <Typography>
                    {`PREPARED BY: ${surveyDetail?.preparedByName || ""}`}
                  </Typography>

                  <div>
                    <img
                      src={surveyDetail?.preparedBy || ""}
                      alt="signaturePreparedBy"
                    />
                  </div>
                </Stack>
              ) : (
                <Stack spacing={3}>
                  <TextField
                    variant="outlined"
                    name="preparedByName"
                    label="PREPARED BY"
                    id="preparedByName"
                    type="text"
                    value={surveyDetail?.preparedByName || ""}
                    size="large"
                    fullWidth
                    onChange={(event) => {
                      setSurveyDetail((previous) => {
                        return {
                          ...previous,
                          preparedByName: event.target.value,
                        };
                      });
                    }}
                    disabled={dialogType === "view"}
                  />

                  <Typography>PREPARED BY SIGNATURE:</Typography>
                  <Box
                    sx={{
                      border: "2px solid gray",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <SignatureCanvas
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "sigCanvas",
                      }}
                      // ref={sigCanvas}
                      ref={(ref) => {
                        setSigCanvasInstance(ref);
                      }} // Callback ref
                      disabled={dialogType === "view"}
                    />
                    {/*  <SignatureCanvas
                      ref={(ref) => {
                        setSigCanvasInstance(ref);
                      }}
                    /> */}
                  </Box>

                  {/*   {dialogType === "add" ? ( */}
                  <Button
                    variant="outlined"
                    onClick={clearSignature}
                    sx={{ margin: "10px" }}
                    size="large"
                  >
                    Clear signature
                  </Button>
                  {/*  ) : (
                    <></>
                  )} */}
                </Stack>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {dialogType === "view" /*  || dialogType === "update"  */ ? (
                <Stack spacing={3}>
                  <Typography>{`CLIENT: ${
                    surveyDetail?.clientSigName || ""
                  }`}</Typography>
                  <div>
                    <img
                      src={surveyDetail?.clientSig || ""}
                      alt="signaturePreparedBy"
                    />
                  </div>
                </Stack>
              ) : (
                <Stack spacing={3}>
                  <TextField
                    variant="outlined"
                    name="clientSigName"
                    label="CLIENT NAME"
                    id="clientSigName"
                    type="text"
                    value={surveyDetail?.clientSigName || ""}
                    size="large"
                    fullWidth
                    onChange={(event) => {
                      setSurveyDetail((previous) => {
                        return {
                          ...previous,
                          clientSigName: event.target.value,
                        };
                      });
                    }}
                    disabled={dialogType === "view"}
                  />

                  <Typography>CLIENT SIGNATURE:</Typography>

                  <Box
                    sx={{
                      border: "2px solid gray",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <SignatureCanvas
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "sigCanvas",
                      }}
                      /* ref={sigCanvasClient} */
                      ref={(ref) => {
                        setSigClientCanvasInstance(ref);
                      }} // Callback ref
                      disabled={
                        dialogType === "view" /* || dialogType === "update" */
                      }
                    />
                  </Box>

                  {/*   {dialogType === "add" ? ( */}
                  <Button
                    variant="outlined"
                    onClick={clearSignatureClient}
                    sx={{ margin: "10px" }}
                    size="large"
                  >
                    Clear signature
                  </Button>
                  {/* ) : (
                    <></>
                  )} */}
                </Stack>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {dialogType !== "view" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (dialogType === "add") {
                  addSurvey();
                } else if (dialogType === "update") {
                  updateSurvey();
                }
              }}
            >
              {dialogType === "add"
                ? "Submit changes"
                : dialogType === "update"
                ? "Update form"
                : ""}
            </Button>
          ) : (
            <></>
          )}

          <Button
            variant="contained"
            color="error"
            onClick={
              () =>
                setConfirmationToCancelDialog(true) /* handleCloseDialog() */
            }
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {confirmationToCancelDialog ? (
        <Dialog open={confirmationToCancelDialog} fullWidth maxWidth="sm">
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Divider />
            <br />
            <Typography>{`Are you sure you want to cancel the ${documentType?.title}?`}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleCloseDialog()}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setConfirmationToCancelDialog(false)}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
}
