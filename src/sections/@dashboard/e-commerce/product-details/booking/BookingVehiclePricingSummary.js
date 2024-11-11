import { Divider, Grid, Stack, Typography } from "@mui/material";
import CurrencyFormat from "react-currency-format";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setBookingData } from "src/features/bookingSlice";

export default function BookingVehiclePricingSummary({ price, bookingData }) {
  const dispatch = useDispatch();

  const temp_calculateTotalAmountRef = useRef();

  useEffect(() => {
    temp_calculateTotalAmountRef.current();
  }, [
    bookingData?.bookingNumberOfDays,
    bookingData?.bookingBabySeatQty,
    bookingData?.bookingBoosterSeatQty,
    bookingData?.bookingChildSeatQty,
  ]);

  function calculateTotalAmount() {
    let totalAmount = 0;

    let totalFromNumOfDays =
      Number(bookingData?.bookingNumberOfDays || 0) * Number(price || 0);

    let totalFromBabySeat = Number(bookingData?.bookingBabySeatQty || 0) * 7;
    let totalFromBoosterSeat =
      Number(bookingData?.bookingBoosterSeatQty || 0) * 7;
    let totalFromChildSeat = Number(bookingData?.bookingChildSeatQty || 0) * 7;

    totalAmount =
      totalFromNumOfDays +
      totalFromBabySeat +
      totalFromBoosterSeat +
      totalFromChildSeat;

    dispatch(
      setBookingData({ ...bookingData, bookingTotalAmount: totalAmount })
    );
  }

  temp_calculateTotalAmountRef.current = calculateTotalAmount;

  return (
    <>
      <Grid item xs={12} md={7}>
        <Typography>Price per day</Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography align="right">
          <CurrencyFormat
            value={Number(price || 0).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={`${process.env.REACT_APP_CURRENCY_USED} `}
          />
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} md={7}>
        <Typography>Rental Days</Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography align="right">
          {bookingData?.bookingNumberOfDays || 0}
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} md={7}>
        <Typography>Rental Fee</Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography align="right">
          <CurrencyFormat
            value={(
              Number(price || 0) * Number(bookingData?.bookingNumberOfDays || 0)
            ).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={`${process.env.REACT_APP_CURRENCY_USED} `}
          />
        </Typography>
      </Grid>

      {bookingData?.bookingBabySeatQty &&
      Number(bookingData?.bookingBabySeatQty || 0) > 0 ? (
        <>
          <Grid item xs={12} md={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Typography>{`(+) Baby Seat`}</Typography>
              <ClearIcon fontSize="small" />
              <Typography>{Number(bookingData?.bookingBabySeatQty)}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography align="right">
              <CurrencyFormat
                value={(
                  Number(price || 0) *
                  Number(bookingData?.bookingBabySeatQty || 0)
                ).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={`${process.env.REACT_APP_CURRENCY_USED} `}
              />
            </Typography>
          </Grid>
        </>
      ) : (
        <></>
      )}

      {bookingData?.bookingBoosterSeatQty &&
      Number(bookingData?.bookingBoosterSeatQty || 0) > 0 ? (
        <>
          <Grid item xs={12} md={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Typography>{`(+) Booster Seat`}</Typography>
              <ClearIcon fontSize="small" />
              <Typography>
                {Number(bookingData?.bookingBoosterSeatQty)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography align="right">
              <CurrencyFormat
                value={(
                  Number(price || 0) *
                  Number(bookingData?.bookingBoosterSeatQty || 0)
                ).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={`${process.env.REACT_APP_CURRENCY_USED} `}
              />
            </Typography>
          </Grid>
        </>
      ) : (
        <></>
      )}

      {bookingData?.bookingChildSeatQty &&
      Number(bookingData?.bookingChildSeatQty || 0) > 0 ? (
        <>
          <Grid item xs={12} md={12}>
            <Divider />
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Typography>{`(+) Child Seat`}</Typography>
              <ClearIcon fontSize="small" />
              <Typography>
                {Number(bookingData?.bookingChildSeatQty)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography align="right">
              <CurrencyFormat
                value={(
                  Number(price || 0) *
                  Number(bookingData?.bookingChildSeatQty || 0)
                ).toFixed(2)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={`${process.env.REACT_APP_CURRENCY_USED} `}
              />
            </Typography>
          </Grid>
        </>
      ) : (
        <></>
      )}

      <Grid item xs={12} md={12}>
        <Divider />
      </Grid>

      <Grid item xs={12} md={7}>
        <Typography variant="h6">Total amount</Typography>
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography align="right">
          <CurrencyFormat
            value={Number(bookingData?.bookingTotalAmount || 0).toFixed(2)}
            displayType={"text"}
            thousandSeparator={true}
            prefix={`${process.env.REACT_APP_CURRENCY_USED} `}
          />
        </Typography>
      </Grid>
    </>
  );
}
