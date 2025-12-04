
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { OPERATIONS } from '../constants';
import { ChevronLeft, PlayCircle, ShieldCheck, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Playground } from '../components/Playground';

export const MissionBriefing: React.FC = () => {
  const { opId } = useParams();
  const op = OPERATIONS.find(o => o.id === opId);

  if (!op) {
    return <div className="p-10 text-center text-slate-400">Operation details classified or missing.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg font-mono">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-border p-4 px-6 flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-4">
            <Link to="/ops" className="text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} />
            </Link>
            <div>
                <h1 className="text-lg font-bold text-white uppercase tracking-widest text-brand-500">OP: {op.codename}</h1>
                <div className="text-[10px] text-slate-500 uppercase">Clearance: {op.difficulty} // Reward: {op.rewardXP} XP</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-500 border border-green-900/50 bg-green-900/10 px-3 py-1 rounded">
              <ShieldCheck size={14} /> LIVE ENVIRONMENT
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
        <div className="flex-1 flex flex-col">
            <Playground 
                initialState={op.initialPlaygroundState}
                validationCriteria={op.validationCriteria}
                lessonContext={op.briefing}
                lessonId={op.id} // Tracking completion
            />
        </div>
      </div>
    </div>
  );
};
