export type LevelConfig = {
  level1: string;
  level2: string;
  level3: string;
};

export const LEVEL_PRESETS = {
  'Classic Screenplay': { level1: 'Act', level2: 'Scene', level3: 'Beat' },
  'Novel Structure': { level1: 'Part', level2: 'Chapter', level3: 'Section' },
  'Three-Act Story': { level1: 'Act', level2: 'Chapter', level3: 'Scene' },
  'Children\'s Book': { level1: 'Chapter', level2: 'Page', level3: 'Panel' },
  'Default': { level1: 'Chapter', level2: 'Section', level3: 'Beat' }
} as const;