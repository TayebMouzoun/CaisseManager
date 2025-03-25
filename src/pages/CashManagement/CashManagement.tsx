import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  FormHelperText,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  Alert,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Checkbox,
  Divider,
  FormGroup,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateTimeValidationError } from '@mui/x-date-pickers/models';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MuiPickersAdapter } from '@mui/x-date-pickers/models';
import {
  AttachMoney,
  AddCircleOutline,
  RemoveCircleOutline,
  KeyboardReturn,
  Check,
  Print,
  Person,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { addOperation, CashOperation, OperationType } from '../../services/slices/cashSlice';
import { RootState } from '../../services/store';
import { formatCurrency } from '../../utils/formatters';
import OperationVoucher from './OperationVoucher';
import { useReactToPrint } from 'react-to-print';
import { Source } from '../../types/sourceTypes';
import { SelectChangeEvent } from '@mui/material/Select';

const CashManagement: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { locations } = useSelector((state: RootState) => state.locations);
  const { currentOperation, operations } = useSelector((state: RootState) => state.cash);
  const { sources } = useSelector((state: RootState) => state.sources);
  
  const [activeTab, setActiveTab] = useState<OperationType>('in');
  const [amount, setAmount] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [personInCharge, setPersonInCharge] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [locationId, setLocationId] = useState<string>(user?.locationId || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [voucherRef, setVoucherRef] = useState<React.RefObject<HTMLDivElement>>(React.createRef());
  const [relatedOperationId, setRelatedOperationId] = useState<string>('');
<<<<<<< HEAD
  const [operationDate, setOperationDate] = useState<Date | null>(new Date());
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editedDate, setEditedDate] = useState<Date | null>(null);
=======
  const [isInvoicePayment, setIsInvoicePayment] = useState(false);
  const [documents, setDocuments] = useState({
    deliveryNote: false,
    invoice: false,
  });
>>>>>>> 62e0e8e26f5fc7eddf98af87fd7a419d156935c2
  
  // Filtrer les sources en fonction du type d'opération
  const sourceOptions = sources
    .filter(s => s.type === (activeTab === 'return' ? 'out' : activeTab))
    .map(s => ({
      value: s.name,
      label: s.name,
      description: s.description
    }));
  
  // Debug sources
  useEffect(() => {
    console.log('All sources in Redux:', sources);
    console.log('Filtered sourceOptions for current tab:', sourceOptions);
    console.log('Active tab:', activeTab);
  }, [sources, activeTab, sourceOptions]);
  
  // If user is not admin and has a location assigned, use that location
  useEffect(() => {
    if (user && user.role !== 'admin' && user.locationId) {
      setLocationId(user.locationId);
    }
  }, [user]);
  
  // Get a list of all out operations for the return operation selection
  const cashOutOperations = useSelector((state: RootState) => 
    state.cash.operations.filter(op => 
      op.type === 'out' && 
      // Only filter by source if we're in return mode and a source is selected
      (activeTab === 'return' && source ? op.source === source : true)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  
  const handlePrint = useReactToPrint({
    content: () => voucherRef.current,
    documentTitle: `Reçu-${currentOperation?.voucherNumber || 'Caisse'}`,
    onAfterPrint: () => {
      // Reset the form after printing
      resetForm();
    },
  });
  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: OperationType) => {
    setActiveTab(newValue);
  };
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = t('required');
    }
    
    if (!source) {
      newErrors.source = t('required');
    }
    
    if (!personInCharge.trim()) {
      newErrors.personInCharge = t('required');
    }
    
    if (!locationId) {
      newErrors.locationId = t('required');
    }
    
    if (!operationDate) {
      newErrors.operationDate = t('required');
    }
    
    if (activeTab === 'return' && !relatedOperationId) {
      newErrors.relatedOperationId = t('required');
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const operationData = {
      type: activeTab,
      amount: parseFloat(amount),
      source,
      personInCharge,
      observation,
      date: operationDate?.toISOString() || new Date().toISOString(),
      createdBy: user?.id || '',
      locationId,
      isSigned: false,
      isInvoicePayment,
      documents: isInvoicePayment ? documents : undefined,
      ...(activeTab === 'return' && { relatedOperationId }),
    };
    
    dispatch(addOperation(operationData));
    setSuccess(true);
  };
  
  const resetForm = () => {
    setAmount('');
    setSource('');
    setPersonInCharge('');
    setObservation('');
    if (user?.role === 'admin') {
      setLocationId('');
    }
    setErrors({});
    setSuccess(false);
    setRelatedOperationId('');
<<<<<<< HEAD
    setOperationDate(new Date());
=======
    setIsInvoicePayment(false);
    setDocuments({
      deliveryNote: false,
      invoice: false,
    });
>>>>>>> 62e0e8e26f5fc7eddf98af87fd7a419d156935c2
  };
  
  // Add effect to reset relatedOperationId when source changes in return mode
  useEffect(() => {
    if (activeTab === 'return') {
      setRelatedOperationId('');
    }
  }, [source, activeTab]);
  
  // Create a function to handle related operation selection
  const handleRelatedOperationChange = (operationId: string) => {
    setRelatedOperationId(operationId);
    
    // If an operation is selected, suggest the same amount
    if (operationId) {
      const selectedOperation = cashOutOperations.find(op => op.id === operationId);
      if (selectedOperation && !amount) {
        // Suggest the original amount by default
        setAmount(selectedOperation.amount.toString());
      }
    }
  };
  
<<<<<<< HEAD
  // Add this function to handle date updates
  const handleDateUpdate = () => {
    if (editedDate && currentOperation) {
      // Here you would typically dispatch an action to update the operation date
      // For now, we'll just update the local state
      setIsEditingDate(false);
      setOperationDate(editedDate);
    }
  };
=======
  // Handle source change
  const handleSourceChange = (event: SelectChangeEvent<string>) => {
    const selectedSource = event.target.value;
    setSource(selectedSource);
    // Reset documents if source is not "Paiement Facture"
    if (selectedSource !== 'Paiement Facture') {
      setDocuments({
        deliveryNote: false,
        invoice: false,
      });
    }
  };

  // Handle document change
  const handleDocumentChange = (document: 'deliveryNote' | 'invoice') => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocuments(prev => ({
      ...prev,
      [document]: event.target.checked
    }));
  };
