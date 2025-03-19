import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import {
  AddCircleOutline,
  RemoveCircleOutline,
  KeyboardReturn,
  Visibility,
  TrendingUp,
  TrendingDown,
  AccountBalance,
  LocationOn,
  Group,
  Settings as SettingsIcon,
  AttachMoney,
  MonetizationOn,
} from '@mui/icons-material';
import { RootState } from '../../services/store';
import { formatCurrency } from '../../utils/formatters';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { operations, balances } = useSelector((state: RootState) => state.cash);
  const { locations } = useSelector((state: RootState) => state.locations);
  const { users } = useSelector((state: RootState) => state.users);
  
  // Calculate total cash across all locations
  const totalCash = balances.reduce((sum, balance) => sum + balance.balance, 0);
  
  // Get today's operations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOperations = operations.filter(op => new Date(op.date) >= today);
  
  // Calculate monthly revenue
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyOperations = operations.filter(op => new Date(op.date) >= startOfMonth);
  const monthlyRevenue = monthlyOperations
    .filter(op => op.type === 'in')
    .reduce((sum, op) => sum + op.amount, 0);
  
  // Get recent operations (last 5)
  const recentOperations = [...operations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Only show locations the user has access to
  const userLocations = user?.role === 'admin' 
    ? locations 
    : locations.filter(loc => loc.id === user?.locationId);
  
  const getOperationTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <Avatar sx={{ bgcolor: 'rgba(56, 142, 60, 0.9)' }}><TrendingUp /></Avatar>;
      case 'out':
        return <Avatar sx={{ bgcolor: 'rgba(211, 47, 47, 0.9)' }}><TrendingDown /></Avatar>;
      case 'return':
        return <Avatar sx={{ bgcolor: 'rgba(255, 160, 0, 0.9)' }}><KeyboardReturn /></Avatar>;
      default:
        return <Avatar><AccountBalance /></Avatar>;
    }
  };
  
  const getOperationTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return '#388e3c';
      case 'out':
        return '#d32f2f';
      case 'return':
        return '#ffa000';
      default:
        return '#757575';
    }
  };
  
  const getLocationBalance = (locationId: string) => {
    const balance = balances.find(b => b.locationId === locationId);
    return balance ? balance.balance : 0;
  };
  
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        borderBottom: '2px solid rgba(49, 146, 105, 0.2)',
        pb: 2
      }}>
        <Typography variant="h4" sx={{ color: '#319269', fontWeight: 'bold' }}>
          {t('dashboard')}
        </Typography>
        {user?.role === 'admin' && (
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/parameters')}
            sx={{
              color: '#319269',
              borderColor: '#319269',
              '&:hover': { 
                borderColor: '#006440',
                bgcolor: 'rgba(49, 146, 105, 0.05)'
              },
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            {t('parameters')}
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 3,
              boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(49, 146, 105, 0.05) 0%, rgba(49, 146, 105, 0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('totalCash')}
                </Typography>
                <AttachMoney sx={{ color: '#319269', fontSize: 24 }} />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    color: '#319269', 
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    lineHeight: 1.2
                  }}
                >
                  {formatCurrency(totalCash).replace('$', 'MAD ')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 3,
              boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(255, 160, 0, 0.05) 0%, rgba(255, 160, 0, 0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('todayOperations')}
                </Typography>
                <MonetizationOn sx={{ color: '#ffa000', fontSize: 24 }} />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    color: '#ffa000', 
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    lineHeight: 1.2
                  }}
                >
                  {todayOperations.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 3,
              boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(56, 142, 60, 0.05) 0%, rgba(56, 142, 60, 0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('monthlyRevenue')}
                </Typography>
                <TrendingUp sx={{ color: '#388e3c', fontSize: 24 }} />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    color: '#388e3c', 
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    lineHeight: 1.2
                  }}
                >
                  {formatCurrency(monthlyRevenue).replace('$', 'MAD ')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 3,
              boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)',
                zIndex: 0,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('activeUsers')}
                </Typography>
                <Group sx={{ color: '#1976d2', fontSize: 24 }} />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    color: '#1976d2', 
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    lineHeight: 1.2
                  }}
                >
                  {users.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={2}
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 6px 15px rgba(0,0,0,0.08)', 
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, rgba(49, 146, 105, 0.05) 0%, rgba(49, 146, 105, 0.15) 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#319269' }}>
                  {t('quickActions')}
                </Typography>
              </Box>
              
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutline />}
                      fullWidth
                      onClick={() => navigate('/caisse')}
                      sx={{
                        bgcolor: '#388e3c',
                        '&:hover': { bgcolor: '#2e7d32' },
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(56, 142, 60, 0.3)',
                        fontWeight: 600,
                      }}
                    >
                      {t('cashIn')}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<RemoveCircleOutline />}
                      fullWidth
                      onClick={() => navigate('/caisse')}
                      sx={{
                        bgcolor: '#d32f2f',
                        '&:hover': { bgcolor: '#c62828' },
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(211, 47, 47, 0.3)',
                        fontWeight: 600,
                      }}
                    >
                      {t('cashOut')}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<KeyboardReturn />}
                      fullWidth
                      onClick={() => navigate('/caisse')}
                      sx={{
                        bgcolor: '#ffa000',
                        '&:hover': { bgcolor: '#ff8f00' },
                        textTransform: 'none',
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(255, 160, 0, 0.3)',
                        fontWeight: 600,
                      }}
                    >
                      {t('cashReturn')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Operations */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={2}
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(49, 146, 105, 0.05) 0%, rgba(49, 146, 105, 0.15) 100%)',
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#319269' }}>
                {t('recentOperations')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/operations')}
                sx={{
                  color: '#319269',
                  borderColor: '#319269',
                  '&:hover': {
                    borderColor: '#006440',
                    bgcolor: 'rgba(49, 146, 105, 0.1)',
                  },
                  textTransform: 'none',
                  borderRadius: 2,
                  fontWeight: 500,
                }}
              >
                {t('viewAll')}
              </Button>
            </Box>
            
            <List sx={{ bgcolor: 'background.paper', overflow: 'auto', maxHeight: 350, py: 0 }}>
              {recentOperations.length > 0 ? recentOperations.map((operation) => {
                const location = locations.find(loc => loc.id === operation.locationId);
                return (
                  <ListItem
                    key={operation.id}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        onClick={() => navigate(`/operations/${operation.id}`)}
                        sx={{ 
                          color: '#319269',
                          '&:hover': { bgcolor: 'rgba(49, 146, 105, 0.1)' },
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    }
                    sx={{
                      borderBottom: '1px solid rgba(0,0,0,0.05)',
                      '&:last-child': { borderBottom: 'none' },
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                      py: 1.5,
                    }}
                  >
                    <ListItemAvatar>
                      {getOperationTypeIcon(operation.type)}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={operation.type === 'in' ? t('cashIn') : operation.type === 'out' ? t('cashOut') : t('cashReturn')} 
                            size="small"
                            sx={{ 
                              bgcolor: operation.type === 'in' 
                                ? 'rgba(56, 142, 60, 0.1)' 
                                : operation.type === 'out' 
                                ? 'rgba(211, 47, 47, 0.1)'
                                : 'rgba(255, 160, 0, 0.1)',
                              color: getOperationTypeColor(operation.type),
                              fontWeight: 'bold',
                              mr: 1.5,
                            }}
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              color: getOperationTypeColor(operation.type),
                              fontWeight: 'bold',
                            }}
                          >
                            {formatCurrency(operation.amount).replace('$', '')} MAD
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                              {operation.source}
                            </Typography>
                            {location && (
                              <Chip 
                                label={location.name} 
                                size="small"
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.75rem',
                                  bgcolor: 'rgba(49, 146, 105, 0.1)',
                                  color: '#319269',
                                }}
                              />
                            )}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(operation.date).toLocaleDateString('fr-FR')}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                );
              }) : (
                <ListItem sx={{ py: 4 }}>
                  <ListItemText
                    primary={t('noData')}
                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Locations List */}
        <Grid item xs={12}>
          <Paper 
            elevation={2}
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ 
              p: 2, 
              background: 'linear-gradient(135deg, rgba(49, 146, 105, 0.05) 0%, rgba(49, 146, 105, 0.15) 100%)',
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#319269' }}>
                {t('locations')}
              </Typography>
            </Box>
            
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                {userLocations.map((location) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={location.id}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': { 
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {location.name}
                          </Typography>
                          <Avatar sx={{ bgcolor: 'rgba(49, 146, 105, 0.85)', width: 36, height: 36 }}>
                            <LocationOn sx={{ fontSize: 20 }} />
                          </Avatar>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                          {location.address || t('noData')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#555' }}>
                          {t('currentBalance')}:
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#319269', fontWeight: 'bold' }}>
                          {formatCurrency(getLocationBalance(location.id)).replace('$', '')} MAD
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ borderTop: '1px solid rgba(0,0,0,0.05)', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          onClick={() => navigate(`/operations?location=${location.id}`)}
                          sx={{ 
                            color: '#319269',
                            fontWeight: 500,
                            '&:hover': { bgcolor: 'rgba(49, 146, 105, 0.1)' },
                          }}
                        >
                          {t('operations')}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                
                {userLocations.length === 0 && (
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        py: 4, 
                        borderRadius: 2,
                        bgcolor: 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <LocationOn sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        {t('noData')}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 