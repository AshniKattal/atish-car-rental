import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import { setLoading } from "../../../features/globalSlice";
import { selectSnackbar, setSnackbar } from "../../../features/snackbarSlice";
import db from "../../../firebase";
import { useSnackbar } from "notistack";
import {
  setClientInvSelected,
  setCompanyInvSelected,
} from "../../../features/invoiceSectionSlice";
import {
  setClientPaymentSelected,
  setCompanyPaymentSelected,
} from "../../../features/paymentSectionSlice";
import {
  setClientReportSelected,
  setCompanyReportSelected,
} from "../../../features/reportSectionSlice";
import {
  setClientDocumentIdSelected,
  setClientDocumentObjectSelected,
  setCompanyDetails,
  setCompanyIdSelected,
} from "../../../features/documentSlice";

function UpdateCompanyDialog({
  companyId,
  openDialog,
  handleCloseDialog,
  clientDetails,
  setClientDetails,
  initializeClientList,
}) {
  const {
    id,
    name,
    // companyRefId,
    companyType,
    // natureOfBusiness,
    // incorDate,
    // payeRegNo,
    tan,
    address,
    // country,
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
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const snackbar = useSelector(selectSnackbar);

  const updateClient = async (e) => {
    if (user?.id !== "") {
      e.preventDefault();
      dispatch(setLoading(true));
      if (name === "" /* || companyType === "" || payeRegNo === "" */) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message: "Name cannot be blank",
            variant: "error",
          })
        );
        dispatch(setLoading(false));
      } /* else if (
        tan !== "" &&
        tan !== undefined &&
        tan !== null &&
        tan.length !== 8
      ) {
        dispatch(
          setSnackbar({
            counter: snackbar.counter + 1,
            message: "Vat Registration Number should be of 8 characters",
            variant: "error",
          })
        );
        dispatch(setLoading(false));
      } */ else {
        // check if name is the same
        await db
          .collection("company")
          .doc(process.env.REACT_APP_COMPANY_ID)
          .collection("client")
          .doc(id)
          .set(
            {
              name: name || "",
              companyType: companyType || "",
              // natureOfBusiness: natureOfBusiness,
              // incorDate: incorDate || "",
              // payeRegNo: payeRegNo,
              tan: tan || "",
              address: address || "",
              // country: country,
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
            },
            { merge: true }
          )
          .then(() => {
            enqueueSnackbar(`Client updated successfully`);

            dispatch(setCompanyInvSelected(undefined));
            dispatch(setClientInvSelected(undefined));

            dispatch(setCompanyPaymentSelected(undefined));
            dispatch(setClientPaymentSelected(undefined));

            dispatch(setCompanyReportSelected(undefined));
            dispatch(setClientReportSelected(undefined));

            // reset company id
            dispatch(setCompanyIdSelected(undefined));

            // reset company details
            dispatch(setCompanyDetails(null));

            dispatch(setClientDocumentIdSelected(undefined));

            dispatch(setClientDocumentObjectSelected(undefined));

            dispatch(setLoading(false));
            handleCloseDialog();
            initializeClientList();
          })
          .catch((err) => {
            enqueueSnackbar(
              `Error occured while updating client: ${err?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      }
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
        <DialogTitle id="alert-dialog-title">Update company</DialogTitle>
        <DialogContent>
          <hr />
          <br />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                required
                fullWidth
                name="name"
                label="Name"
                type="text"
                id="name"
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
                  <option value="">Please choose a Company Type *</option>
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
                name="vatRegistrationNumber"
                label="VAT"
                type="number"
                id="vatRegistrationNumber"
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
                size="small"
                variant="outlined"
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
                size="small"
                variant="outlined"
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
                  <TextField {...params} label="Please define type of buyer" />
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
                  } else if (reason === "removeOption" || reason === "clear") {
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
            {/* <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="natureOfBusiness"
                label="Nature Of Business"
                type="text"
                id="natureOfBusiness"
                value={natureOfBusiness || ""}
                onChange={(event) => {
                  setClientDetails({
                    ...clientDetails,
                    natureOfBusiness: event.target.value,
                  });
                }}
              />
            </Grid> */}
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
            {/* <Grid item xs={12} sm={6} md={4}>
              <TextField
                size="small"
                variant="outlined"
                fullWidth
                name="country"
                label="Country"
                type="text"
                id="country"
                value={country || ""}
                onChange={(event) => {
                  setClientDetails({
                    ...clientDetails,
                    country: event.target.value,
                  });
                }}
              />
            </Grid> */}
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => updateClient(e)}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
          <Button onClick={handleCloseDialog} color="error" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateCompanyDialog;