>>>>>>> 62e0e8e26f5fc7eddf98af87fd7a419d156935c2
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#319269' }}>
        {t('cashManagement')}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
                sx={{ mb: 3 }}
              >
                <Tab 
                  icon={<AddCircleOutline />} 
                  label={t('cashIn')} 
                  value="in"
                  sx={{ 
                    color: activeTab === 'in' ? '#388e3c' : 'inherit',
                    bgcolor: activeTab === 'in' ? 'rgba(56, 142, 60, 0.1)' : 'transparent',
                    borderRadius: '4px 4px 0 0',
                    fontWeight: activeTab === 'in' ? 'bold' : 'normal'
                  }}
                />
                <Tab 
                  icon={<RemoveCircleOutline />} 
                  label={t('cashOut')} 
                  value="out"
                  sx={{ 
                    color: activeTab === 'out' ? '#d32f2f' : 'inherit',
                    bgcolor: activeTab === 'out' ? 'rgba(211, 47, 47, 0.1)' : 'transparent',
                    borderRadius: '4px 4px 0 0',
                    fontWeight: activeTab === 'out' ? 'bold' : 'normal'
                  }}
                />
                <Tab 
                  icon={<KeyboardReturn />} 
                  label={t('cashReturn')} 
                  value="return"
                  sx={{ 
                    color: activeTab === 'return' ? '#ffa000' : 'inherit',
                    bgcolor: activeTab === 'return' ? 'rgba(255, 160, 0, 0.1)' : 'transparent',
                    borderRadius: '4px 4px 0 0',
                    fontWeight: activeTab === 'return' ? 'bold' : 'normal'
                  }}
                />
              </Tabs>
              
              <Box component="form" onSubmit={handleSubmit} sx={{
                bgcolor: activeTab === 'in' 
                  ? 'rgba(56, 142, 60, 0.05)' 
                  : activeTab === 'out' 
                  ? 'rgba(211, 47, 47, 0.05)'
                  : 'rgba(255, 160, 0, 0.05)',
                p: 3,
                borderRadius: 2
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label={t('operationDate')}
                        value={operationDate}
                        onChange={(newValue) => {
                          if (newValue instanceof Date) {
                            setOperationDate(newValue);
                          }
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.operationDate,
                            helperText: errors.operationDate,
                            sx: {
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: activeTab === 'in' 
                                    ? 'rgba(56, 142, 60, 0.5)' 
                                    : activeTab === 'out' 
                                    ? 'rgba(211, 47, 47, 0.5)'
                                    : 'rgba(255, 160, 0, 0.5)',
                                },
                                '&:hover fieldset': {
                                  borderColor: activeTab === 'in' 
                                    ? '#388e3c' 
                                    : activeTab === 'out' 
                                    ? '#d32f2f'
                                    : '#ffa000',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: activeTab === 'in' 
                                    ? '#388e3c' 
                                    : activeTab === 'out' 
                                    ? '#d32f2f'
                                    : '#ffa000',
                                },
                              },
                            }
                          }
                        }}
                        onError={(reason: DateTimeValidationError) => {
                          if (reason === 'invalidDate') {
                            setErrors(prev => ({ ...prev, operationDate: t('invalidDate') }));
                          } else {
                            setErrors(prev => ({ ...prev, operationDate: '' }));
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t('amount')}
                      fullWidth
                      required
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      error={!!errors.amount}
                      helperText={errors.amount}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            MAD
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: activeTab === 'in' 
                              ? 'rgba(56, 142, 60, 0.5)' 
                              : activeTab === 'out' 
                              ? 'rgba(211, 47, 47, 0.5)'
                              : 'rgba(255, 160, 0, 0.5)',
                          },
                          '&:hover fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl 
                      fullWidth 
                      required 
                      error={!!errors.source}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: activeTab === 'in' 
                              ? 'rgba(56, 142, 60, 0.5)' 
                              : activeTab === 'out' 
                              ? 'rgba(211, 47, 47, 0.5)'
                              : 'rgba(255, 160, 0, 0.5)',
                          },
                          '&:hover fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                        },
                      }}
                    >
                      <InputLabel id="source-label">{t('source')}</InputLabel>
                      <Select
                        labelId="source-label"
                        value={source}
                        label={t('source')}
                        onChange={handleSourceChange}
                      >
                        <MenuItem value="">{t('sourceSelect')}</MenuItem>
                        {sourceOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.source && (
                        <FormHelperText>{errors.source}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('personInCharge')}
                      fullWidth
                      required
                      value={personInCharge}
                      onChange={(e) => setPersonInCharge(e.target.value)}
                      error={!!errors.personInCharge}
                      helperText={errors.personInCharge}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: activeTab === 'in' 
                              ? 'rgba(56, 142, 60, 0.5)' 
                              : activeTab === 'out' 
                              ? 'rgba(211, 47, 47, 0.5)'
                              : 'rgba(255, 160, 0, 0.5)',
                          },
                          '&:hover fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label={t('observation')}
                      fullWidth
                      multiline
                      rows={3}
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: activeTab === 'in' 
                              ? 'rgba(56, 142, 60, 0.5)' 
                              : activeTab === 'out' 
                              ? 'rgba(211, 47, 47, 0.5)'
                              : 'rgba(255, 160, 0, 0.5)',
                          },
                          '&:hover fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: activeTab === 'in' 
                              ? '#388e3c' 
                              : activeTab === 'out' 
                              ? '#d32f2f'
                              : '#ffa000',
                          },
                        },
                      }}
                    />
                  </Grid>
                  
                  {user?.role === 'admin' && (
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.locationId}>
                        <InputLabel id="location-label">{t('location')}</InputLabel>
                        <Select
                          labelId="location-label"
                          value={locationId}
                          label={t('location')}
                          onChange={(e) => setLocationId(e.target.value as string)}
                          required
                        >
                          <MenuItem value="">{t('select')}</MenuItem>
                          {locations.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                              {location.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.locationId && (
                          <FormHelperText>{errors.locationId}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                  
                  {activeTab === 'return' && (
                    <Grid item xs={12}>
                      <FormControl 
                        fullWidth 
                        required 
                        error={!!errors.relatedOperationId}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 160, 0, 0.5)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#ffa000',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#ffa000',
                            },
                          },
                        }}
                      >
                        <InputLabel id="related-operation-label">{t('relatedCashOutOperation')}</InputLabel>
                        <Select
                          labelId="related-operation-label"
                          value={relatedOperationId}
                          label={t('relatedCashOutOperation')}
                          onChange={(e) => handleRelatedOperationChange(e.target.value as string)}
                        >
                          <MenuItem value="">{t('select')}</MenuItem>
                          {cashOutOperations.map((operation) => (
                            <MenuItem key={operation.id} value={operation.id}>
                              {operation.voucherNumber} - {formatCurrency(operation.amount).replace('$', '')} MAD - {operation.source} ({new Date(operation.date).toLocaleDateString()})
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.relatedOperationId && (
                          <FormHelperText>{errors.relatedOperationId}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                  
                  {activeTab === 'return' && source && (
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: '#ffa000', fontStyle: 'italic', mt: 1, display: 'block' }}>
                        {t('returnSourceHelp', 'The list of operations has been filtered to show only cash out operations with this source')}
                      </Typography>
                    </Grid>
                  )}
                  
                  {source === 'Paiement Facture' && (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          sx={{ color: '#d32f2f' }}
                          key="documents-tracking-title"
                        >
                          {t('documentsTracking')}
                        </Typography>
                        <FormGroup>
                          <FormControlLabel
                            key="delivery-note-switch"
                            control={
                              <Switch
                                checked={documents.deliveryNote}
                                onChange={handleDocumentChange('deliveryNote')}
                                color="error"
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#d32f2f',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#d32f2f',
                                  },
                                }}
                              />
                            }
                            label={t('deliveryNote')}
                            sx={{ mb: 1 }}
                          />
                          <FormControlLabel
                            key="invoice-switch"
                            control={
                              <Switch
                                checked={documents.invoice}
                                onChange={handleDocumentChange('invoice')}
                                color="error"
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#d32f2f',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#d32f2f',
                                  },
                                }}
                              />
                            }
                            label={t('invoice')}
                          />
                        </FormGroup>
                      </Paper>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={
                        activeTab === 'in' 
                          ? <AddCircleOutline /> 
                          : activeTab === 'out' 
                          ? <RemoveCircleOutline />
                          : <KeyboardReturn />
                      }
                      sx={{
                        mt: 2,
                        bgcolor: activeTab === 'in' 
                          ? '#388e3c' 
                          : activeTab === 'out' 
                          ? '#d32f2f'
                          : '#ffa000',
                        '&:hover': {
                          bgcolor: activeTab === 'in' 
                            ? '#2e7d32' 
                            : activeTab === 'out' 
                            ? '#c62828'
                            : '#ff8f00',
                        },
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      Valider
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {currentOperation && success && (
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                bgcolor: '#f9f9f9',
                position: 'relative',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#319269', display: 'flex', alignItems: 'center' }}>
                <Check sx={{ color: '#388e3c', mr: 1 }} />
                {t('operationSuccess')}
              </Typography>
              
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {t('operationDetails')}:
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('operationType')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {currentOperation.type === 'in' 
                        ? t('cashIn') 
                        : currentOperation.type === 'out' 
                        ? t('cashOut')
                        : t('cashReturn')
                      }
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('amount')}:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: currentOperation.type === 'in' 
                          ? '#388e3c' 
                          : currentOperation.type === 'out' 
                          ? '#d32f2f'
                          : '#ffa000',
                      }}
                    >
                      {formatCurrency(currentOperation.amount)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('source')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {currentOperation.source}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('personInCharge')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {currentOperation.personInCharge}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('voucherNumber')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {currentOperation.voucherNumber}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('date')}:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isEditingDate ? (
                        <>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                              value={editedDate}
                              onChange={(newValue) => {
                                if (newValue instanceof Date) {
                                  setEditedDate(newValue);
                                }
                              }}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  sx: {
                                    width: '200px',
                                    '& .MuiOutlinedInput-root': {
                                      height: '32px',
                                    },
                                  },
                                }
                              }}
                            />
                          </LocalizationProvider>
                          <IconButton 
                            size="small" 
                            onClick={handleDateUpdate}
                            sx={{ color: '#388e3c' }}
                          >
                            <Save />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => {
                              setIsEditingDate(false);
                              setEditedDate(null);
                            }}
                            sx={{ color: '#d32f2f' }}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {new Date(currentOperation.date).toLocaleString()}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => {
                              setEditedDate(new Date(currentOperation.date));
                              setIsEditingDate(true);
                            }}
                            sx={{ color: '#319269' }}
                          >
                            <Edit />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                  
                  {currentOperation.observation && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('observation')}:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {currentOperation.observation}
                      </Typography>
                    </Box>
                  )}
                  
                  {currentOperation.type === 'return' && currentOperation.relatedOperationId && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {t('relatedToVoucher')}:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {operations.find((op: CashOperation) => op.id === currentOperation.relatedOperationId)?.voucherNumber || t('notFound')}
                        </Typography>
                      </Box>
                      
                      {(() => {
                        const relatedOp = operations.find((op: CashOperation) => op.id === currentOperation.relatedOperationId);
                        if (relatedOp) {
                          return (
                            <>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">
                                  {t('originalAmount')}:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                  {formatCurrency(relatedOp.amount)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">
                                  {t('returnRatio')}:
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {Math.round((currentOperation.amount / relatedOp.amount) * 100)}%
                                </Typography>
                              </Box>
                            </>
                          );
                        }
                        return null;
                      })()}
                    </>
                  )}
                </Stack>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={handlePrint}
                  sx={{
                    color: '#319269',
                    borderColor: '#319269',
                    '&:hover': {
                      borderColor: '#006440',
                      bgcolor: 'rgba(49, 146, 105, 0.04)',
                    },
                    textTransform: 'none',
                  }}
                >
                  {t('printVoucher')}
                </Button>
              </Box>
              
              <div style={{ display: 'none' }}>
                <div ref={voucherRef}>
                  <OperationVoucher operation={currentOperation} />
                </div>
              </div>
            </Paper>
          )}
          
          {!success && (
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#f9f9f9',
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'text.secondary', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('operationInstructions')}
                </Typography>
                <Typography variant="body2">
                  {activeTab === 'in' 
                    ? t('operationInstructionsIn')
                    : activeTab === 'out'
                    ? t('operationInstructionsOut')
                    : t('operationInstructionsReturn')
                  }
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('operationSuccessMessage')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CashManagement; 