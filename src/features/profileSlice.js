import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    resetProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setProfile, resetProfile } = profileSlice.actions;

export const selectProfile = (state) => state.profile;

export default profileSlice.reducer;
