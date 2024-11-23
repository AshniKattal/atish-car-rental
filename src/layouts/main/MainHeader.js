import "animate.css";
import { useNavigate } from "react-router-dom";
// @mui
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  AppBar,
  Toolbar,
  Container,
  Button,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Alert,
} from "@mui/material";
// utils
import cssStyles from "../../utils/cssStyles";
// config
import { HEADER } from "../../config";
// components
import useAuth from "../../hooks/useAuth";
import { PATH_AUTH, PATH_DASHBOARD } from "../../routes/paths";
import Logo from "../../components/Logo";
import { lazy, Suspense, useState } from "react";
import useResponsive from "../../hooks/useResponsive";
import { useDispatch, useSelector } from "react-redux";
import { selectTemplate } from "src/features/templateSlice";
import useOffSetTop from "src/hooks/useOffSetTop";
import RegistrationForm from "src/pages/home/registrationDialog/RegistrationDialog";
import {
  selectRegister,
  setCallLocation,
  setOpenDialog,
} from "src/features/registerSlice";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useSettings from "src/hooks/useSettings";
// import Lottie from "lottie-react";
// import LottieLogo from "../../components/logo/Lottie-only-logo.json";

const RegisterButton = lazy(() => import("../../pages/home/RegisterButton"));

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("md")]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: "auto",
  borderRadius: "50%",
  position: "absolute",
  width: "100%", // `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainHeader() {
  const { onToggleMode } = useSettings();

  const dispatch = useDispatch();

  const { template } = useSelector(selectTemplate);

  const { openDialog } = useSelector(selectRegister);

  const { user } = useAuth();

  const navigate = useNavigate();

  const theme = useTheme();

  const isDesktop = useResponsive("up", "md");

  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  return (
    <>
      <AppBar sx={{ boxShadow: 0, bgcolor: "transparent" }}>
        <ToolbarStyle
          disableGutters
          sx={{
            ...(isOffset && {
              ...cssStyles(theme).bgBlur(),
              height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
            }),
          }}
        >
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack
              spacing={3}
              direction="row"
              justifyContent={"center"}
              alignItems={"center"}
              sx={{
                display:
                  (isOffset &&
                    template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH &&
                    window.location.pathname === "/") ||
                  (template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH &&
                    window.location.pathname !== "/") ||
                  template === process.env.REACT_APP_OWNER_SLARKS
                    ? ""
                    : "none",
              }}
            >
              {isDesktop ? (
                <Stack
                  spacing={1}
                  direction="row"
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  {template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
                    <Logo />
                  ) : template === process.env.REACT_APP_OWNER_SLARKS ? (
                    <>
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
                    </>
                  ) : (
                    <></>
                  )}
                </Stack>
              ) : (
                <Box sx={{ width: 50, height: 50 }}>
                  <Logo />
                </Box>
              )}
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: "1px" }}>
              {template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
                <Tooltip title="Website is under construction, Please register an account for now, and we will contact you later. Thank you.">
                  <Alert severity="error">
                    {isDesktop
                      ? "The website is still in development phase"
                      : "Development phase"}
                  </Alert>
                </Tooltip>
              ) : (
                <></>
              )}

              {theme.palette.mode === "light" ? (
                <Tooltip title="Dark mode">
                  <IconButton size="large" onClick={() => onToggleMode()}>
                    <DarkModeIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Light mode">
                  <IconButton size="large" onClick={() => onToggleMode()}>
                    <LightModeIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              )}

              {user &&
              user !== null &&
              user !== undefined &&
              user?.id !== undefined &&
              user?.id !== "" ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(PATH_DASHBOARD.general.app1);
                  }}
                  className="animate__animated animate__fadeIn animate__delay-1s"
                  size="large"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Suspense fallback={<></>}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(setCallLocation("header"));
                        dispatch(setOpenDialog(true));
                      }}
                      className="animate__animated animate__fadeIn animate__delay-1s"
                      size="large"
                    >
                      Sign up
                    </Button>
                  </Suspense>

                  <div style={{ padding: "5px" }}></div>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      navigate(PATH_AUTH.login);
                    }}
                    className="animate__animated animate__fadeIn animate__delay-1s"
                    size="large"
                  >
                    Log in
                  </Button>
                </>
              )}
            </Box>
          </Container>
        </ToolbarStyle>

        {<ToolbarShadowStyle />}
      </AppBar>

      {openDialog ? <RegistrationForm open={openDialog} /> : <></>}
    </>
  );
}
