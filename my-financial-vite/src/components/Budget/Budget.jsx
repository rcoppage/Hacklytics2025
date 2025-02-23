import React from 'react';
import { useState } from 'react';
import './Budget.css';

import Sidebar from '../Sidebar/Sidebar';

import { Box, Card, CardContent, Typography, TextField, Button, 
   Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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

  const samplePortfolioData = [
    { month: 'Jan', stocks: 4000, crypto: 2400, savings: 2400 },
    { month: 'Feb', stocks: 3000, crypto: 1398, savings: 2800 },
    { month: 'Mar', stocks: 2000, crypto: 9800, savings: 3200 },
    { month: 'Apr', stocks: 2780, crypto: 3908, savings: 3600 },
    { month: 'May', stocks: 1890, crypto: 4800, savings: 3800 },
    { month: 'Jun', stocks: 2390, crypto: 3800, savings: 4000 },
  ];

  const handleGenerateBudget = () => {
    if (!annualSalary) return;
    const monthlyIncome = Math.round(Number(annualSalary) / 12);
    setBudget(generateBudget(monthlyIncome));
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
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
    }
    
    setEditDialogOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseToDelete) => {
    const updatedBudget = { ...budget };
    Object.keys(updatedBudget).forEach(category => {
      updatedBudget[category] = updatedBudget[category].filter(
        exp => exp.id !== expenseToDelete.id
      );
    });
    setBudget(updatedBudget);
  };

  const handleAddItem = (category) => {
    setAddCategory(category);
    setAddDialogOpen(true);
  };

  const handleSaveNewItem = () => {
    if (!addName || !addAmount) return;

    const newItem = {
      id: `${addCategory}-${Date.now()}`,
      name: addName,
      amount: Number(addAmount)
    };

    const updatedBudget = { ...budget };
    updatedBudget[addCategory] = [...updatedBudget[addCategory], newItem];
    setBudget(updatedBudget);

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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="budget">
      <div>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>
      <div className={`content ${sidebarOpen ?   'expand' : 'collapse'}`}>
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
            sx={{ mb: 2 }}
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
          <Button onClick={handleSaveEdit}>Save</Button>
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
            sx={{ mb: 2 }}
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
          <Button onClick={handleSaveNewItem}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Budget;