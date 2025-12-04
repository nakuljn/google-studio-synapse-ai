
import React, { useState } from 'react';
import { BookOpen, Video, FileText, Lock, Star, Play } from 'lucide-react';
import { MOCK_COURSES } from '../constants';
import { Course } from '../types';

export const Manual: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'ARTICLE'>('ALL');

    const filteredCourses = MOCK_COURSES.filter(c => filter === 'ALL' || c.type === filter);

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto h-full overflow-y-auto">
             <div className="mb-10 text-center md:text-left">
                 <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                     <BookOpen className="text-emerald-500" size={32} />
                     Synapse Academy
                 </h1>
                 <p className="text-slate-400 max-w-2xl">
                     Access classified intelligence, video briefs, and field manuals. Spend Stars to unlock advanced tactics.
                 </p>
             </div>

             {/* Filters */}
             <div className="flex space-x-4 mb-8 justify-center md:justify-start">
                 {['ALL', 'VIDEO', 'ARTICLE'].map(f => (
                     <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-dark-surface text-slate-500 hover:text-white'}`}
                     >
                         {f}
                     </button>
                 ))}
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {filteredCourses.map(course => (
                     <div key={course.id} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all flex flex-col">
                         
                         {/* Thumbnail */}
                         <div className="aspect-video bg-black relative overflow-hidden">
                             <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                             <div className="absolute top-3 left-3">
                                 {course.type === 'VIDEO' ? (
                                     <div className="bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                         <Video size={10} /> {course.duration}
                                     </div>
                                 ) : (
                                     <div className="bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                         <FileText size={10} /> {course.duration}
                                     </div>
                                 )}
                             </div>
                             {course.locked && (
                                 <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4">
                                     <Lock size={32} className="text-emerald-500 mb-2" />
                                     <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">Restricted Access</div>
                                     <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1 transition-colors">
                                         Unlock <Star size={10} fill="currentColor" /> {course.price}
                                     </button>
                                 </div>
                             )}
                             {!course.locked && (
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                     <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg transform scale-50 group-hover:scale-100 transition-transform">
                                         <Play size={20} fill="currentColor" className="ml-1" />
                                     </div>
                                 </div>
                             )}
                         </div>

                         {/* Content */}
                         <div className="p-5 flex-1 flex flex-col">
                             <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                             <p className="text-sm text-slate-400 mb-4 line-clamp-2">{course.description}</p>
                             
                             <div className="mt-auto pt-4 border-t border-dark-border flex justify-between items-center text-xs text-slate-500 font-mono">
                                 <span>{course.modules.length} Modules</span>
                                 <span>{course.price === 0 ? 'FREE' : `${course.price} STARS`}</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};
