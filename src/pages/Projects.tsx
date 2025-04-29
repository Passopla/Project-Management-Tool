import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useDispatch, useSelector } from 'react-redux';
import { Project } from '../types';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import { RootState } from '../store';
import { addProject, updateProject } from '../store/projectsSlice';

const Projects: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.projects);

  const handleAddProject = (project: Project) => {
    dispatch(addProject(project));
    setOpen(false);
  };
  
  const handleEditProject = (project: Project) => {
    dispatch(updateProject(project));
    setOpen(false);
    setEditingProject(null);
  };
  
  const handleOpenProjectForm = (project?: Project) => {
    if (project) {
      setEditingProject(project);
    } else {
      setEditingProject(null);
    }
    setOpen(true);
  };

  // Function to get status color
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

  // Calculate total expenses for a project
  const calculateTotalExpenses = (project: Project) => {
    if (!project.expenses) return 0;
    return project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const handleViewChange = (_event: React.SyntheticEvent, newValue: 'card' | 'table') => {
    setViewMode(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenProjectForm()}
        >
          Add Project
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={viewMode}
          onChange={handleViewChange}
          aria-label="project view mode"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<ViewModuleIcon />} 
            iconPosition="start" 
            label="Card View" 
            value="card" 
          />
          <Tab 
            icon={<ViewListIcon />} 
            iconPosition="start" 
            label="Table View" 
            value="table" 
          />
        </Tabs>
      </Box>

      {viewMode === 'card' ? (
        <Grid container spacing={3}>
          {projects && projects.length > 0 ? (
            projects.map((project: Project) => (
              <Grid size={4} key={project.id}>
                <ProjectCard project={project} onEdit={() => handleOpenProjectForm(project)} />
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Typography variant="body1" sx={{ p: 2 }}>
                No projects found. Click "Add Project" to create one.
              </Typography>
            </Grid>
          )}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="projects table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timeline</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Expenses</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project: Project) => {
                  const totalExpenses = calculateTotalExpenses(project);
                  return (
                    <TableRow key={project.id}>
                      <TableCell component="th" scope="row">
                        {project.name}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={project.status} 
                          size="small" 
                          color={getStatusColor(project.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant="determinate" value={project.progress} sx={{ height: 8, borderRadius: 4 }} />
                          </Box>
                          <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${Math.round(project.progress)}%`}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>R{project.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        R{totalExpenses.toLocaleString()} 
                        ({project.budget > 0 ? Math.round((totalExpenses / project.budget) * 100) : 0}%)
                      </TableCell>
                      <TableCell>{project.manager}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleOpenProjectForm(project)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No projects found. Click "Add Project" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <DialogContent>
          <ProjectForm 
            onSubmit={editingProject ? handleEditProject : handleAddProject} 
            onCancel={() => {
              setOpen(false);
              setEditingProject(null);
            }} 
            project={editingProject || undefined}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Projects;