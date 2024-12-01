import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; // Import Material-UI Button

function ExpenseCard({ router }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'flex-start', 
        position: 'relative', 
        height: '100%', 
        margin: 2
      }}
    >
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => router.navigate('/Expenses/new-expense')}
        sx={{ top: 5, right: 16 }} // Positioning the button
      >
        Add Expense
      </Button>
    </Box>
  );
}

ExpenseCard.propTypes = {
  router: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default ExpenseCard;
