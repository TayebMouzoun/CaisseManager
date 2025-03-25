import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Operation } from '../../types/Operation';
import { SelectChangeEvent } from '@mui/material/Select';
import InvoicePaymentForm from '../InvoicePaymentForm/InvoicePaymentForm';

interface OperationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (operation: Partial<Operation>) => void;
  initialData?: Partial<Operation>;
  categories: string[];
  locations: string[];
}

const OperationForm: React.FC<OperationFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  categories,
  locations,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<Operation>>({
    type: 'income',
    amount: 0,
    description: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    reference: '',
    source: 'manual',
    isInvoicePayment: false,
    documents: {
      deliveryNote: false,
      invoice: false,
    },
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Operation>) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Operation>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInvoicePaymentChange = (documents: { deliveryNote: boolean; invoice: boolean }) => {
    setFormData((prev: Partial<Operation>) => ({
      ...prev,
      documents,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? t('editOperation') : t('newOperation')}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('type')}</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  label={t('type')}
                  required
                >
                  <MenuItem value="income">{t('income')}</MenuItem>
                  <MenuItem value="expense">{t('expense')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="amount"
                type="number"
                label={t('amount')}
                value={formData.amount}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label={t('description')}
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('category')}</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleSelectChange}
                  label={t('category')}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('location')}</InputLabel>
                <Select
                  name="location"
                  value={formData.location}
                  onChange={handleSelectChange}
                  label={t('location')}
                  required
                >
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="date"
                type="date"
                label={t('date')}
                value={formData.date}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('paymentMethod')}</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleSelectChange}
                  label={t('paymentMethod')}
                  required
                >
                  <MenuItem value="cash">{t('cash')}</MenuItem>
                  <MenuItem value="card">{t('card')}</MenuItem>
                  <MenuItem value="bank_transfer">{t('bankTransfer')}</MenuItem>
                  <MenuItem value="check">{t('check')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="reference"
                label={t('reference')}
                value={formData.reference}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isInvoicePayment}
                    onChange={(e) =>
                      setFormData((prev: Partial<Operation>) => ({
                        ...prev,
                        isInvoicePayment: e.target.checked,
                        source: e.target.checked ? 'invoice_payment' : 'manual',
                      }))
                    }
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#319269',
                        '&:hover': {
                          backgroundColor: 'rgba(49, 146, 105, 0.08)',
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ color: formData.isInvoicePayment ? '#319269' : 'inherit' }}>
                    {t('isInvoicePayment')}
                  </Typography>
                }
                sx={{
                  mb: 2,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: formData.isInvoicePayment ? 'rgba(49, 146, 105, 0.08)' : 'transparent',
                }}
              />
            </Grid>
            {formData.isInvoicePayment && (
              <Grid item xs={12}>
                <InvoicePaymentForm
                  initialDocuments={formData.documents}
                  onDocumentsChange={handleInvoicePaymentChange}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? t('update') : t('create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OperationForm; 