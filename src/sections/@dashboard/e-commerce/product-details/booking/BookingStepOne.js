import { DatePicker } from "@mui/lab";
import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import CurrencyFormat from "react-currency-format";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { selectBooking, setBookingData } from "src/features/bookingSlice";
import InfoIcon from "@mui/icons-material/Info";

export default function BookingStepOne({
  product,
  callLocation,
  disableEditing,
}) {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const { name, price } = product;

  const { bookingData } = useSelector(selectBooking);

  const pickUpOptions = [
    {
      id: "ssr",
      title: "SSR Airport, Plaine Magnien, Mauritius",
    },
    {
      id: "anywhere",
      title: "Desired location - anywhere (+ additional cost)",
    },
  ];

  useEffect(() => {
    if (
      bookingData?.bookingPickupDate &&
      bookingData?.bookingReturnDate &&
      moment(bookingData?.bookingReturnDate).format("YYYY-MM-DD") !==
        moment(new Date()).format("YYYY-MM-DD")
    ) {
      // calculate number of days between these two dates
      let date1 = moment(bookingData?.bookingPickupDate, "YYYY-MM-DD");
      let date2 = moment(bookingData?.bookingReturnDate, "YYYY-MM-DD");

      // Check if date2 is after or the same as date1
      const isAfterOrSame = date2.isAfter(date1);

      if (isAfterOrSame) {
        // Calculate the difference in days
        const differenceInDays = date2.diff(date1, "days") + 1;

        dispatch(
          setBookingData({
            ...bookingData,
            bookingNumberOfDays: differenceInDays,
          })
        );
      } else {
        enqueueSnackbar("Return date should be after Pickup date", {
          variant: "error",
        });
      }
    }
  }, [bookingData?.bookingPickupDate, bookingData?.bookingReturnDate]);

  return (
    <>
      <Grid item xs={12} md={12}>
        <Typography
          variant="h4"
          sx={{
            mt: 2,
            mb: 1,
            display: "block",
          }}
        >
          {name || ""}
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Stack direction={"row"} spacing={1} alignItems={"center"}>
          <Tooltip title="Or similar models">
            <InfoIcon color="info" />
          </Tooltip>
          <Typography>Or similar model</Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} md={12}>
        <Typography>
          <CurrencyFormat
            value={Number(price || 0).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={`${process.env.REACT_APP_CURRENCY_USED} `}
          />{" "}
          / day
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Autocomplete
          ListboxProps={{ style: { maxHeight: "70vh" } }}
          size="small"
          label="Pickup address"
          id="pickup-drop-down"
          options={pickUpOptions || []}
          value={bookingData?.bookingPickupAddress || null}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Pickup address"
              InputLabelProps={{ required: true }}
              size="large"
            />
          )}
          required
          onChange={(e, value, reason) => {
            if (reason !== "removeOption" && reason !== "clear" && value) {
              dispatch(
                setBookingData({
                  ...bookingData,
                  bookingPickupAddress: value,
                })
              );
            } else {
              dispatch(
                setBookingData({
                  ...bookingData,
                  bookingPickupAddress: null,
                })
              );
            }
          }}
          getOptionLabel={(option) => option.title}
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>

      {bookingData?.bookingPickupAddress?.id === "anywhere" && (
        <Grid item xs={12} md={12}>
          <TextField
            variant="outlined"
            fullWidth
            name="bookingPickupAnywhereAddress"
            label="Specify desired address"
            type="text"
            id="bookingPickupAnywhereAddress"
            value={bookingData?.bookingPickupAnywhereAddress || ""}
            size="large"
            onChange={(event) => {
              dispatch(
                setBookingData({
                  ...bookingData,
                  bookingPickupAnywhereAddress: event.target.value,
                })
              );
            }}
            disabled={callLocation === "bookingList" && disableEditing}
          />
        </Grid>
      )}

      <Grid item xs={12} md={6}>
        <DatePicker
          label="Pickup date"
          value={bookingData?.bookingPickupDate || ""}
          onChange={(newValue) => {
            dispatch(
              setBookingData({
                ...bookingData,
                bookingPickupDate: newValue,
              })
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="large"
              fullWidth
              disabled={callLocation === "bookingList" && disableEditing}
            />
          )}
          inputFormat="dd/MM/yyyy"
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          fullWidth
          name="bookingPickupTime"
          label="Pickup time"
          type="time"
          id="bookingPickupTime"
          value={bookingData?.bookingPickupTime || ""}
          size="large"
          onChange={(event) => {
            dispatch(
              setBookingData({
                ...bookingData,
                bookingPickupTime: event.target.value,
              })
            );
          }}
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <DatePicker
          label="Return date"
          value={bookingData?.bookingReturnDate || ""}
          onChange={(newValue) => {
            dispatch(
              setBookingData({
                ...bookingData,
                bookingReturnDate: newValue,
              })
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              size="large"
              fullWidth
              disabled={callLocation === "bookingList" && disableEditing}
            />
          )}
          inputFormat="dd/MM/yyyy"
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          variant="outlined"
          fullWidth
          name="bookingReturnTime"
          label="Return time"
          type="time"
          id="bookingReturnTime"
          value={bookingData?.bookingReturnTime || ""}
          size="large"
          onChange={(event) => {
            dispatch(
              setBookingData({
                ...bookingData,
                bookingReturnTime: event.target.value,
              })
            );
          }}
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>
    </>
  );
}
