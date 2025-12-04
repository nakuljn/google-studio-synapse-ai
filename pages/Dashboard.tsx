
import React from 'react';
import { MY_SQUAD, OPERATIONS, USER_PROFILE } from '../constants';
import { ChevronRight, Shield, Swords, Zap, Users, BookOpen, Code, Star, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    // Calculate progress percentage
    const progress = (USER_PROFILE.currentLevelXP / USER_PROFILE.nextLevelXP) * 100;

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 text-slate-200">
        
        {/* Status Header (Gamified Profile) */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-dark-border/50 pb-6">
            <div className="flex-1">
                <div className="text-xs font-mono text-brand-500 mb-1 animate-pulse">:: SECURE CONNECTION ESTABLISHED</div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">Cmdr. {USER_PROFILE.username}</h1>
                <div className="flex items-center gap-4 mt-4">
                    {/* Level Bar */}
                    <div className="flex-1 max-w-sm">
                        <div className="flex justify-between text-xs font-bold uppercase mb-1">
                            <span className="text-white">Level {USER_PROFILE.level}</span>
                            <span className="text-slate-500">{USER_PROFILE.currentLevelXP} / {USER_PROFILE.nextLevelXP} XP</span>
                        </div>
                        <div className="h-2 bg-dark-surface border border-dark-border rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Currency Pouch */}
            <div className="flex gap-6 mt-6 md:mt-0 font-mono text-sm">
                <div className="bg-dark-surface border border-dark-border px-4 py-2 rounded-lg flex items-center gap-3">
                    <div className="p-1.5 bg-yellow-500/10 rounded-full">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Stars</div>
                        <div className="text-lg font-bold text-white leading-none">{USER_PROFILE.stars}</div>
                    </div>
                </div>
                <div className="bg-dark-surface border border-dark-border px-4 py-2 rounded-lg flex items-center gap-3">
                    <div className="p-1.5 bg-amber-600/10 rounded-full">
                        <Coins size={16} className="text-amber-500" />
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Coins</div>
                        <div className="text-lg font-bold text-white leading-none">{USER_PROFILE.coins.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/missions" className="bg-dark-surface border border-dark-border p-4 hover:bg-brand-900/10 hover:border-brand-500/50 transition-all group">
                <Zap className="text-brand-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <div className="font-bold text-white">Missions</div>
                <div className="text-[10px] text-slate-500 uppercase">Continue Campaign</div>
            </Link>
            <Link to="/wargames" className="bg-dark-surface border border-dark-border p-4 hover:bg-red-900/10 hover:border-red-500/50 transition-all group">
                <Swords className="text-red-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <div className="font-bold text-white">Wargames</div>
                <div className="text-[10px] text-slate-500 uppercase">Enter Arena</div>
            </Link>
            <Link to="/playground" className="bg-dark-surface border border-dark-border p-4 hover:bg-blue-900/10 hover:border-blue-500/50 transition-all group">
                <Code className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <div className="font-bold text-white">Playground</div>
                <div className="text-[10px] text-slate-500 uppercase">Free Build</div>
            </Link>
            <Link to="/manual" className="bg-dark-surface border border-dark-border p-4 hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all group">
                <BookOpen className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
                <div className="font-bold text-white">Academy</div>
                <div className="text-[10px] text-slate-500 uppercase">Learn & Upskill</div>
            </Link>
        </div>

        {/* 1. Active Operations */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap size={20} className="text-brand-500" />
                    Active Mission Objectives
                </h2>
                <Link to="/missions" className="text-xs text-brand-400 hover:text-white uppercase tracking-wider flex items-center group">
                    Mission Log <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {OPERATIONS.slice(0, 2).map(op => (
                    <div key={op.id} className="bg-dark-surface border border-dark-border p-6 rounded-none relative group hover:border-brand-500/50 transition-all">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500/0 group-hover:bg-brand-500 transition-colors"></div>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] font-bold px-2 py-1 uppercase border ${op.difficulty === 'ROOKIE' ? 'text-green-400 border-green-500/30 bg-green-900/10' : 'text-amber-400 border-amber-500/30 bg-amber-900/10'}`}>
                                {op.difficulty}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">REWARD: {op.rewardXP} XP</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{op.codename}</h3>
                        <p className="text-sm text-slate-400 mb-6 line-clamp-2">{op.description}</p>
                        <Link to={`/missions/${op.id}`} className="inline-flex items-center text-xs font-bold text-brand-400 hover:text-white uppercase tracking-widest">
                            [ Deploy Agent ]
                        </Link>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. Squad Readiness */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Users size={20} className="text-blue-500" />
                    Squad Roster
                </h2>
                <Link to="/squad" className="text-xs text-brand-400 hover:text-white uppercase tracking-wider flex items-center group">
                    Manage Squad <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MY_SQUAD.map(agent => (
                    <div key={agent.id} className="bg-dark-surface border border-dark-border p-4 rounded-none flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-dark-bg border border-dark-border flex items-center justify-center text-2xl rounded-sm">
                            {agent.avatar}
                        </div>
                        <div>
                            <div className="font-bold text-white">{agent.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-blue-400">{agent.class} // LVL {agent.level}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
