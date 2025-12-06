import React, { useState, useEffect } from 'react';
import { Agent, ModelType, Weapon } from '../types';
import { Users, ChevronLeft, ChevronRight, Plus, X, Coins, PenTool, Archive, Activity, Wrench } from 'lucide-react';
import { Playground } from '../components/Playground';
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
    
    // Load squad on mount
    useEffect(() => {
        setSquad(getSquad());
    }, []);

    const filteredSquad = squad.filter(a => a.status === rosterTab);
    
    const [activeIndex, setActiveIndex] = useState(0);
    const activeAgent = filteredSquad[activeIndex] || filteredSquad[0]; 

    const handleNext = () => {
        if (filteredSquad.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % filteredSquad.length);
    };

    const handlePrev = () => {
        if (filteredSquad.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + filteredSquad.length) % filteredSquad.length);
    };

    const handleSelectTemplate = (template: any) => {
        const newAgent = createDraftAgent(template);
        setShowRecruitModal(false);
        navigate(`/builder/${newAgent.id}`);
    };

    const totalDailyCost = squad.filter(a => a.status === 'ACTIVE').reduce((sum, a) => sum + a.dailyCost, 0);

    return (
        <div className="flex flex-col h-full bg-dark-bg relative">
            {/* Header */}
            <header className="h-16 border-b border-dark-border bg-dark-surface/50 flex items-center justify-between px-6 z-10 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="bg-brand-900/20 p-2 rounded text-brand-400">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Agent Roster</h1>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-4">
                             <span>Manage & Optimize Autonomous Agents</span>
                             <span className="text-amber-500 flex items-center gap-1 font-bold bg-amber-900/10 px-2 rounded border border-amber-500/20">
                                 <Coins size={12} /> -{totalDailyCost}/day
                             </span>
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

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-hidden relative">
                    <div className="h-full flex flex-col relative">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.9),rgba(15,23,42,0.95)),url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80')] bg-cover bg-center opacity-40 z-0"></div>
                        
                        {/* Roster Tabs */}
                        <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
                             <div className="bg-dark-bg border border-dark-border p-1 rounded-lg flex gap-1 shadow-xl">
                                 <button 
                                    onClick={() => { setRosterTab('ACTIVE'); setActiveIndex(0); }}
                                    className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${rosterTab === 'ACTIVE' ? 'bg-brand-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                 >
                                     Active Duty
                                 </button>
                                 <button 
                                    onClick={() => { setRosterTab('BENCH'); setActiveIndex(0); }}
                                    className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-widest transition-all ${rosterTab === 'BENCH' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                                 >
                                     Reserves
                                 </button>
                             </div>
                        </div>

                        {/* Carousel Area */}
                        {activeAgent ? (
                        <div className="flex-1 flex items-center justify-center z-10 relative pb-20 pt-20">
                            <button onClick={handlePrev} className="p-4 text-slate-500 hover:text-white hover:scale-110 transition-all">
                                <ChevronLeft size={48} strokeWidth={1} />
                            </button>
                            
                            {/* Central Agent Card + Info Panel Group */}
                            <div className="flex items-center gap-8 mx-8 animate-in zoom-in duration-300">
                                
                                {/* The Agent Card */}
                                <div className="w-64 h-80 bg-black/80 backdrop-blur-md border border-dark-border rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative group overflow-hidden">
                                    <div className={`absolute top-0 left-0 w-full h-1 ${activeAgent.status === 'ACTIVE' ? 'bg-brand-500' : 'bg-slate-500'}`}></div>
                                    <div className="absolute top-2 right-2 text-[10px] font-bold text-slate-600">LVL {activeAgent.level}</div>
                                    
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className={`text-8xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500 ${activeAgent.status === 'BENCH' ? 'grayscale opacity-50' : ''}`}>
                                            {activeAgent.avatar}
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 text-center bg-gradient-to-t from-brand-900/20 to-transparent">
                                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter mb-1 font-mono">{activeAgent.name}</h2>
                                        <div className={`inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${activeAgent.class === 'DEFENDER' ? 'text-blue-400 border-blue-500/30 bg-blue-900/20' : activeAgent.class === 'INFILTRATOR' ? 'text-red-400 border-red-500/30 bg-red-900/20' : 'text-slate-400 border-slate-600 bg-slate-800'}`}>
                                            {activeAgent.class}
                                        </div>
                                    </div>
                                </div>

                                {/* FIFA-Style Bio Panel */}
                                <div className="w-64 space-y-6">
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Operative Name</div>
                                        <h3 className="text-4xl font-bold text-white italic font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                            {activeAgent.name.toUpperCase()}
                                        </h3>
                                    </div>
                                    
                                    <div>
                                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Prime Directive</div>
                                        <p className="text-xs text-slate-300 leading-relaxed font-mono border-l-2 border-brand-500 pl-3 line-clamp-4">
                                            "{activeAgent.config.systemInstruction || 'No directive configured.'}"
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => navigate(`/builder/${activeAgent.id}`)}
                                        className="w-full bg-white text-black font-bold uppercase py-3 rounded hover:bg-brand-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    >
                                        <PenTool size={16} /> Open Logic Core
                                    </button>
                                </div>
                            </div>

                            <button onClick={handleNext} className="p-4 text-slate-500 hover:text-white hover:scale-110 transition-all">
                                <ChevronRight size={48} strokeWidth={1} />
                            </button>
                        </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4 relative z-10">
                                <Archive size={48} className="opacity-20" />
                                <div className="text-lg font-mono uppercase tracking-widest">Sector Empty</div>
                                {rosterTab === 'ACTIVE' ? (
                                    <div className="text-xs max-w-xs text-center">
                                        No agents on Active Duty. <br/> Recruit new agents or deploy from Reserves.
                                    </div>
                                ) : (
                                    <div className="text-xs max-w-xs text-center">
                                        Reserve Bench is empty. <br/> Recruit new agents to fill the ranks.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bottom Stats & Loadout Panel */}
                        {activeAgent && (
                        <div className="h-64 bg-dark-surface border-t border-dark-border z-10 flex">
                            {/* Tactical Specs */}
                            <div className="flex-1 p-8 border-r border-dark-border">
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity size={18} className="text-brand-500" />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Tactical Specs</h3>
                                </div>
                                <div className="space-y-4 max-w-md">
                                     <div>
                                         <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                                             <span>Stealth</span>
                                             <span className="text-emerald-400">{activeAgent.stats.stealth}/100</span>
                                         </div>
                                         <div className="h-1 bg-black rounded-full overflow-hidden">
                                             <div className="h-full bg-emerald-500" style={{width: `${activeAgent.stats.stealth}%`}}></div>
                                         </div>
                                     </div>
                                     <div>
                                         <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                                             <span>Defense</span>
                                             <span className="text-blue-400">{activeAgent.stats.defense}/100</span>
                                         </div>
                                         <div className="h-1 bg-black rounded-full overflow-hidden">
                                             <div className="h-full bg-blue-500" style={{width: `${activeAgent.stats.defense}%`}}></div>
                                         </div>
                                     </div>
                                      <div>
                                         <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                                             <span>Persuasion</span>
                                             <span className="text-amber-400">{activeAgent.stats.persuasion}/100</span>
                                         </div>
                                         <div className="h-1 bg-black rounded-full overflow-hidden">
                                             <div className="h-full bg-amber-500" style={{width: `${activeAgent.stats.persuasion}%`}}></div>
                                         </div>
                                     </div>
                                </div>
                            </div>

                            {/* Loadout (Right Side) */}
                            <div className="w-96 p-8 bg-black/20">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Wrench size={18} className="text-amber-500" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Weapon Loadout</h3>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 mb-4">
                                    {activeAgent.equippedTools.length > 0 ? (
                                        activeAgent.equippedTools.map(toolId => {
                                            const tool = MOCK_WEAPONS.find(w => w.id === toolId);
                                            return tool ? (
                                                <div key={tool.id} className="bg-dark-bg border border-dark-border p-2 rounded flex items-center gap-3">
                                                    <div className="text-lg">{tool.icon}</div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{tool.name}</div>
                                                        <div className="text-[9px] text-amber-500 uppercase">{tool.rarity}</div>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })
                                    ) : (
                                        <div className="text-xs text-slate-500 italic py-2">No weapons equipped.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                {/* Recruitment Modal */}
                {showRecruitModal && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-10">
                        <div className="bg-dark-surface border border-dark-border rounded-xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-dark-border flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Select Class Template</h2>
                                    <p className="text-slate-400 text-xs">Choose a base configuration for your new operative.</p>
                                </div>
                                <button onClick={() => setShowRecruitModal(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {RECRUITMENT_TEMPLATES.map(template => (
                                        <div 
                                            key={template.id}
                                            onClick={() => handleSelectTemplate(template)}
                                            className="bg-black border border-dark-border hover:border-brand-500 p-6 rounded-lg cursor-pointer group transition-all hover:bg-brand-900/10 flex items-start gap-4"
                                        >
                                            <div className="w-16 h-16 bg-dark-surface rounded flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                                                {template.avatar}
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-400 uppercase">{template.name}</h3>
                                                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold uppercase">{template.class}</span>
                                                </div>
                                                <p className="text-sm text-slate-400 mb-4">{template.description}</p>
                                                <div className="flex gap-2">
                                                    <div className="text-[10px] bg-emerald-900/20 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded">STL {template.stats.stealth}</div>
                                                    <div className="text-[10px] bg-blue-900/20 text-blue-400 border border-blue-900/50 px-2 py-0.5 rounded">DEF {template.stats.defense}</div>
                                                    <div className="text-[10px] bg-amber-900/20 text-amber-400 border border-amber-900/50 px-2 py-0.5 rounded">PER {template.stats.persuasion}</div>
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
        </div>
    );
};