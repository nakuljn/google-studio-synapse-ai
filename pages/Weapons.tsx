
import React, { useState } from 'react';
import { Wrench, Plus, Save, Trash2, Coins, Zap, Shield, Database } from 'lucide-react';
import { MOCK_WEAPONS } from '../constants';
import { Weapon } from '../types';

export const Weapons: React.FC = () => {
    const [weapons, setWeapons] = useState<Weapon[]>(MOCK_WEAPONS);
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

    const handleCreateNew = () => {
        const newWeapon: Weapon = {
            id: `w-${Date.now()}`,
            name: 'New Tool',
            description: 'Describe function behavior...',
            code: 'def function_name(args):\n  pass',
            parameters: '{ "arg": "string" }',
            icon: '🔧',
            rarity: 'COMMON',
            cost: 0
        };
        setWeapons([...weapons, newWeapon]);
        setSelectedWeapon(newWeapon);
    };

    return (
        <div className="flex flex-col h-full bg-dark-bg">
            <header className="h-16 border-b border-dark-border bg-dark-surface/50 flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <div className="bg-amber-900/20 p-2 rounded text-amber-500">
                        <Wrench size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Weapon Factory</h1>
                        <div className="text-xs text-slate-500 font-mono">Build Custom Tools & Function Calls</div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Inventory List */}
                <div className="w-80 border-r border-dark-border bg-dark-bg overflow-y-auto">
                    <div className="p-4 border-b border-dark-border flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Inventory</span>
                        <button 
                            onClick={handleCreateNew}
                            className="p-1 hover:bg-white/10 rounded text-brand-400 transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    {weapons.map(w => (
                        <div 
                            key={w.id}
                            onClick={() => setSelectedWeapon(w)}
                            className={`p-4 border-b border-dark-border cursor-pointer transition-colors hover:bg-white/5 ${selectedWeapon?.id === w.id ? 'bg-brand-900/10 border-l-2 border-l-brand-500' : 'border-l-2 border-l-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{w.icon}</div>
                                <div>
                                    <div className="font-bold text-white text-sm">{w.name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-2">
                                        <span className={w.rarity === 'LEGENDARY' ? 'text-amber-400' : 'text-slate-500'}>{w.rarity}</span>
                                        {w.cost > 0 && <span className="flex items-center text-amber-500"><Coins size={10} className="mr-0.5" /> {w.cost}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor */}
                {selectedWeapon ? (
                    <div className="flex-1 flex flex-col">
                         <div className="p-6 border-b border-dark-border bg-dark-surface/30">
                             <div className="flex justify-between items-start mb-6">
                                 <div className="flex gap-4">
                                     <div className="w-16 h-16 bg-black border border-dark-border flex items-center justify-center text-4xl rounded-lg">
                                         {selectedWeapon.icon}
                                     </div>
                                     <div className="space-y-2">
                                         <input 
                                            type="text" 
                                            value={selectedWeapon.name} 
                                            onChange={(e) => setSelectedWeapon({...selectedWeapon, name: e.target.value})}
                                            className="bg-transparent text-2xl font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-500 w-full"
                                         />
                                         <input 
                                            type="text" 
                                            value={selectedWeapon.description} 
                                            onChange={(e) => setSelectedWeapon({...selectedWeapon, description: e.target.value})}
                                            className="bg-transparent text-sm text-slate-400 focus:outline-none border-b border-transparent focus:border-brand-500 w-full"
                                         />
                                     </div>
                                 </div>
                                 <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded text-sm font-bold uppercase transition-colors">
                                     <Save size={16} /> Save Blueprint
                                 </button>
                             </div>
                         </div>
                         
                         <div className="flex-1 flex flex-col md:flex-row">
                             <div className="flex-1 border-r border-dark-border flex flex-col">
                                 <div className="bg-black border-b border-dark-border px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                     Implementation (Python/JS)
                                 </div>
                                 <textarea 
                                     value={selectedWeapon.code}
                                     onChange={(e) => setSelectedWeapon({...selectedWeapon, code: e.target.value})}
                                     className="flex-1 bg-dark-bg p-4 font-mono text-sm text-brand-300 focus:outline-none resize-none"
                                     spellCheck={false}
                                 />
                             </div>
                             <div className="flex-1 flex flex-col">
                                 <div className="bg-black border-b border-dark-border px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                     Parameters (JSON Schema)
                                 </div>
                                 <textarea 
                                     value={selectedWeapon.parameters}
                                     onChange={(e) => setSelectedWeapon({...selectedWeapon, parameters: e.target.value})}
                                     className="flex-1 bg-dark-bg p-4 font-mono text-sm text-amber-300 focus:outline-none resize-none"
                                     spellCheck={false}
                                 />
                             </div>
                         </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-surface to-dark-bg">
                        <div className="max-w-md w-full text-center">
                            <div className="w-24 h-24 bg-brand-900/10 border border-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                                <Zap size={48} className="text-brand-500" />
                            </div>
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">The Forge</h2>
                            <p className="text-slate-400 text-sm mb-10">
                                Construct custom tools and function calls to equip your agents with new capabilities.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-dark-bg border border-dark-border p-4 rounded text-left">
                                    <div className="text-2xl font-bold text-white mb-1">{weapons.length}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Blueprints Created</div>
                                </div>
                                <div className="bg-dark-bg border border-dark-border p-4 rounded text-left">
                                    <div className="text-2xl font-bold text-amber-400 mb-1">
                                        {weapons.filter(w => w.rarity === 'LEGENDARY').length}
                                    </div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold">Legendary Items</div>
                                </div>
                            </div>

                            <button 
                                onClick={handleCreateNew}
                                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 rounded-lg uppercase tracking-widest shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02]"
                            >
                                <Plus size={18} className="inline mr-2" /> Forge New Tool
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
