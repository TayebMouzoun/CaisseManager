import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Box, Paper, Typography, Divider, Grid } from '@mui/material';
import { CashOperation } from '../../services/slices/cashSlice';
import { RootState } from '../../services/store';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface OperationVoucherProps {
  operation: CashOperation;
}

const OperationVoucher: React.FC<OperationVoucherProps> = ({ operation }) => {
  const { t } = useTranslation();
  const { locations } = useSelector((state: RootState) => state.locations);
  const { users } = useSelector((state: RootState) => state.users);
  const { operations } = useSelector((state: RootState) => state.cash);
  
  const location = locations.find(loc => loc.id === operation.locationId);
  const user = users.find(u => u.id === operation.createdBy);
  // For return operations, find the related cash out operation
  const relatedOperation = operation.type === 'return' && operation.relatedOperationId
    ? operations.find(op => op.id === operation.relatedOperationId)
    : null;
  
  const getOperationTitle = () => {
    switch (operation.type) {
      case 'in':
        return t('cashIn');
      case 'out':
        return t('cashOut');
      case 'return':
        return t('cashReturn');
      default:
        return t('operation');
    }
  };
  
  const getOperationColor = () => {
    switch (operation.type) {
      case 'in':
        return '#388e3c';
      case 'out':
        return '#d32f2f';
      case 'return':
        return '#ffa000';
      default:
        return '#319269';
    }
  };
  
  return (
    <Paper
      sx={{
        width: '210mm',
        minHeight: '148mm',
        padding: '15mm',
        margin: '0 auto',
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{ color: '#319269', fontWeight: 'bold', mb: 1 }}
        >
          {t('appName')}
        </Typography>
        <Typography variant="h6" sx={{ color: '#666' }}>
          {location?.name || t('location')}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            color: getOperationColor(),
            mb: 2,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {getOperationTitle()}
        </Typography>
        
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ color: '#666' }}>
            {t('voucherNumber')}: <strong>{operation.voucherNumber}</strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#666' }}>
            {formatDateTime(operation.date)}
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              p: 3,
              border: '1px solid #eee',
              borderRadius: 1,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {t('id')}:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {operation.id}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {t('amount')}:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', color: getOperationColor() }}
                >
                  {formatCurrency(operation.amount)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('source')}:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {operation.source}
                  </Typography>
                </Box>
              </Grid>

              {operation.source === 'Paiement Facture' && operation.documents && (
                <>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('deliveryNote')}:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: operation.documents.deliveryNote ? '#388e3c' : '#d32f2f'
                        }}
                      >
                        {operation.documents.deliveryNote ? t('received') : t('pending')}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('invoice')}:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: operation.documents.invoice ? '#388e3c' : '#d32f2f'
                        }}
                      >
                        {operation.documents.invoice ? t('received') : t('pending')}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
              
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {t('personInCharge')}:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {operation.personInCharge}
                </Typography>
              </Grid>
              
              {operation.observation && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {t('observation')}:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {operation.observation}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {operation.type === 'return' && relatedOperation && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {t('relatedToVoucher')}:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {relatedOperation.voucherNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {t('relatedOperationAmount')}:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                      {formatCurrency(relatedOperation.amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {t('relatedOperationDate')}:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {formatDateTime(relatedOperation.date)}
                    </Typography>
                  </Grid>
                </>
              )}
              
              <Grid item xs={6}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {t('createdBy')}:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {user?.name || ''}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={4} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
              {t('signature')}:
            </Typography>
            <Divider />
            <Typography variant="caption" sx={{ color: '#666', mt: 1 }}>
              {t('signedByOperator')}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
              {t('signature')}:
            </Typography>
            <Divider />
            <Typography variant="caption" sx={{ color: '#666', mt: 1 }}>
              {t('signedByBeneficiary')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#999' }}>
          {t('voucherFooter')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default OperationVoucher; 