import React, { useState, useEffect } from 'react';
import './Budget.css';
import Sidebar from '../Sidebar/Sidebar';
import { getAuth } from 'firebase/auth';

import { 
  Box, Card, CardContent, Typography, TextField, Button, 
  Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Alert, Snackbar
} from '@mui/material';
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const generateBudget = (monthlySalary) => {
  const needs = monthlySalary * 0.5;
  const wants = monthlySalary * 0.3;
  const savings = monthlySalary * 0.2;

  return {
    fixed: [
      { id: 'f1', name: 'Rent/Mortgage', amount: Math.round(needs * 0.35) },
      { id: 'f2', name: 'Utilities', amount: Math.round(needs * 0.10) },
      { id: 'f3', name: 'Groceries', amount: Math.round(needs * 0.15) },
      { id: 'f4', name: 'Insurance', amount: Math.round(needs * 0.10) },
      { id: 'f5', name: 'Transportation', amount: Math.round(needs * 0.15) },
      { id: 'f6', name: 'Healthcare', amount: Math.round(needs * 0.15) }
    ],
    variable: [
      { id: 'v1', name: 'Dining Out', amount: Math.round(wants * 0.3) },
      { id: 'v2', name: 'Entertainment', amount: Math.round(wants * 0.2) },
      { id: 'v3', name: 'Shopping', amount: Math.round(wants * 0.2) },
      { id: 'v4', name: 'Vacation Fund', amount: Math.round(wants * 0.15) },
      { id: 'v5', name: 'Activities', amount: Math.round(wants * 0.15) }
    ],
    allocation: [
      { id: 'a1', name: 'Emergency Fund', amount: Math.round(savings * 0.3) },
      { id: 'a2', name: 'Retirement', amount: Math.round(savings * 0.4) },
      { id: 'a3', name: 'Investment', amount: Math.round(savings * 0.3) }
    ]
  };
};

