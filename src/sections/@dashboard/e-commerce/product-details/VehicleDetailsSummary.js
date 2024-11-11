import PropTypes from "prop-types";
// @mui
import { styled } from "@mui/material/styles";
import { Typography, Grid, Button, Divider } from "@mui/material";
import { useState } from "react";
import BookingStepOne from "./booking/BookingStepOne";
import BookingStepTwo from "./booking/BookingStepTwo";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "src/features/globalSlice";
import { useSnackbar } from "notistack";
import useAuth from "src/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { PATH_DASHBOARD } from "src/routes/paths";
import { selectBooking, setBookingData } from "src/features/bookingSlice";
import { setCallLocation, setOpenDialog } from "src/features/registerSlice";
import BookingVehiclePricingSummary from "./booking/BookingVehiclePricingSummary";
import {
  getNewBookingId,
  notifyByEmailAfterNewBooking,
  saveNewBooking,
} from "src/components/core-functions/CoreFunctions";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(3, 3),
  },
}));

// ----------------------------------------------------------------------

VehicleDetailsSummary.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.string,
  }),
};

export default function VehicleDetailsSummary({ product, ...other }) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { name, price } = product;

  const { bookingData } = useSelector(selectBooking);

  const [step, setStep] = useState(0);

  async function saveBooking() {
    dispatch(setLoading(true));

    let bookingIdResult = await getNewBookingId();

    if (bookingIdResult?.error) {
      enqueueSnackbar(bookingIdResult?.message, { variant: "error" });

      dispatch(setLoading(false));
    } else if (!bookingIdResult?.error) {
      // no error
      let saveNewBookingResult = await saveNewBooking(
        bookingIdResult?.bookingId,
        product,
        bookingData,
        user
      );

      if (saveNewBookingResult?.error) {
        enqueueSnackbar(saveNewBookingResult?.message, { variant: "error" });

        dispatch(setLoading(false));
      } else if (!saveNewBookingResult?.error) {
        // no error
        // notify client
        let clientNotificationResult = await notifyByEmailAfterNewBooking(
          bookingIdResult?.bookingId,
          `${user?.lastName || ""} ${user?.firstName || ""}`,
          user?.email,
          bookingData,
          name,
          "Booking recorded successfully.",
          "client",
          ""
        );

        if (clientNotificationResult?.error) {
          enqueueSnackbar(clientNotificationResult?.message, {
            variant: "error",
          });

          dispatch(setLoading(false));
        } else if (!clientNotificationResult?.error) {
          // no error
          // notify admin
          let adminNotificationResult = await notifyByEmailAfterNewBooking(
            bookingIdResult?.bookingId,
            "Admin",
            process.env.REACT_APP_EMAIL,
            bookingData,
            name,
            `Booking sent to admin successfully.`,
            "admin",
            `${user?.lastName || ""} ${user?.firstName || ""}`
          );

          if (adminNotificationResult?.error) {
            enqueueSnackbar(adminNotificationResult?.message, {
              variant: "error",
            });

            dispatch(setLoading(false));
          } else if (!adminNotificationResult?.error) {
            // no error
            enqueueSnackbar(clientNotificationResult?.message, {
              variant: "success",
            });

            enqueueSnackbar(adminNotificationResult?.message, {
              variant: "success",
            });

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

            dispatch(setLoading(false));

            navigate(PATH_DASHBOARD.general.app1);
          }
        }
      }
    }
  }

  return (
    <RootStyle {...other}>
      <Grid container spacing={3} justifyContent={"flex-end"}>
        {step === 0 ? (
          <BookingStepOne product={product} />
        ) : step === 1 ? (
          <BookingStepTwo />
        ) : (
          <></>
        )}

        <Grid item xs={12} md={12} align="right">
          {step === 0 ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setStep((prev) => prev + 1)}
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                View additional options
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setStep((prev) => prev - 1)}
                size="large"
                startIcon={<ArrowBackIcon />}
              >
                Back to date options
              </Button>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography align="right" variant="h5">
            Price summary
          </Typography>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={1}>
            <BookingVehiclePricingSummary
              price={price}
              bookingData={bookingData}
            />

            <Grid item xs={12} md={12}>
              <Divider />
              <br />

              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  /* enqueueSnackbar(
                    "We are sorry, the website is still in test mode. Please register your account for now and then we will contact you when the webiste is ready.",
                    { variant: "info" }
                  ); */

                  if (user && user?.id) {
                    saveBooking();
                  } else {
                    dispatch(
                      setBookingData({
                        ...bookingData,
                        product: { ...product },
                      })
                    );
                    dispatch(setCallLocation("confirmBooking"));
                    dispatch(setOpenDialog(true));
                  }
                }}
                disabled={Number(bookingData?.bookingTotalAmount) === 0}
                fullWidth
                size="large"
              >
                Confirm booking
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
