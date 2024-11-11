import { createSlice } from "@reduxjs/toolkit";

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    usersList: [],
  },
  reducers: {
    setUsersList: (state, action) => {
      state.usersList = action.payload;
    },
    setResetAdmin: (state) => {
      state.usersList = [];
    },
  },
});

export const { setUsersList, setResetAdmin } = adminSlice.actions;

export const selectAdmin = (state) => state.admin;

export default adminSlice.reducer;
