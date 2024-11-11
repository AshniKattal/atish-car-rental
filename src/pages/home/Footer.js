// @mui
import { styled } from "@mui/material/styles";
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
  Box,
  useTheme,
} from "@mui/material";
// routes

// components
import Logo from "../../components/Logo";

import moment from "moment";
import LogoPNG from "./features/images/fertositeweb.png";

// ----------------------------------------------------------------------

const LINKS = [
  /*   {
    headline: "Legal",
    children: [
      { name: "Terms and Condition", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  }, */
  {
    headline: "Contact",
    children: [
      { name: "(+230) 5 929 12 09", href: "#" },
      { name: "contact@fertositeweb.com", href: "#" },
      { name: "Avenue Soobiah, Reduit. ", href: "#" },
      { name: "Mauritius", href: "#" },
    ],
  },
];

const RootStyle = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function Footer() {
  const theme = useTheme();

  return (
    <RootStyle>
      <Divider />
      <Container maxWidth="md">
        <Grid
          container
          justifyContent={{ xs: "center", md: "space-between" }}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Grid item xs={12} sx={{ mt: 3, pb: 3 }}>
            <Stack
              spacing={1}
              direction="row"
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <Logo />
              <Typography
                variant="h4"
                style={{
                  color:
                    theme.palette.mode === "light"
                      ? theme.palette.text.primary
                      : "",
                }}
              >
                PlusInvoice Mauritius
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            <Stack
              direction={"column"}
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <Typography variant="h5">Powered by</Typography>
              <Box sx={{ width: 300, height: 100 }}>
                <img
                  src={LogoPNG}
                  style={{ background: "transparent" }}
                  alt="logoImage"
                />
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              spacing={5}
              direction={{ xs: "column", md: "row" }}
              justifyContent="flex-end"
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="subtitle1">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    <Link
                      to={link.href}
                      key={link.name}
                      color="inherit"
                      variant="body2"
                      // component={RouterLink}
                      sx={{ display: "block" }}
                    >
                      <Typography variant="body1">{link.name}</Typography>
                    </Link>
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
}
