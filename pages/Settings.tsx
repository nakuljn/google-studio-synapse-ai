
import React from 'react';
import { User, Bell, Key } from 'lucide-react';

export const Settings: React.FC = () => {
    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
            
            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User size={18} className="text-brand-400" /> Profile
                    </h2>
                    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Username</label>
                                <input type="text" value="John Doe" disabled className="w-full bg-dark-bg border border-dark-border rounded p-2 text-slate-400" />
                            </div>
                             <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                                <input type="text" value="john@synapse.ai" disabled className="w-full bg-dark-bg border border-dark-border rounded p-2 text-slate-400" />
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Key size={18} className="text-brand-400" /> API Configuration
                    </h2>
                    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Gemini API Key</label>
                        <div className="flex space-x-2">
                            <input type="password" value="************************" disabled className="flex-1 bg-dark-bg border border-dark-border rounded p-2 text-slate-400 font-mono" />
                            <button className="bg-dark-bg border border-dark-border text-slate-300 px-4 rounded text-sm hover:bg-white/5">Change</button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Your API key is stored locally in your browser environment variable config.
                        </p>
                    </div>
                </section>
                
                 <section>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-brand-400" /> Notifications
                    </h2>
                    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-slate-200 font-medium">Bounty Alerts</div>
                                <div className="text-slate-500 text-xs">Get notified when new bounties are posted.</div>
                            </div>
                             <div className="w-10 h-5 bg-brand-600 rounded-full relative cursor-pointer">
                                 <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                             </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}