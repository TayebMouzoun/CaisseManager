import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface InvoicePaymentFormProps {
  onDocumentsChange: (documents: { deliveryNote: boolean; invoice: boolean }) => void;
  initialDocuments?: {
    deliveryNote: boolean;
    invoice: boolean;
  };
}

const InvoicePaymentForm: React.FC<InvoicePaymentFormProps> = ({
  onDocumentsChange,
  initialDocuments = { deliveryNote: false, invoice: false },
}) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState(initialDocuments);

  const handleDocumentChange = (documentType: 'deliveryNote' | 'invoice') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDocuments = {
      ...documents,
      [documentType]: event.target.checked,
    };
    setDocuments(newDocuments);
    onDocumentsChange(newDocuments);
  };

  return (
    <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#319269' }}>
        {t('invoicePayment')}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={documents.deliveryNote}
                onChange={handleDocumentChange('deliveryNote')}
                color="primary"
                sx={{ '&.Mui-checked': { color: '#319269' } }}
              />
            }
            label={t('deliveryNote')}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={documents.invoice}
                onChange={handleDocumentChange('invoice')}
                color="primary"
                sx={{ '&.Mui-checked': { color: '#319269' } }}
              />
            }
            label={t('invoice')}
            sx={{ mb: 1 }}
          />
        </FormControl>
      </Box>
    </Paper>
  );
};

export default InvoicePaymentForm; 