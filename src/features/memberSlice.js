import { createSlice } from '@reduxjs/toolkit';

export const memberSlice = createSlice({
  name: 'member',
  initialState: {
    packType: [],
    memberAdminList: [],
  },
  reducers: {
    setPackType: (state, action) => {
      state.packType = action.payload;
    },
    setMemberAdminList: (state, action) => {
      state.memberAdminList = action.payload;
    },
    resetMember: (state) => {
      state.packType = [];
      state.memberAdminList = [];
    },
  },
});

export const { setPackType, setMemberAdminList, resetMember } = memberSlice.actions;

export const selectMember = (state) => state.member;

export default memberSlice.reducer;
