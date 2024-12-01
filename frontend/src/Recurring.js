import React, { useState } from 'react';
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
  console.log("running");
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ description: '', amount: '', category: recurringCategories[0].name, date: '' });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const theme = useTheme();

  const addRecurringPayment = () => {
    // Convert the amount to a number before adding it to the payments array
    setRecurringPayments((prevPayments) => [
      ...prevPayments,
      { ...newPayment, id: Date.now(), amount: parseFloat(newPayment.amount), date: new Date(newPayment.date) }
    ]);
    setSnackbarMessage('Recurring payment successfully added');
    setSnackbarOpen(true);
    setFormOpen(false);
    setNewPayment({ description: '', amount: '', category: recurringCategories[0].name, date: '' });
  };

  const deleteRecurringPayment = (id) => {
    setRecurringPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== id));
    setSnackbarMessage('Recurring payment successfully deleted');
    setSnackbarOpen(true);
  };

  const categorizedRecurringPayments = recurringPayments.reduce((acc, payment) => {
    acc[payment.category] = acc[payment.category] || [];
    acc[payment.category].push(payment);
    return acc;
  }, {});

  const handleCardClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
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
            return total + (typeof payment.amount === 'number' ? payment.amount : 0); // Ensure amount is a number
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
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categorizedRecurringPayments[openCategory] && categorizedRecurringPayments[openCategory].length > 0 ? (
                    categorizedRecurringPayments[openCategory].map((payment, index) => (
                      <TableRow
                        key={payment.id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0
                              ? theme.palette.action.hover
                              : theme.palette.background.default,
                        }}
                      >
                        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150, color: theme.palette.text.secondary }}>
                          {payment.description}
                        </TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>{payment.category}</TableCell>
                        <TableCell sx={{ color: theme.palette.text.secondary }}>{payment.date?.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton aria-label="delete" color="error" onClick={() => deleteRecurringPayment(payment.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>No recurring payments found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Recurring;
