import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  TextField,
  Button,
  MenuItem,
  Modal,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Alert from '@mui/material/Alert';

const recurringCategories = [
  { name: 'Subscriptions', color: '#ff5722', emoji: '📅' },
  { name: 'Loan Payments', color: '#42a5f5', emoji: '💸' },
  { name: 'Rent', color: '#9575cd', emoji: '🏠' },
  { name: 'Utilities', color: '#f50057', emoji: '💡' },
];

function Recurring() {
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: '', amount: '', category: recurringCategories[0].name, date: '' });
  
  const theme = useTheme();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/recurring_expense/')
      .then((response) => response.json())
      .then((data) => setRecurringPayments(data))
      .catch((error) => console.error('Error fetching recurring payments:', error));
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const addRecurringPayment = () => {
    const paymentToAdd = {
      ...newPayment,
      amount: parseFloat(newPayment.amount),
      date: newPayment.date,
    };

    fetch('http://127.0.0.1:8000/recurring_expense/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentToAdd),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecurringPayments((prevPayments) => [...prevPayments, data]);
        setSnackbarMessage('Recurring payment successfully added');
        setSnackbarOpen(true);
        setFormOpen(false);
        setNewPayment({ description: '', amount: '', category: recurringCategories[0].name, date: '' });
      })
      .catch((error) => console.error('Error adding recurring payment:', error));
  };

  const deleteRecurringPayment = (id) => {
    fetch(`http://127.0.0.1:8000/recurring_expense/${id}/`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setRecurringPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== id));
          setSnackbarMessage('Recurring payment successfully deleted');
          setSnackbarOpen(true);
        }
      })
      .catch((error) => console.error('Error deleting recurring payment:', error));
  };


  const editRecurringPayment = (updatedPayment) => {
    fetch(`http://127.0.0.1:8000/recurring_expense/${updatedPayment.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPayment),
    })
      .then((response) => response.json())
      .then((data) => {
        setRecurringPayments((prevPayments) =>
          prevPayments.map((payment) => (payment.id === data.id ? data : payment))
        );
        setSnackbarMessage('Recurring payment successfully updated');
        setSnackbarOpen(true);
      })
      .catch((error) => console.error('Error updating recurring payment:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  const categorizedRecurringPayments = recurringPayments.reduce((acc, payment) => {
    acc[payment.category] = acc[payment.category] || [];
    acc[payment.category].push(payment);
    return acc;
  }, {});

  const handleCardClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Button variant="contained" color="primary" onClick={() => setFormOpen(true)} sx={{ margin: 2 }}>
        Add Recurring Payment
      </Button>

      {/* Add Recurring Payment Form */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <Box sx={{ bgcolor: 'background.paper', padding: 4, borderRadius: 2, maxWidth: 400, margin: 'auto', marginTop: '20vh' }}>
          <Typography variant="h6" marginBottom={2}>Add Recurring Payment</Typography>

          <TextField
            label="Description"
            name="description"
            value={newPayment.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Amount"
            name="amount"
            value={newPayment.amount}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Category"
            name="category"
            value={newPayment.category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          >
            {recurringCategories.map((category) => (
              <MenuItem key={category.name} value={category.name}>
                {category.emoji} {category.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Date"
            name="date"
            value={newPayment.date}
            onChange={handleInputChange}
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button variant="contained" color="primary" onClick={addRecurringPayment}>
              Add Payment
            </Button>
            <Button variant="outlined" color="error" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 1 }}>
        {recurringCategories.map(({ name, color, emoji }) => {
          const totalRecurringAmount = (categorizedRecurringPayments[name] || []).reduce((total, payment) => {
            return total + (typeof payment.amount === 'number' ? payment.amount : 0);
          }, 0);
          const paymentCount = (categorizedRecurringPayments[name] || []).length;

          return (
            <Box
              key={name}
              onClick={() => handleCardClick(name)}
              sx={{
                borderRadius: '20px',
                padding: 3,
                margin: 1,
                width: 240,
                cursor: 'pointer',
                backgroundColor: color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 2,
                border: '2px solid white',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', color: theme.palette.text.primary }}>
                {emoji} <strong style={{ marginLeft: 8 }}>{name}</strong>
              </Typography>

              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>Total: ${totalRecurringAmount.toFixed(2)}</Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>Count: {paymentCount}</Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 4, width: '100%' }} />

      <Box sx={{ marginTop: 3, width: '90%' }}>
        {openCategory && (
          <>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: 'primary.main' }}>
              Recurring payments for {openCategory}:
            </Typography>

            <TableContainer component={Paper} sx={{ boxShadow: 3, marginBottom: 6 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'lightblue' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categorizedRecurringPayments[openCategory]?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="delete"
                          onClick={() => deleteRecurringPayment(payment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => editRecurringPayment(payment)}>
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Recurring;
