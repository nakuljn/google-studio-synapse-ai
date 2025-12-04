

import React, { useEffect, useState } from 'react';
import { MOCK_COURSES } from '../constants';
import { Course, Project } from '../types';
import { getMyProjects } from '../services/projectService';
import { Clock, PlayCircle, Video, Flame, Calendar, ArrowRight, BrainCircuit, Activity, Swords } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  
  useEffect(() => {
     const completed = JSON.parse(localStorage.getItem('synapse_completed_lessons') || '[]');
     setCompletedCount(completed.length);
     setRecentProjects(getMyProjects().slice(0, 3));
  }, []);

  // Mock Activity Data (Green squares)
  const activityDays = Array.from({ length: 52 }, (_, i) => ({
      level: Math.random() > 0.7 ? Math.floor(Math.random() * 4) : 0
  }));

  const activeCourse = MOCK_COURSES[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
              <h1 className="text-3xl font-bold text-white mb-1">Command Center</h1>
              <p className="text-slate-400">The Interactive Ecosystem to Learn, Build, and Secure AI.</p>
          </div>
          <div className="flex items-center space-x-2 bg-dark-surface px-4 py-2 rounded-lg border border-dark-border">
              <Flame className="text-orange-500" size={20} fill="currentColor" />
              <div>
                  <div className="text-xs text-slate-500 uppercase font-bold">Daily Streak</div>
                  <div className="text-white font-mono font-bold">12 Days</div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Continue Learning Hero */}
            <div className="bg-gradient-to-r from-brand-900/40 to-dark-surface border border-brand-500/20 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-black/50 to-transparent z-10" />
                <img src={activeCourse.image} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" alt="" />
                
                <div className="relative z-20">
                    <div className="flex items-center space-x-2 text-brand-300 mb-2">
                        <PlayCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Continue Learning</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{activeCourse.title}</h2>
                    <p className="text-slate-300 max-w-lg mb-6 line-clamp-2">{activeCourse.description}</p>
                    
                    <div className="flex items-center gap-4">
                        <Link to={`/course/${activeCourse.id}`} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center space-x-2 transition-all shadow-lg shadow-brand-500/20">
                            <span>Resume Module 1</span>
                            <ArrowRight size={16} />
                        </Link>
                        <div className="text-xs text-slate-400 font-mono">
                            35% Complete
                        </div>
                    </div>
                </div>
            </div>

            {/* Contribution Graph */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-200 font-semibold flex items-center gap-2">
                        <Activity size={16} className="text-brand-400" />
                        Neural Activity
                    </h3>
                    <span className="text-xs text-slate-500">Last 3 Months</span>
                 </div>
                 <div className="flex justify-between items-end gap-1 h-20">
                     {activityDays.map((day, i) => (
                         <div 
                            key={i} 
                            className={`w-full rounded-sm transition-all hover:opacity-80
                                ${day.level === 0 ? 'bg-dark-bg h-full' : ''}
                                ${day.level === 1 ? 'bg-brand-900/50 h-[30%]' : ''}
                                ${day.level === 2 ? 'bg-brand-700 h-[50%]' : ''}
                                ${day.level === 3 ? 'bg-brand-500 h-[80%]' : ''}
                                ${day.level >= 4 ? 'bg-brand-300 h-full' : ''}
                            `}
                         />
                     ))}
                 </div>
                 <div className="mt-4 flex justify-between text-xs text-slate-500">
                     <span>Jan</span>
                     <span>Feb</span>
                     <span>Mar</span>
                 </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
                 <Link to="/arena" className="bg-gradient-to-br from-red-900/20 to-dark-surface border border-red-500/20 p-5 rounded-xl hover:border-red-500/50 transition-colors group">
                    <Swords size={24} className="text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white">Enter Arena</h3>
                    <p className="text-xs text-slate-400 mt-1">Battle AI security models.</p>
                 </Link>
                  <Link to="/lab" className="bg-gradient-to-br from-brand-900/20 to-dark-surface border border-brand-500/20 p-5 rounded-xl hover:border-brand-500/50 transition-colors group">
                    <BrainCircuit size={24} className="text-brand-500 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-white">Open Lab</h3>
                    <p className="text-xs text-slate-400 mt-1">Build & Test Agents.</p>
                 </Link>
            </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
            {/* Live Events */}
            <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-white font-bold text-sm">Upcoming Live Events</h3>
                     <Calendar size={14} className="text-slate-500" />
                </div>
                <div className="space-y-4">
                    <div className="relative pl-4 border-l-2 border-brand-500">
                         <div className="text-xs text-brand-400 font-bold mb-0.5">TODAY 14:00 UTC</div>
                         <h4 className="text-sm text-slate-200 font-medium">Prompt Hacking with Dr. Smith</h4>
                         <button className="mt-2 text-xs bg-brand-600/20 text-brand-300 px-2 py-1 rounded hover:bg-brand-600 hover:text-white transition-colors">
                             Register
                         </button>
                    </div>
                     <div className="relative pl-4 border-l-2 border-slate-700">
                         <div className="text-xs text-slate-500 font-bold mb-0.5">TOMORROW</div>
                         <h4 className="text-sm text-slate-400 font-medium">Voice Agent Architecture</h4>
                    </div>
                </div>
            </div>

            {/* Recent Projects */}
             <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-sm">My Projects</h3>
                    <Link to="/lab" className="text-xs text-brand-400 hover:text-white">New</Link>
                </div>
                <div className="space-y-3">
                    {recentProjects.length > 0 ? recentProjects.map(p => (
                        <Link key={p.id} to={`/lab?id=${p.id}`} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded bg-dark-bg border border-dark-border flex items-center justify-center text-slate-500 group-hover:text-brand-400 group-hover:border-brand-500/30">
                                    <BrainCircuit size={14} />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-200 font-medium">{p.title}</div>
                                    <div className="text-[10px] text-slate-500">Edited 2h ago</div>
                                </div>
                            </div>
                        </Link>
                    )) : (
                        <div className="text-center py-4 text-slate-500 text-xs italic">
                            No projects yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};