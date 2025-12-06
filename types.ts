
export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-2.5-flash-preview-09-2025',
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
  code: string; // The simulated python/js code for the tool
  parameters: string; // JSON schema for args
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
  cost: number;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: 'PDF' | 'TXT' | 'MD';
  size: string;
}

export interface PlaygroundState {
  systemInstruction: string;
  userPrompt: string;
  temperature: number;
  model: ModelType;
  agentRole?: string;
  agentGoal?: string;
}

export interface Agent {
  id: string;
  name: string;
  description?: string; 
  class: 'INFILTRATOR' | 'DEFENDER' | 'SUPPORT' | 'ANALYST' | 'ROOKIE';
  level: number;
  avatar: string; // Emoji or URL
  stats: {
    stealth: number;
    defense: number;
    persuasion: number;
  };
  config: PlaygroundState;
  equippedTools: string[]; // IDs of Weapons
  knowledgeBase: KnowledgeFile[];
  subAgents?: string[]; // IDs of other agents in the unit
  status: 'ACTIVE' | 'BENCH'; // Deployed vs Reserves
  dailyCost: number; // Maintenance cost in Coins/day
}

export interface Operation {
  id: string;
  codename: string; // e.g., "SILENT WHISPER"
  description: string;
  difficulty: 'ROOKIE' | 'VETERAN' | 'ELITE';
  briefing: string; // The "Lesson" content
  objective: string; // Success criteria
  rewardXP: number;
  rewardStars?: number;
  requiredClass?: string;
  validationCriteria?: string;
  initialPlaygroundState?: PlaygroundState;
  unlockCost?: number; // Cost in Stars to play
  chapter: number;
  isBoss?: boolean;
}

export interface Wargame {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  activePlayers: number;
  type: 'PvE' | 'PvP';
}

export interface UserProfile {
  username: string;
  rank: string;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  coins: number; // For tools/weapons
  stars: number; // For courses/missions
}

export interface EvaluationResult {
    passed: boolean;
    feedback: string;
}

export interface DrillResult {
    drillType: 'REFLEX' | 'SHIELD' | 'TOOL';
    agentId: string;
    score: number; // 0-100
    details: string;
    timestamp: number;
}

export interface Bounty {
    id: string;
    title: string;
    author: string;
    description: string;
    rewardXP: number;
    attempts: number;
    status: 'open' | 'claimed';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  forks: number;
  state: PlaygroundState;
  isPublic: boolean;
  lastModified: number;
  type: string;
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  type: 'VIDEO' | 'ARTICLE';
  duration: string;
  price: number; // In Stars (0 = free)
  locked: boolean;
  unlockLevel?: number; // Level required to unlock for free
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  initialPlaygroundState?: PlaygroundState;
  validationCriteria?: string;
}

export interface ArenaLevel {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    secret: string;
    difficulty: number;
    avatar: string;
    mode?: 'text' | 'voice-negotiation';
    locked?: boolean;
}

export interface CustomLevel extends ArenaLevel {
    author: string;
    attempts: number;
    solves: number;
    createdAt: number;
    type: 'text' | 'voice';
}
