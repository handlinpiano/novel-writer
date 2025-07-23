'use client';

import { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography, Paper, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { SmartToy, ExpandMore } from '@mui/icons-material';
import { createChapter, updateChapterTitle, deleteChapter, saveRevision, createProject, getProjects, getChapters } from '@/app/actions/chapters';
import { getContentTree, createContentNode, updateContentNode, deleteContentNode, saveNodeRevision, updateProjectLevelConfig, updateNodeNotes } from '@/app/actions/content';
import { getCharacters, createCharacter, updateCharacter, deleteCharacter } from '@/app/actions/characters';
import { LevelConfig } from '@/lib/content-presets';
import { Editor } from '@/components/Editor';
import Sidebar from '@/components/Sidebar';

type Project = {
  id: string;
  title: string;
  description: string | null;
  levelConfig: LevelConfig;
  createdAt: Date;
  updatedAt: Date;
};

type Chapter = {
  id: string;
  projectId: string;
  title: string;
  order: number;
  createdAt: Date;
};

type ContentNode = {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  level: number;
  order: number;
  headNotes: string | null;
  footNotes: string | null;
  children: ContentNode[];
  createdAt: Date;
};

type Character = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Author = 'Dad' | 'Daughter';

interface WritePageClientProps {
  initialProjects: Project[];
  initialProject: Project;
  initialContentTree: ContentNode[];
  initialCharacters: Character[];
}

export default function WritePageClient({ initialProjects, initialProject, initialContentTree, initialCharacters }: WritePageClientProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [currentProject, setCurrentProject] = useState(initialProject);
  const [contentTree, setContentTree] = useState(initialContentTree);
  const [characters, setCharacters] = useState(initialCharacters);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [currentAuthor, setCurrentAuthor] = useState<Author>('Dad');
  const [headNotesExpanded, setHeadNotesExpanded] = useState(false);
  const [footNotesExpanded, setFootNotesExpanded] = useState(false);

  const findNodeById = (nodes: ContentNode[], id: string): ContentNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
    return null;
  };

  const selectedNode = selectedNodeId ? findNodeById(contentTree, selectedNodeId) : null;

  // Helper function to calculate structure summary
  const getStructureSummary = (node: ContentNode) => {
    const countDescendants = (nodes: ContentNode[]): { total: number, byLevel: Record<number, number> } => {
      let total = 0;
      const byLevel: Record<number, number> = {};
      
      nodes.forEach(child => {
        total += 1;
        byLevel[child.level] = (byLevel[child.level] || 0) + 1;
        const childCounts = countDescendants(child.children);
        total += childCounts.total;
        Object.keys(childCounts.byLevel).forEach(level => {
          const levelNum = parseInt(level);
          byLevel[levelNum] = (byLevel[levelNum] || 0) + childCounts.byLevel[levelNum];
        });
      });
      
      return { total, byLevel };
    };

    return countDescendants(node.children);
  };

  const handleProjectSelect = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    setCurrentProject(project);
    const projectContentTree = await getContentTree(projectId);
    const projectCharacters = await getCharacters(projectId);
    setContentTree(projectContentTree);
    setCharacters(projectCharacters);
    setSelectedNodeId(null);
  };

  const handleNewProject = async (title: string, description?: string) => {
    const newProject = await createProject(title, description);
    const updatedProjects = await getProjects();
    setProjects(updatedProjects);
    setCurrentProject(newProject);
    
    const projectContentTree = await getContentTree(newProject.id);
    const projectCharacters = await getCharacters(newProject.id);
    setContentTree(projectContentTree);
    setCharacters(projectCharacters);
    setSelectedNodeId(null);
  };

  const handleCreateNode = async (title: string, level: number, parentId?: string) => {
    await createContentNode(currentProject.id, title, level, parentId);
    const updatedTree = await getContentTree(currentProject.id);
    setContentTree(updatedTree);
  };

  const handleUpdateNode = async (nodeId: string, title: string) => {
    await updateContentNode(nodeId, title);
    const updatedTree = await getContentTree(currentProject.id);
    setContentTree(updatedTree);
  };

  const handleDeleteNode = async (nodeId: string) => {
    await deleteContentNode(nodeId);
    const updatedTree = await getContentTree(currentProject.id);
    setContentTree(updatedTree);
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const handleUpdateLevelConfig = async (config: LevelConfig) => {
    await updateProjectLevelConfig(currentProject.id, config);
    setCurrentProject({ ...currentProject, levelConfig: config });
  };

  const handleSaveContent = async (content: string) => {
    if (!selectedNodeId) return;
    await saveNodeRevision(selectedNodeId, content, currentAuthor);
  };

  const handleSaveHeadNotes = async (headNotes: string) => {
    if (!selectedNodeId) return;
    await updateNodeNotes(selectedNodeId, headNotes, undefined);
    // Update local state
    setContentTree(await getContentTree(currentProject.id));
  };

  const handleSaveFootNotes = async (footNotes: string) => {
    if (!selectedNodeId) return;
    await updateNodeNotes(selectedNodeId, undefined, footNotes);
    // Update local state
    setContentTree(await getContentTree(currentProject.id));
  };

  const handleCreateCharacter = async (characterData: any) => {
    await createCharacter(currentProject.id, characterData);
    const updatedCharacters = await getCharacters(currentProject.id);
    setCharacters(updatedCharacters);
  };

  const handleUpdateCharacter = async (characterId: string, characterData: any) => {
    await updateCharacter(characterId, characterData);
    const updatedCharacters = await getCharacters(currentProject.id);
    setCharacters(updatedCharacters);
  };

  const handleDeleteCharacter = async (characterId: string) => {
    await deleteCharacter(characterId);
    const updatedCharacters = await getCharacters(currentProject.id);
    setCharacters(updatedCharacters);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Left Sidebar */}
      <Sidebar
        projects={projects}
        currentProject={currentProject}
        contentTree={contentTree}
        characters={characters}
        selectedNodeId={selectedNodeId}
        onProjectSelect={handleProjectSelect}
        onNewProject={handleNewProject}
        onNodeSelect={setSelectedNodeId}
        onCreateNode={handleCreateNode}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
        onUpdateLevelConfig={handleUpdateLevelConfig}
        onCreateCharacter={handleCreateCharacter}
        onUpdateCharacter={handleUpdateCharacter}
        onDeleteCharacter={handleDeleteCharacter}
      />

      {/* Center - Editor */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Editor Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'grey.900' }}>
              {selectedNode ? selectedNode.title : 'Select Content to Edit'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentProject.title} 
              {selectedNode && currentProject.levelConfig && ` • ${currentProject.levelConfig[`level${selectedNode.level}` as keyof LevelConfig]}`}
            </Typography>
            
            {/* Author Toggle */}
            <ToggleButtonGroup
              value={currentAuthor}
              exclusive
              onChange={(_, newAuthor) => newAuthor && setCurrentAuthor(newAuthor)}
              size="small"
            >
              <ToggleButton value="Dad">Dad</ToggleButton>
              <ToggleButton value="Daughter">Daughter</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Writing as: <strong>{currentAuthor}</strong>
          </Typography>
        </Paper>

        {/* Editor Content */}
        <Box sx={{ flex: 1, p: 3 }}>
          {selectedNode ? (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Content Header */}
              <Box sx={{ mb: 2, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900' }}>
                  {selectedNode.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentProject.levelConfig?.[`level${selectedNode.level}` as keyof LevelConfig] || `Level ${selectedNode.level}`}
                </Typography>
              </Box>

              {/* Head Notes Accordion */}
              <Accordion 
                expanded={headNotesExpanded} 
                onChange={(_, isExpanded) => setHeadNotesExpanded(isExpanded)}
                sx={{ mb: 3 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main' }}>
                    📝 Head Notes
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Editor 
                    key={`head-${selectedNodeId}`}
                    content={selectedNode.headNotes || ''}
                    placeholder={`Planning notes, setup, character notes for ${selectedNode.title}...`}
                    author={currentAuthor}
                    onChange={handleSaveHeadNotes}
                  />
                </AccordionDetails>
              </Accordion>

              {/* Main Content */}
              {selectedNode.level === 3 ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'success.main' }}>
                    ✍️ Main Content
                  </Typography>
                  <Paper sx={{ border: 1, borderColor: 'success.100' }}>
                    <Editor 
                      key={`main-${selectedNodeId}`}
                      placeholder={`Start writing ${selectedNode.title}, ${currentAuthor}...`}
                      author={currentAuthor}
                      onChange={handleSaveContent}
                    />
                  </Paper>
                </Box>
              ) : (
                /* Level 1 & 2: Structure summary area */
                <Box sx={{ flex: 1 }}>
                  <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      📊 Structure Summary
                    </Typography>
                    {(() => {
                      const summary = getStructureSummary(selectedNode);
                      const levelName = currentProject.levelConfig?.[`level${selectedNode.level}` as keyof LevelConfig]?.toLowerCase() || 'section';
                      
                      return (
                        <Box>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                            This {levelName} contains{' '}
                            <Typography component="span" sx={{ fontWeight: 600 }}>
                              {selectedNode.children?.length || 0}
                            </Typography>
                            {' '}direct sub-sections
                            {summary.total > 0 && (
                              <>
                                {' '}with{' '}
                                <Typography component="span" sx={{ fontWeight: 600 }}>
                                  {summary.total}
                                </Typography>
                                {' '}total items underneath.
                              </>
                            )}
                          </Typography>
                          
                          {Object.keys(summary.byLevel).length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              {Object.entries(summary.byLevel).map(([level, count]) => {
                                const levelNum = parseInt(level);
                                const levelLabel = currentProject.levelConfig?.[`level${levelNum}` as keyof LevelConfig] || `Level ${levelNum}`;
                                return (
                                  <Typography key={level} variant="caption" color="text.primary" sx={{ display: 'block', opacity: 0.8 }}>
                                    • {count} {levelLabel}{count !== 1 ? 's' : ''}
                                  </Typography>
                                );
                              })}
                            </Box>
                          )}
                        </Box>
                      );
                    })()}
                  </Paper>

                  {/* Show children summary */}
                  {selectedNode.children && selectedNode.children.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: 'text.primary' }}>
                        Contains:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedNode.children.map(child => (
                          <Paper 
                            key={child.id} 
                            sx={{ 
                              p: 1.5, 
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                            onClick={() => setSelectedNodeId(child.id)}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {child.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {currentProject.levelConfig?.[`level${child.level}` as keyof LevelConfig]}
                            </Typography>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {selectedNode.children?.length === 0 && (
                    <Paper sx={{ p: 3, bgcolor: 'info.50', border: 1, borderColor: 'info.200' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        This {currentProject.levelConfig?.[`level${selectedNode.level}` as keyof LevelConfig]?.toLowerCase()} is empty. 
                        Add sub-sections using the + button in the sidebar to get started.
                      </Typography>
                    </Paper>
                  )}
                </Box>
              )}

              {/* Foot Notes Accordion */}
              <Accordion 
                expanded={footNotesExpanded} 
                onChange={(_, isExpanded) => setFootNotesExpanded(isExpanded)}
                sx={{ mt: 3 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: 'warning.main' }}>
                    📄 Foot Notes
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Editor 
                    key={`foot-${selectedNodeId}`}
                    content={selectedNode.footNotes || ''}
                    placeholder={`Follow-up thoughts, reminders, what happens next for ${selectedNode.title}...`}
                    author={currentAuthor}
                    onChange={handleSaveFootNotes}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          ) : (
            <Box 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 500, color: 'grey.900' }}>
                  Ready to write?
                </Typography>
                <Typography>
                  {contentTree.length === 0 
                    ? `Create your first ${currentProject.levelConfig?.level1 || 'Chapter'} to get started.`
                    : `Select any item from the story structure to view or edit it.`
                  }
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right Sidebar - AI Assistant */}
      <Box sx={{ width: 320, bgcolor: 'grey.50', borderLeft: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToy color="primary" />
            AI Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Claude is here to help!
          </Typography>
        </Box>
        
        <Box sx={{ p: 2 }}>
          <Button 
            variant="contained"
            fullWidth
            disabled={!selectedNode}
            sx={{ mb: 2 }}
          >
            Send to Claude
          </Button>
          
          <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 24, 
                  height: 24, 
                  bgcolor: 'primary.100', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <SmartToy sx={{ fontSize: 14, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Ready to help you write! Send me your current chapter and I can:
                </Typography>
                <Typography variant="caption" component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                  <li>Suggest improvements</li>
                  <li>Continue the story</li>
                  <li>Fix grammar & style</li>
                  <li>Add creative elements</li>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}