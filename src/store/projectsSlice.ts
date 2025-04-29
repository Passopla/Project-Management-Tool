import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, ExpenseItem } from '../types';

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: []
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      // Create a new array if projects doesn't exist
      if (!Array.isArray(state.projects)) {
        return {
          ...state,
          projects: [action.payload]
        };
      }
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      // Return unchanged state if projects doesn't exist
      if (!Array.isArray(state.projects)) {
        return state;
      }
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      // Return unchanged state if projects doesn't exist
      if (!Array.isArray(state.projects)) {
        return state;
      }
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    addExpense: (state, action: PayloadAction<{ projectId: string; expense: ExpenseItem }>) => {
      // Return unchanged state if projects doesn't exist
      if (!Array.isArray(state.projects)) {
        return state;
      }
      const { projectId, expense } = action.payload;
      const projectIndex = state.projects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1) {
        // Initialize expenses array if it doesn't exist
        if (!Array.isArray(state.projects[projectIndex].expenses)) {
          state.projects[projectIndex].expenses = [];
        }
        
        state.projects[projectIndex].expenses.push(expense);
      }
    },
    updateExpense: (state, action: PayloadAction<{ projectId: string; expense: ExpenseItem }>) => {
      // Return unchanged state if projects doesn't exist
      if (!Array.isArray(state.projects)) {
        return state;
      }
      
      const { projectId, expense } = action.payload;
      const projectIndex = state.projects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1 && Array.isArray(state.projects[projectIndex].expenses)) {
        const expenseIndex = state.projects[projectIndex].expenses.findIndex(e => e.id === expense.id);
        
        if (expenseIndex !== -1) {
          state.projects[projectIndex].expenses[expenseIndex] = expense;
        }
      }
    },
    deleteExpense: (state, action: PayloadAction<{ projectId: string; expenseId: string }>) => {
      // Return unchanged state if projects doesn't exist
      if (!Array.isArray(state.projects)) {
        return state;
      }
      
      const { projectId, expenseId } = action.payload;
      const projectIndex = state.projects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1 && Array.isArray(state.projects[projectIndex].expenses)) {
        state.projects[projectIndex].expenses = state.projects[projectIndex].expenses.filter(
          e => e.id !== expenseId
        );
      }
    },
    addExpenseCategory: (state, action: PayloadAction<{ projectId: string; category: string }>) => {
      // Return unchanged state if projects doesn't exist
      if (!Array.isArray(state.projects)) {
        return state;
      }
      
      const { projectId, category } = action.payload;
      const projectIndex = state.projects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1) {
        // Initialize expenseCategories array if it doesn't exist
        if (!Array.isArray(state.projects[projectIndex].expenseCategories)) {
          state.projects[projectIndex].expenseCategories = [];
        }
        
        // Only add if category doesn't already exist
        if (!state.projects[projectIndex].expenseCategories.includes(category)) {
          state.projects[projectIndex].expenseCategories.push(category);
        }
      }
    }
  }
});

export const { 
  addProject, 
  updateProject, 
  deleteProject, 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  addExpenseCategory 
} = projectsSlice.actions;
export default projectsSlice.reducer;