import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { addSource, updateSource, deleteSource } from '../../services/slices/sourcesSlice';
import { Source, SourceType } from '../../types/sourceTypes';

const SourcesManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const sources = useSelector((state: RootState) => state.sources.sources);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [formData, setFormData] = useState<Omit<Source, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'in' as SourceType,
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleOpenDialog = (source?: Source) => {
    if (source) {
      setEditingSource(source);
      setFormData({
        name: source.name,
        type: source.type,
        description: source.description || '',
      });
    } else {
      setEditingSource(null);
      setFormData({
        name: '',
        type: 'in',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSource(null);
    setFormData({
      name: '',
      type: 'in',
      description: '',
    });
    setError(null);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError(t('sourceNameRequired'));
      return;
    }

    const now = new Date().toISOString();
    const sourceData: Source = {
      ...formData,
      id: editingSource?.id || Date.now().toString(),
      createdAt: editingSource?.createdAt || now,
      updatedAt: now,
    };

    if (editingSource) {
      dispatch(updateSource(sourceData));
    } else {
      dispatch(addSource(sourceData));
    }

    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDeleteSource'))) {
      dispatch(deleteSource(id));
    }
  };

  const inSources = sources.filter((s: Source) => s.type === 'in');
  const outSources = sources.filter((s: Source) => s.type === 'out');

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('sourcesManagement')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: '#319269', '&:hover': { bgcolor: '#006440' } }}
        >
          {t('addSource')}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#319269' }}>
          {t('inSources')}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inSources.map((source: Source) => (
                <TableRow key={source.id}>
                  <TableCell>{source.name}</TableCell>
                  <TableCell>{source.description}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(source)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(source.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, color: '#319269' }}>
          {t('outSources')}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('description')}</TableCell>
                <TableCell align="right">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outSources.map((source: Source) => (
                <TableRow key={source.id}>
                  <TableCell>{source.name}</TableCell>
                  <TableCell>{source.description}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(source)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(source.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSource ? t('editSource') : t('addSource')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label={t('name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('type')}</InputLabel>
              <Select
                value={formData.type}
                label={t('type')}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as SourceType })}
              >
                <MenuItem value="in">{t('inSource')}</MenuItem>
                <MenuItem value="out">{t('outSource')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={t('description')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: '#319269', '&:hover': { bgcolor: '#006440' } }}
          >
            {editingSource ? t('update') : t('add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SourcesManagement; 