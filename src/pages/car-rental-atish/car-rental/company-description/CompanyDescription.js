import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { MotionInView, varFade } from "src/components/animate";
import AboutUs from "../AboutUs.png";
import useSettings from "src/hooks/useSettings";

export default function CompanyDescription() {
  const theme = useTheme();

  const { themeStretch } = useSettings();

  return (
    <div
      style={{
        position: "relative",
        paddingTop: theme.spacing(20),
        paddingBottom: theme.spacing(20),
        backgroundColor: theme.palette.grey[300],
      }}
    >
      <Container maxWidth={themeStretch ? false : "xl"}>
        <Grid container spacing={5} style={{ height: "100%" }}>
          <Grid item xs={12} md={6} style={{ height: "100%" }}>
            <div
              style={{
                height: "425px",
                boxShadow: 10,
                backgroundImage: `url(${AboutUs})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "25px",
              }}
            ></div>
          </Grid>
          <Grid item xs={12} md={6} style={{ height: "100%" }}>
            <Card style={{ padding: "50px", boxShadow: 10, height: "100%" }}>
              <MotionInView variants={varFade({ durationIn: 1 }).inLeft}>
                <Typography variant="h3">About us</Typography>
              </MotionInView>

              <br />
              <br />
              <MotionInView variants={varFade({ durationIn: 2 }).inLeft}>
                <Typography variant="body3">Welcome to RHL cars!</Typography>
              </MotionInView>
              <br />

              <MotionInView variants={varFade({ durationIn: 2 }).inLeft}>
                <Typography variant="body3">
                  We're dedicated to making your rental experience smooth and
                  enjoyable from start to finish. Our team is here to support
                  you every step of the way.
                </Typography>
              </MotionInView>
              <br />
              <MotionInView variants={varFade({ durationIn: 3 }).inLeft}>
                <Typography variant="body3">
                  Looking for corporate rates or repeat customet discounts?
                  We've got you covered! At RHL Cars, we go extra mile to make
                  sure your time in Mauritius is nothing short of amazing. Let
                  us help you make your journey unforgettable!
                </Typography>
              </MotionInView>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
