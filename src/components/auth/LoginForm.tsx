import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Box, 
  Paper, 
  Divider,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

// Create a custom theme with your purple color
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(147, 51, 234)',
      dark: 'rgb(126, 34, 206)',
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  margin: '0 auto',
  borderRadius: theme.shape.borderRadius * 2,
}));

const LoginForm = ({ onLoginSuccess, onForgotPassword, onSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onLoginSuccess();
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
        <StyledPaper elevation={3}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center" 
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            Welcome Back
          </Typography>
          
          <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
            Please enter your credentials to login
          </Typography>
          
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              label="Email Address"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              autoFocus
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link 
                component="button" 
                type="button" 
                variant="body2"
                onClick={onForgotPassword}
                underline="hover"
                color="primary"
              >
                Forgot password?
              </Link>
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 1, py: 1.5 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
            <Divider sx={{ my: 3, color: 'text.secondary' }}>OR</Divider>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" display="inline">
                Don't have an account?{' '}
              </Typography>
              <Link 
                component="button" 
                type="button" 
                variant="body2"
                onClick={onSignUp}
                underline="hover"
                fontWeight="medium"
                color="primary"
              >
                Sign Up
              </Link>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;