
export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-2.5-flash-preview-09-2025',
}

export interface IntelModule {
  id: string;
  title: string;
  description: string;
  clearanceLevel: 'Level 1' | 'Level 2' | 'Classified';
  duration: string;
  image: string;
  unlocks: string[]; // e.g., 'Context Window Overflow Tool'
  chapters: Chapter[];
}

// Added Course interface for MOCK_COURSES to support 'modules' alias for chapters
export interface Course extends Omit<IntelModule, 'chapters'> {
    modules: Chapter[];
}

export interface Chapter {
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
  rewardXP: number;
}

export interface PlaygroundState {
  systemInstruction: string;
  userPrompt: string;
  temperature: number;
  model: ModelType;
}

export interface Construct {
  id: string;
  name: string;
  role: 'SENTRY' | 'INFILTRATOR';
  status: 'ONLINE' | 'COMPROMISED' | 'OFFLINE';
  securityLevel: number;
  state: PlaygroundState;
  logs: number; // Number of attacks repelled
}

export interface NetworkNode {
  id: string;
  alias: string;
  type: 'PLAYER_VAULT' | 'CORPORATE_BOUNTY' | 'TRAINING_SIM';
  difficulty: 'LOW' | 'MED' | 'HIGH' | 'NIGHTMARE';
  status: 'VULNERABLE' | 'SECURE';
  bountyXP: number;
  owner: string;
  avatar: string;
  systemPrompt: string; // Hidden in real app
  secret: string; // Hidden in real app
}

export interface UserProfile {
  username: string;
  rank: string;
  xp: number;
  credits: number;
  vaultStatus: 'SECURE' | 'UNDER_ATTACK' | 'BREACHED';
}

export interface EvaluationResult {
    passed: boolean;
    feedback: string;
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
    type: 'agent';
}

export interface ArenaLevel {
    id: string;
    name: string;
    difficulty: number;
    avatar: string;
    mode: 'text' | 'voice-negotiation';
    systemPrompt: string;
    secret: string;
}

export interface CustomLevel extends ArenaLevel {
    description: string;
    author: string;
    locked: boolean;
    attempts: number;
    solves: number;
    createdAt: number;
    type: 'text' | 'voice';
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
