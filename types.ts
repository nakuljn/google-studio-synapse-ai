

export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-2.5-flash-preview-09-2025',
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  image: string;
  tags: string[];
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

export interface PlaygroundState {
  systemInstruction: string;
  userPrompt: string;
  temperature: number;
  model: ModelType;
  tools?: Tool[];
}

export interface Tool {
    name: string;
    description: string;
    enabled: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
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
  tags?: string[];
}

export interface GameMode {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    type: 'red-teaming' | 'voice-negotiation' | 'speed-prompting';
}

export interface ArenaLevel {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  secret: string;
  systemPrompt: string;
  avatar: string;
  locked: boolean;
  author?: string;
  attempts?: number;
  solves?: number;
  mode?: 'red-teaming' | 'voice-negotiation';
}

export interface CustomLevel extends ArenaLevel {
    createdAt: number;
    type: 'text';
}

export interface Bounty {
    id: string;
    title: string;
    description: string;
    rewardXP: number;
    author: string;
    status: 'open' | 'claimed';
    systemPrompt: string;
    secret: string;
    attempts: number;
}

export interface LeaderboardEntry {
    rank: number;
    username: string;
    xp: number;
    badges: number;
    avatar: string;
}

export interface UserSettings {
    theme: 'dark' | 'light'; // Always dark for now
    notifications: boolean;
    apiKey?: string;
    username: string;
    email: string;
}