import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Users: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#319269' }}>
        {t('users')}
      </Typography>
      
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="body1">
          {t('addUser')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Users; 