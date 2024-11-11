import { createSlice } from "@reduxjs/toolkit";

export const invoiceSectionSlice = createSlice({
  name: "invoiceSection",
  initialState: {
    companyInvSelected: undefined,
    clientInvSelected: undefined,
    clientInvList: undefined,
    updateInvData: undefined,
  },
  reducers: {
    setCompanyInvSelected: (state, action) => {
      state.companyInvSelected = action.payload;
    },
    setClientInvSelected: (state, action) => {
      state.clientInvSelected = action.payload;
    },
    setClientInvList: (state, action) => {
      state.clientInvList = action.payload;
    },
    setUpdateInvData: (state, action) => {
      state.updateInvData = action.payload;
    },
    resetInvoiceSection: (state) => {
      state.companyInvSelected = undefined;
      state.clientInvSelected = undefined;
      state.clientInvList = undefined;
    },
  },
});

export const {
  setCompanyInvSelected,
  setClientInvSelected,
  setClientInvList,
  setUpdateInvData,
  resetInvoiceSection,
} = invoiceSectionSlice.actions;

export const selectInvoiceSection = (state) => state.invoiceSection;

export default invoiceSectionSlice.reducer;
