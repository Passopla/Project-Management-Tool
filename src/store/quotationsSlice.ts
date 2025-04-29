import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Client, Quotation } from '../types';

interface QuotationsState {
  clients: Client[];
}

const initialState: QuotationsState = {
  clients: [
    {
      id: '1',
      name: 'ABC Corporation',
      quotations: [
        {
          id: '101',
          clientId: '1',
          dateSubmitted: '2025-04-15',
          quoteNumber: 'Q2025-001',
          branchLocation: 'Johannesburg',
          division: 'Electrical',
          excludingVAT: 25000,
          status: 'Pending',
          clientRep: 'John Smith'
        }
      ]
    },
    {
      id: '2',
      name: 'XYZ Enterprises',
      quotations: [
        {
          id: '201',
          clientId: '2',
          dateSubmitted: '2025-04-20',
          quoteNumber: 'Q2025-002',
          branchLocation: 'Cape Town',
          division: 'Solar PV',
          excludingVAT: 75000,
          status: 'Approved',
          clientRep: 'Sarah Johnson'
        }
      ]
    }
  ]
};

const quotationsSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<Client>) => {
      // Create a new array if clients doesn't exist
      if (!Array.isArray(state.clients)) {
        return {
          ...state,
          clients: [action.payload]
        };
      }
      state.clients.push(action.payload);
    },
    addQuotation: (state, action: PayloadAction<{ clientId: string; quotation: Quotation }>) => {
      const { clientId, quotation } = action.payload;
      // Return unchanged state if clients doesn't exist
      if (!Array.isArray(state.clients)) {
        return state;
      }
      const clientIndex = state.clients.findIndex(client => client.id === clientId);
      if (clientIndex !== -1) {
        // Handle case where quotations array doesn't exist
        if (!Array.isArray(state.clients[clientIndex].quotations)) {
          // Create a new client object with the quotation
          state.clients[clientIndex] = {
            ...state.clients[clientIndex],
            quotations: [quotation]
          };
        } else {
          state.clients[clientIndex].quotations.push(quotation);
        }
      }
    },
    updateQuotation: (state, action: PayloadAction<{ clientId: string; quotation: Quotation }>) => {
      const { clientId, quotation } = action.payload;
      // Return unchanged state if clients doesn't exist
      if (!Array.isArray(state.clients)) {
        return state;
      }
      const clientIndex = state.clients.findIndex(client => client.id === clientId);
      if (clientIndex !== -1) {
        // Return if quotations array doesn't exist
        if (!Array.isArray(state.clients[clientIndex].quotations)) {
          return state;
        }
        const quotationIndex = state.clients[clientIndex].quotations.findIndex(
          q => q.id === quotation.id
        );
        if (quotationIndex !== -1) {
          state.clients[clientIndex].quotations[quotationIndex] = quotation;
        }
      }
    },
    deleteQuotation: (state, action: PayloadAction<{ clientId: string; quotationId: string }>) => {
      const { clientId, quotationId } = action.payload;
      // Return unchanged state if clients doesn't exist
      if (!Array.isArray(state.clients)) {
        return state;
      }
      const clientIndex = state.clients.findIndex(client => client.id === clientId);
      if (clientIndex !== -1) {
        // Return if quotations array doesn't exist
        if (!Array.isArray(state.clients[clientIndex].quotations)) {
          return state;
        }
        state.clients[clientIndex].quotations = state.clients[clientIndex].quotations.filter(
          q => q.id !== quotationId
        );
      }
    }
  }
});

export const { addClient, addQuotation, updateQuotation, deleteQuotation } = quotationsSlice.actions;
export default quotationsSlice.reducer;
