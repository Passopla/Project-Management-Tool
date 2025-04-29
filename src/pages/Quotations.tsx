import React, { useState } from 'react';
import * as XLSX from 'xlsx';
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
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Client, Quotation, RobonDivision, QuotationStatus } from '../types';
import { addQuotation, addClient } from '../store/quotationsSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

const Quotations: React.FC = () => {
  const dispatch = useDispatch();
  const clients = useSelector((state: RootState) => state.quotations.clients);
  const [openDialog, setOpenDialog] = useState(false);
  const [openClientDialog, setOpenClientDialog] = useState(false);
  const [currentClientId, setCurrentClientId] = useState<string>('');
  const [newQuotation, setNewQuotation] = useState<Partial<Quotation>>({
    dateSubmitted: new Date().toISOString().split('T')[0],
    quoteNumber: '',
    branchLocation: '',
    division: 'Electrical',
    excludingVAT: 0,
    status: 'Pending',
    clientRep: ''
  });
  const [newClient, setNewClient] = useState({
    name: ''
  });

  const handleOpenDialog = (clientId: string) => {
    setCurrentClientId(clientId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewQuotation({
      dateSubmitted: new Date().toISOString().split('T')[0],
      quoteNumber: '',
      branchLocation: '',
      division: 'Electrical',
      excludingVAT: 0,
      status: 'Pending',
      clientRep: ''
    });
  };
  
  const handleOpenClientDialog = () => {
    setOpenClientDialog(true);
  };
  
  const handleCloseClientDialog = () => {
    setOpenClientDialog(false);
    setNewClient({ name: '' });
  };
  
  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient({
      ...newClient,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAddClient = () => {
    if (newClient.name.trim() === '') return;
    
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      quotations: []
    };
    
    dispatch(addClient(client));
    handleCloseClientDialog();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewQuotation({
      ...newQuotation,
      [name]: name === 'excludingVAT' ? parseFloat(value) : value
    });
  };

  const handleSubmit = () => {
    const quotation: Quotation = {
      id: Date.now().toString(),
      clientId: currentClientId,
      dateSubmitted: newQuotation.dateSubmitted || new Date().toISOString().split('T')[0],
      quoteNumber: newQuotation.quoteNumber || '',
      branchLocation: newQuotation.branchLocation || '',
      division: newQuotation.division as RobonDivision || 'Electrical',
      excludingVAT: newQuotation.excludingVAT || 0,
      status: newQuotation.status as QuotationStatus || 'Pending',
      clientRep: newQuotation.clientRep || ''
    };

    dispatch(addQuotation({ clientId: currentClientId, quotation }));
    handleCloseDialog();
  };

  const calculateVAT = (amount: number) => {
    return amount * 0.15;
  };

  const calculateTotal = (amount: number) => {
    return amount + calculateVAT(amount);
  };
  
  // Function to export client quotations to Excel
  const exportToExcel = (client: Client) => {
    // Create data array for the spreadsheet
    const data = client.quotations.map(quotation => ({
      'Date Submitted': new Date(quotation.dateSubmitted).toLocaleDateString(),
      'Quote Number': quotation.quoteNumber,
      'Branch/Location': quotation.branchLocation,
      'Robon Internal Division': quotation.division,
      'Excluding VAT (R)': quotation.excludingVAT,
      'VAT @ 15% (R)': calculateVAT(quotation.excludingVAT),
      'Including VAT (R)': calculateTotal(quotation.excludingVAT),
      'Status': quotation.status,
      'Client Rep': quotation.clientRep
    }));
    
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for better readability
    const columnWidths = [
      { wch: 15 }, // Date Submitted
      { wch: 15 }, // Quote Number
      { wch: 20 }, // Branch/Location
      { wch: 25 }, // Robon Internal Division
      { wch: 15 }, // Excluding VAT
      { wch: 15 }, // VAT
      { wch: 15 }, // Including VAT
      { wch: 15 }, // Status
      { wch: 20 }  // Client Rep
    ];
    worksheet['!cols'] = columnWidths;
    
    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${client.name} Quotations`);
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${client.name} Quotations.xlsx`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Quotations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenClientDialog}
        >
          Add Client
        </Button>
      </Box>

      {clients && clients.length > 0 ? (
        clients.map((client: Client) => (
        <Accordion key={client.id} sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', pr: 2 }}>
              <Typography variant="h6">{client.name}</Typography>
              <IconButton 
                size="small" 
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation(); // Prevent accordion from toggling
                  exportToExcel(client);
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
                    <TableCell>Date Submitted</TableCell>
                    <TableCell>Quote Number</TableCell>
                    <TableCell>Branch/Location</TableCell>
                    <TableCell>Robon Internal Division</TableCell>
                    <TableCell>Excluding VAT</TableCell>
                    <TableCell>VAT @ 15%</TableCell>
                    <TableCell>Including VAT</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Client Rep</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {client.quotations.length > 0 ? (
                    client.quotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell>{new Date(quotation.dateSubmitted).toLocaleDateString()}</TableCell>
                        <TableCell>{quotation.quoteNumber}</TableCell>
                        <TableCell>{quotation.branchLocation}</TableCell>
                        <TableCell>{quotation.division}</TableCell>
                        <TableCell>R{quotation.excludingVAT.toLocaleString()}</TableCell>
                        <TableCell>R{calculateVAT(quotation.excludingVAT).toLocaleString()}</TableCell>
                        <TableCell>R{calculateTotal(quotation.excludingVAT).toLocaleString()}</TableCell>
                        <TableCell>{quotation.status}</TableCell>
                        <TableCell>{quotation.clientRep}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No quotations found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                onClick={() => handleOpenDialog(client.id)}
              >
                Add New Quotation
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))
      ) : (
        <Typography variant="body1" sx={{ p: 2 }}>
          No clients found. Please add clients to manage quotations.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New Quotation</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Date Submitted"
              type="date"
              name="dateSubmitted"
              value={newQuotation.dateSubmitted}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Quote Number"
              name="quoteNumber"
              value={newQuotation.quoteNumber}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Branch/Location"
              name="branchLocation"
              value={newQuotation.branchLocation}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Robon Internal Division"
              name="division"
              value={newQuotation.division}
              onChange={handleInputChange}
            >
              <MenuItem value="Electrical">Electrical</MenuItem>
              <MenuItem value="Solar PV">Solar PV</MenuItem>
              <MenuItem value="Generators">Generators</MenuItem>
              <MenuItem value="Air Conditioning">Air Conditioning</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Excluding VAT"
              name="excludingVAT"
              type="number"
              value={newQuotation.excludingVAT}
              onChange={handleInputChange}
              InputProps={{ startAdornment: 'R' }}
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Status"
              name="status"
              value={newQuotation.status}
              onChange={handleInputChange}
            >
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Onhold">Onhold</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Client Representative"
              name="clientRep"
              value={newQuotation.clientRep}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Quotation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={openClientDialog} onClose={handleCloseClientDialog}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Client Name"
              name="name"
              value={newClient.name}
              onChange={handleClientInputChange}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClientDialog}>Cancel</Button>
          <Button onClick={handleAddClient} variant="contained" color="primary">
            Add Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Quotations;
