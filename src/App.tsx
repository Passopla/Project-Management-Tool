import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';
import Quotations from './pages/Quotations';
import Callouts from './pages/Callouts';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';

// Wrap the app with our custom ThemeProvider
const AppWithTheme: React.FC = () => {
  const { mode } = useThemeContext();
  
  // Create a theme based on the current mode
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#2196f3',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#fff' : '#1e1e1e',
      },
    },
  });
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline /> {/* This normalizes styles and applies the theme's background */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/callouts" element={<Callouts />} />
          </Routes>
        </Layout>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AppWithTheme />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}


export default App;
