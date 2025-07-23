'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Collapse,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Add,
  Edit,
  Delete,
  Settings,
} from '@mui/icons-material';
import { LevelConfig, LEVEL_PRESETS } from '@/lib/content-presets';

type ContentNode = {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  level: number;
  order: number;
  children: ContentNode[];
  createdAt: Date;
};

interface ContentTreeProps {
  contentTree: ContentNode[];
  levelConfig: LevelConfig;
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
  onCreateNode: (title: string, level: number, parentId?: string) => void;
  onUpdateNode: (nodeId: string, title: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateLevelConfig: (config: LevelConfig) => void;
}

export default function ContentTree({
  contentTree,
  levelConfig,
  selectedNodeId,
  onNodeSelect,
  onCreateNode,
  onUpdateNode,
  onDeleteNode,
  onUpdateLevelConfig,
}: ContentTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [configDialog, setConfigDialog] = useState(false);
  const [tempConfig, setTempConfig] = useState(levelConfig);
  const [addNodeDialog, setAddNodeDialog] = useState(false);
  const [addNodeTitle, setAddNodeTitle] = useState('');
  const [addNodeLevel, setAddNodeLevel] = useState(1);
  const [addNodeParent, setAddNodeParent] = useState<string | null>(null);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expanded);
    if (expanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpanded(newExpanded);
  };

  const startEditing = (node: ContentNode) => {
    setEditingNodeId(node.id);
    setEditingTitle(node.title);
  };

  const handleRename = (nodeId: string) => {
    onUpdateNode(nodeId, editingTitle);
    setEditingNodeId(null);
  };

  const openAddDialog = (parentId?: string, level?: number) => {
    setAddNodeParent(parentId || null);
    setAddNodeLevel(level || 1);
    setAddNodeTitle('');
    setAddNodeDialog(true);
  };

  const handleAddNode = () => {
    onCreateNode(addNodeTitle, addNodeLevel, addNodeParent || undefined);
    setAddNodeDialog(false);
  };

  const handleConfigSave = () => {
    onUpdateLevelConfig(tempConfig);
    setConfigDialog(false);
  };

  const renderNode = (node: ContentNode) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const canHaveChildren = node.level < 3;
    const levelName = levelConfig[`level${node.level}` as keyof LevelConfig];

    return (
      <Box key={node.id} sx={{ mb: 0.5 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1,
            cursor: 'pointer',
            border: 1,
            borderColor: isSelected ? 'primary.main' : 'grey.200',
            bgcolor: isSelected ? 'primary.50' : 'white',
            '&:hover': { 
              bgcolor: isSelected ? 'primary.50' : 'grey.50' 
            }
          }}
          onClick={() => onNodeSelect(node.id)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {hasChildren ? (
              <IconButton 
                size="small" 
                onClick={() => toggleExpanded(node.id)}
                sx={{ p: 0.25 }}
              >
                {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            ) : (
              <Box sx={{ width: 24 }} />
            )}

            {editingNodeId === node.id ? (
              <TextField
                size="small"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => handleRename(node.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleRename(node.id)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                variant="outlined"
                sx={{ flex: 1 }}
              />
            ) : (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: node.level === 1 ? 600 : node.level === 2 ? 500 : 400,
                    fontSize: node.level === 1 ? '0.95rem' : '0.875rem'
                  }}
                >
                  {node.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    bgcolor: 'grey.100', 
                    px: 0.5, 
                    py: 0.25, 
                    borderRadius: 0.5,
                    fontSize: '0.65rem'
                  }}
                >
                  {levelName}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {canHaveChildren && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddDialog(node.id, node.level + 1);
                  }}
                  sx={{ p: 0.25 }}
                >
                  <Add fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(node);
                }}
                sx={{ p: 0.25 }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNode(node.id);
                }}
                sx={{ p: 0.25, color: 'error.main' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box sx={{ ml: 2, mt: 0.5 }}>
            {node.children.map(renderNode)}
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <Box>
      {/* Header with configuration */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Story Structure
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            size="small"
            startIcon={<Add />}
            onClick={() => openAddDialog()}
          >
            Add {levelConfig.level1}
          </Button>
          <IconButton 
            size="small" 
            onClick={() => setConfigDialog(true)}
            title="Configure levels"
          >
            <Settings fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Content tree */}
      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {contentTree.map(renderNode)}
      </Box>

      {/* Add Node Dialog */}
      <Dialog open={addNodeDialog} onClose={() => setAddNodeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New {levelConfig[`level${addNodeLevel}` as keyof LevelConfig]}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={addNodeTitle}
            onChange={(e) => setAddNodeTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddNodeDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddNode} 
            variant="contained"
            disabled={!addNodeTitle.trim()}
          >
            Add {levelConfig[`level${addNodeLevel}` as keyof LevelConfig]}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Level Configuration Dialog */}
      <Dialog open={configDialog} onClose={() => setConfigDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configure Story Structure Levels</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Preset</InputLabel>
            <Select
              value="custom"
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  setTempConfig(LEVEL_PRESETS[e.target.value as keyof typeof LEVEL_PRESETS]);
                }
              }}
            >
              <MenuItem value="custom">Custom</MenuItem>
              {Object.keys(LEVEL_PRESETS).map((preset) => (
                <MenuItem key={preset} value={preset}>
                  {preset}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            label="Level 1 Name"
            fullWidth
            variant="outlined"
            value={tempConfig.level1}
            onChange={(e) => setTempConfig({ ...tempConfig, level1: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Level 2 Name"
            fullWidth
            variant="outlined"
            value={tempConfig.level2}
            onChange={(e) => setTempConfig({ ...tempConfig, level2: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Level 3 Name"
            fullWidth
            variant="outlined"
            value={tempConfig.level3}
            onChange={(e) => setTempConfig({ ...tempConfig, level3: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialog(false)}>Cancel</Button>
          <Button onClick={handleConfigSave} variant="contained">
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}