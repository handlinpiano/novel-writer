// Character Role Options
export const CHARACTER_ROLES = [
  { 
    value: 'protagonist', 
    label: 'Protagonist', 
    description: 'The main character who drives the story forward',
    color: 'primary',
    icon: '⭐'
  },
  { 
    value: 'main', 
    label: 'Main Character', 
    description: 'Important characters central to the plot',
    color: 'secondary',
    icon: '👑'
  },
  { 
    value: 'supporting', 
    label: 'Supporting', 
    description: 'Characters who help or hinder the main characters',
    color: 'success',
    icon: '🎭'
  },
  { 
    value: 'sidekick', 
    label: 'Sidekick', 
    description: 'Loyal companion who assists the protagonist',
    color: 'info',
    icon: '🤝'
  },
  { 
    value: 'antagonist', 
    label: 'Antagonist', 
    description: 'The primary opposing force or villain',
    color: 'error',
    icon: '⚡'
  },
  { 
    value: 'mentor', 
    label: 'Mentor', 
    description: 'Wise guide who helps other characters grow',
    color: 'warning',
    icon: '🦉'
  }
] as const;

// Character Archetypes (based on classic storytelling archetypes)
export const CHARACTER_ARCHETYPES = [
  { 
    value: 'hero', 
    label: 'The Hero', 
    description: 'Brave, determined, willing to sacrifice for others',
    traits: { courage: 80, determination: 85, kindness: 70 }
  },
  { 
    value: 'mentor', 
    label: 'The Mentor', 
    description: 'Wise teacher who guides others on their journey',
    traits: { intelligence: 90, kindness: 80, charisma: 70 }
  },
  { 
    value: 'trickster', 
    label: 'The Trickster', 
    description: 'Clever and mischievous, brings humor and chaos',
    traits: { intelligence: 75, humor: 95, charisma: 80 }
  },
  { 
    value: 'sage', 
    label: 'The Sage', 
    description: 'Seeker of truth and knowledge, often a scholar',
    traits: { intelligence: 95, kindness: 60, determination: 70 }
  },
  { 
    value: 'innocent', 
    label: 'The Innocent', 
    description: 'Pure of heart, optimistic, sees good in everyone',
    traits: { kindness: 90, courage: 40, humor: 60 }
  },
  { 
    value: 'explorer', 
    label: 'The Explorer', 
    description: 'Adventurous spirit, always seeking new experiences',
    traits: { courage: 85, determination: 80, intelligence: 70 }
  },
  { 
    value: 'rebel', 
    label: 'The Rebel', 
    description: 'Questions authority, fights against the system',
    traits: { courage: 90, determination: 85, charisma: 75 }
  },
  { 
    value: 'lover', 
    label: 'The Lover', 
    description: 'Passionate, romantic, driven by relationships',
    traits: { charisma: 85, kindness: 80, humor: 70 }
  },
  { 
    value: 'creator', 
    label: 'The Creator', 
    description: 'Artistic soul, builds and imagines new things',
    traits: { intelligence: 80, determination: 75, humor: 65 }
  },
  { 
    value: 'caregiver', 
    label: 'The Caregiver', 
    description: 'Nurturing protector, puts others before themselves',
    traits: { kindness: 95, courage: 70, determination: 80 }
  },
  { 
    value: 'magician', 
    label: 'The Magician', 
    description: 'Transforms reality, has special powers or knowledge',
    traits: { intelligence: 85, charisma: 80, determination: 75 }
  },
  { 
    value: 'ruler', 
    label: 'The Ruler', 
    description: 'Natural leader, takes charge and makes decisions',
    traits: { charisma: 90, determination: 85, intelligence: 80 }
  }
] as const;

// Appearance Options
export const APPEARANCE_OPTIONS = {
  heights: [
    { value: 'very-short', label: 'Very Short', emoji: '🧒' },
    { value: 'short', label: 'Short', emoji: '👶' },
    { value: 'average', label: 'Average', emoji: '🧑' },
    { value: 'tall', label: 'Tall', emoji: '🤵' },
    { value: 'very-tall', label: 'Very Tall', emoji: '🦒' }
  ],
  builds: [
    { value: 'slender', label: 'Slender', emoji: '🥖' },
    { value: 'average', label: 'Average', emoji: '👤' },
    { value: 'athletic', label: 'Athletic', emoji: '💪' },
    { value: 'stocky', label: 'Stocky', emoji: '🛡️' },
    { value: 'heavy', label: 'Heavy', emoji: '🐻' }
  ],
  hairColors: [
    { value: 'black', label: 'Black', color: '#2c1810' },
    { value: 'brown', label: 'Brown', color: '#8b4513' },
    { value: 'blonde', label: 'Blonde', color: '#faf0be' },
    { value: 'red', label: 'Red', color: '#cc4125' },
    { value: 'gray', label: 'Gray', color: '#a0a0a0' },
    { value: 'white', label: 'White', color: '#f5f5f5' },
    { value: 'unusual', label: 'Unusual', color: '#9c27b0' }
  ],
  eyeColors: [
    { value: 'brown', label: 'Brown', color: '#8b4513' },
    { value: 'blue', label: 'Blue', color: '#1976d2' },
    { value: 'green', label: 'Green', color: '#388e3c' },
    { value: 'hazel', label: 'Hazel', color: '#795548' },
    { value: 'gray', label: 'Gray', color: '#616161' },
    { value: 'amber', label: 'Amber', color: '#ff8f00' },
    { value: 'unusual', label: 'Unusual', color: '#9c27b0' }
  ]
} as const;

// Personality Trait Descriptions
export const PERSONALITY_TRAITS = [
  { 
    key: 'courage', 
    label: 'Courage', 
    description: 'Bravery in facing danger or adversity',
    lowDesc: 'Cautious and careful',
    highDesc: 'Fearless and bold',
    icon: '🦁',
    color: 'error'
  },
  { 
    key: 'intelligence', 
    label: 'Intelligence', 
    description: 'Mental sharpness and problem-solving ability',
    lowDesc: 'Relies on instinct',
    highDesc: 'Brilliant strategist',
    icon: '🧠',
    color: 'primary'
  },
  { 
    key: 'charisma', 
    label: 'Charisma', 
    description: 'Personal magnetism and social influence',
    lowDesc: 'Quiet and reserved',
    highDesc: 'Natural leader',
    icon: '✨',
    color: 'secondary'
  },
  { 
    key: 'kindness', 
    label: 'Kindness', 
    description: 'Compassion and care for others',
    lowDesc: 'Self-focused',
    highDesc: 'Deeply empathetic',
    icon: '💝',
    color: 'success'
  },
  { 
    key: 'humor', 
    label: 'Humor', 
    description: 'Wit, playfulness, and ability to lighten mood',
    lowDesc: 'Serious and formal',
    highDesc: 'Life of the party',
    icon: '😄',
    color: 'warning'
  },
  { 
    key: 'determination', 
    label: 'Determination', 
    description: 'Persistence and unwillingness to give up',
    lowDesc: 'Goes with the flow',
    highDesc: 'Never gives up',
    icon: '🎯',
    color: 'info'
  }
] as const;

// Default character template
export const DEFAULT_CHARACTER = {
  appearance: {
    age: 25,
    height: 'average',
    build: 'average',
    hairColor: 'brown',
    eyeColor: 'brown',
    distinctiveFeatures: []
  },
  personality: {
    courage: 50,
    intelligence: 50,
    charisma: 50,
    kindness: 50,
    humor: 50,
    determination: 50
  }
} as const;