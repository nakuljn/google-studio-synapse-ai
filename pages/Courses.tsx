
import React, { useState } from 'react';
import { MOCK_COURSES } from '../constants';
import { Search, Clock, BarChart, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Courses: React.FC = () => {
    const [filter, setFilter] = useState('');

    const filteredCourses = MOCK_COURSES.filter(c => 
        c.title.toLowerCase().includes(filter.toLowerCase()) || 
        c.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Course Catalog</h1>
                    <p className="text-slate-400">Structured learning paths from Zero to AI Engineer.</p>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search topics..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 w-full md:w-64"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                    <Link key={course.id} to={`/course/${course.id}`} className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300 flex flex-col h-full">
                        <div className="h-48 overflow-hidden relative">
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-transparent to-transparent" />
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {course.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                                <div className="bg-brand-500 p-3 rounded-full text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    <Play size={24} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    course.difficulty === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                                    course.difficulty === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                                    'bg-red-900/30 text-red-400'
                                }`}>
                                    {course.difficulty}
                                </span>
                                <span className="text-slate-500 text-xs flex items-center">
                                    <Clock size={12} className="mr-1" /> {course.duration}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{course.title}</h3>
                            <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">{course.description}</p>
                            
                            <div className="pt-4 border-t border-dark-border flex items-center justify-between text-sm font-medium text-slate-300 group-hover:text-white">
                                <span>{course.modules.length} Modules</span>
                                <ChevronRight size={16} className="text-brand-500 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};