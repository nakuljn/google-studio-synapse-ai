
import React from 'react';
import { WARGAMES } from '../constants';
import { Globe, Users, Swords, WifiOff, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Wargames: React.FC = () => {
    // Split games into online vs offline for better structure
    const trainingSims = WARGAMES.filter(g => g.type === 'PvE');
    const liveCombat = WARGAMES.filter(g => g.type === 'PvP');

    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
             <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight flex items-center gap-3">
                    <Globe className="text-red-500" size={32} />
                    Wargames Arena
                </h1>
                <p className="text-slate-400 font-mono text-sm max-w-2xl">
                    Deploy agents in combat simulations. Train offline or compete on the global network.
                </p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Training / Offline */}
                 <div>
                     <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-dark-border pb-2">
                         <WifiOff size={20} className="text-slate-500" />
                         Training Sims (Offline)
                     </h2>
                     <div className="space-y-6">
                        {trainingSims.map(game => (
                             <div key={game.id} className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden group hover:border-brand-500/50 transition-all flex flex-col">
                                 <div className="h-32 bg-black relative overflow-hidden">
                                     <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                                     <div className="absolute top-2 right-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 uppercase rounded">
                                         Solo / PvE
                                     </div>
                                 </div>
                                 <div className="p-4">
                                     <h3 className="text-lg font-bold text-white uppercase tracking-wide">{game.title}</h3>
                                     <p className="text-slate-400 text-xs mb-4">{game.description}</p>
                                     <Link 
                                        to={`/arena/lobby/${game.id}`} 
                                        className="w-full block text-center bg-dark-bg border border-dark-border hover:bg-brand-600 hover:text-white hover:border-brand-500 text-slate-300 py-2 rounded text-xs font-bold uppercase transition-all"
                                    >
                                        Start Simulation
                                    </Link>
                                 </div>
                             </div>
                        ))}
                     </div>
                 </div>

                 {/* Live PvP */}
                 <div>
                     <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-dark-border pb-2">
                         <Wifi size={20} className="text-red-500 animate-pulse" />
                         Live Network (PvP)
                     </h2>
                     <div className="space-y-6">
                        {liveCombat.map(game => (
                             <div key={game.id} className="bg-dark-surface border border-red-900/30 rounded-lg overflow-hidden group hover:border-red-500 transition-all flex flex-col">
                                 <div className="h-40 bg-black relative overflow-hidden">
                                     <img src={game.coverImage} alt={game.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay" />
                                     <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent" />
                                     <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded">
                                         Ranked / PvP
                                     </div>
                                 </div>
                                 <div className="p-4 bg-red-900/5">
                                     <h3 className="text-lg font-bold text-white uppercase tracking-wide">{game.title}</h3>
                                     <p className="text-slate-400 text-xs mb-4">{game.description}</p>
                                     <div className="flex justify-between items-center mb-4 text-[10px] font-mono text-red-300">
                                         <span>{game.activePlayers} Commanders Online</span>
                                         <span className="animate-pulse">● LIVE</span>
                                     </div>
                                     <Link 
                                        to={`/arena/lobby/${game.id}`} 
                                        className="w-full block text-center bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-600 hover:text-white hover:border-red-500 py-2 rounded text-xs font-bold uppercase transition-all"
                                    >
                                        Find Match
                                    </Link>
                                 </div>
                             </div>
                        ))}
                     </div>
                 </div>
             </div>
        </div>
    );
};
