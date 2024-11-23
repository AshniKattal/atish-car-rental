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
import { useState } from "react";
import db from "../../../firebase";
import firebase from "firebase/compat";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { selectSnackbar, setSnackbar } from "../../../features/snackbarSlice";
import { setLoading } from "../../../features/globalSlice";
import { useSnackbar } from "notistack";
import {
  setClientDocumentIdSelected,
  setClientDocumentObjectSelected,
  setCompanyDetails,
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

function CreateClientDialog({
  companyId,
  openDialog,
  handleCloseDialog,
  clientDetails,
  setClientDetails,
  initializeClientList,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    name,
    companyRefId,
    companyRefName,
    companyType,
    tan,
    address,
    email,
    email2,
    email3,
    email4,
    contactNumber,
    mobileNumber,
    brn,
    nic,
    buyerType,
    representativeName,
    representativeContactNumber,
  } = clientDetails;

  const classes = useStyles();
  const dispatch = useDispatch();
  const snackbar = useSelector(selectSnackbar);
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [error, setError] = useState({
    errorBool: false,
    errorMsg: "",
  });
  const { errorBool, errorMsg } = error;

  const handleNext = () => {
    if (activeStep === 0) {
      if (name === "") {
        setError({
          errorBool: true,
          errorMsg: "Please enter a name",
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
      addClient();
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

  const addClient = async () => {
    if (process.env.REACT_APP_COMPANY_ID) {
      dispatch(setLoading(true));

      await db
        .collection("company")
        .doc(process.env.REACT_APP_COMPANY_ID)
        .collection("client")
        .add({
          name: name || "",
          companyRefId: companyRefId || "",
          companyRefName: companyRefName || "",
          companyType: companyType || "",
          tan: tan || "",
          address: address || "",
          email: email || "",
          email2: email2 || "",
          email3: email3 || "",
          email4: email4 || "",
          contactNumber: contactNumber || "",
          mobileNumber: mobileNumber || "",
          brn: brn || "",
          nic: nic || "",
          buyerType: buyerType || null,
          representativeName: representativeName || "",
          representativeContactNumber: representativeContactNumber || "",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          enqueueSnackbar(`Client added successfully`);
          dispatch(setLoading(false));

          // reset company id
          dispatch(setCompanyIdSelected(undefined));

          // reset company details
          dispatch(setCompanyDetails(null));

          dispatch(setClientDocumentIdSelected(undefined));

          dispatch(setClientDocumentObjectSelected(undefined));

          handleCloseDialog();

          if (initializeClientList) {
            initializeClientList();
          }
        })
        .catch((error) => {
          enqueueSnackbar(
            `Error occured while adding client: ${error?.message}`
          );
          dispatch(setLoading(false));
        });
    } else {
      dispatch(
        setSnackbar({
          counter: snackbar.counter + 1,
          message:
            "Your session has been terminated due to greater than 30 minutes of inactivity. Please log in again.",
          variant: "error",
        })
      );
    }
  };

  return (
    <>
      <Dialog
        style={{ width: "100%" }}
        maxWidth="md"
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
            <br />
            <hr />
            <Grid container spacing={3} style={{ marginTop: "1em" }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="name"
                  label="Name"
                  type="text"
                  id="name"
                  size="small"
                  value={name || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      name: event.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl size="small" variant="outlined" fullWidth>
                  <Select
                    size="small"
                    native
                    //label="Company Type"
                    placeholder="Please choose a company type"
                    value={companyType || ""}
                    onChange={(event) => {
                      setClientDetails({
                        ...clientDetails,
                        companyType: event.target.value,
                      });
                    }}
                    inputProps={{
                      name: "companyType",
                      id: "companyType",
                    }}
                  >
                    <option value="">Please choose a Company Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="tan"
                  label="VAT"
                  type="number"
                  id="tan"
                  value={tan || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      tan: event.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="brn"
                  label="BRN"
                  type="text"
                  id="brn"
                  value={brn || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      brn: event.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="nic"
                  label="NIC"
                  type="text"
                  id="nic"
                  value={nic || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      nic: event.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  ListboxProps={{ style: { maxHeight: "70vh" } }}
                  size="small"
                  label="Please define type of buyer"
                  id="buyer-type-drop-down"
                  options={
                    process.env.REACT_APP_EBS_BUYER_TYPE_VALUES
                      ? JSON.parse(process.env.REACT_APP_EBS_BUYER_TYPE_VALUES)
                      : []
                  }
                  value={buyerType}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Please define type of buyer"
                    />
                  )}
                  onChange={(e, value, reason) => {
                    e.preventDefault();
                    if (
                      reason !== "removeOption" &&
                      reason !== "clear" &&
                      value
                    ) {
                      setClientDetails({
                        ...clientDetails,
                        buyerType: value,
                      });
                    } else if (
                      reason === "removeOption" ||
                      reason === "clear"
                    ) {
                      setClientDetails({
                        ...clientDetails,
                        buyerType: null,
                      });
                    }
                  }}
                  getOptionLabel={(option) => option?.title || ""}
                  fullWidth
                />
              </Grid>
            </Grid>
          </div>
          <div style={{ display: activeStep === 1 ? "" : "none" }}>
            <br />
            <hr />
            <Grid container spacing={3} style={{ marginTop: "1em" }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="address"
                  label="Address"
                  type="text"
                  id="address"
                  value={address || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      address: event.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="contactNumber"
                  label="Contact Number"
                  type="text"
                  id="contactNumber"
                  value={contactNumber || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      contactNumber: event.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="mobileNumber"
                  label="Mobile Number"
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      mobileNumber: event.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="email"
                  label="Email 1"
                  type="text"
                  id="email"
                  value={email || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      email: event.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="email2"
                  label="Email 2"
                  type="text"
                  id="email2"
                  value={email2 || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      email2: event.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="email3"
                  label="Email 3"
                  type="text"
                  id="email3"
                  value={email3 || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      email3: event.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="email4"
                  label="Email 4"
                  type="text"
                  id="email4"
                  value={email4 || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      email4: event.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="representativeName"
                  label="Representative name"
                  type="text"
                  id="representativeName"
                  value={representativeName || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      representativeName: event.target.value,
                    });
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  name="representativeContactNumber"
                  label="Representative contact number"
                  type="text"
                  id="representativeContactNumber"
                  value={representativeContactNumber || ""}
                  onChange={(event) => {
                    setClientDetails({
                      ...clientDetails,
                      representativeContactNumber: event.target.value,
                    });
                  }}
                />
              </Grid>
            </Grid>
          </div>

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
                <TableRow>
                  <TableCell>VAT:</TableCell>
                  <TableCell>{tan || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BRN:</TableCell>
                  <TableCell>{brn || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NIC:</TableCell>
                  <TableCell>{nic || ""}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Address:</TableCell>
                  <TableCell>{address || ""}</TableCell>
                </TableRow>
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

export default CreateClientDialog;
