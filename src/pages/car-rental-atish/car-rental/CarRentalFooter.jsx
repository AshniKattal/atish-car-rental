import {
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { styled } from "@mui/material/styles";
import Logo from "src/components/Logo";
import SocialsButton from "src/components/SocialsButton";
import LogoAtishPNG from "../../logo-images/car-rental-atish/LogoAtish.png";

const LINKS = [
  {
    headline: "Contact",
    children: [
      { name: "support@minimals.cc", href: "#" },
      { name: "Los Angeles, 359  Hidden Valley Road", href: "#" },
    ],
  },
];

const RootStyle = styled("div")(({ theme }) => ({
  marginTop: "4em",
  position: "relative",
  backgroundColor: theme.palette.background.default,
}));

const CarRentalFooter = () => {
  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{ xs: "center", md: "space-between" }}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Grid item xs={8} md={3}>
            <Box sx={{ width: 200, height: "auto" }}>
              <img
                src={LogoAtishPNG}
                style={{ background: "transparent" }}
                alt="logoImage"
              />
            </Box>

            <Stack
              direction="row"
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={3}
              direction={{ xs: "column", md: "row" }}
              justifyContent="flex-end"
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography variant="h4" color="primary">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    <Typography variant="subtitle1">{link.name}</Typography>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          component="p"
          variant="body2"
          sx={{
            mt: 10,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {`© ${moment(new Date()).format("YYYY")}. All rights reserved`}
        </Typography>
      </Container>
    </RootStyle>
  );
};

export default CarRentalFooter;
