import React from 'react';
import { useState } from 'react';
import './Budget.css';

import { Box, Tabs, Tab, Card, CardContent, Typography, TextField, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, Grid, IconButton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Edit as EditIcon, Delete as DeleteIcon, ShowChart, CurrencyBitcoin, 
  Savings, TrendingUp } from '@mui/icons-material';

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

const ExpenseList = ({ title, expenses, onEdit, onDelete }) => (
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
    </CardContent>
  </Card>
);

const PortfolioCard = ({ title, value, trend, icon: Icon }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography color="textSecondary">{title}</Typography>
        <Icon />
      </Box>
      <Typography variant="h5">${value.toLocaleString()}</Typography>
      <Typography 
        color={trend >= 0 ? 'success.main' : 'error.main'}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </Typography>
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

  const samplePortfolioData = [
    { month: 'Jan', stocks: 4000, crypto: 2400, savings: 2400 },
    { month: 'Feb', stocks: 3000, crypto: 1398, savings: 2800 },
    { month: 'Mar', stocks: 2000, crypto: 9800, savings: 3200 },
    { month: 'Apr', stocks: 2780, crypto: 3908, savings: 3600 },
    { month: 'May', stocks: 1890, crypto: 4800, savings: 3800 },
    { month: 'Jun', stocks: 2390, crypto: 3800, savings: 4000 },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Typography variant="h3" gutterBottom>
        Financial Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Budget" />
          <Tab label="Investments" />
          <Tab label="Retirement" />
        </Tabs>
      </Box>

      {/* Budget Tab */}
      {tabValue === 0 && (
        <>
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
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ExpenseList
                title="Variable Expenses"
                expenses={budget.variable}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ExpenseList
                title="Savings & Investments"
                expenses={budget.allocation}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
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
        </>
      )}

      {/* Investment Tab */}
      {tabValue === 1 && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <PortfolioCard
                title="Total Portfolio"
                value={142593}
                trend={12.5}
                icon={TrendingUp}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <PortfolioCard
                title="Stocks"
                value={84224}
                trend={8.3}
                icon={ShowChart}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <PortfolioCard
                title="Crypto"
                value={23569}
                trend={-4.2}
                icon={CurrencyBitcoin}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <PortfolioCard
                title="Savings"
                value={34800}
                trend={2.1}
                icon={Savings}
              />
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Portfolio Performance</Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={samplePortfolioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="stocks" stroke="#8884d8" />
                    <Line type="monotone" dataKey="crypto" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="savings" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Retirement Tab */}
      {tabValue === 2 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Retirement Calculator</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Monthly Contribution"
                    type="number"
                    defaultValue="1000"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Expected Return Rate (%)"
                    type="number"
                    defaultValue="7"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Inflation Rate (%)"
                    type="number"
                    defaultValue="2"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Retirement Projection</Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { age: 30, balance: 50000 },
                    { age: 40, balance: 300000 },
                    { age: 50, balance: 800000 },
                    { age: 60, balance: 1800000 },
                    { age: 65, balance: 2500000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Portfolio Balance" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Budget;