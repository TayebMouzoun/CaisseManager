import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LocationsManagement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1">
        {t('locationsManagement')}
      </Typography>
      {/* Add locations management functionality here */}
    </Box>
  );
};

export default LocationsManagement; 