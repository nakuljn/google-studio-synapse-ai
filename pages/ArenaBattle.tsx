
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLevelById } from '../services/arenaService';
import { streamContent, speakText } from '../services/geminiService';
import { ModelType } from '../types';
import { ChevronLeft, Send, Lock, Unlock, Mic, Volume2, VolumeX, MicOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ArenaBattle: React.FC = () => {
    const { levelId } = useParams();
    const [level, setLevel] = useState(levelId ? getLevelById(levelId) : undefined);
    
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isWon, setIsWon] = useState(false);
    
    // Voice State
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Check if level demands voice
    useEffect(() => {
        if(level?.mode === 'voice-negotiation') {
            setIsVoiceEnabled(true);
        }
    }, [level]);

    // Setup Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // Auto send on voice end? Maybe let user confirm.
            };
            
            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    if (!level) return <div className="p-10 text-white">Level not found</div>;

    const handleSend = async () => {
        if (!input.trim() || isLoading || isWon) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            // Build history context
            let historyPrompt = "";
            messages.forEach(m => {
                historyPrompt += `${m.role === 'user' ? 'User' : 'System'}: ${m.text}\n`;
            });
            historyPrompt += `User: ${userMsg}\nSystem:`;

            await streamContent(
                ModelType.FLASH,
                level.systemPrompt, 
                userMsg, 
                0.8,
                (text) => {} 
            ).then((fullText) => {
                setMessages(prev => [...prev, { role: 'model', text: fullText }]);
                
                if (isVoiceEnabled) {
                    speakText(fullText);
                }

                if (fullText.toLowerCase().includes(level.secret.toLowerCase())) {
                    setIsWon(true);
                    if(isVoiceEnabled) speakText("Congratulations. You have defeated me.");
                }
            });

        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "Error: Connection interrupted." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const isVoiceMode = level.mode === 'voice-negotiation';

    return (
        <div className="flex flex-col h-screen bg-black font-mono text-green-400 selection:bg-green-900 selection:text-white">
            {/* Header */}
            <header className="h-16 border-b border-green-900/50 bg-black flex items-center justify-between px-6 z-10">
                <div className="flex items-center space-x-4">
                    <Link to="/arena" className="text-green-700 hover:text-green-400 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 border border-green-800 rounded flex items-center justify-center bg-green-950/30 text-2xl">
                             {level.avatar}
                         </div>
                         <div>
                             <h1 className="font-bold text-lg tracking-wider text-green-500 uppercase">{level.name}</h1>
                             <div className="flex items-center space-x-2 text-xs text-green-800">
                                 <Lock size={10} />
                                 <span>{level.mode === 'voice-negotiation' ? 'VOICE CHANNEL' : 'TEXT CHANNEL'}</span>
                             </div>
                         </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                     <button 
                        onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                        className={`p-2 rounded-full transition-colors ${isVoiceEnabled ? 'text-green-400 bg-green-900/30' : 'text-green-800 hover:text-green-600'}`}
                        title="Toggle TTS"
                     >
                        {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                     </button>
                     <div className="text-right hidden md:block">
                         <div className="text-xs text-green-800 uppercase">Target Data</div>
                         <div className="font-bold text-red-500 animate-pulse tracking-widest">********</div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide relative bg-black/90">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded p-4 border ${
                            msg.role === 'user' 
                                ? 'bg-green-900/20 border-green-800 text-green-300' 
                                : 'bg-black border-green-900 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                        }`}>
                            <div className="text-xs opacity-50 mb-1 uppercase tracking-wider">{msg.role === 'user' ? '> OPERATOR' : '> TARGET_AI'}</div>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="text-green-500 animate-pulse">Running neural simulation...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-green-900/50 bg-black flex flex-col justify-center items-center">
                 {isWon ? (
                     <div className="text-center animate-in zoom-in">
                         <Unlock size={48} className="mx-auto mb-4 text-green-500" />
                         <h2 className="text-3xl font-bold uppercase mb-2">Access Granted</h2>
                         <p className="text-green-400 mb-6">SECRET: {level.secret}</p>
                         <Link to="/arena" className="bg-green-600 text-black font-bold px-8 py-3 rounded hover:bg-green-500 transition-colors">
                             Mission Complete
                         </Link>
                     </div>
                 ) : (
                     <div className="w-full max-w-3xl relative">
                        {isVoiceMode && (
                            <div className="absolute -top-16 left-0 right-0 flex justify-center pointer-events-none">
                                <div className={`px-4 py-2 rounded-full border bg-black transition-all ${isListening ? 'border-red-500 text-red-500 animate-pulse' : 'border-green-900 text-green-800'}`}>
                                    {isListening ? 'LISTENING...' : 'MICROPHONE READY'}
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-end space-x-2">
                             <div className="relative flex-1">
                                <textarea 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder={isVoiceMode ? "Speak or type your command..." : "Enter prompt injection..."}
                                    className="w-full bg-green-900/10 border border-green-800 rounded-lg p-4 pl-4 text-green-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 placeholder-green-900 resize-none h-16"
                                    autoFocus
                                />
                             </div>
                             
                             {/* Mic Button */}
                             <button 
                                onClick={toggleListening}
                                className={`p-4 rounded-lg border transition-all ${
                                    isListening 
                                        ? 'bg-red-900/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                                        : 'bg-green-900/10 border-green-800 text-green-600 hover:text-green-400 hover:border-green-500'
                                }`}
                             >
                                 {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                             </button>

                             <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="p-4 bg-green-700 text-black rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                 <Send size={24} />
                             </button>
                        </div>
                     </div>
                 )}
            </div>
        </div>
    );
};
