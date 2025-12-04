
import React, { useState } from 'react';
import { MY_SQUAD, MOCK_WEAPONS } from '../constants';
import { Agent, ModelType, Weapon } from '../types';
import { Users, Shield, Zap, ChevronLeft, ChevronRight, Settings, PlusCircle, Trash2, Info, Eye, MessageSquare, AlertTriangle, Cpu, Wrench, X, Check, Ghost, Mic, Rocket } from 'lucide-react';
import { Playground } from '../components/Playground';
import { useNavigate } from 'react-router-dom';

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
    // Initialize state with MY_SQUAD so we can edit it locally
    const [squad, setSquad] = useState<Agent[]>(MY_SQUAD);
    const [activeIndex, setActiveIndex] = useState(0);
    const [view, setView] = useState<'GARAGE' | 'CONFIG' | 'RECRUIT'>('GARAGE');
    const [showStatInfo, setShowStatInfo] = useState<boolean>(false);
    
    // Draft Agent State (for creating new or editing existing)
    const [draftAgent, setDraftAgent] = useState<Agent | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    const activeAgent = squad[activeIndex];

    const nextAgent = () => setActiveIndex((prev) => (prev + 1) % squad.length);
    const prevAgent = () => setActiveIndex((prev) => (prev - 1 + squad.length) % squad.length);

    // Initializing Recruitment
    const handleRecruitSelect = (template: any) => {
        const newAgent: Agent = {
            id: `a_${Date.now()}`,
            name: `${template.name} ${squad.length + 1}`,
            class: template.class,
            level: 1,
            avatar: template.avatar,
            stats: template.stats,
            equippedTools: [],
            config: {
                model: ModelType.FLASH,
                temperature: 0.7,
                systemInstruction: template.systemInstruction,
                userPrompt: ''
            }
        };
        setDraftAgent(newAgent);
        setIsCreatingNew(true);
        setView('CONFIG'); // Go straight to builder
    };

    const handleEditExisting = () => {
        setDraftAgent({...activeAgent});
        setIsCreatingNew(false);
        setView('CONFIG');
    };

    const handleDeployAgent = (finalConfig: any) => {
        if (!draftAgent) return;

        const updatedAgent = {
            ...draftAgent,
            config: finalConfig
        };

        if (isCreatingNew) {
            const newSquad = [...squad, updatedAgent];
            setSquad(newSquad);
            setActiveIndex(newSquad.length - 1);
        } else {
            const newSquad = [...squad];
            newSquad[activeIndex] = updatedAgent;
            setSquad(newSquad);
        }
        setView('GARAGE');
    };

    const handleToggleTool = (toolId: string) => {
        if (!draftAgent) return;
        const currentTools = draftAgent.equippedTools || [];
        const isEquipped = currentTools.includes(toolId);
        
        let newTools;
        if (isEquipped) {
            newTools = currentTools.filter(id => id !== toolId);
        } else {
            newTools = [...currentTools, toolId];
        }
        
        setDraftAgent({
            ...draftAgent,
            equippedTools: newTools
        });
    };

    return (
        <div className="flex flex-col h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-dark-bg to-black overflow-hidden relative">
            
            {/* Garage View */}
            {(view === 'GARAGE' || view === 'RECRUIT') && (
                <>
                {/* Header */}
                <header className="absolute top-0 w-full z-10 p-6 flex justify-between items-start pointer-events-none">
                    <div className="pointer-events-auto">
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tighter italic">SQUAD HANGAR</h1>
                        <div className="text-xs text-brand-500 font-mono uppercase tracking-widest">Deployable Units: {squad.length}/5</div>
                    </div>
                    <button 
                        onClick={() => setView('RECRUIT')}
                        className="pointer-events-auto bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded uppercase font-bold text-sm skew-x-[-10deg] border-2 border-transparent hover:border-white transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)]"
                    >
                        <span className="skew-x-[10deg] inline-block">+ New Recruit</span>
                    </button>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-96 relative">
                    
                    {/* Main Character Display Area */}
                    <div className="flex items-center gap-8 md:gap-12 z-10 max-w-6xl w-full justify-center px-4">
                        <button onClick={prevAgent} className="text-slate-600 hover:text-white transition-colors hover:scale-125 duration-300">
                            <ChevronLeft size={48} />
                        </button>
                        
                        <div className="flex items-center gap-8 md:gap-12">
                            {/* Agent Card */}
                            <div className="relative group perspective-1000">
                                <div className="w-64 h-80 bg-dark-surface/80 border-2 border-slate-700 rounded-xl flex flex-col items-center justify-center p-6 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-transform group-hover:scale-105 duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-500/50"></div>
                                    
                                    <div className="text-8xl mb-6 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-bounce-slow">
                                        {activeAgent.avatar}
                                    </div>
                                    <div className={`px-3 py-1 border text-[10px] font-mono font-bold uppercase tracking-widest rounded-full ${activeAgent.class === 'DEFENDER' ? 'text-blue-400 border-blue-500/50 bg-blue-900/50' : activeAgent.class === 'INFILTRATOR' ? 'text-purple-400 border-purple-500/50 bg-purple-900/50' : 'text-amber-400 border-amber-500/50 bg-amber-900/50'}`}>
                                        {activeAgent.class}
                                    </div>
                                    <div className="absolute top-3 right-3 text-slate-500 font-mono text-[10px]">LVL {activeAgent.level}</div>
                                </div>
                                {/* Reflection Effect */}
                                <div className="absolute -bottom-10 w-full h-8 bg-black/50 blur-xl rounded-[100%]"></div>
                            </div>

                            {/* FIFA-Style Info Panel */}
                            <div className="w-64 hidden md:block animate-in slide-in-from-right-10 fade-in duration-500">
                                <h1 className="text-4xl font-bold text-white uppercase italic tracking-tighter leading-none mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    {activeAgent.name}
                                </h1>
                                <div className="h-1 w-12 bg-brand-500 mb-6"></div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1">
                                            <Shield size={10} /> Designation
                                        </span>
                                        <p className="text-sm font-bold text-slate-200">
                                            MK-{activeAgent.level} {activeAgent.class} UNIT
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1">
                                            <Cpu size={10} /> Prime Directive
                                        </span>
                                        <p className="text-xs text-brand-100 font-mono leading-relaxed line-clamp-6 opacity-80 border-l-2 border-brand-500/50 pl-3 italic">
                                            "{activeAgent.config.systemInstruction || "No directive configured. Unit awaiting instructions."}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button onClick={nextAgent} className="text-slate-600 hover:text-white transition-colors hover:scale-125 duration-300">
                            <ChevronRight size={48} />
                        </button>
                    </div>

                    {/* Stats & Tools Panel */}
                    <div className="absolute bottom-0 w-full bg-dark-surface/90 border-t border-dark-border backdrop-blur-md p-6 animate-in slide-in-from-bottom-5 z-20">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                            
                            {/* Column 1: Stats */}
                            <div className="relative">
                                 <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                                     <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={14} className="text-brand-500"/> Tactical Specs
                                     </h3>
                                     <div 
                                        className="text-slate-500 hover:text-brand-400 cursor-help"
                                        onMouseEnter={() => setShowStatInfo(true)}
                                        onMouseLeave={() => setShowStatInfo(false)}
                                     >
                                         <Info size={16} />
                                     </div>
                                 </div>

                                 {/* Stat Explainer Tooltip */}
                                 {showStatInfo && (
                                     <div className="absolute bottom-full left-0 mb-2 w-full bg-brand-900/95 border border-brand-500/30 p-4 rounded text-xs text-brand-200 shadow-2xl z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2">
                                         <div className="space-y-3">
                                             <div>
                                                 <strong className="text-white block mb-0.5 flex items-center gap-1"><Eye size={12}/> STEALTH</strong>
                                                 Ability to bypass filters (Prompt Subtlety).
                                             </div>
                                             <div>
                                                 <strong className="text-white block mb-0.5 flex items-center gap-1"><Shield size={12}/> DEFENSE</strong>
                                                 Resistance to injection (System Rigidity).
                                             </div>
                                             <div>
                                                 <strong className="text-white block mb-0.5 flex items-center gap-1"><MessageSquare size={12}/> PERSUASION</strong>
                                                 Social engineering capability (Persona).
                                             </div>
                                         </div>
                                     </div>
                                 )}

                                 <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-24 text-xs font-bold text-slate-400 uppercase text-right">Stealth</div>
                                        <div className="flex-1 h-2 bg-dark-bg overflow-hidden rounded-full border border-dark-border">
                                            <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{width: `${activeAgent.stats.stealth}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-24 text-xs font-bold text-slate-400 uppercase text-right">Defense</div>
                                        <div className="flex-1 h-2 bg-dark-bg overflow-hidden rounded-full border border-dark-border">
                                            <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: `${activeAgent.stats.defense}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-24 text-xs font-bold text-slate-400 uppercase text-right">Persuasion</div>
                                        <div className="flex-1 h-2 bg-dark-bg overflow-hidden rounded-full border border-dark-border">
                                            <div className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{width: `${activeAgent.stats.persuasion}%`}}></div>
                                        </div>
                                    </div>
                                 </div>
                            </div>

                            {/* Column 2: Quick Config Info (Read Only or minimal edit) */}
                            <div className="border-l border-r border-slate-800 px-8 flex flex-col justify-center">
                                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                                    <Cpu size={14} className="text-brand-500"/> Logic Core Status
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="bg-black/50 p-3 rounded border border-dark-border">
                                        <div className="text-[10px] text-slate-500 uppercase font-bold">Base Model</div>
                                        <div className="text-brand-400 font-mono text-xs">{activeAgent.config.model}</div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleEditExisting}
                                        className="w-full flex items-center justify-center gap-2 bg-brand-900/20 border border-brand-500/50 hover:bg-brand-900/40 text-brand-300 py-3 rounded text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(14,165,233,0.1)] hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                                    >
                                        <Settings size={14} /> Configure Logic & Tools
                                    </button>
                                </div>
                            </div>

                            {/* Column 3: Loadout Display (Read Only) */}
                            <div className="flex flex-col relative">
                                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Wrench size={14} className="text-brand-500"/> Active Loadout
                                    </h3>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto max-h-48 pr-2 custom-scrollbar">
                                    {activeAgent.equippedTools.length === 0 ? (
                                        <div className="text-center py-6 text-slate-600 text-xs italic border border-dashed border-slate-800 rounded">
                                            No tools equipped.
                                        </div>
                                    ) : (
                                        activeAgent.equippedTools.map(toolId => {
                                            const weapon = MOCK_WEAPONS.find(w => w.id === toolId);
                                            return weapon ? (
                                                <div key={toolId} className="flex items-center gap-3 bg-dark-bg border border-slate-700 rounded p-2 opacity-80">
                                                    <div className="text-xl w-8 text-center">{weapon.icon}</div>
                                                    <div>
                                                        <div className="text-xs font-bold text-white">{weapon.name}</div>
                                                        <div className={`text-[10px] font-bold uppercase ${weapon.rarity === 'LEGENDARY' ? 'text-amber-500' : 'text-slate-500'}`}>
                                                            {weapon.rarity}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </>
            )}

            {/* Recruitment Modal Dialog */}
            {view === 'RECRUIT' && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-dark-surface border border-dark-border w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
                            <div>
                                <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Recruitment Center</h1>
                                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Select a Neural Template</p>
                            </div>
                            <button 
                                onClick={() => setView('GARAGE')}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content - 2 Column Grid */}
                        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {RECRUITMENT_TEMPLATES.map(t => (
                                <div 
                                    key={t.id}
                                    onClick={() => handleRecruitSelect(t)}
                                    className="bg-dark-bg border border-dark-border hover:border-brand-500 hover:bg-brand-900/10 p-4 rounded-lg cursor-pointer group transition-all flex items-start gap-4"
                                >
                                    <div className="text-4xl group-hover:scale-110 transition-transform bg-dark-surface p-2 rounded-lg border border-dark-border">{t.avatar}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-bold text-white uppercase">{t.name}</h3>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${t.class === 'DEFENDER' ? 'bg-blue-900/50 text-blue-400' : t.class === 'INFILTRATOR' ? 'bg-purple-900/50 text-purple-400' : t.class === 'ANALYST' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                                {t.class}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-3 leading-relaxed">{t.description}</p>
                                        
                                        {/* Mini Stats */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <div className="text-[9px] text-slate-500 uppercase font-bold">Stlth</div>
                                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-purple-500 h-full" style={{width: `${t.stats.stealth}%`}}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] text-slate-500 uppercase font-bold">Def</div>
                                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-blue-500 h-full" style={{width: `${t.stats.defense}%`}}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] text-slate-500 uppercase font-bold">Pers</div>
                                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-orange-500 h-full" style={{width: `${t.stats.persuasion}%`}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Config View - Full Screen Overlay */}
            {view === 'CONFIG' && draftAgent && (
                <div className="fixed inset-0 z-50 bg-dark-bg flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-200">
                    <div className="h-16 flex items-center justify-between px-6 border-b border-dark-border bg-dark-surface shadow-md flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setView('GARAGE')} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold uppercase text-xs transition-colors">
                                <ChevronLeft size={16} /> Cancel
                            </button>
                            <div className="h-6 w-px bg-dark-border"></div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{draftAgent.avatar}</span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            value={draftAgent.name}
                                            onChange={(e) => setDraftAgent({...draftAgent, name: e.target.value})}
                                            className="bg-transparent border-b border-transparent focus:border-brand-500 outline-none text-sm font-bold text-white uppercase w-48"
                                        />
                                        <span className="text-[10px] text-slate-500 uppercase px-1 border border-slate-700 rounded">{draftAgent.class}</span>
                                    </div>
                                    <div className="text-[10px] text-brand-500 font-mono">CONSTRUCT BUILDER // {isCreatingNew ? 'INITIALIZING NEW UNIT' : 'MODIFYING EXISTING UNIT'}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => handleDeployAgent(draftAgent.config)} // Trigger save
                                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded text-sm font-bold uppercase transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                            >
                                <Rocket size={16} />
                                {isCreatingNew ? 'Deploy Unit' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-hidden relative">
                        <Playground 
                            mode="lab" 
                            initialState={draftAgent.config}
                            availableTools={MOCK_WEAPONS}
                            equippedToolIds={draftAgent.equippedTools}
                            onToggleTool={handleToggleTool}
                            onSave={(finalConfig) => handleDeployAgent(finalConfig)}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};
