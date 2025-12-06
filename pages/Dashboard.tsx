
import React from 'react';
import { MY_SQUAD, OPERATIONS, USER_PROFILE, WORLD_EVENTS, MOCK_COURSES } from '../constants';
import { ChevronRight, Zap, Users, Shield, Target, Activity, Star, Globe, Radio, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
    // Calculate progress percentage
    const progress = (USER_PROFILE.currentLevelXP / USER_PROFILE.nextLevelXP) * 100;
    const recommendedCourses = MOCK_COURSES.filter(c => !c.locked).slice(0, 2);

  return (
    <div className="h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-dark-bg to-black p-6 md:p-10 flex flex-col overflow-y-auto">
        
        {/* Header Area */}
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
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

        {/* Commander Profile Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Identity Card */}
            <div className="col-span-1 md:col-span-2 bg-dark-surface border border-dark-border p-6 rounded-lg relative overflow-hidden flex items-center gap-6 shadow-lg">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                <div className="w-20 h-20 bg-brand-900/20 rounded-full border border-brand-500/30 flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                    👮‍♂️
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Commander</div>
                            <div className="text-2xl font-bold text-white">{USER_PROFILE.username}</div>
                            <div className="text-xs text-brand-400 font-mono">{USER_PROFILE.rank}</div>
                        </div>
                        <div className="text-right">
                             <div className="text-3xl font-bold text-white font-mono">{USER_PROFILE.level}</div>
                             <div className="text-[10px] text-slate-500 uppercase">Level</div>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                            <span>XP Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-black rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Economy Stats */}
            <div className="bg-dark-surface border border-dark-border p-6 rounded-lg flex flex-col justify-center items-center shadow-lg hover:border-brand-500/30 transition-all">
                <Star size={24} className="text-yellow-400 mb-2" />
                <div className="text-3xl font-bold text-white">{USER_PROFILE.stars}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Stars</div>
            </div>
            
            <div className="bg-dark-surface border border-dark-border p-6 rounded-lg flex flex-col justify-center items-center shadow-lg hover:border-brand-500/30 transition-all">
                <div className="text-3xl font-bold text-white">{USER_PROFILE.coins}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Coins</div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: World Updates (Feed) */}
            <div className="lg:col-span-1 bg-dark-surface/50 border border-dark-border rounded-lg p-6 flex flex-col h-[500px]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Radio size={16} className="text-red-500 animate-pulse" /> Global Neural Feed
                </h3>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                    {WORLD_EVENTS.map(event => (
                        <div key={event.id} className="border-l-2 border-slate-700 pl-4 py-1 hover:border-brand-500 transition-colors group">
                            <div className="flex justify-between items-start text-[10px] text-slate-500 uppercase font-mono mb-1">
                                <span className={event.type === 'BREACH' ? 'text-red-400' : event.type === 'DEPLOY' ? 'text-brand-400' : 'text-slate-500'}>
                                    {event.type}
                                </span>
                                <span>{event.timestamp}</span>
                            </div>
                            <div className="text-sm text-slate-300">
                                {event.user && <span className="font-bold text-white">{event.user} </span>}
                                {event.message}
                            </div>
                        </div>
                    ))}
                    <div className="border-l-2 border-slate-700 pl-4 py-1 opacity-50">
                        <div className="text-[10px] text-slate-500 uppercase font-mono">SYSTEM</div>
                        <div className="text-sm text-slate-400 italic">...listening for signals...</div>
                    </div>
                </div>
            </div>

            {/* Column 2 & 3: Missions & Academy */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Upcoming Missions */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Target size={16} className="text-brand-500" /> Active Operations
                        </h3>
                        <Link to="/missions" className="text-xs text-brand-400 hover:text-white uppercase font-bold">View All</Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {OPERATIONS.slice(0, 2).map(op => (
                            <Link key={op.id} to={`/missions/${op.id}`} className="bg-dark-surface border border-dark-border hover:border-brand-500 p-5 rounded-lg group transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 uppercase border rounded ${op.difficulty === 'ROOKIE' ? 'text-green-400 border-green-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                                        {op.difficulty}
                                    </div>
                                    <div className="text-xs font-mono text-brand-400">{op.rewardXP} XP</div>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1 group-hover:text-brand-300">{op.codename}</h4>
                                <p className="text-xs text-slate-400 line-clamp-2">{op.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Academy Suggestions */}
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <BookOpen size={16} className="text-emerald-500" /> Recommended Intel
                        </h3>
                        <Link to="/manual" className="text-xs text-brand-400 hover:text-white uppercase font-bold">Open Academy</Link>
                    </div>

                    <div className="bg-dark-surface/50 border border-dark-border rounded-lg p-1">
                        {recommendedCourses.map((course, idx) => (
                            <Link key={course.id} to="/manual" className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${idx !== recommendedCourses.length -1 ? 'border-b border-dark-border' : ''}`}>
                                <div className="w-16 h-10 bg-black rounded overflow-hidden flex-shrink-0">
                                    <img src={course.thumbnail} className="w-full h-full object-cover opacity-70" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-white">{course.title}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                        <Clock size={10} /> {course.duration}
                                        <span>•</span>
                                        <span className="text-emerald-500">{course.type}</span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-600" />
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
