
import React from 'react';
import { INTEL_DATABASE } from '../constants';
import { Database, Lock, Unlock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Courses: React.FC = () => {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="mb-10 border-b border-dark-border pb-6">
                <h1 className="text-3xl font-bold text-white mb-2 font-mono uppercase tracking-tight">Intel Database</h1>
                <p className="text-slate-400 max-w-2xl">
                    Download specialized knowledge modules to upgrade your hacking capabilities and defensive protocols.
                </p>
            </div>

            <div className="space-y-6">
                {INTEL_DATABASE.map(module => (
                    <div key={module.id} className="bg-dark-surface border border-dark-border hover:border-brand-500/50 transition-all rounded-lg overflow-hidden flex flex-col md:flex-row group">
                         {/* Image / Status */}
                         <div className="md:w-64 h-48 md:h-auto relative">
                             <img src={module.image} alt="" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500" />
                             <div className="absolute inset-0 bg-gradient-to-r from-dark-surface to-transparent" />
                             <div className="absolute top-4 left-4">
                                 {module.clearanceLevel === 'Level 1' ? (
                                     <div className="bg-green-900/80 text-green-400 px-2 py-1 rounded text-[10px] font-bold uppercase border border-green-500/30 flex items-center gap-1">
                                         <Unlock size={10} /> Access Granted
                                     </div>
                                 ) : (
                                     <div className="bg-red-900/80 text-red-400 px-2 py-1 rounded text-[10px] font-bold uppercase border border-red-500/30 flex items-center gap-1">
                                         <Lock size={10} /> {module.clearanceLevel}
                                     </div>
                                 )}
                             </div>
                         </div>

                         {/* Content */}
                         <div className="p-6 flex-1 flex flex-col justify-between">
                             <div>
                                 <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white font-mono">{module.title}</h3>
                                    <span className="text-xs text-slate-500 font-mono">{module.duration}</span>
                                 </div>
                                 <p className="text-slate-400 text-sm mb-4">{module.description}</p>
                                 
                                 <div className="space-y-2">
                                     <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Unlocks</div>
                                     <div className="flex flex-wrap gap-2">
                                         {module.unlocks.map(unlock => (
                                             <span key={unlock} className="text-xs bg-brand-900/20 text-brand-300 border border-brand-500/20 px-2 py-1 rounded font-mono">
                                                 [{unlock}]
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             </div>

                             <div className="mt-6 pt-4 border-t border-dark-border/50 flex justify-end">
                                 {module.chapters.length > 0 ? (
                                    <Link to={`/course/${module.id}`} className="flex items-center gap-2 bg-brand-700 hover:bg-brand-600 text-white px-6 py-2 rounded text-sm font-bold uppercase transition-colors">
                                        <Play size={16} fill="currentColor" /> Initialize
                                    </Link>
                                 ) : (
                                     <button disabled className="text-slate-600 text-xs font-bold uppercase cursor-not-allowed">
                                         Constructing Data...
                                     </button>
                                 )}
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
