import { createSlice } from "@reduxjs/toolkit";

export const companySlice = createSlice({
  name: "company",
  initialState: {
    companyList: [],
  },
  reducers: {
    setCompanyList: (state, action) => {
      state.companyList = action.payload;
    },
    resetCompany: (state) => {
      state.companyList = [];
    },
  },
});

export const { setCompanyList, resetCompany } = companySlice.actions;

export const selectCompanyList = (state) => state.company;

export default companySlice.reducer;
