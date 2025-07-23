'use client';

import { useState } from 'react';
import { Editor } from '@/components/Editor';

type Author = 'Dad' | 'Daughter';

export default function WritePage() {
  const [currentAuthor, setCurrentAuthor] = useState<Author>('Dad');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Chapter List & Revision Tree */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chapters</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChapter === 'chapter-1' 
                  ? 'bg-blue-100 border-blue-200' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              } border`}
              onClick={() => setSelectedChapter('chapter-1')}
            >
              <h3 className="font-medium text-gray-900">Chapter 1</h3>
              <p className="text-sm text-gray-600">The Beginning</p>
            </div>
            <div 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChapter === 'chapter-2' 
                  ? 'bg-blue-100 border-blue-200' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              } border`}
              onClick={() => setSelectedChapter('chapter-2')}
            >
              <h3 className="font-medium text-gray-900">Chapter 2</h3>
              <p className="text-sm text-gray-600">The Adventure Continues</p>
            </div>
          </div>
        </div>
        
        {/* Revision History */}
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Revisions</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Dad - 2 hours ago</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Daughter - 1 day ago</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600">Claude - 2 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center - Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {selectedChapter ? `Chapter ${selectedChapter.split('-')[1]}` : 'Select a Chapter'}
            </h1>
            
            {/* User Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentAuthor('Dad')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentAuthor === 'Dad'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dad
              </button>
              <button
                onClick={() => setCurrentAuthor('Daughter')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentAuthor === 'Daughter'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Daughter
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Writing as: <span className="font-medium text-gray-900">{currentAuthor}</span>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6">
          {selectedChapter ? (
            <Editor 
              placeholder={`Start writing your story, ${currentAuthor}...`}
              author={currentAuthor}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to write?</h3>
                <p>Select a chapter from the sidebar to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - AI Assistant */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
          <p className="text-sm text-gray-600">Claude is here to help!</p>
        </div>
        
        <div className="flex-1 p-4 space-y-4">
          <button 
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            disabled={!selectedChapter}
          >
            Send to Claude
          </button>
          
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-purple-600">AI</span>
                </div>
                <div className="text-sm text-gray-700">
                  <p>Ready to help you write! Send me your current chapter and I can:</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-600">
                    <li>• Suggest improvements</li>
                    <li>• Continue the story</li>
                    <li>• Fix grammar & style</li>
                    <li>• Add creative elements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}