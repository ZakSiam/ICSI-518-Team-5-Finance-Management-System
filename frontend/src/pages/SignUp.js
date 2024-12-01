import * as React from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import getSignUpTheme from '../shared-theme/getSignUpTheme'; 
import TemplateFrame from '../components/TemplateFrame'; 
import { Link as RouterLink } from 'react-router-dom';
import g3 from '../gif/g3.gif';

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  position: 'relative',
  background: 'linear-gradient(to bottom, #2196F3, #E3F2FD)',
  overflow: 'hidden',
}));

const SignUpContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '50%',
  position: 'relative',
  zIndex: 1,
}));

const HalfCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  width: '120%',
  height: '100%',
  backgroundColor: 'white',
  borderRadius: '50%',
  clipPath: 'inset(0 50% 0 0)',
  border: '1.5px solid grey',
  zIndex: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}));

export default function SignUp() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(''); // State for the Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success'); // State for severity (success or error)

  const SignUpTheme = createTheme(getSignUpTheme('light'));

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordPattern.test(password)) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must contain 1 uppercase letter, 1 number, 1 symbol, and be at least 8 characters.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/register/', {
        username: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
      });

      setSnackbarMessage('User registered successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      const errorMsg = error.response ? error.response.data['username'] [0]: error.message;
      setSnackbarMessage(`Error during registration: ${errorMsg}`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <TemplateFrame>
      <ThemeProvider theme={SignUpTheme}>
        <CssBaseline enableColorScheme />
        <MainContainer>
          <SignUpContainer>
            <Card
              variant="outlined"
              sx={{
                padding: 3,
                margin: 'auto',
                width: '90%',
                maxWidth: '400px',
                boxShadow: 4,
                border: '1px solid grey',
                borderRadius: 2,
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                Sign up
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 3 }}
              >
                <FormControl>
                  <FormLabel htmlFor="name">Username</FormLabel>
                  <TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={nameError}
                    helperText={nameErrorMessage}
                    color={nameError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    helperText={emailErrorMessage}
                    color={emailError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    color={passwordError ? 'error' : 'primary'}
                  />
                </FormControl>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive updates via email."
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Sign up
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                  Already have an account?{' '}
                  <span>
                    <Link
                      to="/"
                      component={RouterLink}
                      variant="body2"
                      sx={{ alignSelf: 'center' }}
                    >
                      Sign in
                    </Link>
                  </span>
                </Typography>
              </Box>
            </Card>
          </SignUpContainer>
          <HalfCircle>
            <img 
              src={g3} 
              alt="Decorative GIF" 
              style={{ width: '39%', marginRight: '50%', marginBottom: '5%' }} 
            />
          </HalfCircle>
        </MainContainer>

        {/* Snackbar for dynamic messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </TemplateFrame>
  );
}
