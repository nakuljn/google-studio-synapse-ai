
import React, { useState } from 'react';
import { Playground } from '../components/Playground';
import { FlaskConical, Box, Settings, Sidebar } from 'lucide-react';
import { ModelType } from '../types';

export const Lab: React.FC = () => {
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);

    const defaultState = {
        model: ModelType.FLASH,
        temperature: 0.7,
        systemInstruction: '',
        userPrompt: ''
    };

    return (
        <div className="flex flex-col h-full bg-dark-bg">
            <header className="h-12 border-b border-dark-border flex items-center px-4 bg-dark-surface/50">
                <div className="flex items-center space-x-3 text-slate-300">
                    <FlaskConical size={18} />
                    <span className="font-semibold text-sm">Workbench</span>
                </div>
            </header>
            
            <div className="flex-1 flex overflow-hidden">
                {/* Tools Sidebar */}
                <div className={`${leftPanelOpen ? 'w-64' : 'w-12'} border-r border-dark-border bg-dark-surface flex flex-col transition-all duration-300`}>
                    <div className="p-3 flex justify-between items-center border-b border-dark-border">
                        {leftPanelOpen && <span className="text-xs font-bold uppercase text-slate-500">Tools & Context</span>}
                        <button onClick={() => setLeftPanelOpen(!leftPanelOpen)} className="text-slate-400 hover:text-white">
                            <Sidebar size={16} />
                        </button>
                    </div>
                    
                    {leftPanelOpen ? (
                        <div className="p-4 space-y-6 overflow-y-auto">
                            {/* Mock Tools */}
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                    <Box size={14} className="text-brand-400" /> MCP Servers
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-xs text-slate-400 bg-dark-bg p-2 rounded border border-dark-border">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Google Search</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-slate-400 bg-dark-bg p-2 rounded border border-dark-border">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span>PostgreSQL (Disconnected)</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                    <Settings size={14} className="text-brand-400" /> Parameters
                                </h4>
                                <div className="text-xs text-slate-500">
                                    Configure output JSON schema and advanced safety settings here.
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-4 space-y-4">
                            <Box size={20} className="text-slate-500" />
                            <Settings size={20} className="text-slate-500" />
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <Playground 
                        initialState={defaultState}
                        mode="lab"
                    />
                </div>
            </div>
        </div>
    );
};