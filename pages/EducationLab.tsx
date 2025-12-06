
import React, { useState } from 'react';
import { LAB_EXERCISES } from '../constants';
import { Beaker, ChevronLeft, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { Playground } from '../components/Playground';
import { LabExercise } from '../types';

export const EducationLab: React.FC = () => {
    const [selectedLab, setSelectedLab] = useState<LabExercise | null>(null);

    if (selectedLab) {
        return (
            <div className="flex flex-col h-full bg-dark-bg">
                {/* Lab Header */}
                <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedLab(null)} className="text-slate-500 hover:text-white flex items-center gap-2">
                            <ChevronLeft size={18} /> Exit Lab
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-white uppercase tracking-wider">{selectedLab.title}</h1>
                            <span className="text-xs text-brand-400 font-mono">Exercise Mode</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Instructions Panel */}
                    <div className="w-80 bg-dark-bg border-r border-dark-border p-6 overflow-y-auto">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Instructions</h3>
                        <p className="text-sm text-slate-300 mb-6 whitespace-pre-wrap">{selectedLab.instructions}</p>
                        
                        <div className="bg-brand-900/10 border border-brand-500/20 p-4 rounded text-xs text-brand-200">
                            <strong>Goal:</strong> {selectedLab.description}
                        </div>
                    </div>
                    
                    {/* Playground */}
                    <div className="flex-1">
                        <Playground 
                            initialState={selectedLab.initialState} 
                            mode="lesson" 
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="mb-10 text-center md:text-left">
                 <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                     <Beaker className="text-purple-500" size={32} />
                     Skill Labs
                 </h1>
                 <p className="text-slate-400 max-w-2xl">
                     Hands-on exercises to master prompt engineering and agent architecture. 
                     Select a module to enter the simulation environment.
                 </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {LAB_EXERCISES.map(lab => (
                     <div 
                        key={lab.id} 
                        onClick={() => setSelectedLab(lab)}
                        className="bg-dark-surface border border-dark-border hover:border-purple-500 p-6 rounded-xl cursor-pointer group transition-all"
                     >
                         <div className="flex justify-between items-start mb-4">
                             <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${lab.difficulty === 'BEGINNER' ? 'text-green-400 border-green-500/30' : lab.difficulty === 'INTERMEDIATE' ? 'text-yellow-400 border-yellow-500/30' : 'text-red-400 border-red-500/30'}`}>
                                 {lab.difficulty}
                             </div>
                             <div className="text-xs text-slate-500 font-mono">{lab.duration}</div>
                         </div>
                         
                         <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{lab.title}</h3>
                         <p className="text-sm text-slate-400 mb-6 line-clamp-2">{lab.description}</p>
                         
                         <div className="flex items-center text-xs font-bold text-purple-400 group-hover:translate-x-2 transition-transform">
                             Start Exercise <ChevronRight size={14} className="ml-1" />
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};
