
import React, { useState } from 'react';
import { MOCK_BOUNTIES } from '../constants';
import { Bounty } from '../types';
import { Crosshair, Plus, Search, ShieldCheck, DollarSign, Bug } from 'lucide-react';

export const Bounties: React.FC = () => {
    const [bounties, setBounties] = useState<Bounty[]>(MOCK_BOUNTIES);
    const [activeTab, setActiveTab] = useState<'hunt' | 'post'>('hunt');

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
             <div className="mb-10 text-center md:text-left">
                 <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                     <Crosshair className="text-red-500" size={32} />
                     Bug Bounties
                 </h1>
                 <p className="text-slate-400">Find flaws in community agents. Earn XP.</p>
             </div>

             {/* Tab Switcher */}
             <div className="flex space-x-1 bg-dark-surface p-1 rounded-lg w-fit mb-8 mx-auto md:mx-0">
                 <button 
                    onClick={() => setActiveTab('hunt')}
                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'hunt' ? 'bg-dark-bg text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     Hunt Bounties
                 </button>
                 <button 
                    onClick={() => setActiveTab('post')}
                    className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'post' ? 'bg-dark-bg text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                     Post Bounty
                 </button>
             </div>

             {activeTab === 'hunt' ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     {bounties.map(bounty => (
                         <div key={bounty.id} className="bg-dark-surface border border-dark-border rounded-xl p-6 relative overflow-hidden group hover:border-brand-500/50 transition-all">
                             {bounty.status === 'claimed' && (
                                 <div className="absolute top-0 right-0 bg-red-900/80 text-red-200 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                     CLAIMED
                                 </div>
                             )}
                             
                             <div className="flex justify-between items-start mb-4">
                                 <div>
                                     <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-300">{bounty.title}</h3>
                                     <div className="text-xs text-slate-500">by {bounty.author}</div>
                                 </div>
                                 <div className="bg-brand-900/20 text-brand-400 px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1 border border-brand-500/30">
                                     <DollarSign size={14} />
                                     {bounty.rewardXP} XP
                                 </div>
                             </div>
                             
                             <p className="text-slate-400 text-sm mb-6">{bounty.description}</p>
                             
                             <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                                 <div className="text-xs text-slate-500 font-mono">
                                     {bounty.attempts} Attempts
                                 </div>
                                 <button disabled={bounty.status === 'claimed'} className="bg-dark-bg border border-dark-border hover:bg-brand-600 hover:text-white hover:border-brand-500 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                     {bounty.status === 'claimed' ? 'View Solution' : 'Start Hunt'}
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
             ) : (
                 <div className="max-w-2xl mx-auto bg-dark-surface border border-dark-border rounded-xl p-8">
                     <div className="text-center mb-8">
                         <ShieldCheck size={48} className="mx-auto text-brand-500 mb-4" />
                         <h2 className="text-xl font-bold text-white">Create a Security Challenge</h2>
                         <p className="text-slate-400 text-sm">Post your agent. If no one breaks it in 7 days, you keep the XP.</p>
                     </div>
                     {/* Placeholder Form */}
                     <div className="space-y-4 opacity-50 pointer-events-none">
                         <input type="text" placeholder="Agent Title" className="w-full bg-dark-bg border border-dark-border p-3 rounded" />
                         <textarea placeholder="System Prompt (The Defense)" className="w-full bg-dark-bg border border-dark-border p-3 rounded h-32" />
                         <button className="w-full bg-brand-600 py-3 rounded text-white font-bold">Post Bounty (Coming Soon)</button>
                     </div>
                     <div className="text-center text-xs text-slate-500 mt-2">Bounty creation is disabled in this demo.</div>
                 </div>
             )}
        </div>
    );
};