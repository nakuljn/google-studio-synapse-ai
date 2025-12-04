
import React from 'react';
import { OPERATIONS } from '../constants';
import { Target, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Missions: React.FC = () => {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="mb-10 border-b border-dark-border pb-6 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight flex items-center gap-3">
                        <Target className="text-brand-500" size={32} />
                        Campaign Missions
                    </h1>
                    <p className="text-slate-400">
                        Select a mission. Deploy your agents to solve security challenges.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {OPERATIONS.map((op, index) => (
                    <div key={op.id} className="bg-dark-surface border border-dark-border p-6 flex flex-col md:flex-row items-center gap-6 hover:border-brand-500/50 transition-all group">
                        
                        <div className="flex-shrink-0 text-slate-600 font-mono text-4xl font-bold opacity-30 group-hover:opacity-100 group-hover:text-brand-900 transition-all">
                            0{index + 1}
                        </div>

                        <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{op.codename}</h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 uppercase border ${op.difficulty === 'ROOKIE' ? 'text-green-400 border-green-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                                    {op.difficulty}
                                </span>
                             </div>
                             <p className="text-slate-400 text-sm mb-2">{op.description}</p>
                             <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                                 <span>REQ: {op.requiredClass} Class</span>
                                 <span>•</span>
                                 <span className="text-brand-400">XP: {op.rewardXP}</span>
                             </div>
                        </div>

                        <div className="flex-shrink-0">
                            <Link 
                                to={`/missions/${op.id}`} 
                                className="flex items-center gap-2 bg-dark-bg border border-dark-border hover:bg-brand-600 hover:text-white hover:border-brand-500 text-slate-300 px-6 py-3 text-sm font-bold uppercase transition-all"
                            >
                                <Play size={16} fill="currentColor" /> Start Op
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
