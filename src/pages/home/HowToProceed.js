import "./HowToProceed.css";
import { Card, Container, Grid, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MotionContainer } from "../../components/animate";
import { useTheme } from "@mui/material/styles";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import LoginIcon from "@mui/icons-material/Login";

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    zIndex: 10,
    minHeight: "50vh",
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
    //maxWidth: 520,
    margin: "auto",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.up("md")]: {
      margin: "unset",
    },
  })
);

export default function HowToProceed() {
  const theme = useTheme();
  return (
    <div
      /* className="backgroundGradient" */
      style={{
        position: "relative",
        background:
          theme.palette.mode === "light"
            ? "rgba(211, 211, 211, 0.2)"
            : "rgba(211, 211, 211, 0.9)",
        /*         backgroundImage: `url(${imageBackground})`, //theme.palette.grey[100],
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat", */
        minHeight: "40vh",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <MotionContainer>
        <Container>
          <ContentStyle>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <div data-aos="fade-up">
                  <Typography variant="h3" sx={{ textAlign: "left" }}>
                    How to proceed
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <div
                  data-aos="fade-zoom-in"
                  data-aos-easing="ease-in-back"
                  data-aos-delay="300"
                  data-aos-offset="0"
                  style={{ height: "100%" }}
                >
                  <Card style={{ height: "100%" }}>
                    <Stack sx={{ p: 3 }} spacing={1}>
                      <div
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          width: "40px",
                          padding: "5px",
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <HowToRegIcon fontSize="large" />
                      </div>
                      <Typography variant="subtitle1">
                        Register to PlusInvoice
                      </Typography>
                      <Typography variant="body1">
                        Fill in the register form which includes details of user
                        and company details
                      </Typography>
                    </Stack>
                  </Card>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <div
                  data-aos="fade-zoom-in"
                  data-aos-easing="ease-in-back"
                  data-aos-delay="500"
                  data-aos-offset="0"
                  style={{ height: "100%" }}
                >
                  <Card style={{ height: "100%" }}>
                    <Stack sx={{ p: 3 }} spacing={1}>
                      <div
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          width: "40px",
                          padding: "5px",
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <SettingsPhoneIcon fontSize="large" />
                      </div>

                      <Typography variant="subtitle1">
                        Our team will contact you within 2 business days
                      </Typography>
                      <Typography variant="body1">
                        We will review the registration details and contact you
                        to confirm all the features and if you need to add some
                        custom features
                      </Typography>
                    </Stack>
                  </Card>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <div
                  data-aos="fade-zoom-in"
                  data-aos-easing="ease-in-back"
                  data-aos-delay="700"
                  data-aos-offset="0"
                  style={{ height: "100%" }}
                >
                  <Card style={{ height: "100%" }}>
                    <Stack sx={{ p: 3 }} spacing={1}>
                      <div
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          width: "40px",
                          padding: "5px",
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <DocumentScannerIcon fontSize="large" />
                      </div>

                      <Typography variant="subtitle1">
                        Choose Invoice template or use your current invoice and
                        configure the each document number reached
                      </Typography>
                      <Typography variant="body1">
                        Either choose standard invoice template or we can make
                        your current invoice template.
                      </Typography>
                    </Stack>
                  </Card>
                </div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <div
                  data-aos="fade-zoom-in"
                  data-aos-easing="ease-in-back"
                  data-aos-delay="900"
                  data-aos-offset="0"
                  style={{ height: "100%" }}
                >
                  <Card style={{ height: "100%" }}>
                    <Stack sx={{ p: 3 }} spacing={1}>
                      <div
                        style={{
                          border: "1px solid black",
                          borderRadius: "10px",
                          width: "40px",
                          padding: "5px",
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LoginIcon fontSize="large" />
                      </div>

                      <Typography variant="subtitle1">
                        Get access and start using the software
                      </Typography>
                      <Typography variant="body1">
                        You will receive an email containing the credentials to
                        access PlusInvoice
                      </Typography>
                    </Stack>
                  </Card>
                </div>
              </Grid>
            </Grid>
          </ContentStyle>
        </Container>
      </MotionContainer>

      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
