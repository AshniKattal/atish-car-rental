import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    //profile: null,
    //type: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    /*setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },*/
  },
});

export const { setUser, logout /*setProfile, setType*/ } = userSlice.actions;

export const selectUser = (state) => state.user.user;
//export const selectProfile = (state) => state.user.profile;
//export const selectType = (state) => state.user.type;

export default userSlice.reducer;
