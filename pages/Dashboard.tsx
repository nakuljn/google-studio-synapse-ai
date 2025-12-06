
import React from 'react';
import { MY_SQUAD, OPERATIONS, USER_PROFILE } from '../constants';
import { ChevronRight, Zap, Users, Shield, Target, Activity, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    // Calculate progress percentage
    const progress = (USER_PROFILE.currentLevelXP / USER_PROFILE.nextLevelXP) * 100;
    const activeSquad = MY_SQUAD.filter(a => a.status === 'ACTIVE');

  return (
    <div className="h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-dark-bg to-black p-6 md:p-10 flex flex-col overflow-hidden">
        
        {/* Header Area */}
        <div className="flex justify-between items-start mb-8 flex-shrink-0">
            <div>
                 <div className="text-[10px] font-mono text-brand-500 mb-1 animate-pulse">:: SECURE UPLINK ESTABLISHED</div>
                 <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">Command Base</h1>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase font-bold">Network Status</div>
                    <div className="text-emerald-500 font-mono text-sm">DEFCON 5 // STABLE</div>
                </div>
            </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex-1 flex gap-8 overflow-hidden">
            
            {/* Left Column: Commander Profile (25%) */}
            <div className="w-80 flex flex-col gap-6 flex-shrink-0 overflow-y-auto pr-2">
                {/* ID Card */}
                <div className="bg-dark-surface border border-dark-border p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-brand-900/20 rounded border border-brand-500/30 flex items-center justify-center text-3xl">
                            👮‍♂️
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Commander</div>
                            <div className="text-xl font-bold text-white">{USER_PROFILE.username}</div>
                            <div className="text-xs text-brand-400 font-mono">{USER_PROFILE.rank}</div>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                                <span>Level {USER_PROFILE.level}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 bg-black rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-black/30 p-2 rounded">
                            <span className="text-xs text-slate-400">XP</span>
                            <span className="text-sm font-mono text-white">{USER_PROFILE.currentLevelXP}</span>
                        </div>
                    </div>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-dark-surface border border-dark-border p-4 flex flex-col items-center justify-center">
                         <Star size={20} className="text-yellow-400 mb-2" />
                         <div className="text-xl font-bold text-white">{USER_PROFILE.stars}</div>
                         <div className="text-[10px] text-slate-500 uppercase">Stars</div>
                     </div>
                     <div className="bg-dark-surface border border-dark-border p-4 flex flex-col items-center justify-center">
                         <div className="text-xl font-bold text-white">{USER_PROFILE.coins}</div>
                         <div className="text-[10px] text-slate-500 uppercase">Coins</div>
                     </div>
                </div>

                {/* Recent Alerts */}
                <div className="bg-dark-surface border border-dark-border p-4 flex-1">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <Activity size={14} /> Intel Feed
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start opacity-70">
                            <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                            <div>
                                <div className="text-xs text-white">Security Breach Detected</div>
                                <div className="text-[10px] text-slate-500">Sector 7 Firewall down</div>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 w-2 h-2 rounded-full bg-brand-500 shrink-0"></div>
                            <div>
                                <div className="text-xs text-white">New Bounty Posted</div>
                                <div className="text-[10px] text-slate-500">MegaCorp_Sec requires aid</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Column: Active Squad (Visual Stage) (50%) */}
            <div className="flex-1 flex flex-col relative bg-black/20 border border-dark-border/50 rounded-xl overflow-hidden group">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.8),rgba(15,23,42,0.9)),url('https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=1600&q=80')] bg-cover bg-center opacity-30 z-0 pointer-events-none"></div>
                
                <div className="relative z-10 p-6 flex flex-col h-full">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-8">
                        <Users className="text-brand-500" size={20} /> Active Duty Roster
                    </h2>

                    <div className="flex-1 flex items-center justify-center gap-8 perspective-1000">
                        {activeSquad.length > 0 ? activeSquad.map((agent) => (
                            <div key={agent.id} className="relative group/agent cursor-pointer transition-transform duration-300 hover:-translate-y-2">
                                {/* Agent Card */}
                                <div className="w-48 h-72 bg-dark-surface/90 backdrop-blur border border-brand-500/30 rounded-lg flex flex-col items-center justify-between p-4 shadow-xl shadow-brand-900/20 hover:shadow-brand-500/20 hover:border-brand-500 transition-all">
                                    <div className="flex-1 flex items-center justify-center text-6xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {agent.avatar}
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="text-sm font-bold text-white uppercase tracking-widest mb-1">{agent.name}</div>
                                        <div className="text-[10px] bg-brand-900/40 text-brand-300 px-2 py-0.5 rounded border border-brand-500/20 inline-block mb-2">{agent.class}</div>
                                        <div className="flex gap-1 h-1 bg-black/50 rounded-full overflow-hidden w-full">
                                            <div className="bg-emerald-500 h-full" style={{width: `${agent.stats.stealth}%`}}></div>
                                            <div className="bg-blue-500 h-full" style={{width: `${agent.stats.defense}%`}}></div>
                                            <div className="bg-amber-500 h-full" style={{width: `${agent.stats.persuasion}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Hover Stats */}
                                <div className="absolute -bottom-12 left-0 right-0 text-center opacity-0 group-hover/agent:opacity-100 transition-opacity">
                                    <div className="text-[10px] text-brand-400 font-mono">STATUS: READY</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-slate-500">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <div className="text-sm uppercase tracking-widest">No Agents Deployed</div>
                                <Link to="/squad" className="text-xs text-brand-400 hover:text-white mt-2 inline-block border-b border-brand-500/30">Deploy from Reserves</Link>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-auto pt-6 flex justify-center">
                        <Link to="/squad" className="bg-dark-surface border border-dark-border hover:bg-brand-600 hover:border-brand-500 text-white px-6 py-2 rounded text-xs font-bold uppercase transition-all shadow-lg">
                            Manage Squad Configuration
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Column: Current Objective (25%) */}
            <div className="w-80 flex flex-col gap-6 flex-shrink-0">
                <div className="bg-dark-surface border border-brand-500/30 p-6 rounded-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target size={64} className="text-brand-500" />
                    </div>
                    
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={16} className="text-brand-500" /> Priority Mission
                    </h2>

                    {OPERATIONS[0] && (
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white mb-2">{OPERATIONS[0].codename}</h3>
                            <p className="text-xs text-slate-400 mb-4 line-clamp-3">{OPERATIONS[0].description}</p>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs border-b border-dark-border pb-1">
                                    <span className="text-slate-500">DIFFICULTY</span>
                                    <span className="text-brand-400 font-bold">{OPERATIONS[0].difficulty}</span>
                                </div>
                                <div className="flex justify-between text-xs border-b border-dark-border pb-1">
                                    <span className="text-slate-500">REWARD</span>
                                    <span className="text-white font-bold">{OPERATIONS[0].rewardXP} XP</span>
                                </div>
                            </div>

                            <Link to={`/missions/${OPERATIONS[0].id}`} className="block w-full text-center bg-brand-600 hover:bg-brand-500 text-white py-3 rounded text-xs font-bold uppercase transition-all shadow-lg shadow-brand-500/20">
                                Deploy Now
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex-1 bg-dark-surface border border-dark-border p-6 opacity-80">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <Shield size={14} /> Global Threat Level
                    </h3>
                    <div className="flex items-end gap-2 mb-2">
                        <div className="h-16 w-4 bg-emerald-500 rounded-sm animate-pulse"></div>
                        <div className="h-10 w-4 bg-emerald-500/50 rounded-sm"></div>
                        <div className="h-12 w-4 bg-emerald-500/30 rounded-sm"></div>
                        <div className="h-8 w-4 bg-emerald-500/20 rounded-sm"></div>
                        <div className="h-6 w-4 bg-emerald-500/10 rounded-sm"></div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                        Threat activity is low in your sector. Perfect time for <Link to="/training" className="text-brand-400 hover:text-white underline">Training Drills</Link>.
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
