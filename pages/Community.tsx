import React, { useEffect, useState } from 'react';
import { getCommunityProjects } from '../services/projectService';
import { Project } from '../types';
import { Heart, GitFork, User, Search, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Community: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        setProjects(getCommunityProjects());
    }, []);

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(filter.toLowerCase()) || 
        p.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto h-full overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Community Lab</h1>
                    <p className="text-slate-400">Discover prompts and tools built by other engineers.</p>
                </div>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search projects..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 w-full md:w-64"
                    />
                    <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-brand-500/30 hover:shadow-lg transition-all group flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <User size={14} />
                                <span>{project.author}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs text-slate-500">
                                <span className="flex items-center space-x-1 hover:text-red-400 cursor-pointer transition-colors">
                                    <Heart size={14} /> <span>{project.likes}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <GitFork size={14} /> <span>{project.forks}</span>
                                </span>
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">{project.title}</h3>
                        <p className="text-slate-400 text-sm mb-6 flex-1">{project.description}</p>
                        
                        <div className="pt-4 border-t border-dark-border mt-auto">
                            <Link 
                                to={`/lab?id=${project.id}`}
                                className="w-full flex items-center justify-center space-x-2 bg-dark-bg border border-dark-border hover:bg-brand-900/20 hover:text-brand-300 hover:border-brand-500/50 text-slate-300 py-2 rounded-lg text-sm font-medium transition-all"
                            >
                                <Play size={16} />
                                <span>Open in Lab</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};