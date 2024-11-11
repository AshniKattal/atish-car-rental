import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../features/globalSlice";
import db from "../../../firebase";
import firebase from "firebase/compat";
import emailjs from "@emailjs/browser";
import { selectTemplate } from "src/features/templateSlice";
import { useNavigate } from "react-router";
import useAuth from "src/hooks/useAuth";
import { selectRegister, setOpenDialog } from "src/features/registerSlice";

export default function RegistrationForm({ open, callLocation }) {
  const { register } = useAuth();

  const { template } = useSelector(selectTemplate);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

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
    if (
      !firstName ||
      !lastName ||
      !contactNumber ||
      !email ||
      (template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH && !password)
    ) {
      enqueueSnackbar("Please fill in all compulsory fields.", {
        variant: "warning",
      });
    } else {
      if (template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH) {
        customCarRentalRegistration();
      } else {
        standardRegistration();
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
      await register(userObjectParams, callLocation);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Error occured. ${error?.message || ""}`, {
        variant: "error",
      });
    }
  }

  async function standardRegistration() {
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
  }

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

  return (
    <Dialog open={open} maxWidth={"md"}>
      <DialogTitle>Registration form</DialogTitle>
      <DialogContent>
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          {template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
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
          ) : (
            <></>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => submitDetails()}
          size="large"
          disabled={!firstName || !lastName || !contactNumber || !email}
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
