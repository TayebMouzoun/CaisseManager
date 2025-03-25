import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  LocalShipping as LocalShippingIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Operation {
  _id: string;
  id: number;
  voucherNumber: string;
  type: 'in' | 'out';
  amount: number;
  source: string;
  relatedOperation?: string;
  date: string;
  documents?: {
    deliveryNote: boolean;
    invoice: boolean;
  };
}

interface OperationsListProps {
  operations: Operation[];
  onEdit: (operation: Operation) => void;
  onDelete: (operation: Operation) => void;
}

const OperationsList: React.FC<OperationsListProps> = ({
  operations,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  const renderDocumentStatusTooltip = (operation: Operation) => {
    if (!operation.documents) return null;

    return (
      <Box sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocalShippingIcon
            sx={{
              color: operation.documents.deliveryNote ? '#4caf50' : '#d32f2f',
              fontSize: '1rem',
              mr: 1,
            }}
          />
          <Typography variant="body2">
            BL: {operation.documents.deliveryNote ? 'Reçu' : 'En attente'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon
            sx={{
              color: operation.documents.invoice ? '#4caf50' : '#d32f2f',
              fontSize: '1rem',
              mr: 1,
            }}
          />
          <Typography variant="body2">
            Facture: {operation.documents.invoice ? 'Reçu' : 'En attente'}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderSource = (operation: Operation) => {
    if (operation.source === 'Paiement Facture') {
      return (
        <Tooltip
          title={renderDocumentStatusTooltip(operation)}
          arrow
          placement="right"
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': {
                '& .MuiSvgIcon-root': {
                  color: 'primary.dark'
                }
              }
            }}
          >
            <Typography sx={{ mr: 1 }}>
              {operation.source}
            </Typography>
            <InfoIcon 
              sx={{ 
                fontSize: '20px', 
                color: 'primary.main',
                opacity: 0.8
              }} 
            />
          </Box>
        </Tooltip>
      );
    }
    return operation.source;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Numéro de reçu</TableCell>
            <TableCell>Type d'opération</TableCell>
            <TableCell>Montant</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>relatedOperation</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operations.map((operation) => (
            <TableRow key={operation._id}>
              <TableCell>{operation.id}</TableCell>
              <TableCell>{operation.voucherNumber}</TableCell>
              <TableCell>
                <Chip
                  label={operation.type === 'in' ? 'Entrée' : 'Sortie'}
                  color={operation.type === 'in' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{operation.amount.toFixed(2)} MAD</TableCell>
              <TableCell>{renderSource(operation)}</TableCell>
              <TableCell>{operation.relatedOperation || '-'}</TableCell>
              <TableCell>{new Date(operation.date).toLocaleString()}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(operation)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(operation)} size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OperationsList; 