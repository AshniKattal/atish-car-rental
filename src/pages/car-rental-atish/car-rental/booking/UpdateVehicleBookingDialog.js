import l from "@linways/table-to-excel";
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewContract,
  notifyByEmailAfterUpdatingBooking,
} from "src/components/core-functions/CoreFunctions";
import { selectBooking, setBookingData } from "src/features/bookingSlice";
import { setLoading } from "src/features/globalSlice";
import db from "src/firebase";
import useAuth from "src/hooks/useAuth";
import BookingStepOne from "src/sections/@dashboard/e-commerce/product-details/booking/BookingStepOne";
import BookingStepTwo from "src/sections/@dashboard/e-commerce/product-details/booking/BookingStepTwo";
import BookingVehiclePricingSummary from "src/sections/@dashboard/e-commerce/product-details/booking/BookingVehiclePricingSummary";

export default function UpdateVehicleBookingDialog({
  open,
  setOpen,
  fetchBooking,
  viewOnly,
}) {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { bookingData } = useSelector(selectBooking);

  const [disableEditing, setDisableEditing] = useState(false);

  useEffect(() => {
    if (open) {
      if (
        viewOnly ||
        (user?.role == "client" &&
          (bookingData?.status === "confirmed" ||
            bookingData?.status === "declined"))
      ) {
        setDisableEditing(true);
      } else {
        setDisableEditing(false);
      }
    }
  }, [open]);

  async function updateBooking() {
    dispatch(setLoading(true));

    await db
      .collection("vehiclebooking")
      .doc(bookingData?.bookingId)
      .set(
        {
          ...bookingData,
        },
        { merge: true }
      )
      .then(async () => {
        if (bookingData?.status === "confirmed") {
          let contractResult = await createNewContract();
          if (contractResult?.error) {
            enqueueSnackbar(contractResult?.message, {
              variant: "error",
            });
            dispatch(setLoading(false));
          } else {
            if (user?.role === "client") {
              notifyClientAdminAfterUpdate("client");
            } else if (user?.role !== "client") {
              notifyClientAdminAfterUpdate("admin");
            }
          }
        } else {
          if (user?.role === "client") {
            notifyClientAdminAfterUpdate("client");
          } else if (user?.role !== "client") {
            notifyClientAdminAfterUpdate("admin");
          }
        }
      })
      .catch((error) => {
        enqueueSnackbar(
          `Error occured while updating booking details: ${error?.message}`,
          { variant: "error" }
        );
        dispatch(setLoading(false));
      });
  }

  async function notifyClientAdminAfterUpdate(updatedByRole) {
    // notify client
    let clientNotificationResult = await notifyByEmailAfterUpdatingBooking(
      bookingData?.bookingId,
      `${user?.lastName || ""} ${user?.firstName || ""}`,
      user?.email,
      bookingData,
      bookingData?.vehicleDetails?.name,
      // "Booking updated successfully.",
      "client",
      updatedByRole
    );

    if (clientNotificationResult?.error) {
      enqueueSnackbar(clientNotificationResult?.message, {
        variant: "error",
      });
      dispatch(setLoading(false));
    } else if (!clientNotificationResult?.error) {
      // no error
      // notify client
      let adminNotificationResult = await notifyByEmailAfterUpdatingBooking(
        bookingData?.bookingId,
        "Admin",
        process.env.REACT_APP_EMAIL,
        bookingData,
        bookingData?.vehicleDetails?.name,
        // "Booking updated successfully.",
        "admin",
        updatedByRole
      );

      if (adminNotificationResult?.error) {
        enqueueSnackbar(adminNotificationResult?.message, {
          variant: "error",
        });
        dispatch(setLoading(false));
      } else {
        // no error
        enqueueSnackbar(clientNotificationResult?.message, {
          variant: "success",
        });

        enqueueSnackbar(adminNotificationResult?.message, {
          variant: "success",
        });

        handleClose();

        fetchBooking();

        dispatch(setLoading(false));
      }
    }
  }

  function handleClose() {
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

    setOpen(false);
  }

  const handleSelectChange = async (e, value, reason) => {
    e.preventDefault();
    if (reason !== "removeOption" && reason !== "clear" && value) {
      dispatch(
        setBookingData({
          ...bookingData,
          status: value,
        })
      );
    } else if (reason === "removeOption" || reason === "clear") {
      dispatch(
        setBookingData({
          ...bookingData,
          status: "pending",
        })
      );
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>Update booking</DialogTitle>
      <DialogContent>
        <Divider />
        <br />

        <Grid container spacing={3} justifyContent={"flex-end"}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <>
                {bookingData?.status === "pending" ? (
                  <Alert severity="warning">Pending</Alert>
                ) : bookingData?.status === "confirmed" &&
                  user?.role === "client" ? (
                  <Alert severity="success">Confirmed</Alert>
                ) : bookingData?.status === "declined" ? (
                  <Alert severity="error">Declined</Alert>
                ) : (
                  <></>
                )}
              </>

              {user && user?.role !== "client" ? (
                <Autocomplete
                  size="small"
                  label="Please choose status"
                  id="client-drop-down"
                  options={["pending", "confirmed", "declined"]}
                  value={bookingData?.status || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Please choose status"
                      fullWidth
                    />
                  )}
                  onChange={(e, value, reason) =>
                    handleSelectChange(e, value, reason)
                  }
                  getOptionLabel={(option) =>
                    option === "pending"
                      ? "Pending"
                      : option === "confirmed"
                      ? "Confirmed"
                      : option === "declined"
                      ? "Declined"
                      : ""
                  }
                  disabled={disableEditing}
                />
              ) : (
                <></>
              )}
            </Stack>
          </Grid>

          <BookingStepOne
            product={{
              name: bookingData?.vehicleDetails?.name || "",
              price: bookingData?.vehicleDetails?.price || 0,
            }}
            callLocation="bookingList"
            disableEditing={disableEditing}
          />
          <BookingStepTwo
            callLocation="bookingList"
            disableEditing={disableEditing}
          />

          <Divider />

          <Grid item xs={12} md={12}>
            <Typography align="right" variant="h5">
              Price summary
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <BookingVehiclePricingSummary
                price={bookingData?.vehicleDetails?.price || 0}
                bookingData={bookingData}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {!disableEditing ? (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              updateBooking();
            }}
          >
            Submit changes
          </Button>
        ) : (
          <></>
        )}

        <Button
          variant="outlined"
          color="error"
          size="large"
          onClick={() => handleClose()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
