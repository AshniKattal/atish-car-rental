import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import db, { firebaseApp } from "../../../firebase";
import firebase from "firebase/compat";
//import { makeStyles } from '@mui/styles';
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { selectSnackbar, setSnackbar } from "../../../features/snackbarSlice";
import {
  selectCompanyList,
  setCompanyList,
} from "../../../features/companySlice";
import { setLoading } from "../../../features/globalSlice";
import useAuth from "../../../hooks/useAuth";
import {
  dynamicSort,
  getCompanies,
} from "../../../components/core-functions/SelectionCoreFunctions";
import {
  setClientInvSelected,
  setCompanyInvSelected,
} from "../../../features/invoiceSectionSlice";
import { useSnackbar } from "notistack";
import {
  setClientDocumentIdSelected,
  setClientDocumentObjectSelected,
  setCompanyIdSelected,
} from "../../../features/documentSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },
  },
  indeterminateColor: {
    color: theme.palette.primary,
  },
}));

function getSteps() {
  return ["Tell us", "Contact Info", "Save & Finish"];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return "Tell us about your business";
    case 1:
      return "Enter your business contact information";
    /* case 2:
      return 'Enter absence quota that will be applied to all employees'; */
    case 2:
      return "You are all done!";
    default:
      return "Unknown stepIndex";
  }
}

