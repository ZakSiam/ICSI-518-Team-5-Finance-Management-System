import React, { useState, useEffect } from 'react';
import './ExpenseSummary.css'; // Import your CSS file

function ExpenseSummary() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/expenses/');
        const data = await response.json();
        setExpenses(data);  // Set the fetched data in the state
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchExpenses();
  }, []);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/expenses/?start_date=${startDate}&end_date=${endDate}`);
      const data = await response.json();
      setExpenses(data); // Update the state with filtered expenses
    } catch (error) {
      console.error('Error fetching filtered expenses:', error);
    }
  };

  return (
    <div className="expense-summary">
      <h1>Expense Summary</h1>

      <div className="date-filters">
        <label htmlFor="startDate">Start Date</label>
        <input type="date" id="startDate" value={startDate} onChange={handleStartDateChange} />

        <label htmlFor="endDate">End Date</label>
        <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />

        <button onClick={handleSearch}>Search</button>
      </div>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr className="empty">
              <td colSpan="4">No expenses found for the selected date range.</td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseSummary;
