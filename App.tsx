
import React, { useState, useEffect } from 'react';
import GoalInput from './components/GoalInput';
import ReasoningView from './components/ReasoningView';
import LearningPlanDisplay from './components/LearningPlanDisplay';
import VisualStudio from './components/VisualStudio';
import TimeCommitmentCalculator from './components/TimeCommitmentCalculator';
import CompetitionHighlights from './components/CompetitionHighlights';
import { generateLearningPlanStream } from './services/geminiService';
import { COMMUNITY_HISTORY } from './services/mockHistory';
import { LearningPlan, UserContext } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reasoningText, setReasoningText] = useState('');
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [checkingKey, setCheckingKey] = useState(true);
  const [activeContext, setActiveContext] = useState<UserContext | null>(null);
  
  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // Initialize with Community Plans instead of empty
  const [history, setHistory] = useState<LearningPlan[]>(COMMUNITY_HISTORY);

  // Check for API key on mount
  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
           setHasApiKey(!!process.env.API_KEY);
        }
      } catch (e) {
        console.error("Error checking API key", e);
      } finally {
        setCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const addToSessionHistory = (newPlan: LearningPlan) => {
      const planWithId = {
          ...newPlan,
          id: `session-${Date.now()}`,
          createdAt: 'Just Now'
      };
      // Prepend new plan to the existing (community) history for this session
      setHistory(prev => [planWithId, ...prev]);
  };

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        await window.aistudio.openSelectKey();
        setHasApiKey(true);
      }
    } catch (e) {
      console.error("Error selecting API key", e);
    }
  };

  const handleGoalSubmit = async (goal: string, context: UserContext) => {
    setLoading(true);
    setReasoningText('');
    setPlan(null);
    setActiveContext(context);

    try {
      const resultPlan = await generateLearningPlanStream(goal, context, (text) => {
        setReasoningText(text);
      });
      setPlan(resultPlan);
      addToSessionHistory(resultPlan);
    } catch (error) {
      console.error("Error generating plan:", error);
      setReasoningText(prev => prev + "\n\n❌ Error: Failed to generate a valid plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
      if (window.confirm("Are you sure? This will clear your current plan view.")) {
          setPlan(null);
          setReasoningText('');
          setActiveContext(null);
      }
  };

  const loadFromHistory = (historyPlan: LearningPlan) => {
      setPlan(historyPlan);
      setReasoningText(''); // Clear reasoning for history items as we don't store it
      setActiveContext(null); // Clear context context
      setIsHistoryOpen(false);
  };

  if (checkingKey) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-gray-500">Loading...</div>;
  }

  if (!hasApiKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-gray-200">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">API Key Required</h1>
          <p className="text-gray-600 mb-6">
            To use the advanced Gemini 3.0 Pro features and Image Generation, please select a valid API key.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mb-4"
          >
            Select API Key
          </button>
           <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            Billing Documentation
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-900 flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="glass-panel border-b border-gray-200/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">
                🎓
            </div>
            <div>
               <h1 className="text-lg font-bold text-gray-900 leading-tight">Skill Learning Buddy</h1>
               <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Powered by Gemini 3.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button
                onClick={() => setIsHistoryOpen(true)}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
             >
                <span>🌍</span> Community Plans
             </button>
             {plan && (
                <button 
                    onClick={handleStartOver}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary bg-gray-50 hover:bg-blue-50 rounded-full transition-all border border-gray-200"
                >
                    Start New Goal
                </button>
             )}
          </div>
        </div>
      </nav>

      {/* Community / History Drawer */}
      <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isHistoryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)}></div>
          <div className={`relative w-80 bg-white h-full shadow-2xl transform transition-transform duration-300 flex flex-col ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span>🌍</span> Community Plans
                  </h3>
                  <button onClick={() => setIsHistoryOpen(false)} className="p-1 hover:bg-gray-200 rounded text-gray-500">✕</button>
              </div>
              <div className="p-3 bg-blue-50 text-xs text-blue-800 border-b border-blue-100">
                Explore plans created by the community or your recent session generations.
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {history.map((h, idx) => (
                      <div key={h.id || idx} className="p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group" onClick={() => loadFromHistory(h)}>
                          <p className="text-sm font-bold text-gray-800 line-clamp-2">{h.skillName}</p>
                          <div className="flex justify-between items-center mt-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${h.createdAt === 'Featured' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                {h.createdAt}
                              </span>
                              <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100">Load</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <main className="flex-grow">
        
        {/* Hero Section - Show only when no plan */}
        {!plan && !loading && !reasoningText && (
          <div className="relative overflow-hidden bg-gray-900 text-white pb-16 pt-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 animate-gradient-x opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            
            <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in-up">
                 <span>✨</span> Google DeepMind - Vibe Code with Gemini 3 Pro in AI Studio
               </div>
               
               <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                 AI-powered learning paths personalized to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">YOUR</span> background
               </h2>
               
               <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 font-light animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                 Stop guessing. Let our reasoning engine analyze your skills, schedule, and goals to build the perfect curriculum in seconds.
               </p>

               {/* Impact Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-3xl font-bold">12k+</p>
                    <p className="text-xs text-blue-200 uppercase tracking-wide opacity-80">Plans Generated</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-3xl font-bold">94%</p>
                    <p className="text-xs text-blue-200 uppercase tracking-wide opacity-80">Success Rate</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-3xl font-bold">140h</p>
                    <p className="text-xs text-blue-200 uppercase tracking-wide opacity-80">Avg Time Saved</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <p className="text-3xl font-bold">4.9/5</p>
                    <p className="text-xs text-blue-200 uppercase tracking-wide opacity-80">User Rating</p>
                  </div>
               </div>
            </div>
            
            {/* Decorative curved bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-background" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }}></div>
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 pb-12">
            
            {/* Active Context Indicator */}
            {(loading || plan) && activeContext?.background && (
                <div className="mb-8 animate-fade-in-up">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-4 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-3 opacity-10">
                            <span className="text-6xl">🎯</span>
                        </div>
                        <div className="bg-white p-2 rounded-full shadow-sm text-2xl">
                            🧬
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-1">Context Active</h3>
                            <p className="text-gray-600 text-sm">
                                <span className="font-semibold text-indigo-700">Personalization Engine:</span> Adjusting curriculum based on your provided background and portfolio links.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {!plan && (
                <GoalInput onSubmit={handleGoalSubmit} isLoading={loading} />
            )}

            {(reasoningText || loading) && (
            <ReasoningView 
                reasoningText={reasoningText} 
                isComplete={!!plan} 
            />
            )}

            {plan && <LearningPlanDisplay plan={plan} />}
            
            {plan && (
            <TimeCommitmentCalculator 
                totalHours={plan.totalHours} 
                originalTimelineString={plan.timeline}
                topics={plan.topics}
            />
            )}

            {plan && <VisualStudio plan={plan} />}

            {/* Testimonials */}
            {!plan && !loading && !reasoningText && (
                <div className="mt-20">
                    <h3 className="text-center text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">Trusted by Learners Worldwide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=2563eb&color=fff" alt="User" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Jane Doe</p>
                                    <p className="text-xs text-gray-500">Former Nurse → AI Product Manager</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm italic leading-relaxed">"The context feature is mind-blowing. It didn't just give me a generic PM course; it specifically taught me how to apply my clinical experience to AI product development."</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="https://ui-avatars.com/api/?name=Mark+Smith&background=10b981&color=fff" alt="User" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Mark Smith</p>
                                    <p className="text-xs text-gray-500">Dad & Coding Enthusiast</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm italic leading-relaxed">"Finally a learning plan that understands I only have 45 mins a day. The schedule feasibility check saved me from setting unrealistic goals and burning out."</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Competition Highlights - Always visible on landing, or when no plan is active to keep it clean */}
            {!plan && !loading && !reasoningText && <CompetitionHighlights />}

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
             <div>
                <p className="font-semibold text-gray-700">🏆 Built for Google DeepMind - Vibe Code with Gemini 3 Pro in AI Studio</p>
                <p className="text-xs mt-1">Track: Education & Skill Development</p>
             </div>
             <div className="flex items-center gap-4">
                 <a href="#" className="hover:text-primary transition-colors">About</a>
                 <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                 <a href="#" className="hover:text-primary transition-colors">GitHub</a>
             </div>
          </div>
      </footer>
    </div>
  );
};

export default App;
