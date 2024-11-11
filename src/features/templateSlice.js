import { createSlice } from "@reduxjs/toolkit";

export const templateSlice = createSlice({
  name: "template",
  initialState: {
    template: "",
  },
  reducers: {
    setTemplate: (state, action) => {
      state.template = action.payload;
    },
  },
});

export const { setTemplate } = templateSlice.actions;

export const selectTemplate = (state) => state.template;

export default templateSlice.reducer;
