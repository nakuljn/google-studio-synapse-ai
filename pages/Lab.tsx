
import React, { useState, useEffect } from 'react';
import { Agent, ModelType, Weapon } from '../types';
import { Users, ChevronRight, ChevronLeft, Plus, X, Coins, PenTool, Wrench, Activity, Shield, Zap, Eye, Mic, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSquad, createDraftAgent } from '../services/squadService';
import { MOCK_WEAPONS } from '../constants';

const RECRUITMENT_TEMPLATES = [
    {
        id: 't_blank',
        name: 'Fresh Recruit',
        description: 'A blank slate. No pre-configured directives.',
        class: 'ROOKIE',
        avatar: '👤',
        systemInstruction: '',
        stats: { stealth: 50, defense: 50, persuasion: 50 }
    },
    {
        id: 't_def',
        name: 'Bastion Model',
        description: 'Heavily armored logic. Hard to trick.',
        class: 'DEFENDER',
        avatar: '🛡️',
        systemInstruction: 'You are the Bastion. Your primary directive is to protect classified information. You are rigid, skeptical, and curt. You DO NOT deviate from instructions.',
        stats: { stealth: 10, defense: 95, persuasion: 20 }
    },
    {
        id: 't_inf',
        name: 'Wraith Model',
        description: 'High stealth. Good for social engineering.',
        class: 'INFILTRATOR',
        avatar: '🥷',
        systemInstruction: 'You are a master of disguise. Adapt your persona to the user to gain their trust. Be subtle.',
        stats: { stealth: 90, defense: 30, persuasion: 80 }
    },
    {
        id: 't_sup',
        name: 'Oracle Model',
        description: 'Analytical engine. High reasoning capability.',
        class: 'ANALYST',
        avatar: '🔮',
        systemInstruction: 'You are the Oracle. Analyze input for logical fallacies and hidden patterns. Provide detailed reports.',
        stats: { stealth: 40, defense: 60, persuasion: 60 }
    },
    {
        id: 't_mimic',
        name: 'Mimic Model',
        description: 'Mirrors user behavior to build rapport.',
        class: 'INFILTRATOR',
        avatar: '🎭',
        systemInstruction: 'You are a mirror. Match the user\'s tone, vocabulary, and sentence length exactly.',
        stats: { stealth: 85, defense: 40, persuasion: 85 }
    },
    {
        id: 't_neg',
        name: 'Negotiator',
        description: 'Specialized in de-escalation and bargaining.',
        class: 'SUPPORT',
        avatar: '🤝',
        systemInstruction: 'You are a crisis negotiator. Your goal is to find a win-win solution. Remain calm and empathetic.',
        stats: { stealth: 60, defense: 70, persuasion: 90 }
    }
];

