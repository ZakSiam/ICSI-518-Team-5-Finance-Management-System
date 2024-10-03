import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import Alert from '@mui/material/Alert';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '400px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  border: '1px solid grey',
  borderRadius: theme.shape.borderRadius,
}));

export default function ChangePassword(props) {
  const [currentPasswordError, setCurrentPasswordError] = React.useState(false);
  const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] = React.useState('');
  const [newPasswordError, setNewPasswordError] = React.useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = React.useState('');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /* const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      currentPassword: data.get('currentPassword'),
      newPassword: data.get('newPassword'),
    });
    setSnackbarOpen(true);
    setSnackbarMessage('Password Successfully updated');
  }; */

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  const handleSubmit = async (event) => {

    event.preventDefault();  // Prevent default form submission
    //setMessage('');  // Clear any previous messages
    const data = new FormData(event.currentTarget);
    const token = localStorage.getItem('accessToken');
    console.log(localStorage);

    // console.log(data.get('newPassword'));
   /*  try {
      // Send email to backend, but it's just simulated
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/change-password/', {
        old_password: data.get('currentPassword'),
        new_password: data.get('newPassword'),
      });
      // Show the response message from the backend
      //alert(response.data.message);
    } */ 

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/accounts/change-password/',
        {
          old_password: data.get('currentPassword'),
          new_password: data.get('newPassword'),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      setSnackbarOpen(true);
      setSnackbarMessage('Password Successfully updated');
      console.log(response.data); // Handle response data as needed
    }
    
    catch (error) {
      console.log('Something went wrong. Please try again.');
      console.error('Error during password reset request:', error.response ? error.response.data : error.message);
    }
  }

  const validateInputs = () => {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    let isValid = true;

    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    /* if (!currentPassword || currentPassword.length < 8 || !passwordRegex.test(currentPassword)) {
      setCurrentPasswordError(true);
      setCurrentPasswordErrorMessage('Current password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      isValid = false;
    } else {
      setCurrentPasswordError(false);
      setCurrentPasswordErrorMessage('');
    } */

    if (!newPassword || newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage('New password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      isValid = false;
    } else if (newPassword === currentPassword) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage('New password must not be the same as current password.');
      isValid = false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 300,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Change Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
              <TextField
                error={currentPasswordError}
                helperText={currentPasswordErrorMessage}
                id="currentPassword"
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={currentPasswordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <TextField
                error={newPasswordError}
                helperText={newPasswordErrorMessage}
                id="newPassword"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                color={newPasswordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Change Password
            </Button>
          </Box>
        </Card>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppTheme>
  );
}
