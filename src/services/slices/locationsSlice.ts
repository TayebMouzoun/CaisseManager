import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface Location {
  id: string;
  name: string;
  address?: string;
  manager?: string;
  createdAt: string;
}

interface LocationsState {
  locations: Location[];
  loading: boolean;
  error: string | null;
  currentLocation: Location | null;
}

const initialState: LocationsState = {
  locations: [],
  loading: false,
  error: null,
  currentLocation: null,
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    fetchLocationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLocationsSuccess: (state, action: PayloadAction<Location[]>) => {
      state.loading = false;
      state.locations = action.payload;
    },
    fetchLocationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addLocation: (state, action: PayloadAction<Omit<Location, 'id' | 'createdAt'>>) => {
      const newLocation = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };
      state.locations.push(newLocation);
    },
    updateLocation: (state, action: PayloadAction<{ id: string; updates: Partial<Location> }>) => {
      const { id, updates } = action.payload;
      const locationIndex = state.locations.findIndex(loc => loc.id === id);
      
      if (locationIndex >= 0) {
        state.locations[locationIndex] = {
          ...state.locations[locationIndex],
          ...updates,
        };
      }
    },
    deleteLocation: (state, action: PayloadAction<string>) => {
      state.locations = state.locations.filter(loc => loc.id !== action.payload);
    },
    setCurrentLocation: (state, action: PayloadAction<Location | null>) => {
      state.currentLocation = action.payload;
    },
  },
});

export const {
  fetchLocationsStart,
  fetchLocationsSuccess,
  fetchLocationsFailure,
  addLocation,
  updateLocation,
  deleteLocation,
  setCurrentLocation,
} = locationsSlice.actions;

export default locationsSlice.reducer; 