import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" sx={{ mb: 2, color: '#319269', fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t('pageNotFound')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          {t('pageNotFoundMessage')}
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: '#319269', '&:hover': { bgcolor: '#006440' } }}
          onClick={() => navigate('/')}
        >
          {t('backToDashboard')}
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound; 