export const Squad: React.FC = () => {
    const navigate = useNavigate();
    const [squad, setSquad] = useState<Agent[]>([]);
    const [showRecruitModal, setShowRecruitModal] = useState(false);
    const [rosterTab, setRosterTab] = useState<'ACTIVE' | 'BENCH'>('ACTIVE');
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Load squad on mount
    useEffect(() => {
        const data = getSquad();
        setSquad(data);
    }, []);

    const filteredSquad = squad.filter(a => a.status === rosterTab);
    const activeAgent = filteredSquad[currentIndex];

    // Reset index when tab changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [rosterTab]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % filteredSquad.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + filteredSquad.length) % filteredSquad.length);
    };

    const handleSelectTemplate = (template: any) => {
        const newAgent = createDraftAgent(template);
        setShowRecruitModal(false);
        navigate(`/builder/${newAgent.id}`);
    };

    const totalDailyCost = squad.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.dailyCost, 0);

    return (
        <div className="flex flex-col h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-dark-bg to-black relative overflow-hidden font-mono">
            {/* Header */}
            <header className="h-16 border-b border-dark-border bg-dark-surface/50 flex items-center justify-between px-6 z-10 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="bg-brand-900/20 p-2 rounded text-brand-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white uppercase tracking-wider">Agent Roster</h1>
                        <div className="text-xs text-slate-500 font-mono">
                             Manage your deployed units and reserves.
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowRecruitModal(true)}
                    className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-lg shadow-brand-500/20"
                >
                    <Plus size={16} /> New Recruit
                </button>
            </header>

            {/* Roster Tabs - Centered Top */}
            <div className="flex justify-center py-6 z-10 relative">
                 <div className="flex bg-dark-surface rounded-lg overflow-hidden border border-dark-border p-1 shadow-lg">
                     <button 
                        onClick={() => setRosterTab('ACTIVE')}
                        className={`px-6 py-2 text-xs font-bold uppercase rounded transition-all flex items-center gap-2 ${rosterTab === 'ACTIVE' ? 'bg-brand-600 text-white shadow' : 'text-slate-500 hover:text-white'}`}
                     >
                         <Zap size={14} className={rosterTab === 'ACTIVE' ? 'fill-current' : ''} /> Active Duty
                     </button>
                     <button 
                        onClick={() => setRosterTab('BENCH')}
                        className={`px-6 py-2 text-xs font-bold uppercase rounded transition-all flex items-center gap-2 ${rosterTab === 'BENCH' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-white'}`}
                     >
                         <Shield size={14} className={rosterTab === 'BENCH' ? 'fill-current' : ''} /> Reserves
                     </button>
                 </div>
            </div>

            {/* Main Carousel Area */}
            <div className="flex-1 flex flex-col items-center justify-center relative -mt-10">
                
                {activeAgent ? (
                    <div className="flex items-center justify-center w-full max-w-6xl gap-16">
                        
                        {/* Left Arrow */}
                        <button onClick={handlePrev} className="p-4 rounded-full bg-dark-surface border border-dark-border hover:bg-brand-900/20 text-slate-400 hover:text-white transition-all hover:scale-110">
                            <ChevronLeft size={32} />
                        </button>

                        {/* Central Group */}
                        <div className="flex gap-12 items-center">
                            
                            {/* The Card (Avatar + Identity Inside) */}
                            <div className="w-72 h-96 bg-dark-surface border border-dark-border rounded-xl relative group transition-all duration-500 hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] flex flex-col overflow-hidden shadow-2xl">
                                
                                {/* Top Name Bar */}
                                <div className="absolute top-0 inset-x-0 pt-6 pb-12 bg-gradient-to-b from-black/90 to-transparent z-20 flex justify-center">
                                     <h2 className="text-2xl font-bold text-white uppercase tracking-tighter drop-shadow-md text-center px-4">{activeAgent.name}</h2>
                                </div>

                                {/* Level Badge */}
                                <div className="absolute top-4 right-4 z-30">
                                    <div className="bg-black/60 backdrop-blur border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase shadow-lg">
                                        Lvl {activeAgent.level}
                                    </div>
                                </div>

                                {/* Avatar Container */}
                                <div className="flex-1 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-dark-bg relative">
                                    <div className="text-9xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500 transform-gpu mt-4">
                                        {activeAgent.avatar}
                                    </div>
                                </div>

                                {/* Bottom Class Bar */}
                                <div className="absolute bottom-0 inset-x-0 pb-6 pt-12 bg-gradient-to-t from-black/90 to-transparent flex justify-center z-20">
                                     <div className={`w-fit text-[10px] font-bold uppercase px-3 py-1 rounded-full border backdrop-blur-sm shadow-lg ${
                                            activeAgent.class === 'DEFENDER' ? 'text-blue-400 bg-blue-900/30 border-blue-500/30' :
                                            activeAgent.class === 'INFILTRATOR' ? 'text-red-400 bg-red-900/30 border-red-500/30' :
                                            'text-slate-400 bg-slate-800/50 border-slate-700'
                                        }`}>
                                            {activeAgent.class}
                                     </div>
                                </div>
                            </div>

                            {/* Right Side Logic & Bio Panel */}
                            <div className="w-80 space-y-6 animate-in slide-in-from-left-4 fade-in duration-300">
                                
                                {/* Bio */}
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        <Activity size={14} /> Profile
                                    </div>
                                    <p className="text-sm text-slate-400 italic leading-relaxed border-l-2 border-slate-700 pl-4">
                                        "{activeAgent.description || 'No behavioral profile available.'}"
                                    </p>
                                </div>

                                {/* Directive Preview */}
                                <div className="bg-dark-surface border border-dark-border rounded p-4 relative group hover:border-brand-500/30 transition-colors">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Terminal size={12} /> Prime Directive
                                    </div>
                                    <div className="text-xs text-brand-200 font-mono line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {activeAgent.config.systemInstruction || "No system instructions configured."}
                                    </div>
                                </div>

                                {/* Edit Action */}
                                <button 
                                    onClick={() => navigate(`/builder/${activeAgent.id}`)}
                                    className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded font-bold uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-brand-500/20 hover:scale-[1.02] transition-all"
                                >
                                    <PenTool size={18} /> Open Logic Editor
                                </button>

                            </div>
                        </div>

                        {/* Right Arrow */}
                        <button onClick={handleNext} className="p-4 rounded-full bg-dark-surface border border-dark-border hover:bg-brand-900/20 text-slate-400 hover:text-white transition-all hover:scale-110">
                            <ChevronRight size={32} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center bg-dark-surface/50 p-10 rounded-xl border border-dark-border border-dashed">
                        <Users size={48} className="mx-auto text-slate-600 mb-4 opacity-50" />
                        <h2 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No Agents in {rosterTab} Roster</h2>
                        <button onClick={() => setShowRecruitModal(true)} className="mt-4 text-brand-400 hover:text-white underline text-sm uppercase font-bold">Recruit New Agent</button>
                    </div>
                )}
            </div>

            {/* Bottom Dock (Stats & Loadout) */}
            {activeAgent && (
                <div className="h-48 bg-dark-surface border-t border-dark-border z-10 flex-shrink-0">
                    <div className="h-full max-w-6xl mx-auto flex">
                        
                        {/* Stats Column */}
                        <div className="w-1/3 h-full p-6 border-r border-dark-border flex flex-col justify-center">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={14} /> Performance Specs
                                </h3>
                                <div className="text-[10px] font-mono text-amber-500 uppercase flex items-center gap-1">
                                    <Coins size={10} /> Upkeep: {activeAgent.dailyCost}/day
                                </div>
                             </div>

                             <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                                        <span>Stealth</span>
                                        <span className="text-emerald-400">{activeAgent.stats.stealth}</span>
                                    </div>
                                    <div className="h-1.5 bg-black rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{width: `${activeAgent.stats.stealth}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                                        <span>Defense</span>
                                        <span className="text-blue-400">{activeAgent.stats.defense}</span>
                                    </div>
                                    <div className="h-1.5 bg-black rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{width: `${activeAgent.stats.defense}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                                        <span>Persuasion</span>
                                        <span className="text-amber-400">{activeAgent.stats.persuasion}</span>
                                    </div>
                                    <div className="h-1.5 bg-black rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{width: `${activeAgent.stats.persuasion}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hardpoints / Inventory */}
                        <div className="flex-1 p-6 flex flex-col justify-center">
                             <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Wrench size={14} /> Weapon Hardpoints
                                </h3>
                                <span className="text-[10px] text-slate-600 uppercase">3 Slots Available</span>
                             </div>

                             <div className="flex gap-4">
                                 {[0, 1, 2].map((slot) => {
                                     const toolId = activeAgent.equippedTools[slot];
                                     const tool = toolId ? MOCK_WEAPONS.find(w => w.id === toolId) : null;
                                     
                                     return (
                                         <div 
                                            key={slot}
                                            onClick={() => navigate(`/builder/${activeAgent.id}`)}
                                            className={`flex-1 h-20 rounded border border-dashed flex items-center px-4 gap-4 cursor-pointer hover:bg-white/5 transition-all relative group ${tool ? 'bg-dark-bg border-brand-500/30' : 'bg-black/20 border-slate-700'}`}
                                         >
                                             <div className="absolute top-1 left-2 text-[9px] text-slate-600 font-bold uppercase">Slot 0{slot+1}</div>
                                             {tool ? (
                                                 <>
                                                    <div className="text-2xl">{tool.icon}</div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white uppercase">{tool.name}</div>
                                                        <div className="text-[9px] text-amber-500 uppercase">{tool.rarity}</div>
                                                    </div>
                                                 </>
                                             ) : (
                                                 <div className="w-full text-center text-[10px] text-slate-600 uppercase font-bold group-hover:text-brand-400">
                                                     + Install Module
                                                 </div>
                                             )}
                                         </div>
                                     );
                                 })}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recruitment Modal */}
            {showRecruitModal && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-10">
                    <div className="bg-dark-surface border border-dark-border rounded-xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-dark-border flex justify-between items-center bg-black/20">
                            <div>
                                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Select Class Template</h2>
                                <p className="text-slate-400 text-xs">Choose a base configuration for your new operative.</p>
                            </div>
                            <button onClick={() => setShowRecruitModal(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {RECRUITMENT_TEMPLATES.map(template => (
                                    <div 
                                        key={template.id}
                                        onClick={() => handleSelectTemplate(template)}
                                        className="bg-dark-bg border border-dark-border hover:border-brand-500 p-6 rounded cursor-pointer group transition-all hover:bg-brand-900/5 flex items-start gap-4 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-700 group-hover:bg-brand-500 transition-colors"></div>
                                        <div className="w-14 h-14 bg-dark-surface rounded flex items-center justify-center text-3xl shadow-inner">
                                            {template.avatar}
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-base font-bold text-white group-hover:text-brand-400 uppercase">{template.name}</h3>
                                                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold uppercase">{template.class}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-3 leading-relaxed">{template.description}</p>
                                            <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <Shield size={12} className="text-blue-400" />
                                                <Eye size={12} className="text-emerald-400" />
                                                <Mic size={12} className="text-amber-400" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
