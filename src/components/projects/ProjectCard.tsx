import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Collapse,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoneyIcon from '@mui/icons-material/Money';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'info';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'on-hold':
        return 'error';
      default:
        return 'default';
    }
  };

  // Calculate total expenses
  const totalExpenses = project.expenses
    ? project.expenses.reduce((sum, expense) => sum + expense.amount, 0)
    : 0;

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            {project.name}
          </Typography>
          <IconButton size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Box>

        <Typography color="textSecondary" gutterBottom>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">{project.location.address}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={project.status}
            size="small"
            color={getStatusColor(project.status)}
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" component="span">
            Budget: R{project.budget.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" gutterBottom>
            Progress: {project.progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="body2" color="textSecondary">
          Manager: {project.manager}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            cursor: 'pointer',
          }}
          onClick={toggleExpanded}
        >
          <MoneyIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" component="span">
            Expenses: R{totalExpenses.toLocaleString()} of R{project.budget.toLocaleString()} (
            {project.budget > 0
              ? Math.round((totalExpenses / project.budget) * 100)
              : 0}
            %)
          </Typography>
          <IconButton size="small" sx={{ ml: 'auto' }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>
            Expense Details
          </Typography>

          {project.expenses && project.expenses.length > 0 ? (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {project.expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell align="right">
                        R{expense.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <strong>Total:</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>R{totalExpenses.toLocaleString()}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              No expenses recorded yet.
            </Typography>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;