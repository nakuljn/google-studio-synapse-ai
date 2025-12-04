
import React, { useState } from 'react';
import { MY_CONSTRUCTS } from '../constants';
import { Playground } from '../components/Playground';
import { Cpu, Save, ShieldCheck } from 'lucide-react';
import { Construct } from '../types';

export const Lab: React.FC = () => {
    // In real app, select from list. Here defaulting to first.
    const [activeConstruct, setActiveConstruct] = useState<Construct>(MY_CONSTRUCTS[0]);

    return (
        <div className="flex flex-col h-full bg-dark-bg">
            <header className="h-16 border-b border-dark-border bg-dark-surface/50 flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <div className="bg-brand-900/20 p-2 rounded text-brand-400">
                        <Cpu size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Construct Workshop</h1>
                        <div className="text-xs text-slate-500 font-mono">Editing: {activeConstruct.name}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${activeConstruct.status === 'ONLINE' ? 'bg-green-900/20 text-green-400 border border-green-500/20' : 'bg-red-900/20 text-red-400'}`}>
                         {activeConstruct.status}
                     </span>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Construct List */}
                <div className="w-64 border-r border-dark-border bg-dark-bg hidden lg:flex flex-col">
                    <div className="p-4 border-b border-dark-border text-xs font-bold text-slate-500 uppercase tracking-widest">
                        My Sentries
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {MY_CONSTRUCTS.map(c => (
                            <button 
                                key={c.id}
                                onClick={() => setActiveConstruct(c)}
                                className={`w-full text-left p-4 border-b border-dark-border transition-colors hover:bg-white/5 ${activeConstruct.id === c.id ? 'bg-brand-900/10 border-l-2 border-l-brand-500' : 'border-l-2 border-l-transparent'}`}
                            >
                                <div className="font-bold text-slate-200 text-sm mb-1">{c.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono uppercase flex justify-between">
                                    <span>{c.role}</span>
                                    <span>Lvl {c.securityLevel}</span>
                                </div>
                            </button>
                        ))}
                        <button className="w-full p-4 text-xs text-brand-400 hover:text-brand-300 uppercase font-bold border-b border-dark-border border-dashed">
                            + Initialize New
                        </button>
                    </div>
                </div>

                {/* Main: Editor */}
                <div className="flex-1 flex flex-col">
                    <Playground 
                        mode="lab"
                        initialState={activeConstruct.state}
                        onSave={(newState) => {
                            console.log("Saving construct state:", newState);
                            alert("Protocol Updated. Rebooting Sentry...");
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
