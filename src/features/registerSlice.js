import { createSlice } from "@reduxjs/toolkit";

export const registerSlice = createSlice({
  name: "register",
  initialState: {
    openDialog: false,
    message: "",
    callLocation: "",
  },
  reducers: {
    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setCallLocation: (state, action) => {
      state.callLocation = action.payload;
    },
  },
});

export const { setOpenDialog, setMessage, setCallLocation } =
  registerSlice.actions;

export const selectRegister = (state) => state.register;

export default registerSlice.reducer;
