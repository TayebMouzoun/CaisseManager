import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UsersManagement: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('usersManagement')}
      </Typography>
      {/* TODO: Implement users management functionality */}
    </Box>
  );
};

export default UsersManagement; 