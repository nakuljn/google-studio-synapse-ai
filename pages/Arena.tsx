
import React from 'react';
import { WARGAMES } from '../constants';
import { Globe, Wifi, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wargames: React.FC = () => {
    // Only Live Combat
    const liveCombat = WARGAMES.filter(g => g.type === 'PvP');

    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-dark-bg">
             <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-white mb-2 font-mono uppercase tracking-tight flex items-center justify-center gap-4">
                    <Swords className="text-brand-500 animate-pulse" size={40} />
                    Live Arena
                </h1>
                <p className="text-slate-400 font-mono text-sm max-w-2xl mx-auto">
                    Global PvP Network. Deploy your agents against other commanders in real-time battles.
                    <br/><span className="text-brand-500 font-bold uppercase text-xs">High Stakes Environment</span>
                </p>
             </div>

             <div className="max-w-5xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {liveCombat.map(game => (
                            <div key={game.id} className="bg-dark-surface border border-brand-900/30 rounded-xl overflow-hidden group hover:border-brand-500 transition-all flex flex-col shadow-2xl shadow-brand-900/10">
                                <div className="h-48 bg-black relative overflow-hidden">
                                    <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 to-transparent" />
                                    <div className="absolute top-4 right-4 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 uppercase rounded shadow-lg shadow-brand-500/20">
                                        Ranked Match
                                    </div>
                                </div>
                                <div className="p-6 bg-brand-950/10">
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">{game.title}</h3>
                                    <p className="text-slate-400 text-sm mb-6">{game.description}</p>
                                    
                                    <div className="flex justify-between items-center mb-6 text-xs font-mono text-brand-300 bg-brand-900/20 p-3 rounded">
                                        <span className="flex items-center gap-2"><Globe size={14}/> {game.activePlayers} Commanders Online</span>
                                        <span className="animate-pulse flex items-center gap-1"><Wifi size={14}/> LIVE</span>
                                    </div>
                                    
                                    <Link 
                                    to={`/arena/level/${game.id}`} 
                                    className="w-full block text-center bg-brand-600 text-white hover:bg-brand-500 py-3 rounded font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-600/20"
                                    >
                                        Find Match
                                    </Link>
                                </div>
                            </div>
                    ))}
                    
                    {/* Placeholder for Coming Soon */}
                    <div className="bg-dark-surface/30 border border-dark-border border-dashed rounded-xl flex flex-col items-center justify-center p-10 opacity-50 hover:opacity-80 transition-opacity cursor-not-allowed">
                        <Swords size={48} className="text-slate-600 mb-4" />
                        <div className="text-lg font-bold text-slate-500 uppercase tracking-widest">Seasonal Event</div>
                        <div className="text-xs text-slate-600 mt-2">Unlocks in 3 Days</div>
                    </div>
                 </div>
             </div>
        </div>
    );
};
