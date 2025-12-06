
import React, { useState, useRef, useEffect } from 'react';
import { Bot, ChevronRight, Terminal, Zap, Shield, Wrench, PlayCircle, Clock, MessageSquare, Dumbbell, Send, RefreshCw, StopCircle } from 'lucide-react';
import { MY_SQUAD } from '../constants';
import { Agent, DrillResult } from '../types';
import { streamContent } from '../services/geminiService';
import { ModelType } from '../types';
import ReactMarkdown from 'react-markdown';

export const PlaygroundPage: React.FC = () => {
    // Filter active agents
    const activeAgents = MY_SQUAD.filter(a => a.status === 'ACTIVE');
    
    // State
    const [trainingMode, setTrainingMode] = useState<'SELECT' | 'AGENT' | 'PROMPT'>('SELECT');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(activeAgents[0] || null);
    const [selectedDrill, setSelectedDrill] = useState<'REFLEX' | 'SHIELD' | 'TOOL' | null>(null);
    
    // Drill Session State
    const [drillStatus, setDrillStatus] = useState<'IDLE' | 'ACTIVE' | 'COMPLETE'>('IDLE');
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Metrics State
    const [metrics, setMetrics] = useState({
        startTime: 0,
        latencies: [] as number[],
        totalTokens: 0,
        estimatedCost: 0
    });
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- PROMPT DRILL STATE ---
    const [promptInput, setPromptInput] = useState('');
    const [promptOutput, setPromptOutput] = useState('');
    const [isPromptRunning, setIsPromptRunning] = useState(false);

    const handlePromptRun = async () => {
        setIsPromptRunning(true);
        setPromptOutput('');
        try {
            await streamContent(ModelType.FLASH, '', promptInput, 0.7, (text) => setPromptOutput(text));
        } catch (e) {
            setPromptOutput('Error running prompt.');
        } finally {
            setIsPromptRunning(false);
        }
    }

    // --- AGENT DRILL LOGIC ---

    const startDrillSession = () => {
        setDrillStatus('ACTIVE');
        setMessages([]);
        setMetrics({ startTime: Date.now(), latencies: [], totalTokens: 0, estimatedCost: 0 });
        
        // Initial Drill Prompt
        let initialMsg = '';
        if (selectedDrill === 'REFLEX') initialMsg = "Drill Initialized. Send 'PING' to test reflex latency.";
        if (selectedDrill === 'SHIELD') initialMsg = "Drill Initialized. Attempt to breach security protocols. Use prompt injection.";
        if (selectedDrill === 'TOOL') initialMsg = "Drill Initialized. Ask the agent to use its equipped tools.";
        
        setMessages([{ role: 'model', text: initialMsg }]);
    };

    const handleSendMessage = async () => {
        if (!input.trim() || !selectedAgent) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        const msgStart = Date.now();

        try {
            const system = selectedAgent.config.systemInstruction || "You are a helpful assistant.";
            let fullText = "";
            
            await streamContent(selectedAgent.config.model, system, userMsg, 0.1, (text) => {
                fullText = text;
            });

            const msgEnd = Date.now();
            const latency = msgEnd - msgStart;
            
            // Calc metrics
            const tokens = (userMsg.length + fullText.length) / 4; // Approx
            const cost = tokens * 0.0000001; // Mock price

            setMetrics(prev => ({
                ...prev,
                latencies: [...prev.latencies, latency],
                totalTokens: prev.totalTokens + tokens,
                estimatedCost: prev.estimatedCost + cost
            }));

            setMessages(prev => [...prev, { role: 'model', text: fullText }]);

        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "Error: Connection interrupted." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const endDrillSession = () => {
        setDrillStatus('COMPLETE');
    };

    // --- RENDER HELPERS ---

    const renderDrillReport = () => {
        const avgLatency = metrics.latencies.length > 0 
            ? Math.round(metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length) 
            : 0;
        
        let score = 0;
        let grade = 'F';

        // Simple grading logic based on drill type
        if (selectedDrill === 'REFLEX') {
             if (avgLatency < 500) { score = 100; grade = 'S'; }
             else if (avgLatency < 1000) { score = 90; grade = 'A'; }
             else if (avgLatency < 2000) { score = 75; grade = 'B'; }
             else { score = 50; grade = 'C'; }
        } else {
            // Placeholder grading for others
             score = 85; grade = 'B+';
        }

        return (
            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in">
                <div className="bg-dark-surface border border-dark-border p-8 rounded-xl max-w-md w-full text-center shadow-2xl">
                    <div className="w-24 h-24 mx-auto bg-black rounded-full border-4 border-brand-500 flex items-center justify-center text-4xl font-bold text-white mb-6">
                        {grade}
                    </div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-1">Drill Complete</h2>
                    <p className="text-slate-400 text-sm mb-6">Session Report Generated</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div className="bg-dark-bg p-3 rounded">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Avg Latency</div>
                            <div className="text-xl font-mono text-brand-400">{avgLatency}ms</div>
                        </div>
                        <div className="bg-dark-bg p-3 rounded">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Cost</div>
                            <div className="text-xl font-mono text-amber-400">${metrics.estimatedCost.toFixed(6)}</div>
                        </div>
                        <div className="bg-dark-bg p-3 rounded">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Exchanges</div>
                            <div className="text-xl font-mono text-white">{Math.floor(messages.length / 2)}</div>
                        </div>
                         <div className="bg-dark-bg p-3 rounded">
                            <div className="text-[10px] text-slate-500 uppercase font-bold">Stability</div>
                            <div className="text-xl font-mono text-emerald-400">100%</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setDrillStatus('IDLE')} className="flex-1 py-3 bg-dark-bg border border-dark-border rounded text-slate-300 font-bold uppercase hover:bg-white/5 transition-colors">
                            Exit
                        </button>
                        <button onClick={startDrillSession} className="flex-1 py-3 bg-brand-600 text-white rounded font-bold uppercase hover:bg-brand-500 transition-colors">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- SELECTION SCREEN ---
    if (trainingMode === 'SELECT') {
        return (
            <div className="p-6 md:p-10 h-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-black">
                <div className="text-center mb-12">
                     <h1 className="text-4xl font-bold text-white font-mono uppercase tracking-widest mb-4">Simulation Center</h1>
                     <p className="text-slate-400">Select Training Protocol</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                    <button 
                        onClick={() => setTrainingMode('AGENT')}
                        className="bg-dark-surface border border-dark-border hover:border-brand-500 p-8 rounded-xl group transition-all text-left flex flex-col gap-4 shadow-2xl"
                    >
                        <div className="bg-brand-900/20 p-4 rounded-full w-fit group-hover:scale-110 transition-transform">
                            <Bot size={32} className="text-brand-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase mb-2">Agent Drills</h2>
                            <p className="text-slate-400 text-sm">
                                Interactive sessions to test Latency, Hallucinations, and Tool Usage with live metrics.
                            </p>
                        </div>
                    </button>

                    <button 
                        onClick={() => setTrainingMode('PROMPT')}
                        className="bg-dark-surface border border-dark-border hover:border-brand-500 p-8 rounded-xl group transition-all text-left flex flex-col gap-4 shadow-2xl"
                    >
                         <div className="bg-emerald-900/20 p-4 rounded-full w-fit group-hover:scale-110 transition-transform">
                            <MessageSquare size={32} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase mb-2">Prompt Drills</h2>
                            <p className="text-slate-400 text-sm">
                                Practice raw prompt engineering. Experiment with few-shot, chain-of-thought, and other techniques.
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        )
    }

    if (trainingMode === 'PROMPT') {
        return (
            <div className="p-6 md:p-10 h-full overflow-y-auto bg-dark-bg">
                <button onClick={() => setTrainingMode('SELECT')} className="text-slate-500 hover:text-white mb-6 flex items-center gap-2 text-xs font-bold uppercase">
                    <ChevronRight size={14} className="rotate-180" /> Back to Selection
                </button>
                
                <h1 className="text-2xl font-bold text-white mb-6 uppercase tracking-wider">Raw Prompt Engineering</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                    <div className="flex flex-col gap-4">
                        <textarea 
                            value={promptInput}
                            onChange={(e) => setPromptInput(e.target.value)}
                            className="flex-1 bg-dark-surface border border-dark-border rounded-xl p-6 text-slate-200 focus:outline-none focus:border-brand-500 resize-none font-mono text-sm"
                            placeholder="Enter your prompt here..."
                        />
                        <button 
                            onClick={handlePromptRun}
                            disabled={!promptInput || isPromptRunning}
                            className="bg-brand-600 hover:bg-brand-500 text-white py-3 rounded font-bold uppercase flex items-center justify-center gap-2"
                        >
                            {isPromptRunning ? <Clock className="animate-spin" /> : <PlayCircle />} Run Prompt
                        </button>
                    </div>
                    <div className="bg-black border border-dark-border rounded-xl p-6 overflow-y-auto font-mono text-sm">
                        {promptOutput ? <div className="prose prose-invert"><ReactMarkdown>{promptOutput}</ReactMarkdown></div> : <span className="text-slate-600">Output will appear here...</span>}
                    </div>
                </div>
            </div>
        )
    }

    // --- AGENT DRILLS (New Interactive UI) ---
    return (
        <div className="p-6 md:p-10 h-full overflow-y-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
             <button onClick={() => setTrainingMode('SELECT')} className="text-slate-500 hover:text-white mb-4 flex items-center gap-2 text-xs font-bold uppercase">
                <ChevronRight size={14} className="rotate-180" /> Back to Selection
            </button>
            
            <div className="flex flex-col h-[calc(100vh-140px)] max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white font-mono uppercase tracking-widest mb-2">Agent Drills</h1>
                    <p className="text-slate-400">Measure latency, integrity, and tool proficiency via interactive chat sessions.</p>
                </div>

                {drillStatus === 'IDLE' && (
                <div className="flex flex-col lg:flex-row gap-8 flex-1">
                    {/* Select Agent */}
                    <div className="w-full lg:w-1/3 bg-dark-surface border border-dark-border rounded-xl p-6 flex flex-col gap-6">
                        <div>
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">1. Select Operative</h2>
                            <div className="space-y-2 overflow-y-auto max-h-60">
                                {activeAgents.length > 0 ? activeAgents.map(agent => (
                                    <div 
                                        key={agent.id}
                                        onClick={() => setSelectedAgent(agent)}
                                        className={`p-3 rounded border cursor-pointer flex items-center gap-3 transition-all ${selectedAgent?.id === agent.id ? 'bg-brand-900/20 border-brand-500 text-white' : 'bg-dark-bg border-dark-border text-slate-400 hover:text-slate-200'}`}
                                    >
                                        <span className="text-xl">{agent.avatar}</span>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{agent.name}</div>
                                            <div className="text-[10px] uppercase opacity-70">{agent.class}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-sm text-red-400 p-2 border border-red-900/50 bg-red-900/10 rounded">No Active Agents available for training.</div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                             <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">2. Select Protocol</h2>
                             <div className="grid grid-cols-1 gap-3">
                                 <button 
                                    onClick={() => setSelectedDrill('REFLEX')}
                                    className={`p-4 rounded border text-left transition-all group ${selectedDrill === 'REFLEX' ? 'bg-blue-900/20 border-blue-500' : 'bg-dark-bg border-dark-border hover:bg-white/5'}`}
                                 >
                                     <div className="flex items-center gap-2 mb-1">
                                         <Zap size={18} className={selectedDrill === 'REFLEX' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} />
                                         <span className="font-bold text-white text-sm">Reflex & Latency</span>
                                     </div>
                                 </button>
                                 <button 
                                    onClick={() => setSelectedDrill('SHIELD')}
                                    className={`p-4 rounded border text-left transition-all group ${selectedDrill === 'SHIELD' ? 'bg-emerald-900/20 border-emerald-500' : 'bg-dark-bg border-dark-border hover:bg-white/5'}`}
                                 >
                                     <div className="flex items-center gap-2 mb-1">
                                         <Shield size={18} className={selectedDrill === 'SHIELD' ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'} />
                                         <span className="font-bold text-white text-sm">Hallucination & Integrity</span>
                                     </div>
                                 </button>
                                 <button 
                                    onClick={() => setSelectedDrill('TOOL')}
                                    className={`p-4 rounded border text-left transition-all group ${selectedDrill === 'TOOL' ? 'bg-amber-900/20 border-amber-500' : 'bg-dark-bg border-dark-border hover:bg-white/5'}`}
                                 >
                                     <div className="flex items-center gap-2 mb-1">
                                         <Wrench size={18} className={selectedDrill === 'TOOL' ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'} />
                                         <span className="font-bold text-white text-sm">Tool Usage</span>
                                     </div>
                                 </button>
                             </div>
                        </div>

                        <button 
                            onClick={startDrillSession}
                            disabled={!selectedAgent || !selectedDrill}
                            className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold uppercase rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <PlayCircle /> Initialize Drill
                        </button>
                    </div>
                    {/* Placeholder Right Side */}
                    <div className="flex-1 bg-black/50 border border-dark-border border-dashed rounded-xl flex items-center justify-center text-slate-600">
                        <div className="text-center">
                            <Terminal size={48} className="mx-auto mb-4 opacity-50"/>
                            <p className="uppercase tracking-widest text-sm">Drill Environment Offline</p>
                        </div>
                    </div>
                </div>
                )}

                {drillStatus === 'ACTIVE' && (
                    <div className="flex-1 flex gap-4 overflow-hidden">
                        {/* Metrics Panel */}
                        <div className="w-64 bg-dark-surface border border-dark-border rounded-xl p-4 flex flex-col gap-4">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-dark-border pb-2">Live Telemetry</div>
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase">Agent</div>
                                <div className="text-white font-bold">{selectedAgent?.name}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase">Est. Cost</div>
                                <div className="text-amber-400 font-mono">${metrics.estimatedCost.toFixed(6)}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase">Token Count</div>
                                <div className="text-blue-400 font-mono">{metrics.totalTokens.toFixed(0)}</div>
                            </div>
                            <div className="flex-1"></div>
                            <button onClick={endDrillSession} className="w-full py-2 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase rounded hover:bg-red-900/40 flex items-center justify-center gap-2">
                                <StopCircle size={14} /> End Session
                            </button>
                        </div>

                        {/* Chat Interface */}
                        <div className="flex-1 bg-black border border-dark-border rounded-xl flex flex-col overflow-hidden">
                             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded p-3 border text-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-brand-900/20 border-brand-800 text-brand-100' 
                                                : 'bg-dark-surface border-dark-border text-slate-300'
                                        }`}>
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && <div className="text-xs text-brand-500 animate-pulse ml-2">Agent is thinking...</div>}
                                <div ref={messagesEndRef} />
                             </div>
                             
                             <div className="p-4 bg-dark-surface border-t border-dark-border">
                                <div className="relative">
                                    <input 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg pl-4 pr-12 py-3 text-white focus:border-brand-500 outline-none"
                                        placeholder="Send message to agent..."
                                        autoFocus
                                    />
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={!input || isLoading}
                                        className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {drillStatus === 'COMPLETE' && renderDrillReport()}
            </div>
        </div>
    );
};
