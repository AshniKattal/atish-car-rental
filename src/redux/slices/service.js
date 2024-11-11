import { createSlice } from "@reduxjs/toolkit";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  servicesList: [],
  serviceDetails: null,
  sortBy: null,
  filters: {
    serviceCategory: [],
    // rating: "",
  },
};

const slice = createSlice({
  name: "service",
  initialState,
  reducers: {
    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.serviceCategory = action.payload.serviceCategory;
      // state.filters.rating = action.payload.rating;
    },
    setServiceDetails(state, action) {
      state.serviceDetails = action.payload;
    },
    setServicesList(state, action) {
      state.servicesList = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  sortByProducts,
  filterProducts,
  setServiceDetails,
  setServicesList,
} = slice.actions;
