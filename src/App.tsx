import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CashManagement from './pages/CashManagement/CashManagement';
import CashOperations from './pages/CashOperations/CashOperations';
import Reports from './pages/Reports/Reports';
import Users from './pages/Users/Users';
import Locations from './pages/Locations/Locations';
import Profile from './pages/Profile/Profile';
import NotFound from './pages/NotFound/NotFound';
import LocationsManagement from './pages/Admin/LocationsManagement';
import SourcesManagement from './pages/Admin/SourcesManagement';
import ParametersManagement from './pages/Admin/ParametersManagement';
import Parameters from './pages/Parameters/Parameters';

// Types
import { RootState } from './services/store';

const theme = createTheme({
  palette: {
    primary: {
      main: '#319269',
      light: '#5dc395',
      dark: '#006440',
      contrastText: '#fff',
    },
    secondary: {
      main: '#757575',
      light: '#a4a4a4',
      dark: '#494949',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  console.log('Auth State:', { 
    isAuthenticated, 
    userRole: user?.role,
    user: user,
    path: window.location.pathname
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/caisse" element={<CashManagement />} />
            <Route path="/operations" element={<CashOperations />} />
            <Route path="/operations/:id" element={<CashOperations />} />
            <Route path="/rapports" element={<Reports />} />
            <Route path="/utilisateurs" element={<Users />} />
            <Route path="/locaux" element={<Locations />} />
            <Route path="/profile" element={<Profile />} />
            {user?.role === 'admin' && (
              <>
                <Route path="/admin/locations" element={<LocationsManagement />} />
                <Route path="/admin/sources" element={<SourcesManagement />} />
                <Route path="/parameters" element={<Parameters />} />
              </>
            )}
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App; 