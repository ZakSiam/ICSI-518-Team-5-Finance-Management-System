import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const recurringCategories = [
  { name: 'OTT', color: '#f50057', emoji: '📅' },
  { name: 'Personal Loan', color: '#f50057', emoji: '💸' },
  { name: 'Utilities', color: '#bdc0abaf', emoji: '🏠' },
  { name: 'Social Media ', color: '#f77dd3af', emoji: '💡' }
];

const frequencyOptions = ['Daily', 'Weekly', 'Monthly'];

function Recurring() {
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);

  const [newPayment, setNewPayment] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    frequency: '',
  });

  useEffect(() => {
    const fetchRecurringPayments = async () => {
      try {
        const token = localStorage.getItem('accessToken');;  // Retrieve token from localStorage

        const response = await fetch('http://127.0.0.1:8000/recurring_expense/', {
          headers: {
            'Authorization': `Bearer ${token}`,  // Include token in Authorization header
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setRecurringPayments(data);
      } catch (error) {
        console.error("Error fetching recurring payments:", error);
      }
    };

    fetchRecurringPayments();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const theme = useTheme();
  
  const addOrUpdateRecurringPayment = async () => {
    if (
      !newPayment.description.trim() ||
      !newPayment.amount ||
      isNaN(newPayment.amount) ||
      newPayment.amount <= 0 ||
      !newPayment.date ||
      !newPayment.frequency
    ) {
      setSnackbarMessage('Please fill out all fields with valid data.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');;  // Retrieve token from localStorage

      if (editMode) {
        const response = await fetch(`http://127.0.0.1:8000/recurring_expense/${currentPayment.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,  // Include token in Authorization header
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newPayment,
            amount: parseFloat(newPayment.amount),
            date: new Date(newPayment.date).toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update recurring payment');
        }

        setSnackbarMessage('Recurring payment successfully updated');
      } else {
        const response = await fetch('http://127.0.0.1:8000/recurring_expense/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,  // Include token in Authorization header
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newPayment,
            amount: parseFloat(newPayment.amount),
            date: new Date(newPayment.date).toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add recurring payment');
        }

        setSnackbarMessage('Recurring payment successfully added');
      }

      const payments = await fetch('http://127.0.0.1:8000/recurring_expense/', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Include token in Authorization header
          'Content-Type': 'application/json',
        },
      }).then(res => res.json());

      setRecurringPayments(payments);
    } catch (error) {
      console.error('Error adding/updating recurring payment:', error);
      setSnackbarMessage('Failed to save recurring payment.');
    }

    setSnackbarOpen(true);
    setFormOpen(false);
    setNewPayment({
      description: '',
      amount: '',
      category: '',
      date: '',
      frequency: '',
    });
    setEditMode(false);
    setCurrentPayment(null);
  };

  const deleteRecurringPaymentHandler = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');;  // Retrieve token from localStorage

      const response = await fetch(`http://127.0.0.1:8000/recurring_expense/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,  // Include token in Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete recurring payment');
      }

      setRecurringPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== id));
      setSnackbarMessage('Recurring payment successfully deleted');
    } catch (error) {
      console.error('Error deleting recurring payment:', error);
      setSnackbarMessage('Failed to delete recurring payment.');
    }
    setSnackbarOpen(true);
  };

  const editRecurringPayment = (payment) => {
    setNewPayment({
      description: payment.description,
      amount: payment.amount,
      category: payment.category,
      date: payment.date.split('T')[0],
      frequency: payment.frequency,
    });
    setCurrentPayment(payment);
    setEditMode(true);
    setFormOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={2}>
      <Button variant="contained" color="primary" onClick={() => setFormOpen(true)} sx={{ margin: 2 }}>
        Add Recurring Payment
      </Button>

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        fullWidth
        maxWidth="sm"
        scroll="paper"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{editMode ? 'Edit Recurring Payment' : 'Add Recurring Payment'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={newPayment.description}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                name="amount"
                value={newPayment.amount}
                onChange={handleInputChange}
                type="number"
                fullWidth
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                name="category"
                value={newPayment.category}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {recurringCategories.map((category) => (
                  <MenuItem key={category.name} value={category.name}>
                    {category.emoji} {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Frequency"
                name="frequency"
                value={newPayment.frequency}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              >
                <MenuItem value="" disabled>
                  Select Frequency
                </MenuItem>
                {frequencyOptions.map((freq) => (
                  <MenuItem key={freq} value={freq}>
                    {freq}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date"
                name="date"
                value={newPayment.date}
                onChange={handleInputChange}
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={addOrUpdateRecurringPayment}>
            {editMode ? 'Update Payment' : 'Add Payment'}
          </Button>
          <Button variant="outlined" color="error" onClick={() => setFormOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 1, width: '100%' }}>
        {recurringCategories.map(({ name, color, emoji }) => {
          const totalRecurringAmount = (recurringPayments.filter((payment) => payment.category === name) || []).reduce(
            (total, payment) => {
              return total + (typeof payment.amount === 'number' ? payment.amount : 0);
            },
            0
          );
          const paymentCount = (recurringPayments.filter((payment) => payment.category === name) || []).length;

          return (
            <Box
              key={name}
              sx={{
                borderRadius: '20px',
                  padding: 3,
                  margin: 1,
                  width: 240,
                  cursor: 'pointer',
                  backgroundColor: 'lightblue',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 2,
                  border: '2px solid white',
                  transition: 'transform 0.2s','&:hover': {
                    transform: 'scale(1.1)',
                  },
              }}
            >
              <Typography variant="h6" x={{ marginBottom: 2, fontWeight: 'bold', color: 'primary.main' }}>
                {emoji} <strong style={{ marginLeft: 8 }}>{name}</strong>
              </Typography>
              <Typography variant="subtitle1">Total: ${totalRecurringAmount.toFixed(2)}</Typography>
              <Typography variant="subtitle2">Count: {paymentCount}</Typography>
            </Box>
          );
        })}
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2, width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'lightblue' ,border:'2px solid white' }}>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Frequency</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recurringPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.description}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.category}</TableCell>
                <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                <TableCell>{payment.frequency}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editRecurringPayment(payment)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteRecurringPaymentHandler(payment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
}

export default Recurring;
