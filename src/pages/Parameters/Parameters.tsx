import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Receipt as ReceiptIcon,
  Business as BusinessIcon,
  AddCircle as AddIcon,
  TrendingUp,
  TrendingDown,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../services/store';
import { Source, SourceType } from '../../types/sourceTypes';
import { setSources } from '../../services/slices/sourcesSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`parameters-tabpanel-${index}`}
      aria-labelledby={`parameters-tab-${index}`}
      {...other}
      style={{ padding: '16px 0' }}
    >
      {value === index && children}
    </div>
  );
};

const Parameters: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { sources } = useSelector((state: RootState) => state.sources);
  const [tabValue, setTabValue] = useState(0);
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'SOFRESH AGRICOLE',
    defaultCurrency: 'EUR',
    companyAddress: '123 Rue Principale, Ville, Pays',
    enableNotifications: true,
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  const [receiptSettings, setReceiptSettings] = useState({
    receiptHeader: 'Reçu Officiel',
    receiptFooter: 'Merci pour votre confiance',
    showLogo: true,
    showSignature: true,
    autoGenerateNumber: true,
  });

  // Mock data for permissions management
  const [permissions, setPermissions] = useState([
    { id: 1, role: 'admin', name: 'Administrateur', canCreateUsers: true, canDeleteUsers: true, canModifySettings: true, canViewReports: true, canManageCash: true },
    { id: 2, role: 'manager', name: 'Gestionnaire', canCreateUsers: false, canDeleteUsers: false, canModifySettings: false, canViewReports: true, canManageCash: true },
    { id: 3, role: 'cashier', name: 'Caissier', canCreateUsers: false, canDeleteUsers: false, canModifySettings: false, canViewReports: false, canManageCash: true },
  ]);

  // Mock data for user profiles
  const [profiles, setProfiles] = useState([
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', active: true },
    { id: 2, name: 'Manager One', email: 'manager@example.com', role: 'manager', active: true },
    { id: 3, name: 'Cashier One', email: 'cashier@example.com', role: 'cashier', active: true },
  ]);

  // Initialize sources from Redux or use default values if empty
  const [cashInSources, setCashInSources] = useState<{ id: number, name: string, active: boolean }[]>([
    { id: 1, name: 'Client Payment', active: true },
    { id: 2, name: 'Investment', active: true },
    { id: 3, name: 'Loan', active: true },
  ]);
  
  const [cashOutSources, setCashOutSources] = useState<{ id: number, name: string, active: boolean }[]>([
    { id: 1, name: 'Supplier Payment', active: true },
    { id: 2, name: 'Salary', active: true },
    { id: 3, name: 'Utilities', active: true },
    { id: 4, name: 'Rent', active: true },
  ]);
  
  const [newSourceName, setNewSourceName] = useState('');
  const [editingSource, setEditingSource] = useState<{id: number, name: string, type: string} | null>(null);

  // Sync local state with Redux on component mount
  useEffect(() => {
    if (sources.length > 0) {
      // If we have sources in Redux, use them
      const inSources = sources
        .filter(source => source.type === 'in')
        .map(source => ({
          id: parseInt(source.id) || parseInt(Math.random().toString().substring(2, 10)),
          name: source.name,
          active: true
        }));
      
      const outSources = sources
        .filter(source => source.type === 'out')
        .map(source => ({
          id: parseInt(source.id) || parseInt(Math.random().toString().substring(2, 10)),
          name: source.name,
          active: true
        }));
      
      if (inSources.length > 0) setCashInSources(inSources);
      if (outSources.length > 0) setCashOutSources(outSources);
    } else {
      // If Redux store is empty, initialize it with our local state
      updateReduxSources();
    }
  }, []);

  // Update Redux store with combined sources
  const updateReduxSources = () => {
    const combinedSources: Source[] = [
      ...cashInSources.filter(source => source.active).map(source => ({
        id: source.id.toString(),
        name: source.name,
        type: 'in' as SourceType,
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
      ...cashOutSources.filter(source => source.active).map(source => ({
        id: source.id.toString(),
        name: source.name,
        type: 'out' as SourceType,
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    ];
    
    dispatch(setSources(combinedSources));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTextFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: event.target.value,
    });
  };

  const handleGeneralSettingsSwitchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralSettings({
      ...generalSettings,
      [field]: event.target.checked,
    });
  };

  const handleReceiptTextFieldChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReceiptSettings({
      ...receiptSettings,
      [field]: event.target.value,
    });
  };

  const handleReceiptSettingsSwitchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptSettings({
      ...receiptSettings,
      [field]: event.target.checked,
    });
  };

  const handlePermissionChange = (roleId: number, field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermissions(permissions.map(role => 
      role.id === roleId ? { ...role, [field]: event.target.checked } : role
    ));
  };

  const handleSaveSettings = () => {
    console.log('Saving all settings:', {
      generalSettings,
      receiptSettings,
      permissions,
      profiles
    });
    // Update the sources in Redux
    updateReduxSources();
    // Here you would typically save to an API
    alert(t('settingsSaved'));
  };

  const handleAddSource = (type: 'in' | 'out') => {
    if (!newSourceName.trim()) return;
    
    const newId = type === 'in' 
      ? Math.max(0, ...cashInSources.map(s => s.id)) + 1
      : Math.max(0, ...cashOutSources.map(s => s.id)) + 1;
      
    const newSource = { id: newId, name: newSourceName, active: true };
    
    if (type === 'in') {
      setCashInSources([...cashInSources, newSource]);
    } else {
      setCashOutSources([...cashOutSources, newSource]);
    }
    
    setNewSourceName('');
    updateReduxSources();
  };
  
  const handleEditSource = (id: number, type: 'in' | 'out', newName: string) => {
    if (type === 'in') {
      setCashInSources(
        cashInSources.map(source => 
          source.id === id ? { ...source, name: newName } : source
        )
      );
    } else {
      setCashOutSources(
        cashOutSources.map(source => 
          source.id === id ? { ...source, name: newName } : source
        )
      );
    }
    setEditingSource(null);
    updateReduxSources();
  };
  
  const handleDeleteSource = (id: number, type: 'in' | 'out') => {
    if (type === 'in') {
      setCashInSources(cashInSources.filter(source => source.id !== id));
    } else {
      setCashOutSources(cashOutSources.filter(source => source.id !== id));
    }
    updateReduxSources();
  };
  
  const handleToggleSourceActive = (id: number, type: 'in' | 'out') => {
    if (type === 'in') {
      setCashInSources(
        cashInSources.map(source => 
          source.id === id ? { ...source, active: !source.active } : source
        )
      );
    } else {
      setCashOutSources(
        cashOutSources.map(source => 
          source.id === id ? { ...source, active: !source.active } : source
        )
      );
    }
    updateReduxSources();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#319269' }}>
            {t('parameters')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            sx={{
              bgcolor: '#319269',
              '&:hover': { bgcolor: '#006440' },
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 2,
            }}
          >
            {t('saveAllSettings')}
          </Button>
        </Box>

        <Paper sx={{ width: '100%', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
              '& .Mui-selected': { color: '#319269' },
              '& .MuiTabs-indicator': { backgroundColor: '#319269' }
            }}
          >
            <Tab icon={<BusinessIcon />} label={t('generalSettings')} iconPosition="start" />
            <Tab icon={<ReceiptIcon />} label={t('receiptSettings')} iconPosition="start" />
            <Tab icon={<SecurityIcon />} label={t('permissionsManagement')} iconPosition="start" />
            <Tab icon={<PersonIcon />} label={t('profilesManagement')} iconPosition="start" />
            <Tab icon={<CategoryIcon />} label={t('sourcesManagement')} iconPosition="start" />
          </Tabs>

          {/* General Settings Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('companyName')}
                  value={generalSettings.companyName}
                  onChange={handleTextFieldChange('companyName')}
                  variant="outlined"
                  margin="normal"
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>{t('defaultCurrency')}</InputLabel>
                  <Select
                    value={generalSettings.defaultCurrency}
                    onChange={handleSelectChange('defaultCurrency')}
                    label={t('defaultCurrency')}
                  >
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="MAD">XOF (MAD)</MenuItem>
                    <MenuItem value="XOF">XOF (CFA)</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label={t('companyAddress')}
                  value={generalSettings.companyAddress}
                  onChange={handleTextFieldChange('companyAddress')}
                  variant="outlined"
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>{t('language')}</InputLabel>
                  <Select
                    value={generalSettings.language}
                    onChange={handleSelectChange('language')}
                    label={t('language')}
                  >
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>{t('dateFormat')}</InputLabel>
                  <Select
                    value={generalSettings.dateFormat}
                    onChange={handleSelectChange('dateFormat')}
                    label={t('dateFormat')}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>{t('timeFormat')}</InputLabel>
                  <Select
                    value={generalSettings.timeFormat}
                    onChange={handleSelectChange('timeFormat')}
                    label={t('timeFormat')}
                  >
                    <MenuItem value="24h">24h</MenuItem>
                    <MenuItem value="12h">12h</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={generalSettings.enableNotifications}
                      onChange={handleGeneralSettingsSwitchChange('enableNotifications')}
                      color="primary"
                    />
                  }
                  label={t('enableNotifications')}
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Receipt Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3} sx={{ p: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('receiptHeader')}
                  value={receiptSettings.receiptHeader}
                  onChange={handleReceiptTextFieldChange('receiptHeader')}
                  variant="outlined"
                  multiline
                  rows={3}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label={t('receiptFooter')}
                  value={receiptSettings.receiptFooter}
                  onChange={handleReceiptTextFieldChange('receiptFooter')}
                  variant="outlined"
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={receiptSettings.showLogo}
                      onChange={handleReceiptSettingsSwitchChange('showLogo')}
                      color="primary"
                    />
                  }
                  label={t('showLogo')}
                  sx={{ mt: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={receiptSettings.showSignature}
                      onChange={handleReceiptSettingsSwitchChange('showSignature')}
                      color="primary"
                    />
                  }
                  label={t('showSignature')}
                  sx={{ mt: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={receiptSettings.autoGenerateNumber}
                      onChange={handleReceiptSettingsSwitchChange('autoGenerateNumber')}
                      color="primary"
                    />
                  }
                  label={t('autoGenerateNumber')}
                  sx={{ mt: 2, display: 'block' }}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Permissions Management Tab */}
          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>{t('role')}</TableCell>
                    <TableCell align="center">{t('canCreateUsers')}</TableCell>
                    <TableCell align="center">{t('canDeleteUsers')}</TableCell>
                    <TableCell align="center">{t('canModifySettings')}</TableCell>
                    <TableCell align="center">{t('canViewReports')}</TableCell>
                    <TableCell align="center">{t('canManageCash')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissions.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell component="th" scope="row">
                        <Typography variant="subtitle1" fontWeight="500">
                          {role.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {role.role}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={role.canCreateUsers}
                          onChange={handlePermissionChange(role.id, 'canCreateUsers')}
                          disabled={role.role === 'admin'} // Admin always has all permissions
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={role.canDeleteUsers}
                          onChange={handlePermissionChange(role.id, 'canDeleteUsers')}
                          disabled={role.role === 'admin'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={role.canModifySettings}
                          onChange={handlePermissionChange(role.id, 'canModifySettings')}
                          disabled={role.role === 'admin'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={role.canViewReports}
                          onChange={handlePermissionChange(role.id, 'canViewReports')}
                          disabled={role.role === 'admin'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={role.canManageCash}
                          onChange={handlePermissionChange(role.id, 'canManageCash')}
                          disabled={role.role === 'admin'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('permissionsNote')}
              </Typography>
            </Box>
          </TabPanel>

          {/* Profiles Management Tab */}
          <TabPanel value={tabValue} index={3}>
            <List>
              {profiles.map((profile) => (
                <ListItem
                  key={profile.id}
                  secondaryAction={
                    <Box>
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                  sx={{ 
                    borderBottom: '1px solid #f0f0f0',
                    py: 1.5
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: profile.role === 'admin' ? '#d32f2f' : profile.role === 'manager' ? '#1976d2' : '#388e3c' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="500">
                        {profile.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {profile.email}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                          {t(profile.role)} • {profile.active ? t('active') : t('inactive')}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<PersonIcon />}
                sx={{
                  bgcolor: '#319269',
                  '&:hover': { bgcolor: '#006440' },
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                }}
              >
                {t('addNewUser')}
              </Button>
            </Box>
          </TabPanel>

          {/* Sources Management Tab */}
          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={3} sx={{ p: 2 }}>
              {/* Cash In Sources */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#388e3c', display: 'flex', alignItems: 'center', borderBottom: '2px solid #388e3c', pb: 1 }}>
                    <TrendingUp sx={{ mr: 1 }} />
                    {t('cashInSources')}
                  </Typography>
                  
                  <List sx={{ maxHeight: '300px', overflow: 'auto', py: 0 }}>
                    {cashInSources.map((source) => (
                      <ListItem
                        key={source.id}
                        sx={{ 
                          borderBottom: '1px solid #f0f0f0',
                          opacity: source.active ? 1 : 0.5,
                          py: 1,
                          px: 0
                        }}
                      >
                        <ListItemText 
                          primary={source.name}
                          sx={{ flex: '1 1 auto' }}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={source.active}
                              onChange={() => handleToggleSourceActive(source.id, 'in')}
                              size="small"
                              color="success"
                            />
                          }
                          label={source.active ? t('active') : t('inactive')}
                          sx={{ mx: 1, minWidth: '80px' }}
                        />
                        <IconButton 
                          onClick={() => setEditingSource({id: source.id, name: source.name, type: 'in'})}
                          size="small"
                          color="default"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteSource(source.id, 'in')}
                          size="small"
                          color="default"
                          sx={{ color: '#888' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  
                  {editingSource && editingSource.type === 'in' ? (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={editingSource.name}
                        onChange={(e) => setEditingSource({...editingSource, name: e.target.value})}
                        placeholder={t('sourceName')}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="contained"
                          onClick={() => handleEditSource(editingSource.id, 'in', editingSource.name)}
                          sx={{ bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
                        >
                          {t('save')}
                        </Button>
                        <Button 
                          variant="outlined"
                          onClick={() => setEditingSource(null)}
                          sx={{ ml: 1 }}
                        >
                          {t('cancel')}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        placeholder={t('newSourceName')}
                        variant="outlined"
                      />
                      <Button 
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddSource('in')}
                        sx={{ 
                          ml: 1, 
                          bgcolor: '#388e3c', 
                          '&:hover': { bgcolor: '#2e7d32' },
                          color: 'white',
                          whiteSpace: 'nowrap',
                          minWidth: 'auto',
                          px: 2
                        }}
                      >
                        {t('add')}
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              {/* Cash Out Sources */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#d32f2f', display: 'flex', alignItems: 'center', borderBottom: '2px solid #d32f2f', pb: 1 }}>
                    <TrendingDown sx={{ mr: 1 }} />
                    {t('cashOutSources')}
                  </Typography>
                  
                  <List sx={{ maxHeight: '300px', overflow: 'auto', py: 0 }}>
                    {cashOutSources.map((source) => (
                      <ListItem
                        key={source.id}
                        sx={{ 
                          borderBottom: '1px solid #f0f0f0',
                          opacity: source.active ? 1 : 0.5,
                          py: 1,
                          px: 0
                        }}
                      >
                        <ListItemText 
                          primary={source.name}
                          sx={{ flex: '1 1 auto' }}
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={source.active}
                              onChange={() => handleToggleSourceActive(source.id, 'out')}
                              size="small"
                              color="error"
                            />
                          }
                          label={source.active ? t('active') : t('inactive')}
                          sx={{ mx: 1, minWidth: '80px' }}
                        />
                        <IconButton 
                          onClick={() => setEditingSource({id: source.id, name: source.name, type: 'out'})}
                          size="small"
                          color="default"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteSource(source.id, 'out')}
                          size="small"
                          color="default"
                          sx={{ color: '#888' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  
                  {editingSource && editingSource.type === 'out' ? (
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={editingSource.name}
                        onChange={(e) => setEditingSource({...editingSource, name: e.target.value})}
                        placeholder={t('sourceName')}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="contained"
                          onClick={() => handleEditSource(editingSource.id, 'out', editingSource.name)}
                          sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' } }}
                        >
                          {t('save')}
                        </Button>
                        <Button 
                          variant="outlined"
                          onClick={() => setEditingSource(null)}
                          sx={{ ml: 1 }}
                        >
                          {t('cancel')}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        size="small"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        placeholder={t('newSourceName')}
                        variant="outlined"
                      />
                      <Button 
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddSource('out')}
                        sx={{ 
                          ml: 1, 
                          bgcolor: '#d32f2f', 
                          '&:hover': { bgcolor: '#c62828' },
                          color: 'white',
                          whiteSpace: 'nowrap',
                          minWidth: 'auto',
                          px: 2
                        }}
                      >
                        {t('add')}
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
};

export default Parameters; 