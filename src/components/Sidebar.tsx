'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  TextField,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  Person,
  MenuBook,
  Note,
  Bookmark,
  LocationOn,
  FolderOpen,
} from '@mui/icons-material';

type Chapter = {
  id: string;
  projectId: string;
  title: string;
  order: number;
  createdAt: Date;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface SidebarProps {
  projects: Project[];
  currentProject: Project;
  chapters: Chapter[];
  selectedChapterId: string | null;
  onProjectSelect: (projectId: string) => void;
  onNewProject: (title: string, description?: string) => void;
  onChapterSelect: (chapterId: string) => void;
  onNewChapter: () => void;
  onRenameChapter: (chapterId: string, newTitle: string) => void;
  onDeleteChapter: (chapterId: string) => void;
}

export default function Sidebar({
  projects,
  currentProject,
  chapters,
  selectedChapterId,
  onProjectSelect,
  onNewProject,
  onChapterSelect,
  onNewChapter,
  onRenameChapter,
  onDeleteChapter,
}: SidebarProps) {
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['chapters']);
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handlePanelChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanels(prev => 
      isExpanded 
        ? [...prev, panel]
        : prev.filter(p => p !== panel)
    );
  };

  const startEditing = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditingTitle(chapter.title);
  };

  const handleRename = (chapterId: string) => {
    onRenameChapter(chapterId, editingTitle);
    setEditingChapterId(null);
  };

  const handleCreateProject = () => {
    onNewProject(newProjectTitle, newProjectDescription);
    setNewProjectDialog(false);
    setNewProjectTitle('');
    setNewProjectDescription('');
  };

  return (
    <Box sx={{ width: 320, height: '100vh', bgcolor: 'grey.50', borderRight: 1, borderColor: 'divider' }}>
      {/* Project Selector */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <FolderOpen sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'grey.700' }}>
            Project
          </Typography>
          <Button
            size="small"
            startIcon={<Add />}
            onClick={() => setNewProjectDialog(true)}
            sx={{ ml: 'auto', minWidth: 'auto', px: 1 }}
          >
            New
          </Button>
        </Box>
        
        <FormControl fullWidth size="small">
          <Select
            value={currentProject.id}
            onChange={(e) => onProjectSelect(e.target.value)}
            sx={{ bgcolor: 'white' }}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {project.title}
                  </Typography>
                  {project.description && (
                    <Typography variant="caption" color="text.secondary">
                      {project.description}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* New Project Dialog */}
      <Dialog open={newProjectDialog} onClose={() => setNewProjectDialog(false)} maxWidth="sm" fullWidth>
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
          <Button onClick={() => setNewProjectDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateProject} 
            variant="contained"
            disabled={!newProjectTitle.trim()}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Accordions */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {/* Characters */}
        <Accordion 
          expanded={expandedPanels.includes('characters')} 
          onChange={handlePanelChange('characters')}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Person sx={{ mr: 1, color: 'primary.main' }} />
            <Typography sx={{ fontWeight: 500 }}>Characters</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Emma" 
                  secondary="12-year-old protagonist, curious and brave"
                />
                <ListItemSecondaryAction>
                  <Chip label="Main" size="small" color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Mr. Thompson" 
                  secondary="Emma's father, protective but supportive"
                />
                <ListItemSecondaryAction>
                  <Chip label="Main" size="small" color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Old Man Jenkins" 
                  secondary="Mysterious neighbor with secrets"
                />
                <ListItemSecondaryAction>
                  <Chip label="Supporting" size="small" color="secondary" />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <Button startIcon={<Add />} size="small" sx={{ mt: 1 }}>
              Add Character
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* Chapters */}
        <Accordion 
          expanded={expandedPanels.includes('chapters')} 
          onChange={handlePanelChange('chapters')}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <MenuBook sx={{ mr: 1, color: 'success.main' }} />
            <Typography sx={{ fontWeight: 500 }}>Chapters</Typography>
            <Button
              startIcon={<Add />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onNewChapter();
              }}
              sx={{ ml: 'auto', mr: 1 }}
            >
              Add
            </Button>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
              {chapters.map((chapter) => (
                <Paper
                  key={chapter.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    cursor: 'pointer',
                    border: 1,
                    borderColor: selectedChapterId === chapter.id ? 'primary.main' : 'grey.200',
                    bgcolor: selectedChapterId === chapter.id ? 'primary.50' : 'white',
                    '&:hover': { bgcolor: selectedChapterId === chapter.id ? 'primary.50' : 'grey.50' }
                  }}
                  onClick={() => onChapterSelect(chapter.id)}
                >
                  {editingChapterId === chapter.id ? (
                    <TextField
                      size="small"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleRename(chapter.id)}
                      onKeyPress={(e) => e.key === 'Enter' && handleRename(chapter.id)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      fullWidth
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {chapter.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(chapter);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        {chapters.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteChapter(chapter.id);
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Settings (Places) */}
        <Accordion 
          expanded={expandedPanels.includes('settings')} 
          onChange={handlePanelChange('settings')}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <LocationOn sx={{ mr: 1, color: 'success.main' }} />
            <Typography sx={{ fontWeight: 500 }}>Settings</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Maple Street" 
                  secondary="Emma's quiet suburban neighborhood"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="The Old Oak Tree" 
                  secondary="Secret hideout in the backyard"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Riverside Park" 
                  secondary="Where adventures begin"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Jenkins' House" 
                  secondary="Mysterious Victorian home next door"
                />
              </ListItem>
            </List>
            <Button startIcon={<Add />} size="small" sx={{ mt: 1 }}>
              Add Setting
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* Snippets */}
        <Accordion 
          expanded={expandedPanels.includes('snippets')} 
          onChange={handlePanelChange('snippets')}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Bookmark sx={{ mr: 1, color: 'warning.main' }} />
            <Typography sx={{ fontWeight: 500 }}>Snippets</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Emma's description" 
                  secondary="Her bright eyes sparkled with curiosity..."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="The creaking sound" 
                  secondary="A haunting creak echoed from upstairs..."
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Dad's worried expression" 
                  secondary="His brow furrowed as he watched..."
                />
              </ListItem>
            </List>
            <Button startIcon={<Add />} size="small" sx={{ mt: 1 }}>
              Add Snippet
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* Comments/Notes */}
        <Accordion 
          expanded={expandedPanels.includes('notes')} 
          onChange={handlePanelChange('notes')}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Note sx={{ mr: 1, color: 'info.main' }} />
            <Typography sx={{ fontWeight: 500 }}>Comments & Notes</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Dad's note" 
                  secondary="Maybe add more dialogue here? -Dad"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Daughter's idea" 
                  secondary="What if Emma has a pet that helps? -Daughter"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Plot reminder" 
                  secondary="Don't forget the mysterious key subplot"
                />
              </ListItem>
            </List>
            <Button startIcon={<Add />} size="small" sx={{ mt: 1 }}>
              Add Note
            </Button>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}