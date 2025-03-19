import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
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
  nextId: number; // Counter for sequential IDs
  nextVoucherNumbers: {
    in: number; // Counter for IN voucher numbers
    out: number; // Counter for OUT voucher numbers
    return: number; // Counter for RETURN voucher numbers
  };
}

const initialState: CashState = {
  operations: [],
  balances: [],
  loading: false,
  error: null,
  currentOperation: null,
  nextId: 1, // Start IDs from 1
  nextVoucherNumbers: {
    in: 1, // Start voucher numbers from 1
    out: 1,
    return: 1
  }
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
      // Keep existing state values for nextId and nextVoucherNumbers if they exist
      const currentNextId = state.nextId || 1;
      const currentNextVoucherNumbers = state.nextVoucherNumbers || { in: 1, out: 1, return: 1 };
      
      // Update state
      state.loading = false;
      state.operations = action.payload;
      
      // Ensure nextId and nextVoucherNumbers are set
      state.nextId = currentNextId;
      state.nextVoucherNumbers = currentNextVoucherNumbers;
      
      // Update the nextId based on the highest id found in operations
      if (action.payload.length > 0) {
        const highestId = Math.max(...action.payload.map(op => parseInt(op.id)));
        state.nextId = highestId + 1;
      }
      
      // Update next voucher numbers based on highest numbers in each category
      const inOperations = action.payload.filter(op => op.type === 'in');
      const outOperations = action.payload.filter(op => op.type === 'out');
      const returnOperations = action.payload.filter(op => op.type === 'return');
      
      if (inOperations.length > 0) {
        // Extract numbers from voucher numbers like "ENTREE-0001"
        const inNumbers = inOperations.map(op => {
          const match = op.voucherNumber.match(/ENTREE-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
        state.nextVoucherNumbers.in = Math.max(...inNumbers) + 1;
      }
      
      if (outOperations.length > 0) {
        const outNumbers = outOperations.map(op => {
          const match = op.voucherNumber.match(/SORTIE-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
        state.nextVoucherNumbers.out = Math.max(...outNumbers) + 1;
      }
      
      if (returnOperations.length > 0) {
        const returnNumbers = returnOperations.map(op => {
          const match = op.voucherNumber.match(/RETOUR-(\d+)/);
          return match ? parseInt(match[1]) : 0;
        });
        state.nextVoucherNumbers.return = Math.max(...returnNumbers) + 1;
      }
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
        id: state.nextId.toString(), // Use the next ID from the counter
        voucherNumber: generateVoucherNumber(action.payload.type, state), // Pass state to generate sequential voucher number
        isSigned: false,
      };
      
      // Increment ID counter for next operation
      state.nextId += 1;
      
      // Increment voucher number counter for the specific operation type
      state.nextVoucherNumbers[operation.type] += 1;
      
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
      // Ensure nextId and nextVoucherNumbers are preserved
    }
  }
});

// Helper functions
function generateVoucherNumber(type: OperationType, state: CashState): string {
  let prefix: string;
  let nextNumber: number;
  
  switch (type) {
    case 'in':
      prefix = 'ENTREE';
      nextNumber = state.nextVoucherNumbers.in;
      break;
    case 'out':
      prefix = 'SORTIE';
      nextNumber = state.nextVoucherNumbers.out;
      break;
    case 'return':
      prefix = 'RETOUR';
      nextNumber = state.nextVoucherNumbers.return;
      break;
  }
  
  // Format: PREFIX-NUMBER (padded to at least 4 digits)
  return `${prefix}-${nextNumber.toString().padStart(4, '0')}`;
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