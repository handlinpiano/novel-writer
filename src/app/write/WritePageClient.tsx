'use client';

import { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography, Paper, Button } from '@mui/material';
import { SmartToy } from '@mui/icons-material';
import { createChapter, updateChapterTitle, deleteChapter, saveRevision, createProject, getProjects, getChapters } from '@/app/actions/chapters';
import { Editor } from '@/components/Editor';
import Sidebar from '@/components/Sidebar';

type Project = {
  id: string;
  title: string;
  description: string | null;
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

type Author = 'Dad' | 'Daughter';

interface WritePageClientProps {
  initialProjects: Project[];
  initialProject: Project;
  initialChapters: Chapter[];
}

export default function WritePageClient({ initialProjects, initialProject, initialChapters }: WritePageClientProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [currentProject, setCurrentProject] = useState(initialProject);
  const [chapters, setChapters] = useState(initialChapters);
  const [selectedChapterId, setSelectedChapterId] = useState(chapters[0]?.id || null);
  const [currentAuthor, setCurrentAuthor] = useState<Author>('Dad');

  const selectedChapter = chapters.find(ch => ch.id === selectedChapterId);

  const handleProjectSelect = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    setCurrentProject(project);
    const projectChapters = await getChapters(projectId);
    setChapters(projectChapters);
    setSelectedChapterId(projectChapters[0]?.id || null);
  };

  const handleNewProject = async (title: string, description?: string) => {
    const newProject = await createProject(title, description);
    const updatedProjects = await getProjects();
    setProjects(updatedProjects);
    setCurrentProject(newProject);
    
    const projectChapters = await getChapters(newProject.id);
    setChapters(projectChapters);
    setSelectedChapterId(projectChapters[0]?.id || null);
  };

  const handleNewChapter = async () => {
    const newChapter = await createChapter(
      currentProject.id, 
      `Chapter ${chapters.length + 1}`
    );
    setChapters([...chapters, newChapter]);
    setSelectedChapterId(newChapter.id);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (chapters.length <= 1) return;
    
    await deleteChapter(chapterId);
    const updatedChapters = chapters.filter(ch => ch.id !== chapterId);
    setChapters(updatedChapters);
    
    if (selectedChapterId === chapterId) {
      setSelectedChapterId(updatedChapters[0]?.id || null);
    }
  };

  const handleRenameChapter = async (chapterId: string, newTitle: string) => {
    await updateChapterTitle(chapterId, newTitle);
    setChapters(chapters.map(ch => 
      ch.id === chapterId ? { ...ch, title: newTitle } : ch
    ));
  };

  const handleSaveContent = async (content: string) => {
    if (!selectedChapterId) return;
    await saveRevision(selectedChapterId, content, currentAuthor);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Left Sidebar */}
      <Sidebar
        projects={projects}
        currentProject={currentProject}
        chapters={chapters}
        selectedChapterId={selectedChapterId}
        onProjectSelect={handleProjectSelect}
        onNewProject={handleNewProject}
        onChapterSelect={setSelectedChapterId}
        onNewChapter={handleNewChapter}
        onRenameChapter={handleRenameChapter}
        onDeleteChapter={handleDeleteChapter}
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
              {selectedChapter ? selectedChapter.title : 'Select a Chapter'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentProject.title}
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
          {selectedChapter ? (
            <Editor 
              key={selectedChapterId}
              placeholder={`Start writing ${selectedChapter.title}, ${currentAuthor}...`}
              author={currentAuthor}
              onChange={handleSaveContent}
            />
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
                  Select a chapter from the sidebar to get started.
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
            disabled={!selectedChapter}
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