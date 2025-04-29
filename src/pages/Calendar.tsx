import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Tooltip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Project, Quotation, Client } from '../types';

const Calendar: React.FC = () => {
  const projects = useSelector((state: RootState) => state.projects.projects);
  const clients = useSelector((state: RootState) => state.quotations.clients);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showProjects, setShowProjects] = useState(true);
  const [showQuotations, setShowQuotations] = useState(true);

  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getProjectsForDate = (date: Date) => {
    if (!projects || !showProjects) return [];
    return projects.filter((project: Project) => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getQuotationsForDate = (date: Date) => {
    if (!clients || !showQuotations) return [];
    
    const quotationsForDate: Array<{quotation: Quotation, client: Client}> = [];
    
    clients.forEach((client: Client) => {
      client.quotations.forEach((quotation: Quotation) => {
        const submittedDate = new Date(quotation.dateSubmitted);
        if (submittedDate.getDate() === date.getDate() && 
            submittedDate.getMonth() === date.getMonth() && 
            submittedDate.getFullYear() === date.getFullYear()) {
          quotationsForDate.push({ quotation, client });
        }
      });
    });
    
    return quotationsForDate;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<Grid size={1.7} key={`empty-${i}`} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const projectsForDate = getProjectsForDate(date);
      const quotationsForDate = getQuotationsForDate(date);

      days.push(
        <Grid size={1.7} key={day}>
          <Paper
            sx={{
              p: 1,
              height: 150,
              overflow: 'auto',
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="subtitle2">{day}</Typography>
            
            {projectsForDate && projectsForDate.length > 0 && projectsForDate.map((project: Project) => (
              <Box key={project.id} sx={{ mb: 0.5 }}>
                <Chip 
                  size="small"
                  label={project.name}
                  sx={{ 
                    backgroundColor: '#9c27b0', 
                    color: 'white',
                    fontSize: '0.7rem',
                    height: 'auto',
                    '& .MuiChip-label': { px: 1, py: 0.5 },
                    width: '100%',
                    justifyContent: 'flex-start'
                  }}
                />
                <Typography variant="caption" display="block" sx={{ pl: 1, fontSize: '0.65rem' }}>
                  {project.location.address}, {project.status}
                </Typography>
              </Box>
            ))}
            
            {quotationsForDate && quotationsForDate.length > 0 && quotationsForDate.map((item) => (
              <Box key={item.quotation.id} sx={{ mb: 0.5 }}>
                <Chip 
                  size="small"
                  label={`Quote #${item.quotation.quoteNumber}`}
                  sx={{ 
                    backgroundColor: '#2196f3', 
                    color: 'white',
                    fontSize: '0.7rem',
                    height: 'auto',
                    '& .MuiChip-label': { px: 1, py: 0.5 },
                    width: '100%',
                    justifyContent: 'flex-start'
                  }}
                />
                <Typography variant="caption" display="block" sx={{ pl: 1, fontSize: '0.65rem' }}>
                  {item.client.name}, {item.quotation.branchLocation}, {item.quotation.status}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      );
    }

    return days;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Calendar
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={goToPreviousMonth} color="primary" aria-label="previous month">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={goToCurrentMonth} color="primary" aria-label="current month">
            <TodayIcon />
          </IconButton>
          <IconButton onClick={goToNextMonth} color="primary" aria-label="next month">
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={showProjects}
                onChange={(e) => setShowProjects(e.target.checked)}
                sx={{ '&.Mui-checked': { color: '#9c27b0' } }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Projects</Typography>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: '#9c27b0', 
                    ml: 1 
                  }} 
                />
              </Box>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showQuotations}
                onChange={(e) => setShowQuotations(e.target.checked)}
                sx={{ '&.Mui-checked': { color: '#2196f3' } }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Quotations</Typography>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: '#2196f3', 
                    ml: 1 
                  }} 
                />
              </Box>
            }
          />
        </FormGroup>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Projects appear on all days between their start and end dates">
            <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
              Note: Projects span their full date range
            </Typography>
          </Tooltip>
        </Box>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{
          backgroundColor: 'background.default',
          p: 2,
          borderRadius: 1,
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <Grid size={1.7} key={day}>
            <Typography
              variant="subtitle1"
              align="center"
              sx={{ fontWeight: 'bold' }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
        {renderCalendar()}
      </Grid>
    </Box>
  );
};

export default Calendar;