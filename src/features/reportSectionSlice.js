import { createSlice } from "@reduxjs/toolkit";

export const reportSectionSlice = createSlice({
  name: "reportSection",
  initialState: {
    companyReportSelected: undefined,
    clientReportSelected: undefined,
    clientReportList: undefined,
  },
  reducers: {
    setCompanyReportSelected: (state, action) => {
      state.companyReportSelected = action.payload;
    },
    setClientReportSelected: (state, action) => {
      state.clientReportSelected = action.payload;
    },
    setClientReportList: (state, action) => {
      state.clientReportList = action.payload;
    },
    resetReportSection: (state) => {
      state.companyReportSelected = undefined;
      state.clientReportSelected = undefined;
      state.clientReportList = undefined;
    },
  },
});

export const {
  setCompanyReportSelected,
  setClientReportSelected,
  setClientReportList,
  resetReportSection,
} = reportSectionSlice.actions;

export const selectReportSection = (state) => state.reportSection;

export default reportSectionSlice.reducer;
