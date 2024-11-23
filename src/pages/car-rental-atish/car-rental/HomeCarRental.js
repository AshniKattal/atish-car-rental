// @mui
import { styled } from "@mui/material/styles";
// components
import Page from "../../../components/Page";
// sections
/* import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
} from "../sections/home"; */
/* import HomeBanner from "../components/platform/home/HomeBanner"; */

import VehicleListing from "./vehicle-list/VehicleListing";
import OverviewSection from "./OverviewSection";
import HomeAdvertisement from "./HomeAdvertisement";
import Map from "./Map";
import CompanyDescription from "./company-description/CompanyDescription";
import Faqs from "./company-FAQ/Faqs";
import { lazy, Suspense, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { setBookingData } from "src/features/bookingSlice";

const CarRentalHomeBanner = lazy(() => import("./CarRentalHomeBanner"));

// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
  height: "100%",

  //marginTop: "1em",
}));

const ContentStyle = styled("div")(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.palette.background.default,
  // backgroundColor: "#F0F4FC",
}));

// ----------------------------------------------------------------------

export default function HomeCarRental() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBookingData({
        bookingPickupAddress: null,
        bookingPickupAnywhereAddress: "",
        bookingPickupDate: new Date(),
        bookingPickupTime: "00:00",
        bookingReturnDate: new Date(),
        bookingReturnTime: "00:00",
        bookingNumberOfDays: 0,
        bookingBabySeatQty: 0,
        bookingBoosterSeatQty: 0,
        bookingChildSeatQty: 0,
        bookingTotalAmount: 0,
      })
    );
  }, []);

  return (
    <Page title="Home page">
      <RootStyle>
        <Suspense
          fallback={
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          }
        >
          <CarRentalHomeBanner />
        </Suspense>

        <ContentStyle>
          <Suspense
            fallback={
              <div
                style={{
                  minHeight: "75vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <VehicleListing />
          </Suspense>

          <Suspense
            fallback={
              <div
                style={{
                  minHeight: "75vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <CompanyDescription />
          </Suspense>

          <Suspense
            fallback={
              <div
                style={{
                  minHeight: "75vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <Faqs />
          </Suspense>

          <Suspense
            fallback={
              <div
                style={{
                  minHeight: "75vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <HomeAdvertisement />
          </Suspense>

          <Suspense
            fallback={
              <div
                style={{
                  minHeight: "75vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            }
          >
            <Map />
          </Suspense>
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
