import { Outlet } from "react-router-dom";
// @mui
import { Box, Stack } from "@mui/material";
// components
//
import MainHeader from "./MainHeader";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectTemplate } from "src/features/templateSlice";
import { lazy, Suspense } from "react";

const FooterCarRentalAtish = lazy(() =>
  import("src/pages/home/FooterCarRentalAtish")
);

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const { template } = useSelector(selectTemplate);

  const { user } = useAuth();

  return (
    <Stack sx={{ minHeight: 1 }}>
      {template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ||
      !user?.id ? (
        <MainHeader />
      ) : (
        <></>
      )}

      {children ? children : <Outlet />}

      <Box sx={{ flexGrow: 1 }} />

      {template === process.env.REACT_APP_OWNER_CAR_RENTAL_ATISH ? (
        <Suspense fallback={<></>}>
          <FooterCarRentalAtish />
        </Suspense>
      ) : (
        <></>
      )}
    </Stack>
  );
}
