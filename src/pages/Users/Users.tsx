import React, { useState, useEffect } from 'react';
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
  CardActions,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { 
  Add, 
  Edit, 
  Delete, 
  Person, 
  Security, 
  AdminPanelSettings,
  AccountCircle,
  SupervisorAccount,
  PersonOutline,
  LocationOn,
  Check
} from '@mui/icons-material';

import { RootState } from '../../services/store';
import { addUser, updateUser, deleteUser } from '../../services/slices/usersSlice';
import { User } from '../../services/slices/authSlice';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { users } = useSelector((state: RootState) => state.users);
  const { locations } = useSelector((state: RootState) => state.locations);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<Partial<User>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleClickOpen = () => {
    setIsEditing(false);
    setCurrentUserData({
      role: 'cashier' // Default role
    });
    setUserPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setOpen(true);
  };
  
  const handleEdit = (userData: User) => {
    setIsEditing(true);
    setCurrentUserData({...userData});
    setUserPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setOpen(true);
  };
  
  const handleDeleteClick = (userData: User) => {
    setCurrentUserData(userData);
    setDeleteConfirmOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
  };
  
  const validateForm = () => {
    // Reset previous error
    setPasswordError('');
    
    // Basic validations
    if (!currentUserData.name?.trim()) {
      return false;
    }
    
    if (!currentUserData.email?.trim()) {
      return false;
    }
    
    // Only check password for new users or when password is being changed
    if (!isEditing || userPassword) {
      if (userPassword !== confirmPassword) {
        setPasswordError(t('passwordMismatch'));
        return false;
      }
      
      if (userPassword.length < 6) {
        setPasswordError(t('passwordTooShort'));
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (isEditing && currentUserData.id) {
      dispatch(updateUser({
        id: currentUserData.id,
        updates: {
          name: currentUserData.name,
          email: currentUserData.email,
          role: currentUserData.role,
          locationId: currentUserData.locationId,
        }
      }));
    } else {
      // Create the user without the password property
      dispatch(addUser({
        name: currentUserData.name!,
        email: currentUserData.email!,
        role: currentUserData.role!,
        locationId: currentUserData.locationId,
      }));
      
      // Note: In a real application, we would need to handle the password
      // separately, likely through a different API call or additional action
      console.log('Password would be sent to API:', userPassword);
    }
    
    setOpen(false);
  };
  
  const handleDelete = () => {
    if (currentUserData.id) {
      dispatch(deleteUser(currentUserData.id));
    }
    setDeleteConfirmOpen(false);
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings sx={{ color: '#d32f2f' }} />;
      case 'manager':
        return <SupervisorAccount sx={{ color: '#2e7d32' }} />;
      case 'cashier':
        return <PersonOutline sx={{ color: '#1976d2' }} />;
      default:
        return <Person />;
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return t('adminRole');
      case 'manager':
        return t('managerRole');
      case 'cashier':
        return t('cashierRole');
      default:
        return role;
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'success';
      case 'cashier':
        return 'info';
      default:
        return 'default';
    }
  };
  
  const getLocationName = (locationId?: string) => {
    if (!locationId) return t('noLocation');
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : t('unknownLocation');
  };
  
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      valueGetter: (params) => {
        const id = params.value as string;
        return id.substring(0, 8);
      }
    },
    {
      field: 'name',
      headerName: t('name'),
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: params.row.role === 'admin' 
                ? '#ffebee' 
                : params.row.role === 'manager'
                ? '#e8f5e9'
                : '#e3f2fd',
              color: params.row.role === 'admin' 
                ? '#d32f2f' 
                : params.row.role === 'manager'
                ? '#2e7d32'
                : '#1976d2',
              mr: 1
            }}
          >
            {params.value.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'email',
      headerName: t('email'),
      width: 230,
    },
    {
      field: 'role',
      headerName: t('role'),
      width: 150,
      renderCell: (params) => (
        <Chip
          icon={getRoleIcon(params.value as string)}
          label={getRoleLabel(params.value as string)}
          color={getRoleColor(params.value as string)}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'locationId',
      headerName: t('location'),
      width: 200,
      valueGetter: (params) => getLocationName(params.value as string),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ color: '#666', mr: 1, fontSize: 20 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
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
              onClick={() => handleEdit(params.row as User)}
              sx={{ color: '#1976d2' }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton 
              size="small" 
              onClick={() => handleDeleteClick(params.row as User)}
              sx={{ color: '#d32f2f' }}
              disabled={params.row.id === currentUser?.id} // Prevent deleting yourself
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
          {t('users')}
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
          {t('addUser')}
        </Button>
      </Box>
      
      {users.length === 0 ? (
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Person sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {t('noUsersYet')}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {t('addFirstUser')}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Add />} 
            onClick={handleClickOpen}
            sx={{ mt: 2 }}
          >
            {t('addUser')}
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <DataGrid
                rows={users}
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
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h5" sx={{ color: '#319269', mb: 1 }}>
                {t('rolePermissions')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('rolePermissionsDescription')}
              </Typography>
            </Box>
            
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('role')}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('cashManagement')}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('viewReports')}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('manageUsers')}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('manageLocations')}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('systemSettings')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#ffebee', color: '#d32f2f', mr: 1, width: 32, height: 32 }}>
                          <AdminPanelSettings fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {t('adminRole')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', mr: 1, width: 32, height: 32 }}>
                          <SupervisorAccount fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {t('managerRole')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                    <TableCell align="center"><Check color="disabled" /></TableCell>
                    <TableCell align="center"><Check color="disabled" /></TableCell>
                    <TableCell align="center"><Check color="disabled" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', mr: 1, width: 32, height: 32 }}>
                          <PersonOutline fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight="bold">
                          {t('cashierRole')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center"><Check color="success" /></TableCell>
                    <TableCell align="center"><Check color="disabled" /></TableCell>
                    <TableCell align="center"><Check color="disabled" /></TableCell>
                    <TableCell align="center"><Check color="disabled" /></TableCell>
                    <TableCell align="center"><Check color="disabled" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
      
      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? t('editUser') : t('addUser')}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label={t('name')}
            type="text"
            fullWidth
            variant="outlined"
            value={currentUserData.name || ''}
            onChange={(e) => setCurrentUserData({ ...currentUserData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            required
            margin="dense"
            id="email"
            label={t('email')}
            type="email"
            fullWidth
            variant="outlined"
            value={currentUserData.email || ''}
            onChange={(e) => setCurrentUserData({ ...currentUserData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="dense" sx={{ mb: 2 }}>
                <InputLabel id="role-label">{t('role')}</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={currentUserData.role || 'cashier'}
                  label={t('role')}
                  onChange={(e) => setCurrentUserData({ ...currentUserData, role: e.target.value as User['role'] })}
                >
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AdminPanelSettings sx={{ mr: 1, color: '#d32f2f' }} />
                      {t('adminRole')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="manager">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SupervisorAccount sx={{ mr: 1, color: '#2e7d32' }} />
                      {t('managerRole')}
                    </Box>
                  </MenuItem>
                  <MenuItem value="cashier">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonOutline sx={{ mr: 1, color: '#1976d2' }} />
                      {t('cashierRole')}
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="dense" sx={{ mb: 2 }}>
                <InputLabel id="location-label">{t('location')}</InputLabel>
                <Select
                  labelId="location-label"
                  id="locationId"
                  value={currentUserData.locationId || ''}
                  label={t('location')}
                  onChange={(e) => setCurrentUserData({ ...currentUserData, locationId: e.target.value })}
                >
                  <MenuItem value="">{t('noLocation')}</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {isEditing ? t('changePassword') : t('password')}
          </Typography>
          
          <TextField
            required={!isEditing}
            margin="dense"
            id="password"
            label={t('password')}
            type="password"
            fullWidth
            variant="outlined"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            error={!!passwordError}
            helperText={isEditing ? t('leaveEmptyToKeepCurrent') : ''}
            sx={{ mb: 2 }}
          />
          <TextField
            required={!isEditing}
            margin="dense"
            id="confirmPassword"
            label={t('confirmPassword')}
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!currentUserData.name || !currentUserData.email || (!isEditing && !userPassword)}
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
            {t('deleteUserConfirm', { name: currentUserData.name })}
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

export default Users; 