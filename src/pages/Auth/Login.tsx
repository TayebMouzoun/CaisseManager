import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { loginStart, loginSuccess, loginFailure } from '../../services/slices/authSlice';
import { RootState } from '../../services/store';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this would connect to an API
const mockLogin = (email: string, password: string) => {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, accept 'admin@example.com' / 'password' as credentials
      if (email === 'admin@example.com' && password === 'password') {
        resolve({
          id: uuidv4(),
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
        });
      } else if (email === 'manager@example.com' && password === 'password') {
        resolve({
          id: uuidv4(),
          name: 'Manager User',
          email: 'manager@example.com',
          role: 'manager',
          locationId: 'loc1',
        });
      } else if (email === 'cashier@example.com' && password === 'password') {
        resolve({
          id: uuidv4(),
          name: 'Cashier User',
          email: 'cashier@example.com',
          role: 'cashier',
          locationId: 'loc1',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError(t('required'));
      return false;
    } else if (!re.test(email)) {
      setEmailError(t('invalidFormat'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError(t('required'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    dispatch(loginStart());

    try {
      const user = await mockLogin(email, password);
      dispatch(loginSuccess(user));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(t('invalidCredentials')));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#319269' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {t('login')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: '#319269',
                '&:hover': {
                  bgcolor: '#006440',
                },
                borderRadius: 2,
                textTransform: 'none',
                py: 1.5,
              }}
              disabled={loading}
            >
              {loading ? t('loading') : t('login')}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('forgotPassword')}
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Demo Accounts:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin: admin@example.com / password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manager: manager@example.com / password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cashier: cashier@example.com / password
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 