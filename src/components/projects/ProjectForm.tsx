import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Project } from '../../types';

interface ProjectFormProps {
  onSubmit: (project: Project) => void;
  onCancel: () => void;
  project?: Project;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel, project }) => {
  // Initialize with default expense categories or from existing project
  const defaultCategories = ['Material', 'Transport'];
  const [expenseCategories, setExpenseCategories] = useState<string[]>(
    project?.expenseCategories || defaultCategories
  );
  const [expenses, setExpenses] = useState<Array<{
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
  }>>(project?.expenses || []);
  
  // Dialog states
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [currentExpense, setCurrentExpense] = useState<{
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
  } | null>(null);
  
  // Handle adding/editing an expense
  const handleExpenseDialogOpen = (expense?: typeof expenses[0]) => {
    if (expense) {
      setCurrentExpense(expense);
    } else {
      setCurrentExpense({
        id: Date.now().toString(),
        category: expenseCategories[0],
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      });
    }
    setExpenseDialogOpen(true);
  };
  
  const handleExpenseDialogClose = () => {
    setExpenseDialogOpen(false);
    setCurrentExpense(null);
  };
  
  const handleExpenseSave = () => {
    if (currentExpense) {
      const expenseIndex = expenses.findIndex(e => e.id === currentExpense.id);
      if (expenseIndex >= 0) {
        // Update existing expense
        const updatedExpenses = [...expenses];
        updatedExpenses[expenseIndex] = currentExpense;
        setExpenses(updatedExpenses);
      } else {
        // Add new expense
        setExpenses([...expenses, currentExpense]);
      }
    }
    handleExpenseDialogClose();
  };
  
  // Handle adding a new category
  const handleCategoryDialogOpen = () => {
    setNewCategory('');
    setCategoryDialogOpen(true);
  };
  
  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
  };
  
  const handleCategorySave = () => {
    if (newCategory && !expenseCategories.includes(newCategory)) {
      setExpenseCategories([...expenseCategories, newCategory]);
    }
    handleCategoryDialogClose();
  };
  
  // Handle deleting an expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  // Calculate progress based on current date's relation to start and end dates
  const calculateProgress = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const current = new Date().getTime();
    
    // If project hasn't started yet
    if (current < start) {
      return 0;
    }
    
    // If project is completed or past end date
    if (current >= end) {
      return 100;
    }
    
    // Calculate percentage between start and end date
    const totalDuration = end - start;
    const elapsed = current - start;
    const progress = Math.round((elapsed / totalDuration) * 100);
    
    return progress;
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const teamValue = formData.get('team') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    
    const newProject: Project = {
      id: project?.id || Date.now().toString(),
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || '',
      location: {
        lat: project?.location?.lat || 0,
        lng: project?.location?.lng || 0,
        address: formData.get('address') as string,
      },
      startDate: startDate,
      endDate: endDate,
      status: formData.get('status') as Project['status'],
      progress: calculateProgress(startDate, endDate),
      budget: parseFloat(formData.get('budget') as string),
      manager: formData.get('manager') as string,
      team: teamValue ? teamValue.split(',').map(member => member.trim()) : [],
      expenses: expenses,
      expenseCategories: expenseCategories,
    };
    onSubmit(newProject);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            name="name"
            label="Project Name"
            defaultValue={project?.name}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            name="description"
            label="Description"
            defaultValue={project?.description}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            name="address"
            label="Address"
            defaultValue={project?.location.address}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            required
            fullWidth
            type="date"
            name="startDate"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            defaultValue={project?.startDate}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            required
            fullWidth
            type="date"
            name="endDate"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            defaultValue={project?.endDate}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            required
            select
            fullWidth
            name="status"
            label="Status"
            defaultValue={project?.status || 'planning'}
          >
            <MenuItem value="planning">Planning</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="on-hold">On Hold</MenuItem>
          </TextField>
        </Grid>

        <Grid size={12}>
          <TextField
            required
            fullWidth
            type="number"
            name="budget"
            label="Budget"
            InputProps={{
              startAdornment: <InputAdornment position="start">R</InputAdornment>,
            }}
            defaultValue={project?.budget}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            required
            fullWidth
            name="manager"
            label="Project Manager"
            defaultValue={project?.manager}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            name="team"
            label="Team Members (comma-separated)"
            defaultValue={project?.team ? project?.team.join(', ') : ''}
          />
        </Grid>
        
        {/* Expense Tracking Section */}
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Expense Tracking</Typography>
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={handleCategoryDialogOpen}
                sx={{ mr: 1 }}
              >
                Add Category
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleExpenseDialogOpen()}
              >
                Add Expense
              </Button>
            </Box>
          </Box>
          
          {/* Expense Categories */}
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ mr: 1, alignSelf: 'center' }}>Categories:</Typography>
            {expenseCategories.map((category) => (
              <Chip key={category} label={category} color="primary" variant="outlined" />
            ))}
          </Box>
          
          {/* Expenses Table */}
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount (R)</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No expenses added yet</TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell align="right">R{expense.amount.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleExpenseDialogOpen(expense)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteExpense(expense.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {expenses.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                    <TableCell align="right">
                      <strong>R{expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}</strong>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        <Grid size={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="contained">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Add/Edit Expense Dialog */}
      <Dialog open={expenseDialogOpen} onClose={handleExpenseDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{currentExpense && expenses.some(e => e.id === currentExpense.id) ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={6}>
              <TextField
                fullWidth
                select
                label="Category"
                value={currentExpense?.category || ''}
                onChange={(e) => currentExpense && setCurrentExpense({...currentExpense, category: e.target.value})}
              >
                {expenseCategories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                value={currentExpense?.date || ''}
                onChange={(e) => currentExpense && setCurrentExpense({...currentExpense, date: e.target.value})}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                value={currentExpense?.description || ''}
                onChange={(e) => currentExpense && setCurrentExpense({...currentExpense, description: e.target.value})}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                InputProps={{
                  startAdornment: <InputAdornment position="start">R</InputAdornment>,
                }}
                value={currentExpense?.amount || 0}
                onChange={(e) => currentExpense && setCurrentExpense({...currentExpense, amount: parseFloat(e.target.value)})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExpenseDialogClose}>Cancel</Button>
          <Button onClick={handleExpenseSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={handleCategoryDialogClose}>
        <DialogTitle>Add Expense Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoryDialogClose}>Cancel</Button>
          <Button onClick={handleCategorySave} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectForm;