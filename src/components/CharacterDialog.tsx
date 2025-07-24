'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  Person,
  Psychology,
  Palette,
  Star,
  Close
} from '@mui/icons-material';
import { 
  CHARACTER_ROLES, 
  CHARACTER_ARCHETYPES, 
  APPEARANCE_OPTIONS, 
  PERSONALITY_TRAITS,
  DEFAULT_CHARACTER
} from '@/lib/character-presets';
import type { Character, CharacterData } from '@/types/character';

interface CharacterDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (character: CharacterData) => void;
  editingCharacter?: Character | null;
}

export default function CharacterDialog({ open, onClose, onSave, editingCharacter }: CharacterDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [character, setCharacter] = useState<any>({
    name: '',
    description: '',
    role: 'supporting',
    archetype: '',
    appearance: DEFAULT_CHARACTER.appearance,
    personality: DEFAULT_CHARACTER.personality,
    importanceLevel: 3,
    relationships: {},
    motivation: '',
    goals: '',
    fears: '',
    secrets: '',
    notes: ''
  });

  useEffect(() => {
    if (editingCharacter) {
      setCharacter({
        name: editingCharacter.name || '',
        description: editingCharacter.description || '',
        role: editingCharacter.role || 'supporting',
        archetype: editingCharacter.archetype || '',
        appearance: editingCharacter.appearance || DEFAULT_CHARACTER.appearance,
        personality: editingCharacter.personality || DEFAULT_CHARACTER.personality,
        importanceLevel: editingCharacter.importanceLevel || 3,
        relationships: editingCharacter.relationships || {},
        motivation: editingCharacter.motivation || '',
        goals: editingCharacter.goals || '',
        fears: editingCharacter.fears || '',
        secrets: editingCharacter.secrets || '',
        notes: editingCharacter.notes || ''
      });
    } else {
      setCharacter({
        name: '',
        description: '',
        role: 'supporting',
        archetype: '',
        appearance: DEFAULT_CHARACTER.appearance,
        personality: DEFAULT_CHARACTER.personality,
        importanceLevel: 3,
        relationships: {},
        motivation: '',
        goals: '',
        fears: '',
        secrets: '',
        notes: ''
      });
    }
  }, [editingCharacter, open]);

  const handleSave = () => {
    if (!character.name.trim()) return;
    onSave(character);
    onClose();
  };

  const handleArchetypeSelect = (archetypeValue: string) => {
    const archetype = CHARACTER_ARCHETYPES.find(a => a.value === archetypeValue);
    if (archetype) {
      setCharacter(prev => ({
        ...prev,
        archetype: archetypeValue,
        personality: { ...prev.personality, ...archetype.traits }
      }));
    }
  };

  const selectedArchetype = CHARACTER_ARCHETYPES.find(a => a.value === character.archetype);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '90vh', maxHeight: 800 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            <Typography variant="h6">
              {editingCharacter ? 'Edit Character' : 'Create New Character'}
            </Typography>
          </Box>
          <Button onClick={onClose} size="small">
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label="Basic Info" />
          <Tab icon={<Star />} label="Role & Type" />
          <Tab icon={<Palette />} label="Appearance" />
          <Tab icon={<Psychology />} label="Personality" />
        </Tabs>

        <Box sx={{ p: 3, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          {/* Basic Info Tab */}
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Character Name"
                value={character.name}
                onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                required
                autoFocus
              />
              
              <TextField
                label="Description"
                value={character.description}
                onChange={(e) => setCharacter(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                placeholder="Brief description of your character..."
              />

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Story Importance
                </Typography>
                <Slider
                  value={character.importanceLevel}
                  onChange={(_, value) => setCharacter(prev => ({ ...prev, importanceLevel: value as number }))}
                  min={1}
                  max={5}
                  step={1}
                  marks={[
                    { value: 1, label: 'Minor' },
                    { value: 2, label: 'Supporting' },
                    { value: 3, label: 'Important' },
                    { value: 4, label: 'Major' },
                    { value: 5, label: 'Critical' }
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Age"
                    type="number"
                    value={character.appearance.age}
                    onChange={(e) => setCharacter(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, age: parseInt(e.target.value) || 25 }
                    }))}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Role & Type Tab */}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Character Role</Typography>
                <Grid container spacing={2}>
                  {CHARACTER_ROLES.map((role) => (
                    <Grid item xs={12} sm={6} key={role.value}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: 2,
                          borderColor: character.role === role.value ? `${role.color}.main` : 'transparent',
                          '&:hover': { borderColor: `${role.color}.light` }
                        }}
                        onClick={() => setCharacter(prev => ({ ...prev, role: role.value }))}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h4">{role.icon}</Typography>
                            <Typography variant="h6">{role.label}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {role.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Character Archetype</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select an archetype to automatically set personality traits
                </Typography>
                <Grid container spacing={2}>
                  {CHARACTER_ARCHETYPES.map((archetype) => (
                    <Grid item xs={12} sm={6} md={4} key={archetype.value}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: 2,
                          borderColor: character.archetype === archetype.value ? 'primary.main' : 'transparent',
                          '&:hover': { borderColor: 'primary.light' }
                        }}
                        onClick={() => handleArchetypeSelect(archetype.value)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {archetype.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {archetype.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}

          {/* Appearance Tab */}
          {activeTab === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Height</InputLabel>
                    <Select
                      value={character.appearance.height}
                      onChange={(e) => setCharacter(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, height: e.target.value }
                      }))}
                    >
                      {APPEARANCE_OPTIONS.heights.map((height) => (
                        <MenuItem key={height.value} value={height.value}>
                          {height.emoji} {height.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Build</InputLabel>
                    <Select
                      value={character.appearance.build}
                      onChange={(e) => setCharacter(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, build: e.target.value }
                      }))}
                    >
                      {APPEARANCE_OPTIONS.builds.map((build) => (
                        <MenuItem key={build.value} value={build.value}>
                          {build.emoji} {build.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Hair Color</Typography>
                  <ToggleButtonGroup
                    value={character.appearance.hairColor}
                    exclusive
                    onChange={(_, value) => value && setCharacter(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, hairColor: value }
                    }))}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {APPEARANCE_OPTIONS.hairColors.map((color) => (
                      <ToggleButton key={color.value} value={color.value} size="small">
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: color.color,
                            mr: 1,
                            border: 1,
                            borderColor: 'grey.400'
                          }}
                        />
                        {color.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Eye Color</Typography>
                  <ToggleButtonGroup
                    value={character.appearance.eyeColor}
                    exclusive
                    onChange={(_, value) => value && setCharacter(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, eyeColor: value }
                    }))}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {APPEARANCE_OPTIONS.eyeColors.map((color) => (
                      <ToggleButton key={color.value} value={color.value} size="small">
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: color.color,
                            mr: 1,
                            border: 1,
                            borderColor: 'grey.400'
                          }}
                        />
                        {color.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Personality Tab */}
          {activeTab === 3 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="h6">Personality Traits</Typography>
              {selectedArchetype && (
                <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1, border: 1, borderColor: 'info.200' }}>
                  <Typography variant="body2">
                    <strong>{selectedArchetype.label}</strong>: {selectedArchetype.description}
                  </Typography>
                </Box>
              )}
              
              {PERSONALITY_TRAITS.map((trait) => (
                <Box key={trait.key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body1">{trait.icon}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {trait.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({character.personality[trait.key as keyof typeof character.personality]}/100)
                    </Typography>
                  </Box>
                  <Slider
                    value={character.personality[trait.key as keyof typeof character.personality]}
                    onChange={(_, value) => setCharacter(prev => ({
                      ...prev,
                      personality: { ...prev.personality, [trait.key]: value as number }
                    }))}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      {trait.lowDesc}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {trait.highDesc}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Divider />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Character Depth</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Motivation"
                      value={character.motivation}
                      onChange={(e) => setCharacter(prev => ({ ...prev, motivation: e.target.value }))}
                      placeholder="What drives this character?"
                      multiline
                      rows={2}
                    />
                    <TextField
                      label="Goals"
                      value={character.goals}
                      onChange={(e) => setCharacter(prev => ({ ...prev, goals: e.target.value }))}
                      placeholder="What do they want to achieve?"
                      multiline
                      rows={2}
                    />
                    <TextField
                      label="Fears"
                      value={character.fears}
                      onChange={(e) => setCharacter(prev => ({ ...prev, fears: e.target.value }))}
                      placeholder="What are they afraid of?"
                      multiline
                      rows={2}
                    />
                    <TextField
                      label="Secrets"
                      value={character.secrets}
                      onChange={(e) => setCharacter(prev => ({ ...prev, secrets: e.target.value }))}
                      placeholder="Hidden aspects or backstory"
                      multiline
                      rows={2}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!character.name.trim()}
          startIcon={<Person />}
        >
          {editingCharacter ? 'Update Character' : 'Create Character'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}