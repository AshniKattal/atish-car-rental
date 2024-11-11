import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar } from "@mui/material";
// hooks
import useOffSetTop from "../../../hooks/useOffSetTop";
// utils
import cssStyles from "../../../utils/cssStyles";
// config
import { HEADER } from "../../../config";
// components
import Iconify from "../../../components/Iconify";
import { IconButtonAnimate } from "../../../components/animate";
import AccountPopover from "./AccountPopover";
import Logo from "../../../components/Logo";
import useResponsive from "../../../hooks/useResponsive";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { selectTemplate } from "src/features/templateSlice";

const SearchComponent = lazy(() =>
  import("../../../components/search/SearchComponent")
);

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== "isCollapse" && prop !== "isOffset" && prop !== "verticalLayout",
})(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: "none",
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  verticalLayout = false,
}) {
  const isOffset =
    useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive("up", "lg");

  const { template } = useSelector(selectTemplate);

  return (
    <RootStyle
      isCollapse={isCollapse}
      isOffset={isOffset}
      verticalLayout={verticalLayout}
    >
      <Toolbar
        sx={{
          minHeight: "100% !important",
          px: { lg: 5 },
        }}
      >
        {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

        {!isDesktop && (
          <IconButtonAnimate
            onClick={onOpenSidebar}
            sx={{ mr: 1, color: "text.primary" }}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButtonAnimate>
        )}

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          {/*
          <LanguagePopover />
          <NotificationsPopover />
          <ContactsPopover />
          */}

          {window &&
          window.location &&
          window.location.pathname &&
          (window.location.pathname === "/dashboard/app1" ||
            window.location.pathname === "/") &&
          template !== process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
            <Suspense fallback={<></>}>
              <SearchComponent />
            </Suspense>
          ) : (
            <></>
          )}
          <AccountPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
