import { createSlice } from "@reduxjs/toolkit";

export const paymentSectionSlice = createSlice({
  name: "paymentSection",
  initialState: {
    companyPaymentSelected: undefined,
    clientPaymentSelected: undefined,
    clientPaymentList: undefined,
  },
  reducers: {
    setCompanyPaymentSelected: (state, action) => {
      state.companyPaymentSelected = action.payload;
    },
    setClientPaymentSelected: (state, action) => {
      state.clientPaymentSelected = action.payload;
    },
    setClientPaymentList: (state, action) => {
      state.clientPaymentList = action.payload;
    },
    resetPaymentSection: (state) => {
      state.companyPaymentSelected = undefined;
      state.clientPaymentSelected = undefined;
      state.clientPaymentList = undefined;
    },
  },
});

export const {
  setCompanyPaymentSelected,
  setClientPaymentSelected,
  setClientPaymentList,
  resetPaymentSection,
} = paymentSectionSlice.actions;

export const selectPaymentSection = (state) => state.paymentSection;

export default paymentSectionSlice.reducer;
