
import { Agent, ModelType } from '../types';
import { MY_SQUAD } from '../constants';

const SQUAD_STORAGE_KEY = 'synapse_squad';

export const getSquad = (): Agent[] => {
    const stored = localStorage.getItem(SQUAD_STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with default mock data if empty
    localStorage.setItem(SQUAD_STORAGE_KEY, JSON.stringify(MY_SQUAD));
    return MY_SQUAD;
};

export const getAgentById = (id: string): Agent | undefined => {
    const squad = getSquad();
    return squad.find(a => a.id === id);
};

export const saveAgent = (agent: Agent): void => {
    const squad = getSquad();
    const index = squad.findIndex(a => a.id === agent.id);
    
    if (index >= 0) {
        squad[index] = agent;
    } else {
        squad.push(agent);
    }
    
    localStorage.setItem(SQUAD_STORAGE_KEY, JSON.stringify(squad));
};

export const createDraftAgent = (template?: any): Agent => {
    const base: Agent = {
        id: `a-${Date.now()}`,
        name: template?.name || 'Untitled Agent',
        description: template?.description || 'No description provided.',
        class: template?.class || 'ROOKIE',
        level: 1,
        avatar: template?.avatar || '🤖',
        stats: template?.stats || { stealth: 50, defense: 50, persuasion: 50 },
        equippedTools: [],
        knowledgeBase: [],
        config: {
            model: ModelType.FLASH,
            temperature: 0.7,
            systemInstruction: template?.systemInstruction || '',
            userPrompt: ''
        },
        status: 'BENCH',
        dailyCost: 50
    };
    saveAgent(base);
    return base;
};
