import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LandingBookingForm from "./booking-form/LandingBookingForm";
import { MotionInView, varFade } from "src/components/animate";
import { pxToRem, responsiveFontSizes } from "src/utils/getFontValue";
import "./Home.css";
import CarImg1 from "./Car-rent-img2.png";
import useResponsive from "src/hooks/useResponsive";
import { useEffect, useState } from "react";
import useSettings from "src/hooks/useSettings";

const RootStyle = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(5),
  [theme.breakpoints.up("md")]: {
    paddingBottom: theme.spacing(10),
  },
  position: "relative",
  overflow: "hidden",
}));

const StyledGridContainer = styled(({ backgroundImage, ...props }) => (
  <Grid {...props} />
))(({ backgroundImage, theme }) => ({
  minHeight: "550px",
  display: "flex",
  padding: theme.spacing(6),
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundColor: "#4A00E0",
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up("md")]: {
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default function CarRentalHomeBanner({
  backgroundImage = "https://picsum.photos/1600/900?blur",
}) {
  const { themeStretch } = useSettings();

  const isDesktopXL = useResponsive("only", "xl");

  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const theme = useTheme();

  return (
    <RootStyle>
      {/*     <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
          height: "20%",
          background: `linear-gradient(to bottom, rgba(255,0,0,0) 0%, ${theme.palette.background.default} 100%)`,
        }}
      ></div> */}
      <div
        className="animatedBackground"
        style={{
          //backgroundImage: `url(${CarImg1})`,
          backgroundImage: `url(${CarImg1})`,
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
          opacity: "0.8",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <Container maxWidth={themeStretch ? false : "xl"}>
        {/*  <StyledGridContainer
          container
          backgroundImage={backgroundImage}
          gap={4}
        > */}
        <div style={{ zIndex: 10 }}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sm={6}
              md={7}
              style={{
                minHeight: "100vh",
              }}
            >
              <Grid
                container
                spacing={3}
                alignItems={"center"}
                justifyContent={isDesktopXL ? "flex-start" : "center"}
                style={{ height: "100%" }}
              >
                <Grid item xs={12} md={9}>
                  <Stack
                    spacing={3}
                    className="scroll-up-text"
                    sx={{ marginTop: theme.spacing(20) }}
                  >
                    <MotionInView variants={varFade({ durationIn: 1 }).inLeft}>
                      <Typography
                        className="gradient-move "
                        variant="h3"
                        sx={{
                          background:
                            "linear-gradient(90deg, #ffffff, #ffffff, #708D81, #708D81)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",

                          animation: "gradient-move 10s infinite",
                          backgroundSize: "150% 150%",
                          fontWeight: 900,
                          lineHeight: 70 / 64,
                          fontSize: pxToRem(60),
                          letterSpacing: "-.03125rem",
                          ...responsiveFontSizes({ sm: 60, md: 70, lg: 80 }),

                          transform: `translateY(-${scrollPosition * 0.5}px)`,
                        }}
                      >
                        RENT A
                      </Typography>

                      <Typography
                        className="gradient-move"
                        variant="h3"
                        sx={{
                          background:
                            "linear-gradient(90deg, #ffffff, #ffffff, #708D81, #708D81)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",

                          animation: "gradient-move 10s infinite",
                          backgroundSize: "150% 150%",
                          fontWeight: 900,
                          lineHeight: 70 / 64,
                          fontSize: pxToRem(60),
                          letterSpacing: "-.03125rem",
                          ...responsiveFontSizes({ sm: 60, md: 70, lg: 80 }),

                          transform: `translateY(-${scrollPosition * 0.3}px)`,
                        }}
                      >
                        CAR TODAY
                      </Typography>
                    </MotionInView>

                    <MotionInView variants={varFade({ durationIn: 2 }).inLeft}>
                      <Typography
                        variant="h4"
                        style={{
                          //fontSize: "20px",
                          lineHeight: "30px",
                          //marginTop: "1em",
                          color: theme.palette.grey[700],

                          transform: `translateY(-${scrollPosition * 0.2}px)`,
                        }}
                      >
                        GET THE LOWEST RENTAL CAR HERE
                      </Typography>
                    </MotionInView>

                    <MotionInView variants={varFade({ durationIn: 2 }).inLeft}>
                      <Typography
                        variant="h6"
                        style={{
                          fontWeight: "bold",
                          color: "#ffffff",

                          transform: `translateY(-${scrollPosition * 0.1}px)`,
                        }}
                      >
                        Reaching Heights Ltd delivers exceptional value with
                        unbeatable deals, affordable prices, and top-tier
                        service to meet all your needs.
                      </Typography>
                    </MotionInView>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            {/*          <Grid item xs={12} md={5}>
            <Card elevation={5}>
              <CardContent>
                <LandingBookingForm />
              </CardContent>
            </Card>
          </Grid> */}
          </Grid>
          {/*      </StyledGridContainer> */}
        </div>
      </Container>
    </RootStyle>
  );
}
