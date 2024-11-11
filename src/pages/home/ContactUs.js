// @mui
import { styled } from "@mui/material/styles";
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  Stack,
  TextField,
  Box,
  CardContent,
} from "@mui/material";
// components
import { useState } from "react";
import { useDispatch } from "react-redux";
import db from "../../firebase";
import firebase from "firebase/compat";
import { useSnackbar } from "notistack";
import { setLoading } from "../../features/globalSlice";
import emailjs from "@emailjs/browser";
import "./ContactUs.css";
import useSettings from "src/hooks/useSettings";

// ----------------------------------------------------------------------

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  })
);

export default function ContactUs() {
  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [documentDetails, setDocumentDetails] = useState({
    fullName: "",
    contactNumber: "",
    email: "",
    inquiry: "",
  });

  const { fullName, contactNumber, email, inquiry } = documentDetails;

  async function submitDetails() {
    dispatch(setLoading(true));

    await db
      .collection("onlineinquiry")
      .add({
        ...documentDetails,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        let emailParameters = {
          ...documentDetails,
          from_name: "PlusInvoice ADMIN",
          to_name: fullName,
          from_email: "contact@fertositeweb.com",
          to_email: email,
          reply_to: "contact@fertositeweb.com",
        };

        emailjs
          .send(
            process.env.REACT_APP_ADMIN_EMAIL_SERVICE_KEY,
            process.env.REACT_APP_INQUIRY_FORM_TEMPLATE_KEY,
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
    setDocumentDetails({
      fullName: "",
      contactNumber: "",
      email: "",
      inquiry: "",
    });
  }

  return (
    <ContentStyle>
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Card>
          {/* <Box
            sx={{
              position: "absolute",
              top: "-50%",
              right: "-60%",
              width: "100%",
              height: "100%",
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              //opacity: 0.9, // Set your desired opacity here
              zIndex: 1,
              borderBottomRightRadius: "300px",
              mixBlendMode: "hard-light",
            }}
          /> */}

          <Box className="box-background" />
          <CardContent sx={{ p: 5, zIndex: 2 }}>
            <Grid container spacing={3} style={{ width: "100%" }}>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <Stack>
                    <Typography variant="h3">Help us solve</Typography>
                    <Typography variant="h3">your inquiry</Typography>
                  </Stack>

                  <Typography variant="body1">
                    Getting started with PlusInvoice for invoicing is quick and
                    efficient, allowing you to streamline your process
                    immediately. If your business requires additional features,
                    our development team is ready to assist. Share your business
                    needs with us, and we'll guide you to the best solutions and
                    develop customized features to fit your requirements.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      variant="outlined"
                      name="fullName"
                      label={"Full name"}
                      id="fullName"
                      type="text"
                      value={fullName || ""}
                      size="large"
                      fullWidth
                      onChange={(event) => {
                        setDocumentDetails((previous) => {
                          return {
                            ...previous,
                            fullName: event.target.value,
                          };
                        });
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      variant="outlined"
                      name="contactNumber"
                      label={"Contact number"}
                      id="contactNumber"
                      type="text"
                      value={contactNumber || ""}
                      size="large"
                      fullWidth
                      onChange={(event) => {
                        setDocumentDetails((previous) => {
                          return {
                            ...previous,
                            contactNumber: event.target.value,
                          };
                        });
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      required
                      variant="outlined"
                      name="email"
                      label={"Email address"}
                      id="email"
                      type="text"
                      value={email || ""}
                      size="large"
                      fullWidth
                      onChange={(event) => {
                        setDocumentDetails((previous) => {
                          return {
                            ...previous,
                            email: event.target.value,
                          };
                        });
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      required
                      variant="outlined"
                      name="inquiry"
                      label={"Inquiry"}
                      id="inquiry"
                      type="text"
                      value={inquiry || ""}
                      size="large"
                      fullWidth
                      multiline
                      minRows={5}
                      onChange={(event) => {
                        setDocumentDetails((previous) => {
                          return {
                            ...previous,
                            inquiry: event.target.value,
                          };
                        });
                      }}
                    />
                  </Grid>

                  {fullName && contactNumber && email && inquiry ? (
                    <Grid item xs={12} md={12}>
                      <Button
                        variant="contained"
                        onClick={() => submitDetails()}
                        fullWidth
                        size="large"
                        disabled={
                          !fullName || !contactNumber || !email || !inquiry
                        }
                      >
                        Submit
                      </Button>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </ContentStyle>
  );
}