function CreateCompanyDialog({
  openDialog,
  handleCloseDialog,
  companyDetails,
  setCompanyDetails,
  initializeCompanies,
}) {
  const {
    name,
    vatPercentage,
    imageName,
    imageSig,
    stampName,
    companyType,
    // natureOfBusiness,
    // incorDate,
    // payeRegNo,
    vatOrNonVatRegistered,
    tan,
    address,
    // country,
    email,
    contactNumber,
    mobileNumber,
    brn,
    // nic,
    // absenceTariff,
    beneficiaryName,
    bankName,
    bankAccNo,
    bankIban,
    bankSwiftCode,
    MRATemplateFlag,
    displayMRAFiscalisationButton,
    documentTemplate,
  } = companyDetails;

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const snackbar = useSelector(selectSnackbar);
  const { companyList } = useSelector(selectCompanyList);

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [error, setError] = useState({
    errorBool: false,
    errorMsg: "",
  });
  const { errorBool, errorMsg } = error;
  const [uploadedFile, setUploadedFile] = useState("");
  const [uploadedSigFile, setUploadedSigFile] = useState("");
  const [uploadedStampSigFile, setUploadedStampSigFile] = useState("");

  const init_comp_details_temp = useRef();

  useEffect(() => {
    if (openDialog) {
      init_comp_details_temp.current();
    }
  }, [openDialog]);

  const initCompDetail = () => {
    setCompanyDetails({
      name: "",
      vatPercentage: 0,
      imageName: "",
      imageUrl: "",
      imageSig: "",
      sigUrl: "",
      stampName: "",
      stampUrl: "",
      companyType: "",
      // natureOfBusiness: "",
      // incorDate: "",
      // payeRegNo: "",
      vatOrNonVatRegistered: null,
      tan: "",
      address: "",
      // country: "",
      contactNumber: "",
      mobileNumber: "",
      email: "",
      brn: "",
      // nic: "",
      beneficiaryName: "",
      bankName: "",
      bankAccNo: "",
      bankIban: "",
      bankSwiftCode: "",
      MRATemplateFlag: null,
      displayMRAFiscalisationButton: false,
      documentTemplate: "",
    });
  };

  init_comp_details_temp.current = initCompDetail;

  const handleNext = () => {
    if (activeStep === 0) {
      if (name === "" /*  || companyType === "" || payeRegNo === "" */) {
        setError({
          errorBool: true,
          errorMsg: "Please enter a name",
        });
      } else if (!vatOrNonVatRegistered) {
        setError({
          errorBool: true,
          errorMsg: "Please define if company is VAT registered or not",
        });
      } else if (
        vatOrNonVatRegistered?.id === "VATR" &&
        (!tan || (tan && tan?.length !== 8))
      ) {
        setError({
          errorBool: true,
          errorMsg:
            "Please provide a Vat Registration Number and should be of 8 characters",
        });
      } else {
        setError({
          errorBool: false,
          errorMsg: "",
        });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 2) {
      setError({
        errorBool: false,
        errorMsg: "",
      });
      addCompany();
      setActiveStep(0);
    } else {
      setError({
        errorBool: false,
        errorMsg: "",
      });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const addCompany = async () => {
    if (user?.id !== "") {
      dispatch(setLoading(true));

      //upload image if present
      let fileUrl = "";
      if (uploadedFile !== "") {
        const storageRef = firebaseApp.storage().ref();
        const fileRef = storageRef.child(
          `/photo/companyLogo/${companyDetails?.name}/${uploadedFile.name}`
        );
        await fileRef.put(uploadedFile);
        fileUrl = await fileRef.getDownloadURL();
      }

      //upload signature img if present
      let fileSigUrl = "";
      if (uploadedSigFile !== "") {
        const storageRef = firebaseApp.storage().ref();
        const fileSigRef = storageRef.child(
          `/photo/companySignature/${companyDetails?.name}/${uploadedSigFile.name}`
        );
        await fileSigRef.put(uploadedSigFile);
        fileSigUrl = await fileSigRef.getDownloadURL();
      }

      //upload signature img if present
      let fileStampUrl = "";
      if (uploadedStampSigFile !== "") {
        const storageRef = firebaseApp.storage().ref();
        const fileSigRef = storageRef.child(
          `/photo/companyStamp/${companyDetails?.name}/${uploadedStampSigFile.name}`
        );
        await fileSigRef.put(uploadedStampSigFile);
        fileStampUrl = await fileSigRef.getDownloadURL();
      }

      //create a ref id for a new company doc
      const compDoc = db.collection("company").doc();
      //const compDocId = compDoc.id;
      // const compDocRef = db.collection('company').doc(compDoc.id);
      //create a ref to store the id and name of big array
      const compBigArrRef = db.collection("company").doc("companyIds");

      const invoiceRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("invoice")
        .doc("documentIndex");

      const vat_invoiceRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("vat_invoice")
        .doc("documentIndex");

      const purchaseOrderRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("purchase_order")
        .doc("documentIndex");

      const proformaRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("proforma")
        .doc("documentIndex");

      const quotationRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("quotation")
        .doc("documentIndex");

      const creditNoteRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("credit_note")
        .doc("documentIndex");

      const debitNoteRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("debit_note")
        .doc("documentIndex");

      const cashTransactionRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("cash_transaction")
        .doc("documentIndex");

      const paymentRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("payment")
        .doc("paymentCounter");

      // MRA customs
      const EBSInvoiceCounterRef = db
        .collection("company")
        .doc(compDoc.id)
        .collection("EBSInvoiceCounter")
        .doc("invoiceCounter");

      //perform a batch
      let a_new_comp_list = [...companyList, { id: compDoc.id, name: name }];
      a_new_comp_list.sort(dynamicSort("name"));

      // prepare images object
      let imageObject = {};

      // add image logo if logo has been uploaded
      if (fileUrl !== "") {
        imageObject = {
          ...imageObject,
          imageName: imageName,
          imageUrl: fileUrl,
        };
      }

      // add image signature if logo has been uploaded
      if (fileSigUrl !== "") {
        imageObject = {
          ...imageObject,
          imageSig: imageSig,
          sigUrl: fileSigUrl,
        };
      }

      // add image stamp if logo has been uploaded
      if (fileStampUrl !== "") {
        imageObject = {
          ...imageObject,
          stampName: stampName,
          stampUrl: fileStampUrl,
        };
      }

      var batch = db.batch();
      //set company details to the autogenerated company doc
      batch.set(compDoc, {
        name: name || "",
        vatPercentage: vatPercentage || 0,
        // imageName: imageName,
        // imageUrl: fileUrl,
        // imageSig: imageSig,
        // sigUrl: fileSigUrl,
        // stampName: stampName,
        // stampUrl: fileStampUrl,
        ...imageObject,
        companyType: companyType || "",
        vatOrNonVatRegistered: vatOrNonVatRegistered || null,
        tan: tan || "",
        address: address || "",
        email: email || "",
        contactNumber: contactNumber || "",
        mobileNumber: mobileNumber || "",
        brn: brn || "",
        beneficiaryName: beneficiaryName || "",
        bankName: bankName || "",
        bankAccNo: bankAccNo || "",
        bankIban: bankIban || "",
        bankSwiftCode: bankSwiftCode || "",
        documentTemplate: documentTemplate || "",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),

        // flag to start new MRA template
        MRATemplateFlag: MRATemplateFlag || null,
        displayMRAFiscalisationButton: displayMRAFiscalisationButton || false,
      });
      //set id and name in big array
      batch.set(compBigArrRef, {
        companyIdArray: a_new_comp_list,
      });
      batch.set(invoiceRef, {
        documentIndex: 0,
      });
      batch.set(vat_invoiceRef, {
        documentIndex: 0,
      });
      batch.set(purchaseOrderRef, {
        documentIndex: 0,
      });
      batch.set(proformaRef, {
        documentIndex: 0,
      });
      batch.set(quotationRef, {
        documentIndex: 0,
      });
      batch.set(creditNoteRef, {
        documentIndex: 0,
      });
      batch.set(debitNoteRef, {
        documentIndex: 0,
      });
      batch.set(cashTransactionRef, {
        documentIndex: 0,
      });
      batch.set(paymentRef, {
        paymentCounter: 0,
      });
      batch.set(EBSInvoiceCounterRef, {
        invoiceCounter: 0,
      });

      // Commit the batch
      batch
        .commit()
        .then(async function () {
          dispatch(
            setSnackbar({
              counter: snackbar.counter + 1,
              message: "Company added successfully",
              variant: "success",
            })
          );

          const result = await getCompanies(user?.id, user?.a_comp, user?.role);

          if (result.error) {
            enqueueSnackbar(result.msg || "", { variant: result.variant });
          } else {
            dispatch(setCompanyList(result));
          }

          //reset home fields to initialise new options by user
          dispatch(setCompanyInvSelected(undefined));
          dispatch(setClientInvSelected(undefined));

          setCompanyDetails({
            name: "",
            vatPercentage: 0,
            imageName: "",
            imageUrl: "",
            imageSig: "",
            sigUrl: "",
            stampName: "",
            stampUrl: "",
            companyType: "",
            // natureOfBusiness: "",
            // incorDate: "",
            // payeRegNo: "",
            vatOrNonVatRegistered: null,
            tan: "",
            address: "",
            // country: "",
            contactNumber: "",
            mobileNumber: "",
            email: "",
            brn: "",
            // nic: "",
            // absenceTariff: [],
            beneficiaryName: "",
            bankName: "",
            bankAccNo: "",
            bankIban: "",
            bankSwiftCode: "",
            MRATemplateFlag: null,
            displayMRAFiscalisationButton: false,
            documentTemplate: "",
          });
          handleCloseDialog();

          if (initializeCompanies) {
            initializeCompanies();
          }

          // reset company id
          dispatch(setCompanyIdSelected(undefined));

          dispatch(setClientDocumentIdSelected(undefined));

          dispatch(setClientDocumentObjectSelected(undefined));

          dispatch(setLoading(false));
        })
        .catch((err) => {
          enqueueSnackbar(
            `Error occured while creating new company: ${err.message}`,
            { variant: "error" }
          );
          dispatch(setLoading(false));
        });
    } else {
      enqueueSnackbar(
        "Your session has been terminated due to greater than 30 minutes of inactivity. Please log in again.",
        { variant: "error" }
      );
    }
  };

  const onFileChange = (e, type) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let fileSize = Number(file.size) / 1000; //to get size in kb

      //check for valid image type
      const fileType = file["type"];
      const validImageTypes = ["image/jpeg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        // invalid file type
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message:
              "Sorry you should upload only images with type image/jpeg and image/png",
            variant: "error",
          })
        );
      } else if (Math.round(fileSize) > 25) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message:
              "Sorry the image you uploaded exceed 25 KB, size of image uploaded: " +
              Math.round(fileSize) +
              " KB",
            variant: "error",
          })
        );
      } else {
        if (type === "logo") {
          setUploadedFile(file);
          setCompanyDetails({
            ...companyDetails,
            imageName: file.name,
          });
        } else if (type === "signature") {
          setUploadedSigFile(file);
          setCompanyDetails({
            ...companyDetails,
            imageSig: file.name,
          });
        } else if (type === "stamp") {
          setUploadedStampSigFile(file);
          setCompanyDetails({
            ...companyDetails,
            stampName: file.name,
          });
        }
      }
    }
  };

  return (
    <>
      <Dialog
        style={{ width: "100%" }}
        maxWidth="lg"
        fullWidth
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle id="alert-dialog-title">Create a company</DialogTitle>
        <DialogContent style={{ height: "auto" }}>
          <Grid
            container
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" align="left" color="primary">
                {getStepContent(activeStep)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={classes.root}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </Grid>
          </Grid>
          <Alert
            variant="filled"
            severity="error"
            style={{ display: errorBool ? "" : "none" }}
          >
            {errorMsg}
          </Alert>
          <div style={{ display: activeStep === 0 ? "" : "none" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              type="text"
              id="name"
              size="small"
              value={name || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  name: event.target.value,
                });
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="vatPercentage"
              label="VAT Percentage"
              type="number"
              id="vatPercentage"
              size="small"
              value={vatPercentage || 0}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  vatPercentage: event.target.value,
                });
              }}
            />

            <div style={{ paddingTop: "1rem" }}></div>
            <Typography>
              Upload Image Logo{" "}
              <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
            </Typography>
            <TextField
              className="uploadInput"
              variant="outlined"
              size="small"
              fullWidth
              name="image"
              type="file"
              id="image"
              accept=".png,.jpeg"
              onChange={(event) => onFileChange(event, "logo")}
            />

            <div style={{ paddingTop: "1rem" }}></div>
            <Typography>
              Upload Signature Image{" "}
              <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              name="imageSig"
              type="file"
              id="imageSig"
              accept=".png,.jpeg"
              onChange={(event) => onFileChange(event, "signature")}
            />

            <div style={{ paddingTop: "1rem" }}></div>
            <Typography>
              Upload Stamp Image{" "}
              <span style={{ color: "red" }}>(Max Size of 25 KB)</span>:{" "}
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              name="stampName"
              type="file"
              id="stampName"
              accept=".png,.jpeg"
              onChange={(event) => onFileChange(event, "stamp")}
            />

            <FormControl
              size="small"
              variant="outlined"
              fullWidth
              style={{ marginTop: "1em" }}
            >
              <Select
                size="small"
                native
                //label="Company Type"
                placeholder="Please choose a company type"
                value={companyType || ""}
                required
                onChange={(event) => {
                  setCompanyDetails({
                    ...companyDetails,
                    companyType: event.target.value,
                  });
                }}
                inputProps={{
                  name: "companyType",
                  id: "companyType",
                }}
              >
                <option value="">Please choose a Company Type *</option>
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <div style={{ paddingTop: "1rem" }}></div>
            {/*   <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="incorDate"
              label="Date Of Incorporation"
              id="incorDate"
              type="date"
              value={incorDate || ""}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  incorDate: event.target.value,
                });
              }}
              size="small"
            /> */}

            {/*  <TextField
              variant="outlined"
              margin="normal"
              size="small"
              required
              fullWidth
              name="payeRegNo"
              label="PAYE Reg No"
              type="text"
              id="payeRegNo"
              value={payeRegNo || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  payeRegNo: event.target.value,
                });
              }}
            /> */}

            <Autocomplete
              ListboxProps={{
                style: { maxHeight: "70vh", marginTop: "1.5em" },
              }}
              size="small"
              label="Apply MRA Template"
              id="mra-template-application-drop-down"
              options={[
                {
                  value: true,
                  title: "Apply",
                },
                {
                  value: false,
                  title: "Do not apply",
                },
              ]}
              value={MRATemplateFlag}
              renderInput={(params) => (
                <TextField {...params} label="Apply MRA Template" />
              )}
              required
              onChange={(e, value, reason) => {
                e.preventDefault();
                if (reason !== "removeOption" && reason !== "clear" && value) {
                  setCompanyDetails({
                    ...companyDetails,
                    MRATemplateFlag: value,
                  });
                } else if (reason === "removeOption" || reason === "clear") {
                  setCompanyDetails({
                    ...companyDetails,
                    MRATemplateFlag: null,
                  });
                }
              }}
              getOptionLabel={(option) => option?.title || ""}
              fullWidth
            />
            <br />

            <Autocomplete
              ListboxProps={{
                style: { maxHeight: "70vh", marginTop: "1.5em" },
              }}
              size="small"
              label="Show MRA send for Fiscalisation button"
              id="fiscalisation-button-display"
              options={[true, false]}
              value={displayMRAFiscalisationButton}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Show MRA send for Fiscalisation button"
                />
              )}
              required
              onChange={(e, value, reason) => {
                e.preventDefault();
                if (reason !== "removeOption" && reason !== "clear" && value) {
                  setCompanyDetails({
                    ...companyDetails,
                    displayMRAFiscalisationButton: value,
                  });
                } else if (reason === "removeOption" || reason === "clear") {
                  setCompanyDetails({
                    ...companyDetails,
                    displayMRAFiscalisationButton: false,
                  });
                }
              }}
              getOptionLabel={(option) =>
                option === true ? "Show" : "Do not show"
              }
              fullWidth
            />
            <br />

            {user && user?.role === "super-admin" ? (
              <>
                <Autocomplete
                  ListboxProps={{
                    style: { maxHeight: "70vh", marginTop: "1.5em" },
                  }}
                  size="small"
                  label="Document template"
                  id="document-template-drop-down"
                  options={
                    process.env.REACT_APP_DOCUMENT_TEMPLATES
                      ? JSON.parse(process.env.REACT_APP_DOCUMENT_TEMPLATES)
                      : []
                  }
                  value={documentTemplate}
                  renderInput={(params) => (
                    <TextField {...params} label="Document template" />
                  )}
                  required
                  onChange={(e, value, reason) => {
                    e.preventDefault();
                    if (
                      reason !== "removeOption" &&
                      reason !== "clear" &&
                      value
                    ) {
                      setCompanyDetails({
                        ...companyDetails,
                        documentTemplate: value,
                      });
                    } else if (
                      reason === "removeOption" ||
                      reason === "clear"
                    ) {
                      setCompanyDetails({
                        ...companyDetails,
                        documentTemplate: null,
                      });
                    }
                  }}
                  getOptionLabel={(option) => option || ""}
                  fullWidth
                />
                <br />
              </>
            ) : (
              <></>
            )}

            <Autocomplete
              ListboxProps={{
                style: { maxHeight: "70vh", marginTop: "1.5em" },
              }}
              size="small"
              label="VAT/Non VAT Registered"
              id="transaction-type-drop-down"
              options={
                process.env.REACT_APP_EBS_VAT_OR_NON_VAT_REGISTERED_VALUES
                  ? JSON.parse(
                      process.env.REACT_APP_EBS_VAT_OR_NON_VAT_REGISTERED_VALUES
                    )
                  : []
              }
              value={vatOrNonVatRegistered}
              renderInput={(params) => (
                <TextField {...params} label="VAT/Non VAT Registered" />
              )}
              required
              onChange={(e, value, reason) => {
                e.preventDefault();
                if (reason !== "removeOption" && reason !== "clear" && value) {
                  setCompanyDetails({
                    ...companyDetails,
                    vatOrNonVatRegistered: value,
                  });
                } else if (reason === "removeOption" || reason === "clear") {
                  setCompanyDetails({
                    ...companyDetails,
                    vatOrNonVatRegistered: null,
                  });
                }
              }}
              getOptionLabel={(option) => option?.title || ""}
              fullWidth
            />

            <TextField
              style={{ marginTop: "1.5em" }}
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="tan"
              label="VAT"
              type="number"
              id="tan"
              value={tan || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  tan: event.target.value,
                });
              }}
            />

            <TextField
              variant="outlined"
              size="small"
              margin="normal"
              fullWidth
              name="brn"
              label="BRN"
              type="text"
              id="brn"
              value={brn || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  brn: event.target.value,
                });
              }}
            />

            {/*      <TextField
              variant="outlined"
              size="small"
              margin="normal"
              fullWidth
              name="nic"
              label="NIC"
              type="text"
              id="nic"
              value={nic || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  nic: event.target.value,
                });
              }}
            /> */}
          </div>
          <div style={{ display: activeStep === 1 ? "" : "none" }}>
            {/*   <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="natureOfBusiness"
              label="Nature Of Business"
              type="text"
              id="natureOfBusiness"
              value={natureOfBusiness || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  natureOfBusiness: event.target.value,
                });
              }}
            /> */}
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="address"
              label="Address"
              type="text"
              id="address"
              value={address || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  address: event.target.value,
                });
              }}
            />
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="contactNumber"
              label="Contact Number"
              type="text"
              id="contactNumber"
              value={contactNumber || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  contactNumber: event.target.value,
                });
              }}
            />
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="mobileNumber"
              label="Mobile Number"
              type="text"
              id="mobileNumber"
              value={mobileNumber || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  mobileNumber: event.target.value,
                });
              }}
            />
            {/*   <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="country"
              label="Country"
              type="text"
              id="country"
              value={country || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  country: event.target.value,
                });
              }}
            /> */}

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="email"
              label="Email"
              type="text"
              id="email"
              value={email || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  email: event.target.value,
                });
              }}
            />

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="beneficiaryName"
              label="Beneficiary name"
              type="text"
              id="beneficiaryName"
              value={beneficiaryName || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  beneficiaryName: event.target.value,
                });
              }}
            />

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="bankName"
              label="Bank name"
              type="text"
              id="bankName"
              value={bankName || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  bankName: event.target.value,
                });
              }}
            />

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="bankAccNo"
              label="Bank Acc No"
              type="text"
              id="bankAccNo"
              value={bankAccNo || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  bankAccNo: event.target.value,
                });
              }}
            />

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="bankIban"
              label="Bank IABN"
              type="text"
              id="bankIban"
              value={bankIban || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  bankIban: event.target.value,
                });
              }}
            />

            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              fullWidth
              name="bankSwiftCode"
              label="Bank Swift Code"
              type="text"
              id="bankSwiftCode"
              value={bankSwiftCode || ""}
              onChange={(event) => {
                setCompanyDetails({
                  ...companyDetails,
                  bankSwiftCode: event.target.value,
                });
              }}
            />
          </div>
          {/*  <div style={{ display: activeStep === 2 ? '' : 'none' }}>
            <TableContainer>
              <Typography>The total number will be applicable after 1 year of employment.</Typography>
              <Table border={1}>
                <TableHead>
                  <TableRow>
                    <TableCell>Absence type</TableCell>
                    <TableCell>Total number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {absenceTariff?.map((o_abc, index) => (
                    <TableRow key={index}>
                      <TableCell>{o_abc?.txt}</TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          name="absc"
                          label="Quantity"
                          type="number"
                          id={o_abc?.id}
                          value={o_abc?.qty}
                          onChange={(event) => {
                            let a_abscence = [...absenceTariff];
                            let a_new_absc = [];
                            a_abscence.forEach((o_absc) => {
                              if (o_absc?.id === o_abc?.id) {
                                a_new_absc.push({ ...o_abc, qty: event.target.value });
                              } else {
                                a_new_absc.push({ ...o_absc });
                              }
                            });
                            setCompanyDetails({ ...companyDetails, absenceTariff: a_new_absc });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div> */}
          <div
            style={{
              display: activeStep === 2 ? "" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name:</TableCell>
                  <TableCell>{name || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Company Type:</TableCell>
                  <TableCell>{companyType || ""}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>PAYE Reg No:</TableCell>
                  <TableCell>{payeRegNo}</TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>Is VAT Registered:</TableCell>
                  <TableCell>
                    {vatOrNonVatRegistered?.id === "VATR" ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>VAT:</TableCell>
                  <TableCell>{tan || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BRN:</TableCell>
                  <TableCell>{brn || ""}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>NIC:</TableCell>
                  <TableCell>{nic}</TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>Address:</TableCell>
                  <TableCell>{address || ""}</TableCell>
                </TableRow>
                {/* <TableRow>
                  <TableCell>Country:</TableCell>
                  <TableCell>{country}</TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell>Contact Number:</TableCell>
                  <TableCell>{contactNumber || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Mobile Number:</TableCell>
                  <TableCell>{mobileNumber || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email:</TableCell>
                  <TableCell>{email || ""}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </DialogContent>
        <DialogActions>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed
                </Typography>
                <Button onClick={handleReset}>Reset</Button>
              </div>
            ) : (
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.backButton}
                >
                  {activeStep === steps.length - 1 ? "Save" : "Next"}
                </Button>
              </div>
            )}
          </div>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateCompanyDialog;
