import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AttachMoney as CashIcon,
  LocationOn as LocationIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Category as SourcesIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { path: '/dashboard', icon: <DashboardIcon />, label: t('dashboard') },
    { path: '/caisse', icon: <AccountBalanceIcon />, label: t('cash') },
    { path: '/operations', icon: <ReceiptIcon />, label: t('operations') },
    { path: '/rapports', icon: <AssessmentIcon />, label: t('reports') },
    { path: '/utilisateurs', icon: <UsersIcon />, label: t('users') },
    { path: '/locaux', icon: <LocationIcon />, label: t('locations') },
    { path: '/profile', icon: <PersonIcon />, label: t('profile') },
  ];

  const adminMenuItems = user?.role === 'admin' ? [
    { path: '/admin/locations', icon: <LocationIcon />, label: t('locations') },
    { path: '/admin/users', icon: <UsersIcon />, label: t('users') },
    { path: '/admin/sources', icon: <SourcesIcon />, label: t('sources') },
    { path: '/parameters', icon: <SettingsIcon />, label: t('parameters') },
  ] : [];

  return (
    <Box sx={{ width: 240, bgcolor: 'background.paper', height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ color: '#319269' }}>
          {t('appName')}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(49, 146, 105, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(49, 146, 105, 0.12)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#319269' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {adminMenuItems.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
            {t('administration')}
          </Typography>
          <List>
            {adminMenuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'rgba(49, 146, 105, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(49, 146, 105, 0.12)',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? '#319269' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default Sidebar; 