import { createSlice } from '@reduxjs/toolkit';

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    counter: 0,
    message: '',
    variant: '',
  },
  reducers: {
    setSnackbar: (state, action) => {
      state.counter = action.payload.counter;
      state.message = action.payload.message;
      state.variant = action.payload.variant;
    },
    resetSnackbar: (state) => {
      state.counter = 0;
      state.message = '';
      state.variant = '';
    },
  },
});

export const { setSnackbar, resetSnackbar } = snackbarSlice.actions;

export const selectSnackbar = (state) => state.snackbar;

export default snackbarSlice.reducer;
