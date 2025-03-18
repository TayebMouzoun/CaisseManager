import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Button, Grid, Divider, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Print, Attachment, AttachFile, RemoveRedEye } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

import { RootState } from '../../services/store';
import { setCurrentOperation, CashOperation } from '../../services/slices/cashSlice';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import OperationVoucher from '../CashManagement/OperationVoucher';
import AttachmentUpload from '../../components/AttachmentUpload/AttachmentUpload';

// Définir les interfaces pour les données
interface User {
  id: string;
  name: string;
  // ... autres propriétés
}

interface Location {
  id: string;
  name: string;
  // ... autres propriétés
}

const CashOperations: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { operations } = useSelector((state: RootState) => state.cash);
  const { users } = useSelector((state: RootState) => state.users);
  const { locations } = useSelector((state: RootState) => state.locations);
  
  const [selectedOperation, setSelectedOperation] = useState<CashOperation | null>(null);
  const [showVoucher, setShowVoucher] = useState<boolean>(false);
  const [showAttachment, setShowAttachment] = useState<boolean>(false);
  
  const voucherRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => voucherRef.current,
    documentTitle: `Reçu-${selectedOperation?.voucherNumber || 'Caisse'}`,
    onAfterPrint: () => {
      // After printing, you might want to do something
      console.log('Printing completed');
    },
  });
  
  const handleSelectOperation = (operation: CashOperation) => {
    setSelectedOperation(operation);
    dispatch(setCurrentOperation(operation));
    setShowVoucher(true);
    setShowAttachment(false);
  };
  
  const handleShowAttachment = () => {
    setShowAttachment(true);
    setShowVoucher(false);
  };
  
  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'success';
      case 'out':
        return 'error';
      case 'return':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  const getOperationTypeLabel = (type: string) => {
    switch (type) {
      case 'in':
        return t('cashIn');
      case 'out':
        return t('cashOut');
      case 'return':
        return t('cashReturn');
      default:
        return type;
    }
  };
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : '';
  };
  
  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location ? location.name : '';
  };
  
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('id'),
      width: 100,
      valueGetter: (params) => {
        const id = params.row.id;
        return id.slice(0, 8); // Show first 8 characters of UUID
      },
    },
    {
      field: 'voucherNumber',
      headerName: t('voucherNumber'),
      width: 180,
    },
    {
      field: 'type',
      headerName: t('operationType'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={getOperationTypeLabel(params.value as string)}
          color={getOperationTypeColor(params.value as string)}
          size="small"
        />
      ),
    },
    {
      field: 'amount',
      headerName: t('amount'),
      width: 130,
      valueFormatter: (params) => formatCurrency(params.value as number),
    },
    {
      field: 'source',
      headerName: t('source'),
      width: 200,
    },
    {
      field: 'date',
      headerName: t('date'),
      width: 180,
      valueFormatter: (params) => formatDateTime(params.value as string),
    },
    {
      field: 'createdBy',
      headerName: t('createdBy'),
      width: 150,
      valueGetter: (params) => getUserName(params.value as string),
    },
    {
      field: 'locationId',
      headerName: t('location'),
      width: 150,
      valueGetter: (params) => getLocationName(params.value as string),
    },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleSelectOperation(params.row as CashOperation)}
            startIcon={<Print />}
          >
            {t('print')}
          </Button>
        </Box>
      ),
    },
    {
      field: 'attachment',
      headerName: t('attachment'),
      width: 120,
      renderCell: (params) => (
        <Box>
          {params.row.attachmentUrl ? (
            <Chip 
              icon={<Attachment />} 
              label={t('signed')} 
              color="success"
              size="small" 
              onClick={() => window.open(params.row.attachmentUrl, '_blank')}
            />
          ) : (
            <Chip 
              icon={<AttachFile />} 
              label={t('notSigned')} 
              color="default"
              size="small" 
            />
          )}
        </Box>
      ),
    },
  ];
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#319269' }}>
        {t('operations')}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedOperation ? 7 : 12}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <DataGrid
              rows={operations}
              columns={columns}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 }
                }
              }}
              sx={{
                '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Paper>
        </Grid>
        
        {selectedOperation && (
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {t('operationDetails')}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Print />}
                    onClick={handlePrint}
                    sx={{ mr: 1 }}
                  >
                    {t('printVoucher')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={selectedOperation.attachmentUrl ? <RemoveRedEye /> : <AttachFile />}
                    onClick={handleShowAttachment}
                  >
                    {selectedOperation.attachmentUrl ? t('viewAttachment') : t('addAttachment')}
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {showVoucher && (
                <Box sx={{ display: 'block', overflow: 'auto', maxHeight: '70vh' }}>
                  <Box ref={voucherRef}>
                    <OperationVoucher operation={selectedOperation} />
                  </Box>
                </Box>
              )}
              
              {showAttachment && (
                <AttachmentUpload
                  operationId={selectedOperation.id}
                  existingAttachmentUrl={selectedOperation.attachmentUrl}
                />
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CashOperations; 