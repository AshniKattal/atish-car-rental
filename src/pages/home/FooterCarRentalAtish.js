import "../car-rental-atish/car-rental/Home.css";
// @mui
import { styled } from "@mui/material/styles";
import {
  Grid,
  Container,
  Typography,
  Stack,
  Box,
  useTheme,
  Button,
} from "@mui/material";
// routes
import SocialsButton from "../../components/SocialsButton";
import moment from "moment";
import logoImg from "../../components/logo/LogoCarRentalAtish.png";
import "../car-rental-atish/car-rental/Home.css";
import { useEffect, useState } from "react";
import useResponsive from "src/hooks/useResponsive";

// ----------------------------------------------------------------------

const LINKS = [
  /*   {
    name: "BRN: C24208214",
    href: "#",
  }, */
  {
    name: "(+230) 57752433",
    href: "tel:+23057752433",
  },
  /*   {
    name: "(+230) 5258-3282",
    href: "tel:+23052583282",
  }, */
  {
    name: "info@reachingheightsltd.com",
    href: "mailto:info@reachingheightsltd.com",
  },
];

// const LINKSRentalDesk = [
//   {
//     name: `SSR International - Airport of Mauritius,`,
//     href: "https://maps.app.goo.gl/hg2Fg8dAvvrqXQfm9",
//   },
//   {
//     name: `Plaine Magnien,`,
//     href: "https://maps.app.goo.gl/hg2Fg8dAvvrqXQfm9",
//   },
//   {
//     name: `Mauritius`,
//     href: "https://maps.app.goo.gl/hg2Fg8dAvvrqXQfm9",
//   },
// ];

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.grey[200],
}));

// ----------------------------------------------------------------------

export default function FooterCarRentalAtish() {
  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    // seconds: "00",
  });

  const [isOutsideBusinessHours, setIsOutsideBusinessHours] = useState(false); // Boolean state

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = moment();
      const startOfDay = moment().set({ hour: 6, minute: 0, second: 0 }); // 5 AM
      const endOfDay = moment().set({ hour: 21, minute: 0, second: 0 }); // 5 PM

      // Check if the current time is outside 6 AM - 9 PM
      if (now.isBefore(startOfDay) || now.isAfter(endOfDay)) {
        setIsOutsideBusinessHours(true);
      } else {
        setIsOutsideBusinessHours(false);
      }
    };

    const calculateTimeLeft = () => {
      const now = moment();
      const targetTime = moment().set({ hour: 21, minute: 0, second: 0 });

      if (now.isAfter(targetTime)) {
        return { hours: "00", minutes: "00" /* , seconds: "00" */ };
      }

      const duration = moment.duration(targetTime.diff(now));

      return {
        hours: String(Math.floor(duration.asHours())).padStart(2, "0"),
        minutes: String(duration.minutes()).padStart(2, "0"),
        // seconds: String(duration.seconds()).padStart(2, "0"),
      };
    };

    const updateCountdown = () => {
      checkBusinessHours();
      setTimeLeft(calculateTimeLeft());
    };

    // Initial calculation
    updateCountdown();

    // Update the countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const LINKSOpeningHours = [
    {
      name: "Mon – Sun (06:00 to 21:00)",
      href: "#",
    },
    {
      name: !isOutsideBusinessHours
        ? `Closing in ${timeLeft.hours} : ${timeLeft.minutes}.`
        : "",
      href: "#",
    },
    {
      name: isOutsideBusinessHours
        ? "Sorry, we are currently closed"
        : "We are currently open",
      href: "#",
    },
  ];

  return (
    <RootStyle>
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          spacing={4}
          style={{ paddingBottom: theme.spacing(10) }}
        >
          {/*   <Grid item xs={12} md={12} style={{ paddingBottom: "1em" }}>
            <div align={isDesktop ? "left" : "center"}>
              <Box sx={{ width: 225, height: 100 }}>
                <img src={logoImg} alt="logo" />
              </Box>
            </div>
          </Grid> */}
          <Grid item xs={12} md={4}>
            <div align={isDesktop ? "left" : "center"}>
              <Stack
                spacing={1}
                alignItems={isDesktop ? "flex-start" : "center"}
              >
                <Box sx={{ width: 225, height: 100 }}>
                  <img src={logoImg} alt="logo" />
                </Box>
                {/*  <Typography
                  variant="h5"
                  sx={{
                    color: "#708D81",
                    paddingBottom: "1em",
                  }}
                >
                  Rental Desk
                </Typography>
                {LINKSRentalDesk.map((link) => (
                  <Typography
                    variant="body3"
                    align={isDesktop ? "left" : "center"}
                    component="a"
                    href={link.href !== "#" ? link.href : undefined}
                    style={{ textDecoration: "none" }}
                    color={"primary"}
                  >
                    {link.name}
                  </Typography>
                ))} */}

                <br />
                <br />
                <div align={isDesktop ? "left" : "center"}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      window.open(
                        "https://maps.app.goo.gl/hg2Fg8dAvvrqXQfm9",
                        "_blank"
                      );
                    }}
                    fullWidth={false}
                    size="large"
                    style={{ width: "225px" }}
                  >
                    Direction
                  </Button>
                </div>
              </Stack>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isDesktop ? "flex-end" : "center",
              }}
            >
              <Stack spacing={1}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#708D81",
                    paddingBottom: "1em",
                  }}
                  align={isDesktop ? "left" : "center"}
                >
                  Company Info
                </Typography>

                {LINKS.map((link) => (
                  <Typography
                    variant="body3"
                    align={isDesktop ? "left" : "center"}
                    component="a"
                    href={link.href !== "#" ? link.href : undefined}
                    style={{ textDecoration: "none" }}
                    color={"primary"}
                  >
                    {link.name}
                  </Typography>
                ))}
              </Stack>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isDesktop ? "flex-end" : "center",
              }}
            >
              <Stack spacing={1}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#708D81",
                    paddingBottom: "1em",
                  }}
                  align={isDesktop ? "left" : "center"}
                >
                  Opening Hours
                </Typography>

                {LINKSOpeningHours.map((link) => (
                  <Typography
                    variant="body3"
                    align={isDesktop ? "left" : "center"}
                    component="a"
                    href={link.href !== "#" ? link.href : undefined}
                    style={{ textDecoration: "none" }}
                    color={"primary"}
                  >
                    {link.name}
                  </Typography>
                ))}
              </Stack>
            </div>
          </Grid>

          <Grid item xs={12} md={12} align={"right"} style={{ width: "100%" }}>
            <Grid
              container
              justifyContent={isDesktop ? "flex-start" : "center"}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Grid>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{
            mt: 5,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: "center", md: "center" },
          }}
        >
          {`© ${moment(new Date()).format("YYYY")}. All rights reserved.`}
        </Typography>
      </Container>
    </RootStyle>
  );
}
