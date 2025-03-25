export interface Operation {
  _id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  location: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check';
  reference: string;
  source: 'manual' | 'invoice_payment';
  isInvoicePayment: boolean;
  documents?: {
    deliveryNote: boolean;
    invoice: boolean;
  };
} 