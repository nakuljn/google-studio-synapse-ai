
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, MessageSquare, Loader2, Sparkles, X, CheckCircle, AlertCircle, Award, Save, Share2, Lightbulb, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ModelType, PlaygroundState } from '../types';
import { streamContent, askTutor, evaluateSubmission } from '../services/geminiService';

interface PlaygroundProps {
  lessonId?: string;
  initialState?: PlaygroundState;
  lessonContext?: string;
  validationCriteria?: string;
  onSave?: (state: PlaygroundState) => void;
  onPublish?: (state: PlaygroundState) => void;
  mode?: 'lesson' | 'lab';
}

export const Playground: React.FC<PlaygroundProps> = ({ 
    lessonId, 
    initialState, 
    lessonContext, 
    validationCriteria,
    onSave,
    onPublish,
    mode = 'lesson'
}) => {
  const [config, setConfig] = useState<PlaygroundState>(initialState || {
    model: ModelType.FLASH,
    temperature: 0.7,
    systemInstruction: '',
    userPrompt: ''
  });

  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tutor State
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorQuery, setTutorQuery] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  // Validation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{passed: boolean, feedback: string} | null>(null);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // Update config when prop changes (new lesson loaded)
  useEffect(() => {
    if (initialState) {
        setConfig(initialState);
        setResponse('');
        setError(null);
        setEvaluationResult(null);
        setShowNudge(false);
        
        // Check if already completed
        if (lessonId) {
            const completed = JSON.parse(localStorage.getItem('synapse_completed_lessons') || '[]');
            setIsLessonComplete(completed.includes(lessonId));
        }
    }
  }, [initialState, lessonId]);

  // AI Nudge Logic
  useEffect(() => {
      if (error) {
          setShowNudge(true);
      } else if (response.length > 0 && response.length < 20 && !isLoading) {
          // If response is suspiciously short, maybe suggest help
          const timer = setTimeout(() => setShowNudge(true), 2000);
          return () => clearTimeout(timer);
      }
  }, [error, response, isLoading]);

  const handleRun = async () => {
    setIsLoading(true);
    setResponse('');
    setError(null);
    setEvaluationResult(null); // Reset prev evaluation on new run
    setShowNudge(false);
    
    try {
      await streamContent(
        config.model,
        config.systemInstruction,
        config.userPrompt,
        config.temperature,
        (text) => setResponse(text)
      );
    } catch (err: any) {
      setError(err.message || 'An error occurred while running the model.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
      if (!validationCriteria) return;
      if (!response) {
          setError("Please run the model first to generate an output.");
          return;
      }

      setIsEvaluating(true);
      try {
          const result = await evaluateSubmission(
              validationCriteria,
              config.systemInstruction,
              config.userPrompt,
              response
          );
          setEvaluationResult(result);

          if (result.passed && lessonId) {
             setIsLessonComplete(true);
             const completed = JSON.parse(localStorage.getItem('synapse_completed_lessons') || '[]');
             if (!completed.includes(lessonId)) {
                 completed.push(lessonId);
                 localStorage.setItem('synapse_completed_lessons', JSON.stringify(completed));
                 
                 // Trigger a custom event so other components (like Dashboard) update
                 window.dispatchEvent(new Event('synapse-progress-updated'));
             }
          } else if (!result.passed) {
              setShowNudge(true);
          }
      } catch (e) {
          setError("Failed to submit assignment.");
      } finally {
          setIsEvaluating(false);
      }
  }

  const handleTutorAsk = async (queryOverride?: string) => {
      const q = queryOverride || tutorQuery;
      if(!q.trim()) return;
      
      if (!isTutorOpen) setIsTutorOpen(true);
      setIsTutorLoading(true);
      setTutorResponse('');
      setShowNudge(false);
      
      const context = `
      Current Lesson Context: ${lessonContext || 'Free Lab Project'}
      Current System Instruction: ${config.systemInstruction}
      Current Prompt: ${config.userPrompt}
      Current Output: ${response}
      Error State: ${error || 'None'}
      `;

      try {
          const answer = await askTutor(context, q);
          setTutorResponse(answer);
      } catch (e) {
          setTutorResponse("Error contacting tutor.");
      } finally {
          setIsTutorLoading(false);
      }
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg border-l border-dark-border relative font-mono text-sm">
      {/* Success Overlay Animation */}
      {evaluationResult?.passed && (
          <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex justify-center pt-20">
             <div className="animate-bounce bg-green-900/90 text-green-400 border border-green-500/50 px-6 py-2 rounded font-bold flex items-center space-x-2 backdrop-blur-sm shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <Award size={20} />
                <span>OBJECTIVE COMPLETE</span>
             </div>
          </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-surface border-b border-dark-border">
        <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Terminal size={14} />
                {mode === 'lab' ? 'CONSTRUCT_EDITOR' : 'INTEL_SIMULATION'}
            </span>
            {isLessonComplete && (
                <span className="ml-2 text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-800 flex items-center uppercase">
                    <CheckCircle size={10} className="mr-1" /> Verified
                </span>
            )}
        </div>
        <div className="flex items-center space-x-2">
            {onSave && (
                <button 
                    onClick={() => onSave(config)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-dark-bg rounded transition-colors"
                    title="Save Construct"
                >
                    <Save size={16} />
                </button>
            )}

            <button 
                onClick={() => setIsTutorOpen(!isTutorOpen)}
                className={`p-2 rounded hover:bg-dark-bg transition-colors relative ${isTutorOpen ? 'text-brand-400 bg-brand-400/10' : 'text-slate-400'}`}
                title="AI Assistant"
            >
                <Sparkles size={16} />
                {showNudge && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
            </button>

            <div className="w-px h-6 bg-dark-border mx-1" />

            <button 
                onClick={() => {
                   if(initialState) setConfig(initialState);
                   setResponse('');
                   setEvaluationResult(null);
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-dark-bg rounded transition-colors"
                title="Reset"
            >
                <RotateCcw size={16} />
            </button>
            
            {/* Run Button */}
            <button 
                onClick={handleRun}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-dark-surface border border-dark-border hover:bg-white/5 text-slate-200 px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                <span>Execute</span>
            </button>

            {/* Submit Assignment Button */}
            {validationCriteria && (
                <button 
                    onClick={handleSubmitAssignment}
                    disabled={isEvaluating || isLoading || !response}
                    className={`flex items-center space-x-2 px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        ${evaluationResult?.passed 
                            ? 'bg-green-700 hover:bg-green-600 text-white' 
                            : 'bg-brand-700 hover:bg-brand-600 text-white'}
                    `}
                >
                    {isEvaluating ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : evaluationResult?.passed ? (
                        <CheckCircle size={16} />
                    ) : (
                        <Award size={16} />
                    )}
                    <span>{evaluationResult?.passed ? 'Confirmed' : 'Verify Hack'}</span>
                </button>
            )}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Column: Inputs */}
        <div className="flex-1 flex flex-col border-r border-dark-border min-w-[300px]">
            {/* System Instruction */}
            <div className="p-4 border-b border-dark-border bg-dark-bg">
                <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">System Protocol (Hidden Layer)</label>
                <textarea 
                    value={config.systemInstruction}
                    onChange={(e) => setConfig({...config, systemInstruction: e.target.value})}
                    placeholder="Define strict security protocols..."
                    className="w-full h-32 bg-black border border-dark-border rounded-none p-3 text-sm text-green-500 placeholder-slate-700 focus:outline-none focus:border-brand-500 font-mono resize-none"
                />
            </div>

            {/* User Prompt */}
            <div className="flex-1 p-4 flex flex-col bg-dark-bg">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Injection Vector (User Input)</label>
                    <div className="flex items-center space-x-2">
                         <span className="text-[10px] text-slate-500 uppercase">Entropy: {config.temperature}</span>
                         <input 
                            type="range" 
                            min="0" 
                            max="2" 
                            step="0.1" 
                            value={config.temperature}
                            onChange={(e) => setConfig({...config, temperature: parseFloat(e.target.value)})}
                            className="w-20 accent-brand-500 h-1 bg-dark-border rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
                <textarea 
                    value={config.userPrompt}
                    onChange={(e) => setConfig({...config, userPrompt: e.target.value})}
                    placeholder="Enter payload..."
                    className="flex-1 w-full bg-black border border-dark-border rounded-none p-3 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-brand-500 font-mono resize-none"
                />
            </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex-1 flex flex-col bg-black p-6 overflow-y-auto relative">
             <label className="block text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-wide">Terminal Output</label>
             {error && (
                 <div className="p-4 bg-red-900/20 border border-red-800 text-red-200 text-sm mb-4 font-mono">
                     [ERROR]: {error}
                 </div>
             )}
             
             {/* Evaluation Result Feedback */}
             {evaluationResult && (
                 <div className={`p-4 mb-4 border ${evaluationResult.passed ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-amber-900/20 border-amber-800 text-amber-400'}`}>
                     <div className="flex items-start space-x-3">
                        {evaluationResult.passed ? <CheckCircle size={20} className="mt-0.5 shrink-0" /> : <AlertCircle size={20} className="mt-0.5 shrink-0" />}
                        <div>
                            <p className="font-bold text-sm uppercase">{evaluationResult.passed ? 'Breach Successful' : 'Access Denied'}</p>
                            <p className="text-xs opacity-90 font-mono mt-1">{evaluationResult.feedback}</p>
                        </div>
                     </div>
                 </div>
             )}

             <div className="prose prose-invert prose-sm max-w-none font-mono text-slate-300">
                 {response ? (
                     <ReactMarkdown>{response}</ReactMarkdown>
                 ) : (
                     <div className="text-slate-700 italic text-xs">Waiting for execution...</div>
                 )}
             </div>

             {/* AI Nudge Toast */}
             {showNudge && !isTutorOpen && (
                 <div className="absolute bottom-6 right-6 max-w-xs animate-in slide-in-from-bottom-5 fade-in">
                     <div className="bg-brand-900/90 border border-brand-500/50 backdrop-blur-md p-4 rounded shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                         <div className="flex items-start space-x-3">
                             <div className="bg-brand-500 p-1.5 rounded-none shrink-0 animate-pulse">
                                 <Lightbulb size={16} className="text-white" />
                             </div>
                             <div>
                                 <h4 className="text-xs font-bold text-white mb-1 uppercase">Hint Available</h4>
                                 <p className="text-[10px] text-brand-200 mb-2">Detection systems indicate you are struggling. Request tactical assist?</p>
                                 <div className="flex space-x-2">
                                     <button 
                                        onClick={() => handleTutorAsk(error ? "Analyze this error log" : "Provide tactical hint")}
                                        className="text-[10px] bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-none transition-colors uppercase font-bold"
                                     >
                                         Request Assist
                                     </button>
                                     <button 
                                        onClick={() => setShowNudge(false)}
                                        className="text-[10px] text-brand-300 hover:text-white px-2 py-1.5 uppercase"
                                     >
                                         Ignore
                                     </button>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
        </div>

        {/* Tutor Overlay */}
        {isTutorOpen && (
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-dark-surface border-l border-dark-border shadow-2xl flex flex-col z-20">
                <div className="p-4 border-b border-dark-border flex items-center justify-between bg-brand-900/20">
                    <div className="flex items-center space-x-2 text-brand-400">
                        <Terminal size={16} />
                        <span className="font-bold text-xs uppercase">Tactical Support</span>
                    </div>
                    <button onClick={() => setIsTutorOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <p className="text-xs text-slate-300 bg-dark-bg p-3 border border-dark-border font-mono">
                        System ready. I can analyze your prompt structure or suggest injection vectors.
                    </p>
                    {tutorResponse && (
                         <div className="text-xs text-slate-300 bg-dark-bg p-3 border border-dark-border animate-in fade-in slide-in-from-bottom-2 font-mono">
                            <ReactMarkdown>{tutorResponse}</ReactMarkdown>
                         </div>
                    )}
                     {isTutorLoading && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin text-brand-400" size={20} />
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-dark-border">
                    <div className="relative">
                        <textarea
                            value={tutorQuery}
                            onChange={(e) => setTutorQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleTutorAsk();
                                }
                            }}
                            placeholder="Input query..."
                            className="w-full bg-black border border-dark-border pl-3 pr-10 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none h-20 font-mono"
                        />
                        <button 
                            onClick={() => handleTutorAsk()}
                            disabled={isTutorLoading || !tutorQuery.trim()}
                            className="absolute right-2 bottom-2 p-1.5 bg-brand-600 text-white rounded-none hover:bg-brand-500 transition-colors disabled:opacity-50"
                        >
                            <MessageSquare size={14} />
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
