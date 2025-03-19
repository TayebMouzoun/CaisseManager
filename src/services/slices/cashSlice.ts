import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type OperationType = 'in' | 'out' | 'return';

export interface CashOperation {
  id: string;
  type: OperationType;
  amount: number;
  source: string;
  personInCharge: string; // Personne responsable de l'opération
  date: string;
  observation?: string;
  createdBy: string;
  locationId: string;
  voucherNumber: string;
  isSigned: boolean;
  attachmentUrl?: string; // URL to the scanned signed voucher
  relatedOperationId?: string; // For return operations, reference to the original out operation
}

interface CashBalance {
  id: string;
  locationId: string;
  balance: number;
  lastUpdated: string;
}

interface CashState {
  operations: CashOperation[];
  balances: CashBalance[];
  loading: boolean;
  error: string | null;
  currentOperation: CashOperation | null;
}

const initialState: CashState = {
  operations: [],
  balances: [],
  loading: false,
  error: null,
  currentOperation: null,
};

const cashSlice = createSlice({
  name: 'cash',
  initialState,
  reducers: {
    fetchOperationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOperationsSuccess: (state, action: PayloadAction<CashOperation[]>) => {
      state.loading = false;
      state.operations = action.payload;
    },
    fetchOperationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchBalancesSuccess: (state, action: PayloadAction<CashBalance[]>) => {
      state.balances = action.payload;
    },
    addOperation: (state, action: PayloadAction<Omit<CashOperation, 'id' | 'voucherNumber'>>) => {
      const operation = {
        ...action.payload,
        id: uuidv4(),
        voucherNumber: generateVoucherNumber(action.payload.type),
        isSigned: false,
      };
      
      state.operations.push(operation);
      
      // Update balance
      const balanceIndex = state.balances.findIndex(b => b.locationId === operation.locationId);
      
      if (balanceIndex >= 0) {
        const balanceChange = getBalanceChange(operation.type, operation.amount);
        state.balances[balanceIndex].balance += balanceChange;
        state.balances[balanceIndex].lastUpdated = new Date().toISOString();
      } else {
        state.balances.push({
          id: uuidv4(),
          locationId: operation.locationId,
          balance: getBalanceChange(operation.type, operation.amount),
          lastUpdated: new Date().toISOString(),
        });
      }
      
      state.currentOperation = operation;
    },
    setCurrentOperation: (state, action: PayloadAction<CashOperation | null>) => {
      state.currentOperation = action.payload;
    },
    markOperationAsSigned: (state, action: PayloadAction<string>) => {
      const operationIndex = state.operations.findIndex(op => op.id === action.payload);
      if (operationIndex >= 0) {
        state.operations[operationIndex].isSigned = true;
      }
    },
    addAttachmentToOperation: (state, action: PayloadAction<{ operationId: string, attachmentUrl: string }>) => {
      const { operationId, attachmentUrl } = action.payload;
      const operationIndex = state.operations.findIndex(op => op.id === operationId);
      
      if (operationIndex >= 0) {
        state.operations[operationIndex].attachmentUrl = attachmentUrl;
        state.operations[operationIndex].isSigned = true; // Also mark as signed when attachment is added
      }
    },
    clearOperationState: (state) => {
      state.currentOperation = null;
      state.error = null;
    }
  }
});

// Helper functions
function generateVoucherNumber(type: OperationType): string {
  const prefix = type === 'in' ? 'IN' : type === 'out' ? 'OUT' : 'RET';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
}

function getBalanceChange(type: OperationType, amount: number): number {
  if (type === 'in') return amount;
  if (type === 'out') return -amount;
  return amount; // For 'return', we're adding back to balance
}

export const {
  fetchOperationsStart,
  fetchOperationsSuccess,
  fetchOperationsFailure,
  fetchBalancesSuccess,
  addOperation,
  setCurrentOperation,
  markOperationAsSigned,
  addAttachmentToOperation,
  clearOperationState
} = cashSlice.actions;

export default cashSlice.reducer; 