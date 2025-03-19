import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Add, Edit, Delete, Business, Person, LocationOn } from '@mui/icons-material';

import { RootState } from '../../services/store';
import { Location, addLocation, updateLocation, deleteLocation } from '../../services/slices/locationsSlice';

const Locations: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { locations } = useSelector((state: RootState) => state.locations);
  
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Partial<Location>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  const handleClickOpen = () => {
    setIsEditing(false);
    setCurrentLocation({});
    setOpen(true);
  };
  
  const handleEdit = (location: Location) => {
    setIsEditing(true);
    setCurrentLocation(location);
    setOpen(true);
  };
  
  const handleDeleteClick = (location: Location) => {
    setCurrentLocation(location);
    setDeleteConfirmOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };
  
  const handleSubmit = () => {
    if (!currentLocation.name) return;
    
    if (isEditing && currentLocation.id) {
      dispatch(updateLocation({
        id: currentLocation.id,
        updates: {
          name: currentLocation.name,
          address: currentLocation.address,
          manager: currentLocation.manager
        }
      }));
    } else {
      dispatch(addLocation({
        name: currentLocation.name,
        address: currentLocation.address,
        manager: currentLocation.manager
      }));
    }
    
    setOpen(false);
  };
  
  const handleDelete = () => {
    if (currentLocation.id) {
      dispatch(deleteLocation(currentLocation.id));
    }
    setDeleteConfirmOpen(false);
  };
  
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      valueGetter: (params) => {
        return params.row.id.substring(0, 8);
      }
    },
    {
      field: 'name',
      headerName: t('locationName'),
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Business sx={{ color: '#319269', mr: 1 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'address',
      headerName: t('address'),
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ color: '#666', mr: 1, fontSize: 20 }} />
          <Typography variant="body2">{params.value || '-'}</Typography>
        </Box>
      )
    },
    {
      field: 'manager',
      headerName: t('manager'),
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Person sx={{ color: '#666', mr: 1, fontSize: 20 }} />
          <Typography variant="body2">{params.value || '-'}</Typography>
        </Box>
      )
    },
    {
      field: 'createdAt',
      headerName: t('createdAt'),
      width: 180,
      valueFormatter: (params) => {
        return new Date(params.value as string).toLocaleDateString();
      }
    },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('edit')}>
            <IconButton 
              size="small" 
              onClick={() => handleEdit(params.row as Location)}
              sx={{ color: '#1976d2' }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton 
              size="small" 
              onClick={() => handleDeleteClick(params.row as Location)}
              sx={{ color: '#d32f2f' }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];
  
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#319269' }}>
          {t('locations')}
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleClickOpen}
          sx={{ 
            bgcolor: '#319269',
            '&:hover': {
              bgcolor: '#2a7d58'
            }
          }}
        >
          {t('addLocation')}
        </Button>
      </Box>
      
      {locations.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Business sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {t('noLocationsYet')}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {t('addFirstLocation')}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Add />} 
            onClick={handleClickOpen}
            sx={{ mt: 2 }}
          >
            {t('addLocation')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <DataGrid
                rows={locations}
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
          
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: '#319269' }}>
              {t('locationCards')}
            </Typography>
            <Grid container spacing={3}>
              {locations.map((location) => (
                <Grid item xs={12} sm={6} md={4} key={location.id}>
                  <Card sx={{ 
                    borderRadius: 2, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: '#319269'
                      }}>
                        <Business sx={{ mr: 1 }} />
                        {location.name}
                      </Typography>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ color: '#666', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="textSecondary">
                          {location.address || t('noAddress')}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ color: '#666', mr: 1, fontSize: 20 }} />
                        <Typography variant="body2" color="textSecondary">
                          {location.manager || t('noManager')}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 1.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(location)}
                        sx={{ color: '#1976d2' }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(location)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
      
      {/* Add/Edit Location Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? t('editLocation') : t('addLocation')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label={t('locationName')}
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.name || ''}
            onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="address"
            label={t('address')}
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.address || ''}
            onChange={(e) => setCurrentLocation({ ...currentLocation, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="manager"
            label={t('manager')}
            type="text"
            fullWidth
            variant="outlined"
            value={currentLocation.manager || ''}
            onChange={(e) => setCurrentLocation({ ...currentLocation, manager: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!currentLocation.name}
            sx={{ 
              bgcolor: '#319269',
              '&:hover': {
                bgcolor: '#2a7d58'
              }
            }}
          >
            {isEditing ? t('update') : t('add')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
        <DialogTitle>{t('confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {t('deleteLocationConfirm', { name: currentLocation.name })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose} variant="outlined">
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
          >
            {t('delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Locations; 