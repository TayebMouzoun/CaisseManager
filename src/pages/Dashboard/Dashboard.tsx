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
        return <Avatar sx={{ bgcolor: '#388e3c' }}><TrendingUp /></Avatar>;
      case 'out':
        return <Avatar sx={{ bgcolor: '#d32f2f' }}><TrendingDown /></Avatar>;
      case 'return':
        return <Avatar sx={{ bgcolor: '#ffa000' }}><KeyboardReturn /></Avatar>;
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
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#319269' }}>
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
              '&:hover': { borderColor: '#006440' },
              textTransform: 'none',
            }}
          >
            {t('parameters')}
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {t('totalCash')}
            </Typography>
            <Typography variant="h3" component="div" sx={{ mt: 'auto', color: '#319269', fontWeight: 'bold' }}>
              {formatCurrency(totalCash)}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {t('totalLocations')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <LocationOn sx={{ color: '#319269', fontSize: 40, mr: 1 }} />
              <Typography variant="h3" component="div" sx={{ color: '#319269', fontWeight: 'bold' }}>
                {locations.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {t('totalUsers')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
              <Group sx={{ color: '#319269', fontSize: 40, mr: 1 }} />
              <Typography variant="h3" component="div" sx={{ color: '#319269', fontWeight: 'bold' }}>
                {users.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('quickActions')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
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
                    }}
                  >
                    {t('cashReturn')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Operations */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{t('recentOperations')}</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/rapports')}
                sx={{
                  color: '#319269',
                  borderColor: '#319269',
                  '&:hover': {
                    borderColor: '#006440',
                  },
                  textTransform: 'none',
                }}
              >
                {t('viewAll')}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
              {recentOperations.length > 0 ? recentOperations.map((operation) => {
                const location = locations.find(loc => loc.id === operation.locationId);
                return (
                  <ListItem
                    key={operation.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => navigate(`/operations/${operation.id}`)}>
                        <Visibility />
                      </IconButton>
                    }
                    sx={{
                      borderBottom: '1px solid #f0f0f0',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <ListItemAvatar>
                      {getOperationTypeIcon(operation.type)}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {operation.type === 'in' ? t('cashIn') : operation.type === 'out' ? t('cashOut') : t('cashReturn')}
                          <Typography
                            component="span"
                            variant="body1"
                            sx={{
                              ml: 1,
                              color: getOperationTypeColor(operation.type),
                              fontWeight: 'bold',
                            }}
                          >
                            {formatCurrency(operation.amount)}
                          </Typography>
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary">
                            {operation.source} - {location?.name || ''} 
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(operation.date).toLocaleDateString('fr-FR')}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                );
              }) : (
                <ListItem>
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
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom>
              {t('locations')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {userLocations.map((location) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={location.id}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="div">
                          {location.name}
                        </Typography>
                        <Avatar sx={{ bgcolor: '#319269', width: 32, height: 32 }}>
                          <LocationOn sx={{ fontSize: 20 }} />
                        </Avatar>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {location.address || t('noData')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {t('currentBalance')}:
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#319269', fontWeight: 'bold' }}>
                        {formatCurrency(getLocationBalance(location.id))}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => navigate(`/operations/${location.id}`)}
                        sx={{ color: '#319269' }}
                      >
                        {t('operations')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              
              {userLocations.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {t('noData')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 