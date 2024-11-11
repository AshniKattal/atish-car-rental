import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    loading: false,
    toggleNight: 'light',
    msg: '',
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setToggleNight: (state, action) => {
      state.toggleNight = action.payload;
    },
    setMsg: (state, action) => {
      state.msg = action.payload;
    },
    resetGlobal: (state) => {
      state.loading = false;
      state.msg = '';
    },
  },
});

export const { setLoading, setToggleNight, setMsg, resetGlobal } = globalSlice.actions;

export const selectGlobal = (state) => state.global;

export default globalSlice.reducer;