const ExpenseList = ({ title, expenses, onEdit, onDelete, onAdd }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="h4" gutterBottom>
        ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
      </Typography>
      {expenses.map((expense) => (
        <Box key={expense.id} sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 1,
          '&:hover': { bgcolor: 'action.hover' }
        }}>
          <Typography>{expense.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 2 }}>${expense.amount.toLocaleString()}</Typography>
            <IconButton size="small" onClick={() => onEdit(expense)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(expense)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
      <Button 
        variant="contained" 
        startIcon={<AddIcon />} 
        onClick={onAdd}
        sx={{ mt: 2 }}
      >
        Add New Item
      </Button>
    </CardContent>
  </Card>
);

function Budget() {
  // States
  const [tabValue, setTabValue] = useState(0);
  const [annualSalary, setAnnualSalary] = useState('');
  const [budget, setBudget] = useState({ fixed: [], variable: [], allocation: [] });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addCategory, setAddCategory] = useState('');
  const [addName, setAddName] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // States for MongoDB data handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success', open: false });

  const saveBudgetToMongo = async (newBudget) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        setMessage({
          text: 'Please log in to save your budget',
          type: 'error',
          open: true
        });
        return;
      }

      const response = await fetch('http://localhost:5000/update-budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.uid,
          budget: newBudget
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save budget');
      }

      setMessage({
        text: 'Budget saved successfully',
        type: 'success',
        open: true
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      setMessage({
        text: 'Failed to save budget',
        type: 'error',
        open: true
      });
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.log('No user logged in');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/get-financial-data/${user.uid}`);
      const data = await response.json();

      if (data.success && data.data) {
        const { financialInfo, budgetInfo } = data.data;
        
        // Add this debug log
        console.log('Financial Info received:', financialInfo);
        
        // Set annual salary
        if (financialInfo?.salary) {
          setAnnualSalary(financialInfo.salary.toString());
        }
        
        // If we have existing budget data, use it directly
        if (budgetInfo && Object.keys(budgetInfo).length > 0) {
          setBudget(budgetInfo);
        } else if (financialInfo?.salary) {
          // Only generate new budget if we don't have saved budget data
          const monthlyIncome = Math.round(financialInfo.salary / 12);
          const initialBudget = generateBudget(monthlyIncome);
          
          // Update fixed expenses with actual values from MongoDB
          const updatedFixed = initialBudget.fixed.map(expense => {
            switch(expense.name) {
              case 'Rent/Mortgage':
                return { ...expense, amount: financialInfo.monthlyRent || expense.amount };
              case 'Groceries':
                return { ...expense, amount: financialInfo.grocerySpending || expense.amount };
              case 'Transportation':
                return { ...expense, amount: financialInfo.transportationCost || expense.amount };
              case 'Insurance':
                return { ...expense, amount: financialInfo.insuranceCost || expense.amount };
              default:
                return expense;
            }
          });

          const newBudget = {
            ...initialBudget,
            fixed: updatedFixed
          };
          setBudget(newBudget);
          // Save this initial budget to MongoDB
          await saveBudgetToMongo(newBudget);
        }
        
        setUserDataFetched(true);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add auth state change listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData();
      } else {
        // Reset states when user logs out
        setBudget({ fixed: [], variable: [], allocation: [] });
        setAnnualSalary('');
        setUserDataFetched(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleGenerateBudget = async () => {
    if (!annualSalary) return;
    const monthlyIncome = Math.round(Number(annualSalary) / 12);
    const newBudget = generateBudget(monthlyIncome);
    setBudget(newBudget);
    await saveBudgetToMongo(newBudget);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingExpense) return;
    
    const updatedBudget = { ...budget };
    const category = Object.keys(budget).find(cat => 
      budget[cat].some(exp => exp.id === editingExpense.id)
    );
    
    if (category) {
      updatedBudget[category] = budget[category].map(exp =>
        exp.id === editingExpense.id 
          ? { ...exp, name: editName, amount: Number(editAmount) }
          : exp
      );
      setBudget(updatedBudget);
      await saveBudgetToMongo(updatedBudget);
    }
    
    setEditDialogOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (expenseToDelete) => {
    const updatedBudget = { ...budget };
    Object.keys(updatedBudget).forEach(category => {
      updatedBudget[category] = updatedBudget[category].filter(
        exp => exp.id !== expenseToDelete.id
      );
    });
    setBudget(updatedBudget);
    await saveBudgetToMongo(updatedBudget);
  };

  const handleAddItem = (category) => {
    setAddCategory(category);
    setAddDialogOpen(true);
  };

  const handleSaveNewItem = async () => {
    if (!addName || !addAmount) return;

    const newItem = {
      id: `${addCategory}-${Date.now()}`,
      name: addName,
      amount: Number(addAmount)
    };

    const updatedBudget = { ...budget };
    updatedBudget[addCategory] = [...updatedBudget[addCategory], newItem];
    setBudget(updatedBudget);
    await saveBudgetToMongo(updatedBudget);

    setAddDialogOpen(false);
    setAddName('');
    setAddAmount('');
  };

  const getBudgetData = () => [
    {
      name: 'Fixed Expenses',
      value: budget.fixed.reduce((sum, exp) => sum + exp.amount, 0)
    },
    {
      name: 'Variable Expenses',
      value: budget.variable.reduce((sum, exp) => sum + exp.amount, 0)
    },
    {
      name: 'Savings & Investments',
      value: budget.allocation.reduce((sum, exp) => sum + exp.amount, 0)
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="budget">
      <div>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className={`content ${sidebarOpen ? 'expand' : 'collapse'}`}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Salary Information
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                type="number"
                label="Annual Salary"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(e.target.value)}
                fullWidth
              />
              <Button 
                variant="contained" 
                onClick={handleGenerateBudget}
                sx={{ minWidth: '200px' }}
              >
                Generate Budget
              </Button>
            </Box>
            {annualSalary && (
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Typography color="textSecondary">Monthly</Typography>
                  <Typography variant="h6">
                    ${Math.round(Number(annualSalary) / 12).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary">Bi-Weekly</Typography>
                  <Typography variant="h6">
                    ${Math.round(Number(annualSalary) / 26).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary">Weekly</Typography>
                  <Typography variant="h6">
                    ${Math.round(Number(annualSalary) / 52).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <ExpenseList
              title="Fixed Expenses"
              expenses={budget.fixed}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onAdd={() => handleAddItem('fixed')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ExpenseList
              title="Variable Expenses"
              expenses={budget.variable}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onAdd={() => handleAddItem('variable')}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ExpenseList
              title="Savings & Investments"
              expenses={budget.allocation}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
              onAdd={() => handleAddItem('allocation')}
            />
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Budget Overview</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getBudgetData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={160}
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Amount"
            type="number"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            fullWidth
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Amount"
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewItem} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={message.open} 
        autoHideDuration={6000} 
        onClose={() => setMessage(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Budget;