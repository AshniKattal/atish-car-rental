import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { styled, useTheme } from "@mui/material/styles";
import { HEADER } from "src/config";
import useOffSetTop from "src/hooks/useOffSetTop";
import cssStyles from "src/utils/cssStyles";
import { useLocation } from "react-router";
import useResponsive from "src/hooks/useResponsive";
import { IconButtonAnimate } from "src/components/animate";
import Iconify from "src/components/Iconify";
import Scrollbar from "src/components/Scrollbar";
import LogoAtishPNG from "../../logo-images/car-rental-atish/LogoAtish.png";
import useAuth from "src/hooks/useAuth";

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
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

const NavLinkStyled = styled(Button)(() => ({
  fontWeight: "normal",
}));

const DesktopMenu = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const { isAuthenticated } = useAuth();

  return (
    <>
      <Box display="flex" gap={3}>
        <NavLinkStyled
          color="inherit"
          sx={isHome && { fontWeight: "900", bgcolor: "rgba(74, 0, 224, 0.1)" }}
        >
          Home
        </NavLinkStyled>
        <NavLinkStyled color="inherit">Vehicles</NavLinkStyled>
        {/* <NavLinkStyled color="inherit">Details</NavLinkStyled> */}
        <NavLinkStyled color="inherit">About Us</NavLinkStyled>
        <NavLinkStyled color="inherit">Contact Us</NavLinkStyled>
        {!isAuthenticated ? (
          <>
            <NavLinkStyled href="/auth/register" color="inherit">
              Register
            </NavLinkStyled>

            <NavLinkStyled href="/auth/login" color="inherit">
              Login
            </NavLinkStyled>
          </>
        ) : (
          <NavLinkStyled href="/dashboard/client-dashboard" color="inherit">
            Dashboard
          </NavLinkStyled>
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <IconButton edge="end" color="info" aria-label="phone">
          <LocalPhoneIcon />
        </IconButton>
        <Box textAlign="right">
          <Typography variant="body2">Need help?</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            +230 5895-XXXX
          </Typography>
        </Box>
      </Box>
    </>
  );
};

const MobileMenu = () => {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  const toggleDrawer = (value = open) => {
    setOpen(!value);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={() => toggleDrawer()}
        sx={{
          ml: 1,
          ...(isHome && { color: "common.white" }),
          ...(isOffset && { color: "text.primary" }),
        }}
      >
        <Iconify icon={"eva:menu-2-fill"} color="#4A00E0" />
      </IconButtonAnimate>

      <Drawer
        open={open}
        onClose={() => toggleDrawer()}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { pb: 5, width: 260 } }}
        anchor="right"
      >
        <Scrollbar>
          <List disablePadding>
            <ListItemButton sx={isHome && { fontWeight: "900" }}>
              Home
            </ListItemButton>
            <ListItemButton>Vehicles</ListItemButton>
            <ListItemButton>Details</ListItemButton>
            <ListItemButton>About Us</ListItemButton>
            <ListItemButton>Contact Us</ListItemButton>
          </List>
        </Scrollbar>
      </Drawer>
    </>
  );
};

const CarRentalHeader = () => {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  return (
    <AppBar
      sx={{ boxShadow: 0, bgcolor: "transparent", color: "common.black" }}
    >
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
            justifyContent: "space-between",
          }),
        }}
      >
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            {/* <IconButton edge="start" color="inherit" aria-label="logo">
              <DirectionsCarIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              Car Rental
            </Typography> */}

            {process.env.REACT_APP_OWNER === "carrentalatish" ? (
              <img
                src={LogoAtishPNG}
                style={{ background: "transparent", width: 130, height: 55 }}
                alt="logoImage"
              />
            ) : (
              "Look4"
            )}
          </Box>
          {isDesktop ? <DesktopMenu /> : <MobileMenu />}
        </Container>
      </ToolbarStyle>
      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
};

export default CarRentalHeader;
