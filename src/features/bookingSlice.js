import { createSlice } from "@reduxjs/toolkit";

export const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookingData: {
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
    },

    afterBookingRedirect: "",
  },
  reducers: {
    setBookingData: (state, action) => {
      state.bookingData = action.payload;
    },
  },
});

export const { setBookingData } = bookingSlice.actions;

export const selectBooking = (state) => state.booking;

export default bookingSlice.reducer;
