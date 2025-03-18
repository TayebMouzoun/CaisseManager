import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '@mui/icons-material';

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
    // Here you would typically save to an API
    alert(t('settingsSaved'));
  };

  return (
    <Box sx={{ p: 3 }}>
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
      </Paper>
    </Box>
  );
};

export default Parameters; 