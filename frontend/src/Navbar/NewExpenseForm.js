import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useTheme, styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { FaPencilAlt, FaDollarSign, FaTag, FaCalendarAlt } from 'react-icons/fa';
import MuiCard from '@mui/material/Card';

const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Utilities',
  'Housing',
  'Healthcare',
  'Entertainment',
  'Personal',
  'Education',
  'Other'
];

// Custom styled Card component
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '400px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  border: '1px solid grey',
  borderRadius: theme.shape.borderRadius,
  justifyContent:'center'
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function NewExpenseForm({ router, addExpense, editExpense, initialData }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: null,
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description,
        amount: initialData.amount,
        category: initialData.category,
        date: new Date(initialData.date),
      });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData(prevData => ({
      ...prevData,
      date: newDate
    }));
  };

  const validateForm = () => {
    if (!formData.description) {
      return 'Description is required.';
    }
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      return 'Amount must be a positive number.';
    }
    if (!formData.category) {
      return 'Category is required.';
    }
    if (!formData.date) {
      return 'Date is required.';
    }
    return null;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setOpenSnackbar(true);
      return;
    }

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: initialData ? initialData.id : Date.now(),
    };

    if (initialData) {
      editExpense(expenseData);
      setSnackbarMessage('Expense updated successfully!');
    } else {
      addExpense(expenseData);
      setSnackbarMessage('Expense added successfully!');
    }

    setOpenSnackbar(true);
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: null,
    });
    setTimeout(() => {
      router.navigate('/Expenses');
    }, 1000);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setError('');
    setSnackbarMessage('');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ 
            width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center',           
            position: 'fixed',
            top: 0,
            left: 300,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',}}
        >

        </Typography>

        {/* Form Fields */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography 
          component="h2" 
          variant="h5" 
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </Typography>

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!error && error.includes('Description')}
            helperText={error && error.includes('Description') ? error : ''}
            InputProps={{
              startAdornment: (
                <IconButton position="start" sx={{ color: theme.palette.primary.main }}>
                  <FaPencilAlt />
                </IconButton>
              ),
            }}
          />

          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!error && error.includes('Amount')}
            helperText={error && error.includes('Amount') ? error : ''}
            InputProps={{
              startAdornment: (
                <IconButton position="start" sx={{ color: theme.palette.primary.main }}>
                  <FaDollarSign />
                </IconButton>
              ),
            }}
          />

          <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!error && error.includes('Category')}
            helperText={error && error.includes('Category') ? error : ''}
          >
            {expenseCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={!!error && error.includes('Date')}
                  helperText={error && error.includes('Date') ? error : ''}
                />
              )}
            />
          </LocalizationProvider>

          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update Expense' : 'Add Expense'}
          </Button>
        </Box>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
            {error ? error : snackbarMessage}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  );
}

export default NewExpenseForm;
