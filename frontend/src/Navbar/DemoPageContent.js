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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Alert from '@mui/material/Alert';
import ExpenseCard from './ExpenseCard';
import NewExpenseForm from './NewExpenseForm';
import ExpenseSummary from './ExpenseSummary';
import Recurring from './Recurring';
import ChangePassword from './ChangePassword';

const expenseCategories = [
  { name: 'Food & Dining', color: 'primary', emoji: '🍽️' },
  { name: 'Transportation', color: 'yellow', emoji: '🚗' },
  { name: 'Utilities', color: '#f50057', emoji: '💡' },
  { name: 'Housing', color: '#9575cd', emoji: '🏠' },
  { name: 'Healthcare', color: '#66bb6a', emoji: '💊' },
  { name: 'Entertainment', color: '#ffa726', emoji: '🎉' },
  { name: 'Personal', color: '#ab47bc', emoji: '🧘' },
  { name: 'Education', color: '#26c6da', emoji: '📚' },
  { name: 'Other', color: '#8d6e63', emoji: '🔍' },
];

function DemoPageContent({ pathname, router }) {
  const [expenses, setExpenses] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // console.log("useEffect running...");
    const token = localStorage.getItem('accessToken'); // Retrieve the token from localStorage

    fetch('http://127.0.0.1:8000/expenses/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then(res => {
        // console.log("Response status:", res.status); // Log the status code
        if (!res.ok) {
          return res.text().then(text => { 
            // console.error("Error text:", text); // Log any error response text
            throw new Error(`HTTP error! Status: ${res.status}`);
          });
        }
        return res.json(); // Parse JSON response if successful
      })
      .then(data => {
        // console.log("Fetched data:", data); // Log the fetched data
        setExpenses(data); // Set the data to state
      })
      .catch(error => {
        console.error("Error fetching expenses:", error); // Log the error
      });
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const theme = useTheme();

  // Dynamic background color based on dark mode

    /* const addExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, { ...newExpense, id: Date.now() }]);
  }; */

  const addExpense = (newExpense) => {
    console.log("newExpense:", newExpense);
    const token = localStorage.getItem('accessToken');
    fetch('http://127.0.0.1:8000/expenses/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newExpense),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        // Update local state after successful addition
        // alert("okay");
        setExpenses((prevExpenses) => [...prevExpenses, resp]);
      })
      .catch((error) => console.log(error));
    };

/*   const editExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
    setEditingExpense(null);
  }; */

  const editExpense = (updatedExpense) => {
    const token = localStorage.getItem('accessToken');
    fetch(`http://127.0.0.1:8000/expenses/${updatedExpense.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedExpense),
    })
    .then(res => res.json())  

    .then(data => {
      setExpenses(prevExpenses => 
        prevExpenses.map(expense => 
          expense.id === data.id ? data : expense
        )
      );
      setEditingExpense(null); 
      setSnackbarMessage('Expense successfully updated');
      setSnackbarOpen(true);
    })
    .catch(error => console.error("Error updating expense:", error));
  };

/*   const deleteExpense = (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
    setSnackbarMessage('Expense successfully deleted');
    setSnackbarOpen(true);
  }; */

  const deleteExpense = (id) => {
    const token = localStorage.getItem('accessToken');
    fetch(`http://127.0.0.1:8000/expenses/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      },
    })
    .then(() => {
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      setSnackbarMessage('Expense successfully deleted');
      setSnackbarOpen(true);
    })
    .catch(error => console.error("Error deleting expense:", error));
  };

  const categorizedExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = acc[expense.category] || [];
    acc[expense.category].push(expense);
    return acc;
  }, {});

  const handleCardClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    router.navigate('/Expenses/new-expense');
  };

  if (pathname === '/summary') {
    return <ExpenseSummary expenses={expenses} />;
  }
  if (pathname === '/Recurring') {
    return <Recurring expenses={expenses} />;
  }
  if (pathname === '/Settings/Password') {
    return (
      <ChangePassword
        onPasswordChange={(currentPassword, newPassword) => {
          // Add your password change logic here
          console.log(`Changing password from ${currentPassword} to ${newPassword}`);
          // Possibly call an API or update state
        }}
      />
    );
  }
  
  if (pathname === '/Expenses') {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" >
        <ExpenseCard router={router} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: 1 }}>
          {expenseCategories.map(({ name, color, emoji }) => {
            const totalExpense = (categorizedExpenses[name] || []).reduce((total, expense) => total + expense.amount, 0);
            const expenseCount = (categorizedExpenses[name] || []).length;

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
                  backgroundColor: 'lightblue',
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
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center',  color: theme.palette.text.primary }}>
                  {emoji} <strong style={{ marginLeft: 8 }}>{name}</strong>
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>Spent: ${totalExpense.toFixed(2)}</Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>Count: {expenseCount}</Typography>
              </Box>
            );
          })}
        </Box>

        <Divider sx={{ my: 4, width: '100%' }} />

   
        <Box sx={{ marginTop: 3, width: '100%', flexGrow: 1}}>
          {openCategory && (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: 'black' }}>
                Expenses for {openCategory}:
              </Typography>

              <TableContainer component={Paper} sx={{ boxShadow: 3, marginBottom: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'lightblue' ,border:'2px solid white' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categorizedExpenses[openCategory] && categorizedExpenses[openCategory].length > 0 ? (
                      categorizedExpenses[openCategory].map((expense, index) => (
                        <TableRow
                          key={expense.id}
                          sx={{
                            backgroundColor:'white',
                            border:'2px solid white'
                              
                                
                          }}
                        >
                          <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150, color: theme.palette.text.secondary }}>
                            {expense.description}
                          </TableCell>
                          <TableCell sx={{ color: theme.palette.text.secondary }}>${expense.amount.toFixed(2)}</TableCell>
                          <TableCell sx={{ color: theme.palette.text.secondary }}>{expense.category}</TableCell>
                          <TableCell sx={{ color: theme.palette.text.secondary }}>{expense.date?new Date(expense.date).toLocaleDateString():""}</TableCell>
                          <TableCell>
                            <IconButton aria-label="edit" color="primary" onClick={() => handleEditClick(expense)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete" color="error" onClick={() => deleteExpense(expense.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No expenses available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ bgcolor: '#2e7d32', color: 'white' }} 
            iconMapping={{
              success: <CheckCircleOutlineIcon sx={{ color: 'white' }} />, 
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  if (pathname === '/Expenses/new-expense') {
    return (
      <NewExpenseForm
        router={router}
        addExpense={addExpense}
        editExpense={editExpense}
        initialData={editingExpense}  
      />
    );
  }

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      
    </Box>
  );
}

export default DemoPageContent;
