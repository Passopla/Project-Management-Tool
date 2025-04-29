import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { CustomerWithCallouts, Callout, CalloutStatus, ExpenseItem } from '../types';
import { addCallout, addCustomer } from '../store/calloutsSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as XLSX from 'xlsx';

const Callouts: React.FC = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state: RootState) => state.callouts.customers);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState<string>('');
  
  // Expense dialog states
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [currentExpense, setCurrentExpense] = useState<ExpenseItem | null>(null);
  
  // Default expense categories
  const defaultCategories = ['Material', 'Transport', 'Labor'];
  
  const [newCallout, setNewCallout] = useState<Partial<Callout>>({
    dateReceived: new Date().toISOString().split('T')[0],
    completeDate: '',
    location: '',
    invoiceDate: '',
    jobNo: '',
    contactPerson: '',
    totalExcVAT: 0,
    amount: 0,
    status: 'Pending',
    request: '',
    technicians: [],
    expenses: [],
    expenseCategories: [...defaultCategories]
  });
  
  const [newCustomer, setNewCustomer] = useState({
    name: ''
  });

  const handleOpenDialog = (customerId: string) => {
    setCurrentCustomerId(customerId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCallout({
      dateReceived: new Date().toISOString().split('T')[0],
      completeDate: '',
      location: '',
      invoiceDate: '',
      jobNo: '',
      contactPerson: '',
      totalExcVAT: 0,
      amount: 0,
      status: 'Pending',
      request: '',
      technicians: [],
      expenses: [],
      expenseCategories: [...defaultCategories]
    });
  };
  
  // Handle adding/editing an expense
  const handleExpenseDialogOpen = (expense?: ExpenseItem) => {
    if (expense) {
      setCurrentExpense(expense);
    } else {
      setCurrentExpense({
        id: Date.now().toString(),
        category: newCallout.expenseCategories?.[0] || defaultCategories[0],
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
    if (currentExpense && newCallout.expenses) {
      const expenseIndex = newCallout.expenses.findIndex(e => e.id === currentExpense.id);
      if (expenseIndex >= 0) {
        // Update existing expense
        const updatedExpenses = [...newCallout.expenses];
        updatedExpenses[expenseIndex] = currentExpense;
        setNewCallout({
          ...newCallout,
          expenses: updatedExpenses
        });
      } else {
        // Add new expense
        setNewCallout({
          ...newCallout,
          expenses: [...(newCallout.expenses || []), currentExpense]
        });
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
    if (newCategory && newCallout.expenseCategories && !newCallout.expenseCategories.includes(newCategory)) {
      setNewCallout({
        ...newCallout,
        expenseCategories: [...(newCallout.expenseCategories || []), newCategory]
      });
    }
    handleCategoryDialogClose();
  };
  
  // Handle deleting an expense
  const handleDeleteExpense = (id: string) => {
    if (newCallout.expenses) {
      setNewCallout({
        ...newCallout,
        expenses: newCallout.expenses.filter(expense => expense.id !== id)
      });
    }
  };
  
  const handleOpenCustomerDialog = () => {
    setOpenCustomerDialog(true);
  };
  
  const handleCloseCustomerDialog = () => {
    setOpenCustomerDialog(false);
    setNewCustomer({ name: '' });
  };
  
  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAddCustomer = () => {
    if (newCustomer.name.trim() === '') return;
    
    const customer: CustomerWithCallouts = {
      id: Date.now().toString(),
      name: newCustomer.name,
      callouts: []
    };
    
    dispatch(addCustomer(customer));
    handleCloseCustomerDialog();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'technicians') {
      setNewCallout({
        ...newCallout,
        technicians: value.split(',').map(tech => tech.trim())
      });
    } else {
      setNewCallout({
        ...newCallout,
        [name]: name === 'totalExcVAT' || name === 'amount' ? parseFloat(value) : value
      });
    }
  };

  const handleSubmit = () => {
    const callout: Callout = {
      id: Date.now().toString(),
      customerId: currentCustomerId,
      dateReceived: newCallout.dateReceived || new Date().toISOString().split('T')[0],
      completeDate: newCallout.completeDate || '',
      location: newCallout.location || '',
      invoiceDate: newCallout.invoiceDate || '',
      jobNo: newCallout.jobNo || '',
      contactPerson: newCallout.contactPerson || '',
      totalExcVAT: newCallout.totalExcVAT || 0,
      amount: newCallout.amount || 0,
      status: newCallout.status as CalloutStatus || 'Pending',
      request: newCallout.request || '',
      technicians: newCallout.technicians || [],
      expenses: newCallout.expenses || [],
      expenseCategories: newCallout.expenseCategories || [...defaultCategories]
    };

    dispatch(addCallout({ customerId: currentCustomerId, callout }));
    handleCloseDialog();
  };

  // Function to calculate VAT
  const calculateVAT = (amount: number) => {
    return amount * 0.15;
  };

  // Function to calculate total including VAT
  const calculateTotal = (amount: number) => {
    return amount + calculateVAT(amount);
  };
  
  // Function to calculate total expenses
  const calculateTotalExpenses = (expenses: ExpenseItem[]) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  // Function to export customer callouts to Excel
  const exportToExcel = (customer: CustomerWithCallouts) => {
    // Create data array for the spreadsheet
    const data = customer.callouts.map(callout => ({
      'Date Received': new Date(callout.dateReceived).toLocaleDateString(),
      'Complete Date': callout.completeDate ? new Date(callout.completeDate).toLocaleDateString() : '',
      'Location': callout.location,
      'Invoice Date': callout.invoiceDate ? new Date(callout.invoiceDate).toLocaleDateString() : '',
      'Job No.': callout.jobNo,
      'Contact Person': callout.contactPerson,
      'Total Exc. VAT (R)': callout.totalExcVAT,
      'VAT @ 15% (R)': calculateVAT(callout.totalExcVAT),
      'Total Incl. VAT (R)': calculateTotal(callout.totalExcVAT),
      'Status': callout.status,
      'Request': callout.request,
      'Technicians': callout.technicians.join(', '),
      'Total Expenses (R)': calculateTotalExpenses(callout.expenses)
    }));
    
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for better readability
    const columnWidths = [
      { wch: 15 }, // Date Received
      { wch: 15 }, // Complete Date
      { wch: 20 }, // Location
      { wch: 15 }, // Invoice Date
      { wch: 15 }, // Job No.
      { wch: 20 }, // Contact Person
      { wch: 15 }, // Total Exc. VAT
      { wch: 15 }, // VAT @ 15%
      { wch: 15 }, // Total Incl. VAT
      { wch: 15 }, // Status
      { wch: 30 }, // Request
      { wch: 30 }, // Technicians
      { wch: 15 }  // Total Expenses
    ];
    worksheet['!cols'] = columnWidths;
    
    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${customer.name} Callouts`);
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${customer.name} Callouts.xlsx`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Callouts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCustomerDialog}
        >
          Add Customer
        </Button>
      </Box>

      {customers && customers.length > 0 ? (
        customers.map((customer: CustomerWithCallouts) => (
        <Accordion key={customer.id} sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
              <Typography variant="h6">{customer.name}</Typography>
              <IconButton 
                size="small" 
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation(); // Prevent accordion from toggling
                  exportToExcel(customer);
                }}
                sx={{ ml: 2 }}
                title="Download as Excel"
              >
                <DownloadIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date Received</TableCell>
                    <TableCell>Complete Date</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Invoice Date</TableCell>
                    <TableCell>Job No.</TableCell>
                    <TableCell>Contact Person</TableCell>
                    <TableCell>Total Exc. VAT</TableCell>
                    <TableCell>VAT @ 15%</TableCell>
                    <TableCell>Total Incl. VAT</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Request</TableCell>
                    <TableCell>Technician(s)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customer.callouts.length > 0 ? (
                    customer.callouts.map((callout) => (
                      <TableRow key={callout.id}>
                        <TableCell>{new Date(callout.dateReceived).toLocaleDateString()}</TableCell>
                        <TableCell>{callout.completeDate ? new Date(callout.completeDate).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>{callout.location}</TableCell>
                        <TableCell>{callout.invoiceDate ? new Date(callout.invoiceDate).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>{callout.jobNo}</TableCell>
                        <TableCell>{callout.contactPerson}</TableCell>
                        <TableCell>R{callout.totalExcVAT.toLocaleString()}</TableCell>
                        <TableCell>R{calculateVAT(callout.totalExcVAT).toLocaleString()}</TableCell>
                        <TableCell>R{calculateTotal(callout.totalExcVAT).toLocaleString()}</TableCell>
                        <TableCell>{callout.status}</TableCell>
                        <TableCell>{callout.request}</TableCell>
                        <TableCell>{callout.technicians.join(', ')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        No callouts found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={() => handleOpenDialog(customer.id)}
              >
                Add New Callout
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))
      ) : (
        <Typography variant="body1" sx={{ p: 2 }}>
          No customers found. Please add customers to manage callouts.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Callout</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* First row - Date fields */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Date Received"
                    type="date"
                    name="dateReceived"
                    value={newCallout.dateReceived}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Complete Date"
                    type="date"
                    name="completeDate"
                    value={newCallout.completeDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>
              
              {/* Location field */}
              <Box>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Location"
                  name="location"
                  value={newCallout.location}
                  onChange={handleInputChange}
                />
              </Box>
              
              {/* Invoice Date and Job No */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Invoice Date"
                    type="date"
                    name="invoiceDate"
                    value={newCallout.invoiceDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Job No."
                    name="jobNo"
                    value={newCallout.jobNo}
                    onChange={handleInputChange}
                  />
                </Box>
              </Box>
              
              {/* Contact Person */}
              <Box>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Contact Person"
                  name="contactPerson"
                  value={newCallout.contactPerson}
                  onChange={handleInputChange}
                />
              </Box>
              
              {/* VAT and Status */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Total Excluding VAT"
                    name="totalExcVAT"
                    type="number"
                    value={newCallout.totalExcVAT}
                    onChange={handleInputChange}
                    InputProps={{ 
                      startAdornment: <InputAdornment position="start">R</InputAdornment>
                    }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    select
                    label="Status"
                    name="status"
                    value={newCallout.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Complete">Complete</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                  </TextField>
                </Box>
              </Box>
              
              {/* Request */}
              <Box>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Request"
                  name="request"
                  multiline
                  rows={3}
                  value={newCallout.request}
                  onChange={handleInputChange}
                />
              </Box>
              
              {/* Technicians */}
              <Box>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Technician(s) (comma-separated)"
                  name="technicians"
                  value={newCallout.technicians ? newCallout.technicians.join(', ') : ''}
                  onChange={handleInputChange}
                />
              </Box>
              
              {/* Expense Tracking Section */}
              <Box>
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
                  {newCallout.expenseCategories && newCallout.expenseCategories.map((category) => (
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
                      {newCallout.expenses && newCallout.expenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">No expenses added yet</TableCell>
                        </TableRow>
                      ) : (
                        newCallout.expenses && newCallout.expenses.map((expense) => (
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
                      {newCallout.expenses && newCallout.expenses.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                          <TableCell align="right">
                            <strong>R{newCallout.expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}</strong>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Callout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Customer Dialog */}
      <Dialog open={openCustomerDialog} onClose={handleCloseCustomerDialog}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Customer Name"
              name="name"
              value={newCustomer.name}
              onChange={handleCustomerInputChange}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustomerDialog}>Cancel</Button>
          <Button onClick={handleAddCustomer} variant="contained" color="primary">
            Add Customer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Expense Dialog */}
      <Dialog open={expenseDialogOpen} onClose={handleExpenseDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{currentExpense && newCallout.expenses?.some(e => e.id === currentExpense.id) ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={currentExpense?.category || ''}
                  onChange={(e) => currentExpense && setCurrentExpense({...currentExpense, category: e.target.value})}
                >
                  {newCallout.expenseCategories?.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ flex: '1 1 300px' }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={currentExpense?.date || ''}
                  onChange={(e) => currentExpense && setCurrentExpense({...currentExpense, date: e.target.value})}
                />
              </Box>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Description"
                value={currentExpense?.description || ''}
                onChange={(e) => currentExpense && setCurrentExpense({...currentExpense, description: e.target.value})}
              />
            </Box>
            <Box>
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
            </Box>
          </Box>
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

export default Callouts;
