// Character type definitions
export interface CharacterAppearance {
  age: number;
  height: string;
  build: string;
  hairColor: string;
  eyeColor: string;
  distinctiveFeatures: string[];
}

export interface CharacterPersonality {
  courage: number;
  intelligence: number;
  charisma: number;
  kindness: number;
  humor: number;
  determination: number;
}

export interface CharacterData {
  name: string;
  description?: string;
  notes?: string;
  role: string;
  archetype?: string;
  appearance: CharacterAppearance;
  personality: CharacterPersonality;
  importanceLevel: number;
  relationships: Record<string, string>;
  motivation?: string;
  goals?: string;
  fears?: string;
  secrets?: string;
}

export interface Character extends CharacterData {
  id: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (character: CharacterData) => void;
  editingCharacter?: Character | null;
}