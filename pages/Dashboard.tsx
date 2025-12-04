
import React from 'react';
import { MY_CONSTRUCTS, NETWORK_NODES, USER_PROFILE } from '../constants';
import { Shield, AlertTriangle, Activity, Database, Crosshair, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8 text-slate-200">
        
        {/* Header / HUD */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-dark-border/50 pb-6">
            <div>
                <div className="text-xs font-mono text-brand-500 mb-1">:: OPERATOR LOGGED IN</div>
                <h1 className="text-4xl font-bold text-white tracking-tight">WELCOME, {USER_PROFILE.username}</h1>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0 font-mono text-sm">
                <div className="bg-dark-surface border border-dark-border px-4 py-2 rounded flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase">Credits</span>
                    <span className="font-bold text-brand-400">{USER_PROFILE.credits} CR</span>
                </div>
                <div className="bg-dark-surface border border-dark-border px-4 py-2 rounded flex flex-col items-center">
                    <span className="text-[10px] text-slate-500 uppercase">Rank</span>
                    <span className="font-bold text-white">{USER_PROFILE.rank}</span>
                </div>
            </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vault Status */}
            <div className="bg-dark-surface/50 border border-dark-border p-6 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield size={100} />
                </div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Vault Status</h3>
                    <div className={`w-3 h-3 rounded-full ${USER_PROFILE.vaultStatus === 'SECURE' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">{USER_PROFILE.vaultStatus}</div>
                <p className="text-xs text-slate-500">Your primary node is operating within normal parameters. No intrusion attempts detected in last 24h.</p>
                <div className="mt-4 pt-4 border-t border-dark-border/50 flex gap-2">
                    <Link to="/workshop" className="flex-1 bg-dark-bg border border-dark-border hover:border-brand-500 text-center py-2 text-xs font-bold uppercase transition-colors">
                        Reinforce
                    </Link>
                    <button className="flex-1 bg-dark-bg border border-dark-border hover:border-red-500 hover:text-red-500 text-center py-2 text-xs font-bold uppercase transition-colors">
                        View Logs
                    </button>
                </div>
            </div>

            {/* Global Threat Level */}
            <div className="bg-dark-surface/50 border border-dark-border p-6 rounded-lg relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={100} />
                </div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Threat</h3>
                    <div className="text-orange-500 font-mono font-bold animate-pulse">HIGH</div>
                </div>
                <div className="text-2xl font-bold text-white mb-2">342 ACTIVE BREACHES</div>
                <p className="text-xs text-slate-500">New zero-day exploit "Context-Drift" detected in the wild. Patch your sentries immediately.</p>
                
                <div className="mt-4 h-1 w-full bg-dark-bg rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 w-[75%]"></div>
                </div>
            </div>

            {/* Active Op */}
            <div className="bg-brand-900/10 border border-brand-500/30 p-6 rounded-lg relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-sm font-bold text-brand-400 uppercase tracking-widest">Active Bounty</h3>
                    <Crosshair className="text-brand-500" size={20} />
                </div>
                <div className="text-xl font-bold text-white mb-1">{NETWORK_NODES[0].alias}</div>
                <div className="text-xs text-slate-400 mb-4">{NETWORK_NODES[0].owner}</div>
                <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-1 rounded border border-brand-500/20">REWARD: {NETWORK_NODES[0].bountyXP} XP</span>
                </div>
                <Link to="/network" className="block w-full bg-brand-600 hover:bg-brand-500 text-white text-center py-2 rounded text-sm font-bold uppercase transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                    Initiate Breach
                </Link>
            </div>
        </div>

        {/* Quick Access: Intel & Constructs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Database size={18} className="text-slate-500" />
                        Available Intel
                    </h2>
                    <Link to="/intel" className="text-xs text-brand-400 hover:text-white uppercase tracking-wider flex items-center">
                        Database <ChevronRight size={14} />
                    </Link>
                </div>
                <div className="space-y-3">
                    <div className="bg-dark-surface border border-dark-border p-4 rounded flex items-center justify-between hover:border-brand-500/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-900/20 rounded flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">01</div>
                            <div>
                                <div className="font-bold text-white group-hover:text-brand-300">Prompt Injection 101</div>
                                <div className="text-xs text-slate-500">Unlocks: Basic Override Tool</div>
                            </div>
                        </div>
                        <div className="text-xs text-slate-600 uppercase">Acquired</div>
                    </div>
                    <div className="bg-dark-surface border border-dark-border p-4 rounded flex items-center justify-between hover:border-brand-500/50 transition-colors cursor-pointer group opacity-75">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-dark-bg rounded flex items-center justify-center text-slate-600 font-bold border border-dark-border">02</div>
                            <div>
                                <div className="font-bold text-slate-300">Token Splicing</div>
                                <div className="text-xs text-slate-500">Required: Level 2 Clearance</div>
                            </div>
                        </div>
                         <div className="text-xs text-slate-600 uppercase">Locked</div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Shield size={18} className="text-slate-500" />
                        Active Constructs
                    </h2>
                     <Link to="/workshop" className="text-xs text-brand-400 hover:text-white uppercase tracking-wider flex items-center">
                        Workshop <ChevronRight size={14} />
                    </Link>
                </div>
                <div className="space-y-3">
                    {MY_CONSTRUCTS.map(construct => (
                        <div key={construct.id} className="bg-dark-surface border border-dark-border p-4 rounded flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${construct.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div>
                                    <div className="font-bold text-white">{construct.name}</div>
                                    <div className="text-xs text-slate-500 font-mono">SEC_LEVEL_{construct.securityLevel} | {construct.logs} LOGS</div>
                                </div>
                            </div>
                            <div className="text-xs font-mono text-slate-500 uppercase">{construct.role}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
