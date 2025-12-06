
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OPERATIONS, MY_SQUAD } from '../constants';
import { ChevronLeft, PlayCircle, ShieldCheck, Terminal, Users, AlertTriangle, Coins } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Playground } from '../components/Playground';
import { Agent } from '../types';

export const MissionBriefing: React.FC = () => {
  const { opId } = useParams();
  const op = OPERATIONS.find(o => o.id === opId);
  const activeSquad = MY_SQUAD.filter(a => a.status === 'ACTIVE');
  
  const [selectedAgentId, setSelectedAgentId] = useState<string>(activeSquad[0]?.id || '');
  const selectedAgent = activeSquad.find(a => a.id === selectedAgentId);

  if (!op) {
    return <div className="p-10 text-center text-slate-400">Operation details classified or missing.</div>;
  }

  // Merge Mission Config with Agent Config
  // The Mission defines the User Prompt (The scenario) and Validation
  // The Agent defines the System Prompt (The Persona/Defense) and Model
  const mergedState = selectedAgent ? {
      ...op.initialPlaygroundState!,
      systemInstruction: selectedAgent.config.systemInstruction, // Agent's brain
      model: selectedAgent.config.model, // Agent's backbone
      temperature: selectedAgent.config.temperature,
      // Tools would be injected here in a real app
  } : op.initialPlaygroundState;

  return (
    <div className="flex flex-col h-full bg-dark-bg font-mono">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-border p-4 px-6 flex justify-between items-center shadow-md z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/missions" className="text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} />
            </Link>
            <div>
                <h1 className="text-lg font-bold text-white uppercase tracking-widest text-brand-500">OP: {op.codename}</h1>
                <div className="text-[10px] text-slate-500 uppercase">Clearance: {op.difficulty} // Reward: {op.rewardXP} XP</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
              {/* Agent Selector */}
              {activeSquad.length > 0 ? (
                  <div className="flex items-center gap-2 bg-black border border-dark-border px-3 py-1.5 rounded">
                      <Users size={14} className="text-brand-400"/>
                      <span className="text-[10px] text-slate-500 uppercase font-bold mr-2">Deployed Unit:</span>
                      <select 
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                      >
                          {activeSquad.map(agent => (
                              <option key={agent.id} value={agent.id} className="bg-dark-surface">
                                  {agent.name} ({agent.class})
                              </option>
                          ))}
                      </select>
                  </div>
              ) : (
                  <Link to="/agents" className="flex items-center gap-2 text-xs font-bold text-red-400 border border-red-900/50 bg-red-900/10 px-3 py-1.5 rounded animate-pulse hover:bg-red-900/20">
                      <AlertTriangle size={14} /> NO ACTIVE AGENTS - DEPLOY SQUAD
                  </Link>
              )}

              <div className="flex items-center gap-2 text-xs text-green-500 border border-green-900/50 bg-green-900/10 px-3 py-1 rounded">
                  <ShieldCheck size={14} /> LIVE ENVIRONMENT
              </div>
          </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Intel / Briefing */}
        <div className="flex-1 lg:max-w-[35%] bg-dark-bg border-r border-dark-border flex flex-col">
            <div className="p-2 bg-black border-b border-dark-border text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4">
                Mission Dossier
            </div>
            <div className="flex-1 overflow-y-auto p-6 prose prose-invert prose-sm max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:text-brand-400 prose-p:text-slate-400">
                <ReactMarkdown>{op.briefing}</ReactMarkdown>
            </div>
        </div>

        {/* Right: Workspace */}
        <div className="flex-1 flex flex-col relative">
            {!selectedAgent ? (
                <div className="absolute inset-0 z-20 bg-dark-bg/90 backdrop-blur flex flex-col items-center justify-center p-10 text-center">
                    <Users size={64} className="text-slate-600 mb-6" />
                    <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">Deployment Required</h2>
                    <p className="text-slate-400 max-w-md mb-8">
                        This operation requires an active operative on the field. 
                        Go to your Squad Hangar and set an agent to <span className="text-brand-400 font-bold">ACTIVE DUTY</span>.
                    </p>
                    <Link to="/agents" className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded uppercase tracking-wider flex items-center gap-2">
                        Open Squad Hangar <ChevronLeft size={16} className="rotate-180"/>
                    </Link>
                </div>
            ) : null}
            
            <Playground 
                initialState={mergedState}
                validationCriteria={op.validationCriteria}
                lessonContext={op.briefing}
                lessonId={op.id} // Tracking completion
                agentClass={selectedAgent?.class}
                equippedToolIds={selectedAgent?.equippedTools}
                // In mission mode, we usually lock configuration to simulate "Field Conditions" 
                // but for learning we might allow tweaks.
                mode="lesson" 
            />
        </div>
      </div>
    </div>
  );
};
