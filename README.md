# Contractor's Project Management Application

![Project Management Tool](https://img.shields.io/badge/Project%20Management%20Tool-blue)
![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue)
![Redux](https://img.shields.io/badge/Redux-4.x-purple)
![Material UI](https://img.shields.io/badge/Material%20UI-5.x-blue)

A comprehensive project management application designed for constractors and service companies, featuring project tracking, quotation management, callout service management, and expense tracking.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Application Structure](#application-structure)
- [User Guide](#user-guide)
- [Development](#development)
- [License](#license)

## ✨ Features

### Dashboard
- Overview of active projects and key metrics
- Visual representation of project progress
- Quick access to important information

### Projects Management
- Create, edit, and track construction projects
- Monitor project progress, budget, and expenses
- View projects in both card and table formats
- Track expenses with categorization

### Calendar
- Visual timeline of all projects
- Schedule management and overview
- Event tracking and organization

### Quotations
- Manage client quotations
- Track quotation status (Approved, Pending, Rejected, etc.)
- Export quotations to Excel spreadsheets
- Add and manage clients

### Callouts
- Track service callouts with detailed information
- Manage customer service requests
- Track expenses related to service calls
- Export callout data to Excel

### Team Management
- Assign team members to projects
- Track team member responsibilities

### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **UI Framework**: Material UI 5
- **Routing**: React Router 6
- **Data Export**: XLSX for Excel exports
- **Styling**: CSS-in-JS with Material UI's styling solution
- **Storage**: Local storage for theme preferences and Redux Persist for application state

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/project-management-tool.git
   cd project-management-tool
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 📁 Application Structure

```
src/
├── components/       # Reusable UI components
│   ├── layout/       # Layout components (Header, Sidebar, etc.)
│   ├── projects/     # Project-related components
│   └── ...           # Other component categories
├── contexts/         # React contexts (Theme context, etc.)
├── pages/            # Page components for each route
├── store/            # Redux store configuration and slices
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## 📘 User Guide

### Dashboard

The dashboard provides an overview of your projects and important metrics. It's the first screen you see when you log in.

### Projects

1. **Viewing Projects**:
   - Toggle between card and table views using the tab buttons
   - Card view shows a summary of each project
   - Table view provides detailed information in a tabular format

2. **Creating a Project**:
   - Click the "Add Project" button
   - Fill in the project details (name, description, dates, etc.)
   - Add expenses if needed
   - Click "Create Project" to save

3. **Managing Expenses**:
   - In the project form, scroll down to the Expense Tracking section
   - Add expense categories as needed
   - Add individual expenses with dates, categories, and amounts
   - Edit or delete expenses as required

### Quotations

1. **Managing Clients**:
   - Click "Add Client" to create a new client
   - Expand a client's section to view their quotations

2. **Adding Quotations**:
   - Expand a client's section
   - Click "Add New Quotation"
   - Fill in the quotation details
   - Click "Add Quotation" to save

3. **Exporting Data**:
   - Click the download icon next to a client's name
   - An Excel file will be generated and downloaded

### Callouts

1. **Managing Customers**:
   - Click "Add Customer" to create a new customer
   - Expand a customer's section to view their callouts

2. **Adding Callouts**:
   - Expand a customer's section
   - Click "Add New Callout"
   - Fill in the callout details including expenses
   - Click "Add Callout" to save

3. **Tracking Expenses**:
   - In the callout form, scroll down to the Expense Tracking section
   - Add expense categories as needed
   - Add individual expenses with dates, categories, and amounts

4. **Exporting Data**:
   - Click the download icon next to a customer's name
   - An Excel file will be generated and downloaded

### Theme Switching

- Click the sun/moon icon in the top-right corner to toggle between light and dark modes
- Your preference will be saved and remembered for future sessions

## 💻 Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

### Adding New Features

1. Create necessary components in the appropriate directories
2. Add Redux slices for state management if needed
3. Update types in the types directory
4. Add routing in App.tsx if creating new pages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the Amanzi Connexions Team
