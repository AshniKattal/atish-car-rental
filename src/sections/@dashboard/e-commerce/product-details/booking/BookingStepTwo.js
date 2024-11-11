import { Divider, Grid, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectBooking, setBookingData } from "src/features/bookingSlice";

export default function BookingStepTwo({ callLocation, disableEditing }) {
  const dispatch = useDispatch();

  const { bookingData } = useSelector(selectBooking);

  return (
    <>
      <Grid item xs={12} md={12}>
        <Typography variant="h6">Add extra options (Optional)</Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={1}>
          <Typography variant="subtitle1">Baby Seat</Typography>
          <Typography>Baby seat suitable for 0-13 Kg.</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Baby seat quantity"
          variant="outlined"
          size="large"
          fullWidth
          name="bookingBabySeatQty"
          type="number"
          id="bookingBabySeatQty"
          value={bookingData?.bookingBabySeatQty || 0}
          onChange={(event) => {
            if (Number(event.target.value) >= 0) {
              dispatch(
                setBookingData({
                  ...bookingData,
                  bookingBabySeatQty: event.target.value,
                })
              );
            }
          }}
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={1}>
          <Typography variant="subtitle1">Booster Seat</Typography>
          <Typography>Booster Seat suitable for 7-12 years old.</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="Booster seat quantity"
          variant="outlined"
          size="large"
          fullWidth
          name="bookingBoosterSeatQty"
          type="number"
          id="bookingBoosterSeatQty"
          value={bookingData?.bookingBoosterSeatQty || 0}
          onChange={(event) => {
            if (Number(event.target.value) >= 0) {
              dispatch(
                setBookingData({
                  ...bookingData,
                  bookingBoosterSeatQty: event.target.value,
                })
              );
            }
          }}
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={1}>
          <Typography variant="subtitle1">Child Seat</Typography>
          <Typography>Child seat suitable for 9-18 Kg.</Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          label="Child seat quantity"
          variant="outlined"
          size="large"
          fullWidth
          name="bookingChildSeatQty"
          type="number"
          id="bookingChildSeatQty"
          value={bookingData?.bookingChildSeatQty || 0}
          onChange={(event) => {
            if (Number(event.target.value) >= 0) {
              dispatch(
                setBookingData({
                  ...bookingData,
                  bookingChildSeatQty: event.target.value,
                })
              );
            }
          }}
          disabled={callLocation === "bookingList" && disableEditing}
        />
      </Grid>

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>
    </>
  );
}
