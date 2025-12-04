
import React from 'react';
import { Playground } from '../components/Playground';
import { Code, Save } from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-dark-bg">
            <header className="h-16 border-b border-dark-border bg-dark-surface/50 flex items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-900/20 p-2 rounded text-blue-400">
                        <Code size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white font-mono uppercase tracking-wider">Sim Playground</h1>
                        <div className="text-xs text-slate-500 font-mono">Unrestricted Testing Environment</div>
                    </div>
                </div>
            </header>
            
            <div className="flex-1 overflow-hidden">
                <Playground mode="lab" />
            </div>
        </div>
    );
};
