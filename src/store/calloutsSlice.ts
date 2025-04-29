import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomerWithCallouts, Callout } from '../types';

interface CalloutsState {
  customers: CustomerWithCallouts[];
}

const initialState: CalloutsState = {
  customers: [
    {
      id: '1',
      name: 'ABC Corporation',
      callouts: [
        {
          id: '101',
          customerId: '1',
          dateReceived: '2025-04-15',
          completeDate: '2025-04-20',
          location: 'Johannesburg',
          invoiceDate: '2025-04-22',
          jobNo: 'JOB-2025-001',
          contactPerson: 'John Smith',
          totalExcVAT: 5000,
          amount: 5750,
          status: 'Complete',
          request: 'Electrical fault in main office',
          technicians: ['Mike Johnson', 'Sarah Lee'],
          expenses: [
            {
              id: '1001',
              category: 'Material',
              description: 'Electrical components',
              amount: 2500,
              date: '2025-04-16'
            },
            {
              id: '1002',
              category: 'Transport',
              description: 'Site visit',
              amount: 800,
              date: '2025-04-17'
            }
          ],
          expenseCategories: ['Material', 'Transport', 'Labor']
        }
      ]
    },
    {
      id: '2',
      name: 'XYZ Enterprises',
      callouts: [
        {
          id: '201',
          customerId: '2',
          dateReceived: '2025-04-18',
          completeDate: '',
          location: 'Cape Town',
          invoiceDate: '',
          jobNo: 'JOB-2025-002',
          contactPerson: 'Sarah Johnson',
          totalExcVAT: 3500,
          amount: 4025,
          status: 'In Progress',
          request: 'Generator maintenance',
          technicians: ['David Williams'],
          expenses: [
            {
              id: '2001',
              category: 'Material',
              description: 'Generator parts',
              amount: 1500,
              date: '2025-04-19'
            }
          ],
          expenseCategories: ['Material', 'Transport', 'Labor']
        }
      ]
    }
  ]
};

const calloutsSlice = createSlice({
  name: 'callouts',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<CustomerWithCallouts>) => {
      // Create a new array if customers doesn't exist
      if (!Array.isArray(state.customers)) {
        return {
          ...state,
          customers: [action.payload]
        };
      }
      state.customers.push(action.payload);
    },
    addCallout: (state, action: PayloadAction<{ customerId: string; callout: Callout }>) => {
      const { customerId, callout } = action.payload;
      // Return unchanged state if customers doesn't exist
      if (!Array.isArray(state.customers)) {
        return state;
      }
      const customerIndex = state.customers.findIndex(customer => customer.id === customerId);
      if (customerIndex !== -1) {
        // Handle case where callouts array doesn't exist
        if (!Array.isArray(state.customers[customerIndex].callouts)) {
          // Create a new customer object with the callout
          state.customers[customerIndex] = {
            ...state.customers[customerIndex],
            callouts: [callout]
          };
        } else {
          state.customers[customerIndex].callouts.push(callout);
        }
      }
    },
    updateCallout: (state, action: PayloadAction<{ customerId: string; callout: Callout }>) => {
      const { customerId, callout } = action.payload;
      // Return unchanged state if customers doesn't exist
      if (!Array.isArray(state.customers)) {
        return state;
      }
      const customerIndex = state.customers.findIndex(customer => customer.id === customerId);
      if (customerIndex !== -1) {
        // Return if callouts array doesn't exist
        if (!Array.isArray(state.customers[customerIndex].callouts)) {
          return state;
        }
        const calloutIndex = state.customers[customerIndex].callouts.findIndex(
          c => c.id === callout.id
        );
        if (calloutIndex !== -1) {
          state.customers[customerIndex].callouts[calloutIndex] = callout;
        }
      }
    },
    deleteCallout: (state, action: PayloadAction<{ customerId: string; calloutId: string }>) => {
      const { customerId, calloutId } = action.payload;
      // Return unchanged state if customers doesn't exist
      if (!Array.isArray(state.customers)) {
        return state;
      }
      const customerIndex = state.customers.findIndex(customer => customer.id === customerId);
      if (customerIndex !== -1) {
        // Return if callouts array doesn't exist
        if (!Array.isArray(state.customers[customerIndex].callouts)) {
          return state;
        }
        state.customers[customerIndex].callouts = state.customers[customerIndex].callouts.filter(
          c => c.id !== calloutId
        );
      }
    }
  }
});

export const { 
  addCustomer, 
  addCallout, 
  updateCallout, 
  deleteCallout 
} = calloutsSlice.actions;
export default calloutsSlice.reducer;
