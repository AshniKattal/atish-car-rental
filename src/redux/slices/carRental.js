import { createSlice } from "@reduxjs/toolkit";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  vehiclesList: [],
  serviceDetails: null,
  sortBy: null,
  filters: {
    serviceCategory: [],
    passengers: 0,
    luggage: undefined,
    doors: 0,
    transmission: "",
    airConditioning: undefined,
    // rating: "",
  },
};

const slice = createSlice({
  name: "carRental",
  initialState,
  reducers: {
    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterVehicles(state, action) {
      state.filters.serviceCategory = action.payload.serviceCategory;
      state.filters.passengers = action.payload.passengers;
      state.filters.luggage = action.payload.luggage;
      state.filters.doors = action.payload.doors;
      state.filters.transmission = action.payload.transmission;
      state.filters.airConditioning = action.payload.airConditioning;

      // state.filters.rating = action.payload.rating;
    },
    setVehicleDetails(state, action) {
      state.vehicleDetails = action.payload;
    },
    setVehiclesList(state, action) {
      state.vehiclesList = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  sortByProducts,
  filterVehicles,
  setVehicleDetails,
  setVehiclesList,
} = slice.actions;
