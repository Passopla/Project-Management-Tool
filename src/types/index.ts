export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  startDate: string;
  endDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  budget: number;
  manager: string;
  team: string[];
  expenses: ExpenseItem[];
  expenseCategories: string[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface Client {
  id: string;
  name: string;
  quotations: Quotation[];
}

export type RobonDivision = 'Electrical' | 'Solar PV' | 'Generators' | 'Air Conditioning';
export type QuotationStatus = 'Approved' | 'Pending' | 'Rejected' | 'Cancelled' | 'Onhold';
export type CalloutStatus = 'In Progress' | 'Pending' | 'Complete' | 'Cancelled' | 'On Hold';

export interface Quotation {
  id: string;
  clientId: string;
  dateSubmitted: string;
  quoteNumber: string;
  branchLocation: string;
  division: RobonDivision;
  excludingVAT: number;
  status: QuotationStatus;
  clientRep: string;
}

export interface CustomerWithCallouts {
  id: string;
  name: string;
  callouts: Callout[];
}

export interface Callout {
  id: string;
  customerId: string;
  dateReceived: string;
  completeDate: string;
  location: string;
  invoiceDate: string;
  jobNo: string;
  contactPerson: string;
  totalExcVAT: number;
  amount: number;
  status: CalloutStatus;
  request: string;
  technicians: string[];
  expenses: ExpenseItem[];
  expenseCategories: string[];
}