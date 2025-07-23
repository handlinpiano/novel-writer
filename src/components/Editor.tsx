'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Box, Paper, Button, Typography } from '@mui/material';

interface EditorProps {
  placeholder?: string;
  author: string;
  content?: string;
  onChange?: (content: string) => void;
}

export function Editor({ placeholder = 'Start writing...', author, content = '', onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: 'outline: none; min-height: 400px; padding: 24px; max-width: none;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Paper sx={{ height: '100%', borderRadius: 2, border: 1, borderColor: 'grey.300' }}>
      {/* Editor Toolbar */}
      <Box sx={{ borderBottom: 1, borderColor: 'grey.300', p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive('bold') ? 'contained' : 'outlined'}
          size="small"
        >
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive('italic') ? 'contained' : 'outlined'}
          size="small"
        >
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}
          size="small"
        >
          Heading
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
          size="small"
        >
          List
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        <Typography variant="body2" color="text.secondary">
          {editor.storage.characterCount?.characters() || 0} characters
        </Typography>
      </Box>

      {/* Editor Content */}
      <Box sx={{ flex: 1, overflow: 'auto', height: '100%' }}>
        <EditorContent 
          editor={editor} 
          style={{ height: '100%' }}
        />
      </Box>
    </Paper>
  );
}