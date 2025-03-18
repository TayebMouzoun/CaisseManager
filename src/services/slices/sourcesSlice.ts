import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Source, SourceState, SourceFormData } from '../../types/sourceTypes';

export type { Source, SourceFormData, SourceState } from '../../types/sourceTypes';

const initialState: SourceState = {
  sources: [],
  loading: false,
  error: null,
};

const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    setSources: (state, action: PayloadAction<Source[]>) => {
      state.sources = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSource: (state, action: PayloadAction<Source>) => {
      state.sources.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateSource: (state, action: PayloadAction<Source>) => {
      const index = state.sources.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.sources[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteSource: (state, action: PayloadAction<string>) => {
      state.sources = state.sources.filter(s => s.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSources,
  addSource,
  updateSource,
  deleteSource,
  setLoading,
  setError,
} = sourcesSlice.actions;

export default sourcesSlice.reducer; 