import { Project, ModelType } from '../types';

const STORAGE_KEY = 'synapse_projects';

// Mock initial community projects to populate the feed
const MOCK_COMMUNITY_PROJECTS: Project[] = [
    {
        id: 'p1',
        title: 'Story Generator v1',
        description: 'A tuned system instruction for generating children\'s stories with moral lessons.',
        author: 'Sarah Connor',
        likes: 24,
        forks: 5,
        state: {
            model: ModelType.FLASH,
            temperature: 0.8,
            systemInstruction: 'You are a gentle storyteller who focuses on themes of friendship and courage. Always end with a moral.',
            userPrompt: 'Tell me a story about a robot who loves flowers.'
        },
        isPublic: true,
        lastModified: Date.now(),
        type: 'agent'
    },
     {
        id: 'p2',
        title: 'Python Bug Fixer',
        description: 'Strict code corrector that explains errors clearly.',
        author: 'DevDave',
        likes: 12,
        forks: 2,
        state: {
            model: ModelType.FLASH,
            temperature: 0.1,
            systemInstruction: 'You are a senior python developer. Fix bugs in provided code. Output only the fixed code block followed by a brief explanation.',
            userPrompt: 'def hello() print("world")'
        },
        isPublic: true,
        lastModified: Date.now(),
        type: 'agent'
    },
    {
        id: 'p3',
        title: 'Sales Email Drafter',
        description: 'Generates professional cold outreach emails.',
        author: 'GrowthHacker',
        likes: 89,
        forks: 15,
        state: {
            model: ModelType.FLASH,
            temperature: 0.7,
            systemInstruction: 'You are a professional sales copywriter. Write concise, persuasive emails.',
            userPrompt: 'Draft an email to a CTO about our new cloud security platform.'
        },
        isPublic: true,
        lastModified: Date.now(),
        type: 'agent'
    }
];

export const getCommunityProjects = (): Project[] => {
    // In a real app, this would fetch from a backend.
    // For now, we combine mock data + any "public" local projects (simulated)
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const publicLocal = local.filter((p: Project) => p.isPublic);
    return [...MOCK_COMMUNITY_PROJECTS, ...publicLocal];
};

export const getMyProjects = (): Project[] => {
     const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
     return local;
}

export const saveProject = (project: Project): void => {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = local.findIndex((p: Project) => p.id === project.id);
    if (index >= 0) {
        local[index] = { ...project, lastModified: Date.now() };
    } else {
        local.push({ ...project, lastModified: Date.now() });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
};

export const getProjectById = (id: string): Project | undefined => {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const foundLocal = local.find((p: Project) => p.id === id);
    if (foundLocal) return foundLocal;
    return MOCK_COMMUNITY_PROJECTS.find(p => p.id === id);
}