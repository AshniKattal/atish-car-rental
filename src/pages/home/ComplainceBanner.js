import {
  Card,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MraLogo from "./MRALogo.jpg";
import backgroundImage from "./features/images/wave_background.png";

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(
  ({ theme }) => ({
    zIndex: 10,
    paddingBottom: theme.spacing(10),
    margin: "auto",
    position: "relative",
    [theme.breakpoints.up("md")]: {
      margin: "unset",
    },
  })
);

export default function ComplainceBanner() {
  return (
    <>
      <ContentStyle>
        <Container maxWidth="md">
          <Card
            sx={{
              p: 5,
              /* background:
                "rgba(51, 122, 210, 0.5)" /* theme.palette.primary.main  */
              backgroundImage: `url(${backgroundImage})`,
            }}
            data-aos="fade-in"
            data-aos-easing="linear"
            data-aos-delay={250}
          >
            <Grid
              container
              spacing={5}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Grid item xs={12} sm={5} md={5}>
                <Typography style={{ color: "#333333" }} variant="h4">
                  PlusInvoice powered by PlusMauritius is compliant with the MRA
                  e-invoicing requirements and has been registered as an EBS
                  solution provider.
                </Typography>
              </Grid>
              <Grid item xs={8} sm={5} md={4}>
                <Card>
                  <CardMedia
                    image={MraLogo}
                    alt="MRA Logo"
                    component="img"
                    style={{ width: "100%" }}
                  />
                </Card>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </ContentStyle>
    </>
  );
}
