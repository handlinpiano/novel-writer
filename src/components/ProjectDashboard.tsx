'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActionArea,
  Button, 
  Grid, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab
} from '@mui/material';
import { 
  Edit, 
  Add, 
  AutoStories, 
  Schedule,
  Description 
} from '@mui/icons-material';
import Link from 'next/link';
import { createProject } from '@/app/actions/chapters';
import { useRouter } from 'next/navigation';

type Project = {
  id: string;
  title: string;
  description: string | null;
  levelConfig: any;
  createdAt: Date;
  updatedAt: Date;
};

interface ProjectDashboardProps {
  projects: Project[];
}

export default function ProjectDashboard({ projects }: ProjectDashboardProps) {
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const router = useRouter();

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) return;
    
    await createProject(newProjectTitle, newProjectDescription || undefined);
    setNewProjectDialog(false);
    setNewProjectTitle('');
    setNewProjectDescription('');
    router.refresh();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            📚 Your Writing Projects
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Choose a project to continue writing, or create a new one
          </Typography>
        </Box>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'grey.300',
            borderRadius: 2
          }}>
            <AutoStories sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              No projects yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create your first writing project to get started
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setNewProjectDialog(true)}
            >
              Create Your First Project
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea 
                    component={Link}
                    href="/write"
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <CardContent sx={{ flex: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <AutoStories sx={{ color: 'primary.main', mt: 0.5 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {project.title}
                          </Typography>
                          {project.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {project.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<Schedule />}
                          label={`Created ${formatDate(project.createdAt)}`}
                          size="small"
                          variant="outlined"
                        />
                        {project.levelConfig && (
                          <Chip 
                            icon={<Description />}
                            label={`${project.levelConfig.level1}s`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mt: 2,
                        py: 1,
                        bgcolor: 'primary.50',
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'primary.200'
                      }}>
                        <Edit sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Click to open project
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        {projects.length > 0 && (
          <Fab
            color="primary"
            sx={{ position: 'fixed', bottom: 24, right: 24 }}
            onClick={() => setNewProjectDialog(true)}
          >
            <Add />
          </Fab>
        )}

        {/* New Project Dialog */}
        <Dialog 
          open={newProjectDialog} 
          onClose={() => setNewProjectDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Project</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Project Title"
              fullWidth
              variant="outlined"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description (optional)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewProjectDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject}
              variant="contained"
              disabled={!newProjectTitle.trim()}
            >
              Create Project
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}