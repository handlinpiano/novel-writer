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
  appearance: any;
  personality: any;
  importanceLevel: number;
  relationships: any;
  motivation?: string;
  goals?: string;
  fears?: string;
  secrets?: string;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  notes: string | null;
  role: string | null;
  archetype: string | null;
  appearance: unknown; // JSON from database
  personality: unknown; // JSON from database
  importanceLevel: number | null;
  relationships: unknown; // JSON from database
  motivation: string | null;
  goals: string | null;
  fears: string | null;
  secrets: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CharacterDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (character: CharacterData) => void;
  editingCharacter?: Character | null;
}