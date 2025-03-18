import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cashReducer from './slices/cashSlice';
import locationsReducer from './slices/locationsSlice';
import usersReducer from './slices/usersSlice';
import sourcesReducer from './slices/sourcesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cash: cashReducer,
    locations: locationsReducer,
    users: usersReducer,
    sources: sourcesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 