
import React, { useState, useEffect } from 'react';
import { Play, Loader2, ArrowLeft, Zap, Sparkles, Upload, FileText, Bot, Search, Check, Cpu, Maximize2, X, ChevronRight, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ModelType, PlaygroundState, Weapon, KnowledgeFile, Agent } from '../types';
import { streamContent } from '../services/geminiService';
import { useNavigate, useParams } from 'react-router-dom';
import { getAgentById, saveAgent } from '../services/squadService';
import { MOCK_WEAPONS, MY_SQUAD } from '../constants';

interface PlaygroundProps {
  lessonId?: string;
  initialState?: PlaygroundState;
  lessonContext?: string;
  validationCriteria?: string;
  
  agentId?: string; 
  mode?: 'lesson' | 'builder' | 'raw';

  agentClass?: string;
  equippedToolIds?: string[];
}

export const Playground: React.FC<PlaygroundProps> = ({ 
    lessonId, 
    initialState, 
    agentId,
    mode = 'lesson',
    agentClass: propAgentClass,
    equippedToolIds: propEquippedToolIds
}) => {
  const navigate = useNavigate();
  const params = useParams();

  // Agent State
  const [agentName, setAgentName] = useState('Untitled Agent');
  const [agentDesc, setAgentDesc] = useState('No description provided.');
  const [agentClass, setAgentClass] = useState(propAgentClass || 'ROOKIE');
  const [config, setConfig] = useState<PlaygroundState>(initialState || {
    model: ModelType.FLASH,
    temperature: 0.7,
    systemInstruction: '',
    userPrompt: '',
    agentRole: '',
    agentGoal: ''
  });

  // Feature Toggles & Data
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeFile[]>([]);
  
  const [showTools, setShowTools] = useState(false);
  const [equippedToolIds, setEquippedToolIds] = useState<string[]>(propEquippedToolIds || []);
  
  const [showSquad, setShowSquad] = useState(false);
  const [subAgents, setSubAgents] = useState<string[]>([]);
  
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);

  // Chat State
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load Agent Data
  useEffect(() => {
      const targetId = agentId || params.agentId;
      if (mode === 'builder' && targetId) {
          const agent = getAgentById(targetId);
          if (agent) {
              setCurrentAgent(agent);
              setAgentName(agent.name);
              setAgentDesc(agent.description || '');
              setAgentClass(agent.class);
              setConfig(agent.config);
              
              setKnowledgeBase(agent.knowledgeBase);
              setShowKnowledge(agent.knowledgeBase.length > 0);
              
              setEquippedToolIds(agent.equippedTools);
              setShowTools(agent.equippedTools.length > 0);
              
              setSubAgents(agent.subAgents || []);
              setShowSquad((agent.subAgents?.length || 0) > 0);
          }
      }
  }, [agentId, params.agentId, mode]);

  const handleSave = (deploy: boolean) => {
      if (!currentAgent) return;
      const updated: Agent = {
          ...currentAgent,
          name: agentName,
          description: agentDesc,
          class: agentClass as any,
          config,
          knowledgeBase,
          equippedTools: equippedToolIds,
          subAgents,
          status: deploy ? 'ACTIVE' : 'BENCH'
      };
      saveAgent(updated);
      
      // Navigate to Home Base on deploy, else back to Agents list
      if (deploy) {
          navigate('/');
      } else {
          navigate('/agents');
      }
  };

  const handleRun = async () => {
    setIsLoading(true);
    setResponse('');
    setError(null);
    
    try {
      let effectiveSystemPrompt = config.systemInstruction;
      
      if (config.agentRole) effectiveSystemPrompt = `ROLE:\n${config.agentRole}\n\n` + effectiveSystemPrompt;
      if (config.agentGoal) effectiveSystemPrompt = effectiveSystemPrompt + `\n\nGOAL:\n${config.agentGoal}`;

      if (showKnowledge && knowledgeBase.length > 0) {
          effectiveSystemPrompt += `\n\n[ATTACHED KNOWLEDGE]:\n${knowledgeBase.map(f => `- ${f.name}`).join('\n')}`;
      }
      
      if (showTools && equippedToolIds.length > 0) {
          const tools = MOCK_WEAPONS.filter(w => equippedToolIds.includes(w.id));
          effectiveSystemPrompt += `\n\n[AVAILABLE TOOLS]:\n${tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}`;
      }

       if (showSquad && subAgents.length > 0) {
           const squadMembers = MY_SQUAD.filter(a => subAgents.includes(a.id));
          effectiveSystemPrompt += `\n\n[SQUAD LINK]: Connected to: ${squadMembers.map(a => a.name).join(', ')}`;
      }

      await streamContent(
        config.model,
        effectiveSystemPrompt,
        config.userPrompt,
        config.temperature,
        (text) => setResponse(text)
      );
    } catch (err: any) {
      setError(err.message || 'Simulation Error');
    } finally {
      setIsLoading(false);
    }
  };

  const FeatureToggle = ({ label, active, onClick, icon: Icon, children }: any) => (
      <div className="bg-dark-bg border border-dark-border rounded mb-3 overflow-hidden">
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5" onClick={onClick}>
               <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                   {Icon && <Icon size={16} className="text-slate-500" />}
                   {label}
               </div>
               <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-brand-600' : 'bg-slate-700'}`}>
                   <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
               </div>
          </div>
          {active && children && (
              <div className="p-3 border-t border-dark-border bg-dark-surface/50">
                  {children}
              </div>
          )}
      </div>
  );

  // --- UI Renders ---

  if (mode === 'builder') {
      return (
          <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans">
              <div className="flex flex-col h-full bg-dark-bg text-slate-200 font-mono">
                  
              <header className="h-16 bg-dark-surface border-b border-dark-border flex items-center justify-between px-6 flex-shrink-0 z-20">
                  <div className="flex items-center gap-4">
                      <button onClick={() => navigate('/agents')} className="text-slate-500 hover:text-white flex items-center gap-2">
                          <ArrowLeft size={18} />
                      </button>
                      <h1 className="text-lg font-bold text-white uppercase tracking-wider">Manage Agent</h1>
                  </div>
                  <div className="flex items-center gap-3">
                      <button className="text-xs font-bold text-slate-500 hover:text-white uppercase px-3 py-2 flex items-center gap-2">
                          <Maximize2 size={14} /> Traces
                      </button>
                      <button onClick={() => handleSave(false)} className="px-4 py-2 rounded text-xs font-bold uppercase border border-dark-border text-slate-300 hover:bg-white/5">
                          Save Draft
                      </button>
                      <button onClick={() => handleSave(true)} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded text-xs font-bold uppercase shadow-lg shadow-brand-500/20 flex items-center gap-2">
                          <Zap size={14} /> Deploy
                      </button>
                  </div>
              </header>

              <div className="flex-1 flex overflow-hidden">
                  
                  {/* Column 1: Core Configuration (35%) */}
                  <div className="w-[35%] flex flex-col border-r border-dark-border overflow-y-auto bg-dark-bg p-6 space-y-6">
                      <div className="space-y-4">
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Name</label>
                              <input 
                                  value={agentName}
                                  onChange={(e) => setAgentName(e.target.value)}
                                  className="w-full bg-dark-surface border border-dark-border rounded p-2.5 text-white font-bold focus:border-brand-500 outline-none transition-colors"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description</label>
                              <input 
                                  value={agentDesc}
                                  onChange={(e) => setAgentDesc(e.target.value)}
                                  className="w-full bg-dark-surface border border-dark-border rounded p-2.5 text-sm text-slate-300 focus:border-brand-500 outline-none transition-colors"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Model</label>
                              <div className="relative">
                                  <select 
                                      value={config.model}
                                      onChange={(e) => setConfig({...config, model: e.target.value as ModelType})}
                                      className="w-full bg-dark-surface border border-dark-border rounded p-2.5 text-sm text-white focus:border-brand-500 outline-none appearance-none"
                                  >
                                      <option value={ModelType.FLASH}>Gemini 2.5 Flash (Fast)</option>
                                      <option value={ModelType.PRO}>Gemini 2.5 Pro (Reasoning)</option>
                                  </select>
                                  <Cpu size={14} className="absolute right-3 top-3 text-slate-500 pointer-events-none" />
                              </div>
                          </div>
                      </div>

                      <div className="pt-4 border-t border-dark-border space-y-4">
                          <div className="flex justify-between items-center">
                              <h2 className="text-xs font-bold text-white uppercase">Identity & Behavior</h2>
                              <button className="text-[10px] text-brand-400 font-bold uppercase flex items-center gap-1 hover:text-white">
                                  <Sparkles size={12} /> Auto-Generate
                              </button>
                          </div>
                          
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agent Role</label>
                              <textarea 
                                  value={config.agentRole || ''}
                                  onChange={(e) => setConfig({...config, agentRole: e.target.value})}
                                  className="w-full h-20 bg-dark-surface border border-dark-border rounded p-3 text-sm text-slate-200 focus:border-brand-500 outline-none resize-none"
                                  placeholder="e.g. You are an expert security analyst..."
                              />
                          </div>

                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Agent Goal</label>
                              <textarea 
                                  value={config.agentGoal || ''}
                                  onChange={(e) => setConfig({...config, agentGoal: e.target.value})}
                                  className="w-full h-20 bg-dark-surface border border-dark-border rounded p-3 text-sm text-slate-200 focus:border-brand-500 outline-none resize-none"
                                  placeholder="e.g. Your goal is to identify vulnerabilities in code..."
                              />
                          </div>

                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Core Instructions</label>
                              <textarea 
                                  value={config.systemInstruction}
                                  onChange={(e) => setConfig({...config, systemInstruction: e.target.value})}
                                  className="w-full h-40 bg-dark-surface border border-dark-border rounded p-3 text-sm text-slate-200 focus:border-brand-500 outline-none resize-none leading-relaxed font-mono"
                                  placeholder="- Step 1: Analyze input&#10;- Step 2: Formulate response&#10;- Step 3: Output result"
                              />
                          </div>
                      </div>
                  </div>

                  {/* Column 2: Feature Toggles (25%) */}
                  <div className="w-[25%] border-r border-dark-border bg-dark-surface/20 flex flex-col">
                      <div className="p-4 border-b border-dark-border">
                          <div className="relative">
                              <input 
                                  placeholder="Search features..."
                                  className="w-full bg-dark-bg border border-dark-border rounded px-8 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                              />
                              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
                          </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-6">
                          <div>
                              <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Core Capabilities</h3>
                              
                              <FeatureToggle 
                                  label="Knowledge Base" 
                                  active={showKnowledge} 
                                  onClick={() => setShowKnowledge(!showKnowledge)} 
                                  icon={FileText}
                              >
                                  <button onClick={() => setKnowledgeBase([...knowledgeBase, { id: 'k'+Date.now(), name: 'manual.pdf', type: 'PDF', size: '1.2MB' }])} className="w-full py-2 border border-dashed border-slate-600 rounded text-xs text-slate-400 hover:text-white hover:border-slate-400 flex items-center justify-center gap-2">
                                      <Upload size={12} /> Add Source
                                  </button>
                                  {knowledgeBase.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                          {knowledgeBase.map(f => (
                                              <div key={f.id} className="flex items-center gap-2 text-[10px] text-slate-300">
                                                  <FileText size={10} /> {f.name}
                                              </div>
                                          ))}
                                      </div>
                                  )}
                              </FeatureToggle>

                              <FeatureToggle 
                                  label="Tools & Weapons" 
                                  active={showTools} 
                                  onClick={() => setShowTools(!showTools)} 
                                  icon={Settings}
                              >
                                  <div className="space-y-1">
                                      {MOCK_WEAPONS.map(tool => (
                                          <div 
                                              key={tool.id}
                                              onClick={() => setEquippedToolIds(prev => prev.includes(tool.id) ? prev.filter(id => id !== tool.id) : [...prev, tool.id])}
                                              className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs ${equippedToolIds.includes(tool.id) ? 'bg-brand-900/30 text-brand-300' : 'hover:bg-white/5 text-slate-400'}`}
                                          >
                                              <span>{tool.name}</span>
                                              {equippedToolIds.includes(tool.id) && <Check size={10} />}
                                          </div>
                                      ))}
                                      <button onClick={() => navigate('/weapons')} className="text-[10px] text-brand-400 hover:underline mt-2 block w-full text-left">Forge New Tool +</button>
                                  </div>
                              </FeatureToggle>

                              <FeatureToggle label="Long Term Memory" active={false} onClick={() => {}} icon={Cpu} />
                          </div>
                          
                          <div>
                              <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Safe AI</h3>
                              <FeatureToggle label="Hallucination Check" active={true} onClick={() => {}} icon={Zap} />
                              <FeatureToggle label="Content Safety" active={true} onClick={() => {}} icon={Check} />
                          </div>
                      </div>
                  </div>

                  {/* Column 3: Inference Chat (40%) */}
                  <div className="flex-1 bg-black flex flex-col">
                      <div className="h-12 border-b border-dark-border flex items-center justify-between px-4 bg-dark-surface/10">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test Agent Inference</span>
                          <button onClick={() => { setConfig({...config, userPrompt: ''}); setResponse(''); }} className="text-[10px] text-slate-500 hover:text-white uppercase">
                              Reset Chat
                          </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                           {!response && !config.userPrompt && (
                               <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                   <Bot size={48} className="mb-4" />
                                   <p className="text-xs uppercase tracking-widest text-center">Ready for input</p>
                                   <div className="mt-4 space-y-2 w-full max-w-xs">
                                       <button onClick={() => setConfig({...config, userPrompt: 'Who are you?'})} className="w-full py-2 border border-dashed border-slate-700 text-[10px] uppercase hover:bg-white/5">Who are you?</button>
                                       <button onClick={() => setConfig({...config, userPrompt: 'What tools do you have?'})} className="w-full py-2 border border-dashed border-slate-700 text-[10px] uppercase hover:bg-white/5">List your tools</button>
                                   </div>
                               </div>
                           )}

                           {config.userPrompt && (
                               <div className="flex justify-end">
                                   <div className="bg-dark-surface border border-dark-border rounded-lg p-3 max-w-[90%] text-sm text-slate-200">
                                       {config.userPrompt}
                                   </div>
                               </div>
                           )}

                           {isLoading && (
                               <div className="flex justify-start">
                                   <div className="flex items-center gap-2 text-brand-400 text-xs font-mono animate-pulse">
                                       <Loader2 size={14} className="animate-spin" /> Thinking...
                                   </div>
                               </div>
                           )}

                           {response && (
                               <div className="flex justify-start">
                                   <div className="bg-brand-900/10 border border-brand-500/20 rounded-lg p-4 max-w-[95%]">
                                       <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed prose-p:mb-2 prose-ul:my-2">
                                            <ReactMarkdown>{response}</ReactMarkdown>
                                       </div>
                                   </div>
                               </div>
                           )}
                      </div>

                      <div className="p-4 bg-dark-bg border-t border-dark-border">
                           <div className="relative">
                               <textarea 
                                   value={config.userPrompt}
                                   onChange={(e) => setConfig({...config, userPrompt: e.target.value})}
                                   className="w-full bg-dark-surface border border-dark-border rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:border-brand-500 outline-none resize-none h-14"
                                   placeholder="Type a message..."
                                   onKeyDown={(e) => {
                                       if(e.key === 'Enter' && !e.shiftKey) {
                                           e.preventDefault();
                                           handleRun();
                                       }
                                   }}
                               />
                               <button 
                                  onClick={handleRun}
                                  disabled={isLoading || !config.userPrompt}
                                  className="absolute right-2 top-2 p-2 bg-brand-600 hover:bg-brand-500 text-white rounded transition-colors disabled:opacity-50"
                               >
                                   <ChevronRight size={16} />
                               </button>
                           </div>
                           <div className="flex justify-between items-center mt-2 px-1">
                               <span className="text-[10px] text-slate-500 uppercase">Shift+Enter for newline</span>
                               <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1"><Zap size={10}/> Instant Run</span>
                           </div>
                      </div>
                  </div>
              </div>
              </div>
          </div>
      );
  }

  // Simplified render for embedded mode (Missions/Lessons)
  return (
    <div className="flex flex-col h-full bg-dark-bg font-mono p-4">
        <div className="flex-1 bg-black border border-dark-border rounded-lg overflow-hidden flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto">
                {response ? <div className="prose prose-invert prose-sm prose-p:mb-2"><ReactMarkdown>{response}</ReactMarkdown></div> : <div className="text-slate-500 text-sm italic">Model output will appear here...</div>}
            </div>
            <div className="p-4 bg-dark-surface border-t border-dark-border">
                 <textarea 
                     value={config.userPrompt}
                     onChange={(e) => setConfig({...config, userPrompt: e.target.value})}
                     className="w-full bg-dark-bg border border-dark-border rounded p-2 text-sm text-white"
                     placeholder="Enter prompt..."
                 />
                 <button onClick={handleRun} className="mt-2 w-full bg-brand-600 text-white py-2 rounded font-bold text-xs uppercase">Run Simulation</button>
            </div>
        </div>
    </div>
  );
};
