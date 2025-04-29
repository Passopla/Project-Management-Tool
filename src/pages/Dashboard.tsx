import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Project } from '../types';

const Dashboard: React.FC = () => {
  const projects = useSelector((state: RootState) => state.projects.projects);

  const totalProjects = projects ? projects.length : 0;
  const completedProjects = projects ? projects.filter((p: Project) => p.status === 'completed').length : 0;
  const inProgressProjects = projects ? projects.filter((p: Project) => p.status === 'in-progress').length : 0;
  const totalBudget = projects ? projects.reduce((sum: number, p: Project) => sum + p.budget, 0) : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 200px', minWidth: 250, maxWidth: 350, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h4">{totalProjects}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 250, maxWidth: 350, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Projects
              </Typography>
              <Typography variant="h4">{completedProjects}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 250, maxWidth: 350, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4">{inProgressProjects}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 200px', minWidth: 250, maxWidth: 350, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Budget
              </Typography>
              <Typography variant="h4">
                R{totalBudget.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: '100%', mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Progress Overview
              </Typography>
              {projects && projects.length > 0 ? (
                projects.map((project: Project) => (
                  <Box key={project.id} sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      {project.name} ({project.progress}%)
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2">No projects available</Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;