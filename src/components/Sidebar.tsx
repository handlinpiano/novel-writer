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
  Delete,
  Person,
  Note,
  Bookmark,
  LocationOn,
  FolderOpen,
  AccountTree,
} from '@mui/icons-material';
import CharacterDialog from './CharacterDialog';
import { CHARACTER_ROLES } from '@/lib/character-presets';
import ContentTree from './ContentTree';
import { LevelConfig } from '@/lib/content-presets';
import type { Project, ContentNode } from '@/types/project';
import type { Character, CharacterData } from '@/types/character';

interface SidebarProps {
  projects: Project[];
  currentProject: Project;
  contentTree: ContentNode[];
  characters: Character[];
  selectedNodeId: string | null;
  onProjectSelect: (projectId: string) => void;
  onNewProject: (title: string, description?: string) => void;
  onNodeSelect: (nodeId: string) => void;
  onCreateNode: (title: string, level: number, parentId?: string) => void;
  onUpdateNode: (nodeId: string, title: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateLevelConfig: (config: LevelConfig) => void;
  onCreateCharacter: (characterData: CharacterData) => void;
  onUpdateCharacter: (characterId: string, characterData: CharacterData) => void;
  onDeleteCharacter: (characterId: string) => void;
}

export default function Sidebar({
  projects,
  currentProject,
  contentTree,
  characters,
  selectedNodeId,
  onProjectSelect,
  onNewProject,
  onNodeSelect,
  onCreateNode,
  onUpdateNode,
  onDeleteNode,
  onUpdateLevelConfig,
  onCreateCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
}: SidebarProps) {
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['structure']);
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [characterDialog, setCharacterDialog] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  const handlePanelChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanels(prev => 
      isExpanded 
        ? [...prev, panel]
        : prev.filter(p => p !== panel)
    );
  };

  const handleCreateProject = () => {
    onNewProject(newProjectTitle, newProjectDescription);
    setNewProjectDialog(false);
    setNewProjectTitle('');
    setNewProjectDescription('');
  };

  const openCreateCharacterDialog = () => {
    setEditingCharacter(null);
    setCharacterDialog(true);
  };

  const openEditCharacterDialog = (character: Character) => {
    setEditingCharacter(character);
    setCharacterDialog(true);
  };

  const handleSaveCharacter = (characterData: CharacterData) => {
    if (editingCharacter) {
      onUpdateCharacter(editingCharacter.id, characterData);
    } else {
      onCreateCharacter(characterData);
    }
    setCharacterDialog(false);
    setEditingCharacter(null);
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
            <Typography sx={{ fontWeight: 500 }}>Characters ({characters.length})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            {characters.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No characters yet
                </Typography>
                <Button 
                  startIcon={<Add />} 
                  size="small" 
                  variant="outlined"
                  onClick={openCreateCharacterDialog}
                >
                  Add First Character
                </Button>
              </Box>
            ) : (
              <>
                <List dense>
                  {characters.map((character) => {
                    const role = CHARACTER_ROLES.find(r => r.value === character.role);
                    return (
                      <ListItem 
                        key={character.id}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'grey.100' },
                          borderRadius: 1,
                          mb: 0.5
                        }}
                        onClick={() => openEditCharacterDialog(character)}
                      >
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {character.name}
                              </Typography>
                              {role && (
                                <Chip 
                                  label={role.icon + ' ' + role.label}
                                  size="small"
                                  color={role.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'}
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          }
                          secondary={character.description || character.archetype || 'Click to edit'}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteCharacter(character.id);
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
                <Button 
                  startIcon={<Add />} 
                  size="small" 
                  sx={{ mt: 1 }}
                  onClick={openCreateCharacterDialog}
                >
                  Add Character
                </Button>
              </>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Story Structure */}
        <Accordion 
          expanded={expandedPanels.includes('structure')} 
          onChange={handlePanelChange('structure')}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <AccountTree sx={{ mr: 1, color: 'success.main' }} />
            <Typography sx={{ fontWeight: 500 }}>Story Structure</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1 }}>
            <ContentTree
              contentTree={contentTree}
              levelConfig={currentProject.levelConfig || { level1: 'Chapter', level2: 'Section', level3: 'Beat' }}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
              onCreateNode={onCreateNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              onUpdateLevelConfig={onUpdateLevelConfig}
            />
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

      {/* Character Dialog */}
      <CharacterDialog
        open={characterDialog}
        onClose={() => {
          setCharacterDialog(false);
          setEditingCharacter(null);
        }}
        onSave={handleSaveCharacter}
        editingCharacter={editingCharacter}
      />
    </Box>
  );
}