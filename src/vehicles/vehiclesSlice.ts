import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Vehicle } from "./vehicle.types";

type VehiclesState = {
  items: Vehicle[];
  loading: boolean;
  error: string | null;
  filters: {
    status: Vehicle["status"] | "ALL";
    query: string;
  };
};

const initialState: VehiclesState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: "ALL",
    query: "",
  },
};

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setVehiclesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setStatusFilter: (state, action: PayloadAction<Vehicle["status"] | "ALL">) => {
      state.filters.status = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.query = action.payload;
    },
  },
});

export const {
  setVehicles,
  setLoading,
  setVehiclesError,
  setStatusFilter,
  setSearchQuery,
} = vehiclesSlice.actions;

export default vehiclesSlice.reducer;
