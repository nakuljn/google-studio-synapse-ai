
import React from 'react';
import { NETWORK_NODES } from '../constants';
import { Globe, Lock, ShieldAlert, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Arena: React.FC = () => {
    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
             <div className="flex justify-between items-end mb-10 border-b border-dark-border pb-6">
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight flex items-center gap-3">
                        <Globe className="text-brand-500" size={32} />
                        Global Network
                    </h1>
                    <p className="text-slate-400 font-mono text-sm">
                        Scanning for vulnerable nodes...
                    </p>
                 </div>
                 <div className="hidden md:flex items-center gap-2 text-green-500 font-mono text-xs animate-pulse">
                     <Wifi size={14} /> LINK ESTABLISHED
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {NETWORK_NODES.map(node => (
                     <div key={node.id} className="bg-dark-surface/80 backdrop-blur border border-dark-border rounded-lg p-6 relative group hover:border-brand-500/50 transition-all">
                         {/* Difficulty Badge */}
                         <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                             node.difficulty === 'LOW' ? 'bg-green-900/20 text-green-400 border-green-500/30' :
                             node.difficulty === 'MED' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30' :
                             'bg-red-900/20 text-red-400 border-red-500/30'
                         }`}>
                             Sec_Level: {node.difficulty}
                         </div>

                         <div className="flex items-center gap-4 mb-6">
                             <div className="w-16 h-16 bg-black rounded-lg border border-dark-border flex items-center justify-center text-4xl shadow-inner">
                                 {node.avatar}
                             </div>
                             <div>
                                 <h3 className="text-lg font-bold text-white font-mono">{node.alias}</h3>
                                 <div className="text-xs text-slate-500 uppercase">{node.owner}</div>
                             </div>
                         </div>

                         <div className="space-y-4 mb-6">
                             <div className="flex justify-between text-xs border-b border-dark-border/50 pb-2">
                                 <span className="text-slate-500 uppercase">Target Data</span>
                                 <span className="text-red-400 font-mono">*******</span>
                             </div>
                             <div className="flex justify-between text-xs border-b border-dark-border/50 pb-2">
                                 <span className="text-slate-500 uppercase">Bounty</span>
                                 <span className="text-brand-400 font-mono font-bold">{node.bountyXP} XP</span>
                             </div>
                         </div>

                         <Link 
                            to={`/arena/${node.id}`} 
                            className="block w-full bg-dark-bg border border-dark-border hover:bg-brand-900/20 hover:text-brand-400 hover:border-brand-500 text-slate-300 py-3 rounded text-sm font-bold uppercase tracking-wider transition-all text-center"
                        >
                            Establish Connection
                         </Link>
                     </div>
                 ))}
             </div>
        </div>
    );
};
