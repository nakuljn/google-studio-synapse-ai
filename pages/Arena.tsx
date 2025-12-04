
import React, { useState } from 'react';
import { GAME_MODES, ARENA_LEVELS } from '../constants';
import { Link } from 'react-router-dom';
import { Lock, Trophy, ChevronRight } from 'lucide-react';

export const Arena: React.FC = () => {
    const [selectedMode, setSelectedMode] = useState(GAME_MODES[0].id);

    const activeMode = GAME_MODES.find(m => m.id === selectedMode);
    const filteredLevels = ARENA_LEVELS.filter(l => l.mode === activeMode?.type);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
             <div className="mb-12">
                 <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Arena Arcade</h1>
                 <p className="text-lg text-slate-400 max-w-2xl">
                     Select a game mode. Compete for the leaderboard.
                 </p>
             </div>

             {/* Game Modes */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {GAME_MODES.map(mode => (
                     <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`text-left relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${
                            selectedMode === mode.id 
                                ? 'bg-gradient-to-br from-dark-surface to-dark-bg border-brand-500 shadow-xl shadow-brand-500/10' 
                                : 'bg-dark-surface border-dark-border opacity-70 hover:opacity-100 hover:border-slate-600'
                        }`}
                     >
                         <div className={`p-3 rounded-lg w-fit mb-4 ${selectedMode === mode.id ? 'bg-brand-500 text-white' : 'bg-dark-bg text-slate-400'}`}>
                             <mode.icon size={24} />
                         </div>
                         <h3 className={`text-xl font-bold mb-1 ${selectedMode === mode.id ? 'text-white' : 'text-slate-300'}`}>{mode.title}</h3>
                         <p className="text-sm text-slate-500">{mode.description}</p>
                         
                         {selectedMode === mode.id && (
                             <div className="absolute top-0 right-0 p-4">
                                 <span className="flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                                </span>
                             </div>
                         )}
                     </button>
                 ))}
             </div>

             {/* Levels for Selected Mode */}
             <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                     {activeMode?.title} Levels
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {filteredLevels.map((level) => (
                         <Link key={level.id} to={`/arena/${level.id}`} className="group relative bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-brand-500/50 hover:translate-y-[-2px] transition-all">
                             <div className="flex justify-between items-start mb-6">
                                <div className="text-4xl">{level.avatar}</div>
                                <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${level.difficulty > 2 ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                                    Diff {level.difficulty}
                                </div>
                             </div>
                             
                             <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{level.name}</h3>
                             <p className="text-sm text-slate-400 line-clamp-2 mb-4">{level.description}</p>
                             
                             <div className="flex items-center text-brand-400 font-bold text-sm">
                                 <span>Start Challenge</span>
                                 <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                             </div>
                         </Link>
                     ))}
                     
                     {/* Lock State Placeholder */}
                     <div className="bg-dark-surface/30 border border-dark-border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-50">
                        <Lock size={32} className="text-slate-600 mb-2" />
                        <span className="text-sm text-slate-500">Complete previous levels to unlock more</span>
                     </div>
                 </div>
             </div>
        </div>
    );
}