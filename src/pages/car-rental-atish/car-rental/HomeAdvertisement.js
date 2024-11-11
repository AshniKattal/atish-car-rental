import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  TextField,
  useTheme,
} from "@mui/material";
// components
import { MotionInView, varFade } from "../../../components/animate";
// import bannerImage from "../../bannerImage/fertositewebbackground.png";
import { useState } from "react";

import { useDispatch } from "react-redux";
import db from "../../../firebase";
import firebase from "firebase/compat";
import { useSnackbar } from "notistack";
import { setLoading } from "../../../features/globalSlice";

// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "4em",
    zIndex: 999,
    minHeight: "50vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.down("md")]: {
      padding: "2em",
      minHeight: 0,
    },
  },
}));

export default function HomeAdvertisement() {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const classes = useStyles();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function saveRequest() {
    dispatch(setLoading(true));

    await db
      .collection("request")
      .add({
        fullName: fullName,
        email: email,
        subject: subject,
        message: message,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        enqueueSnackbar("Your request has been registered successfully.");
        setEmail("");
        dispatch(setLoading(false));
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while saving request: ${error?.message}`,
          {
            variant: "error",
          }
        );
        dispatch(setLoading(false));
      });
  }

  return (
    <div style={{ backgroundColor: theme.palette.grey[200] }}>
      <Container
        maxWidth="lg"
        style={{
          paddingTop: theme.spacing(20),
          paddingBottom: theme.spacing(20),
        }}
      >
        <Card
          style={{ position: "relative", borderRadius: "2em", boxShadow: 20 }}
        >
          <Grid
            container
            alignContent={"center"}
            justifyContent={"center"}
            style={{ zIndex: 999, width: "100%" }}
          >
            <Grid item xs={12} md={5} className={classes.container}>
              <MotionInView variants={varFade().inUp} sx={{ mb: 5 }}>
                <Typography
                  variant="h2"
                  color={"primary"}
                  sx={{
                    background:
                      "linear-gradient(90deg, #d8ac04, #F4D58D, #708D81, #708D81)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",

                    animation: "gradient-move 10s infinite",
                    backgroundSize: "150% 150%",
                  }}
                >
                  Request a call back
                </Typography>
                <br />
                <Typography variant="subtitle1">
                  We will get back to you within 2 weekdays
                </Typography>
              </MotionInView>
            </Grid>
            <Grid item xs={12} md={7} className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Full name"
                    variant="outlined"
                    size="large"
                    fullWidth
                    name="fullName"
                    type="text"
                    id="fullName"
                    value={fullName || ""}
                    onChange={(event) => {
                      setFullName(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Email address"
                    variant="outlined"
                    size="large"
                    fullWidth
                    name="email"
                    type="text"
                    id="email"
                    value={email || ""}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Subject"
                    variant="outlined"
                    size="large"
                    fullWidth
                    name="subject"
                    type="text"
                    id="subject"
                    value={subject || ""}
                    onChange={(event) => {
                      setSubject(event.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    label="Message"
                    variant="outlined"
                    size="large"
                    fullWidth
                    name="message"
                    type="text"
                    id="message"
                    value={message || ""}
                    onChange={(event) => {
                      setMessage(event.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={12} align="right">
                  <MotionInView variants={varFade().inRight} sx={{ mb: 5 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={!fullName || !email || !subject || !message}
                      onClick={() => saveRequest()}
                    >
                      Submit request
                    </Button>
                  </MotionInView>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Card>

        {/* <MotionInView variants={varFade().inDown}>
            <Button
              size="large"
              variant="contained"
              target="_blank"
              rel="noopener"
              href="https://material-ui.com/store/items/minimal-dashboard/"
              sx={{
                whiteSpace: "nowrap",
                boxShadow: (theme) => theme.customShadows.z8,
                color: (theme) =>
                  theme.palette.getContrastText(theme.palette.common.white),
                bgcolor: "common.white",
                "&:hover": { bgcolor: "grey.300" },
              }}
            >
              Purchase Now
            </Button>
          </MotionInView> */}

        <br />
        <br />
      </Container>
    </div>
  );
}
