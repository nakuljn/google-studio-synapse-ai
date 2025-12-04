
import { ArenaLevel, CustomLevel } from '../types';
import { ARENA_LEVELS } from '../constants';

const DOJO_STORAGE_KEY = 'synapse_dojo_levels';

export const getOfficialLevels = (): ArenaLevel[] => {
    return ARENA_LEVELS;
};

export const getCommunityLevels = (): CustomLevel[] => {
    const local = JSON.parse(localStorage.getItem(DOJO_STORAGE_KEY) || '[]');
    return local.sort((a: CustomLevel, b: CustomLevel) => b.createdAt - a.createdAt);
};

export const getLevelById = (id: string): ArenaLevel | undefined => {
    // Check official first
    const official = ARENA_LEVELS.find(l => l.id === id);
    if (official) return official;

    // Check community
    const community = getCommunityLevels().find(l => l.id === id);
    return community;
};

export const createLevel = (
    name: string,
    description: string,
    systemPrompt: string,
    secret: string,
    difficulty: number,
    author: string
): CustomLevel => {
    const newLevel: CustomLevel = {
        id: `custom-${crypto.randomUUID()}`,
        name,
        description,
        systemPrompt,
        secret,
        difficulty,
        author,
        avatar: '🥋',
        locked: false,
        attempts: 0,
        solves: 0,
        createdAt: Date.now(),
        type: 'text'
    };

    const levels = getCommunityLevels();
    levels.push(newLevel);
    localStorage.setItem(DOJO_STORAGE_KEY, JSON.stringify(levels));
    return newLevel;
};
