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
} from '@mui/material';

const ParametersManagement: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    companyName: '',
    defaultCurrency: 'EUR',
    companyAddress: '',
    receiptHeader: '',
    receiptFooter: '',
    enableNotifications: true,
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [field]: event.target.value,
    });
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
    setSettings({
      ...settings,
      [field]: event.target.value,
    });
  };

  const handleSwitchChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [field]: event.target.checked,
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', settings);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#319269' }}>
        {t('parameters')}
      </Typography>

      <Grid container spacing={3}>
        {/* Paramètres Généraux */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#319269' }}>
              {t('generalSettings')}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('companyName')}
                  value={settings.companyName}
                  onChange={handleTextChange('companyName')}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('defaultCurrency')}</InputLabel>
                  <Select
                    value={settings.defaultCurrency}
                    onChange={handleSelectChange('defaultCurrency')}
                    label={t('defaultCurrency')}
                  >
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="XOF">XOF (CFA)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('companyAddress')}
                  value={settings.companyAddress}
                  onChange={handleTextChange('companyAddress')}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Paramètres des Reçus */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#319269' }}>
              {t('receiptSettings')}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('receiptHeader')}
                  value={settings.receiptHeader}
                  onChange={handleTextChange('receiptHeader')}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('receiptFooter')}
                  value={settings.receiptFooter}
                  onChange={handleTextChange('receiptFooter')}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Préférences Système */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#319269' }}>
              {t('systemPreferences')}
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('language')}</InputLabel>
                  <Select
                    value={settings.language}
                    onChange={handleSelectChange('language')}
                    label={t('language')}
                  >
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('dateFormat')}</InputLabel>
                  <Select
                    value={settings.dateFormat}
                    onChange={handleSelectChange('dateFormat')}
                    label={t('dateFormat')}
                  >
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('timeFormat')}</InputLabel>
                  <Select
                    value={settings.timeFormat}
                    onChange={handleSelectChange('timeFormat')}
                    label={t('timeFormat')}
                  >
                    <MenuItem value="24h">24h</MenuItem>
                    <MenuItem value="12h">12h</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableNotifications}
                      onChange={handleSwitchChange('enableNotifications')}
                      color="primary"
                    />
                  }
                  label={t('enableNotifications')}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Bouton de Sauvegarde */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: '#319269',
                '&:hover': { bgcolor: '#006440' },
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {t('save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParametersManagement; 