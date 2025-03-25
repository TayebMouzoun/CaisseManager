import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Source, SourceState, SourceFormData } from '../../types/sourceTypes';
import { v4 as uuidv4 } from 'uuid';

export type { Source, SourceFormData, SourceState } from '../../types/sourceTypes';

// Add some default sources
const defaultSources: Source[] = [
  {
    id: uuidv4(),
    name: 'Client Payment',
    type: 'in',
    description: 'Payment received from clients',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Investment',
    type: 'in',
    description: 'Investment funds',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Loan',
    type: 'in',
    description: 'Loan received',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Paiement Facture',
    type: 'out',
    description: 'Paiement des factures',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Supplier Payment',
    type: 'out',
    description: 'Payment to suppliers',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Salary',
    type: 'out',
    description: 'Employee salaries',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Utilities',
    type: 'out',
    description: 'Utilities payment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Rent',
    type: 'out',
    description: 'Rent payment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialState: SourceState = {
  sources: defaultSources,  // Initialize with default sources
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