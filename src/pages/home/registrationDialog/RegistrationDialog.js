import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "src/hooks/useAuth";
import { selectRegister, setOpenDialog } from "src/features/registerSlice";

export default function RegistrationForm({ open }) {
  const { register, login } = useAuth();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { callLocation } = useSelector(selectRegister);

  const [tabValue, setTabValue] = useState("register");

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    mobileNumber: "",
    email: "",
    password: "",
    companyName: "",
    brn: "",
    vat: "",
    nic: "",
  });

  const {
    firstName,
    lastName,
    contactNumber,
    mobileNumber,
    email,
    password,
    companyName,
    brn,
    vat,
    nic,
  } = userDetails;

  async function submitDetails() {
    if (tabValue === "register") {
      if (!firstName || !lastName || !contactNumber || !email || !password) {
        enqueueSnackbar("Please fill in all compulsory fields.", {
          variant: "warning",
        });
      } else {
        customCarRentalRegistration();
      }
    } else if (tabValue === "login") {
      if (!email || !password) {
        enqueueSnackbar("Please fill in all compulsory fields.", {
          variant: "warning",
        });
      } else {
        customCarRentalLogin();
      }
    }
  }

  async function customCarRentalRegistration() {
    let userObjectParams = {
      firstName: firstName,
      lastName: lastName,
      contactNumber: contactNumber,
      mobileNumber: mobileNumber,
      email: email,
      password: password,
      role: "client",
      access: true,
      sysFunc: [],
      a_comp: [
        {
          id: process.env.REACT_APP_COMPANY_ID,
          name: process.env.REACT_APP_COMPANY_NAME,
        },
      ],
    };

    try {
      await register(userObjectParams);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Error occured. ${error?.message || ""}`, {
        variant: "error",
      });
    }
  }

  async function customCarRentalLogin() {
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Error occured. ${error?.message || ""}`, {
        variant: "error",
      });
    }
  }

  /*  async function standardRegistration() {
    dispatch(setLoading(true));

    await db
      .collection("onlineregistration")
      .add({
        ...userDetails,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        let emailParameters = {
          ...userDetails,
          from_name: "PlusInvoice ADMIN",
          to_name: `${firstName} ${lastName}`,
          from_email: "contact@fertositeweb.com",
          to_email: email,
          reply_to: "contact@fertositeweb.com",
        };

        emailjs
          .send(
            process.env.REACT_APP_ADMIN_EMAIL_SERVICE_KEY,
            process.env.REACT_APP_REGISTRATION_FORM_TEMPLATE_KEY,
            {
              ...emailParameters,
            },
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY
          )
          .then(() => {
            enqueueSnackbar("Your details have been recorded successfully");
            closeDialog();
            dispatch(setLoading(false));
          })
          .catch((error) => {
            enqueueSnackbar(
              `Error occured while recording data, please contact (+230) 5929 1209: ${error?.message}`,
              { variant: "error" }
            );
            dispatch(setLoading(false));
          });
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while recording data, please contact (+230) 5929 1209: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  } */

  function closeDialog() {
    setUserDetails({
      firstName: "",
      lastName: "",
      contactNumber: "",
      mobileNumber: "",
      email: "",
      password: "",
      companyName: "",
      brn: "",
      vat: "",
      nic: "",
    });

    dispatch(setOpenDialog(false));
  }

  const handleTabsChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} maxWidth={"md"}>
      <DialogTitle>
        {callLocation === "confirmBooking"
          ? "Register or Login"
          : "Register form"}
      </DialogTitle>
      <DialogContent>
        <Divider />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            {callLocation === "confirmBooking" ? (
              <>
                <Tabs
                  fullWidth
                  value={tabValue}
                  onChange={handleTabsChange}
                  aria-label="register/login tabs"
                >
                  <Tab label="Register" value="register" />

                  <Tab label="Login" value="login" />
                </Tabs>
                <br />
                <Divider />
              </>
            ) : (
              <></>
            )}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              required
              variant="outlined"
              label="First name"
              name="firstName"
              id="firstName"
              type="text"
              value={firstName || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  firstName: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              required
              label="Last name"
              variant="outlined"
              name="lastName"
              id="lastName"
              type="text"
              value={lastName || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  lastName: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              required
              label="Contact number"
              variant="outlined"
              name="contactNumber"
              id="contactNumber"
              type="text"
              value={contactNumber || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  contactNumber: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              label="Mobile number"
              variant="outlined"
              name="mobileNumber"
              id="mobileNumber"
              type="text"
              value={mobileNumber || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  mobileNumber: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              label="NIC"
              variant="outlined"
              name="nic"
              id="nic"
              type="text"
              value={nic || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  nic: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              label="Company name"
              variant="outlined"
              name="companyName"
              id="companyName"
              type="text"
              value={companyName || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  companyName: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              label="BRN"
              variant="outlined"
              name="brn"
              id="brn"
              type="text"
              value={brn || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  brn: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            style={{ display: tabValue === "register" ? "" : "none" }}
          >
            <TextField
              label="VAT"
              variant="outlined"
              name="vat"
              id="vat"
              type="text"
              value={vat || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  vat: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              label="Email"
              variant="outlined"
              name="email"
              id="email"
              type="text"
              value={email || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  email: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              label="Password"
              variant="outlined"
              name="password"
              id="password"
              type="text"
              value={password || ""}
              size="large"
              onChange={(event) => {
                setUserDetails({
                  ...userDetails,
                  password: event.target.value,
                });
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => submitDetails()}
          size="large"
          disabled={
            (tabValue === "register" &&
              (!firstName ||
                !lastName ||
                !contactNumber ||
                !email ||
                !password)) ||
            (tabValue === "login" && (!email || !password))
          }
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => closeDialog()}
          size="large"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
