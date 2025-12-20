import React, { useEffect, useRef, useMemo } from 'react';

interface ReasoningViewProps {
    reasoningText: string;
    isComplete: boolean;
}

// Reasoning phases that the AI goes through
const REASONING_PHASES = [
    { id: 'goal', label: 'Goal Analysis', icon: '🎯', keywords: ['goal', 'objective', 'want to', 'learn', 'master', 'skill'] },
    { id: 'breakdown', label: 'Skill Breakdown', icon: '🧩', keywords: ['break', 'component', 'pillar', 'core', 'fundamental', 'module'] },
    { id: 'background', label: 'Context Analysis', icon: '🧬', keywords: ['background', 'experience', 'existing', 'prior', 'knowledge'] },
    { id: 'timeline', label: 'Timeline Estimation', icon: '⏱️', keywords: ['time', 'hour', 'week', 'month', 'duration', 'estimate'] },
    { id: 'feasibility', label: 'Feasibility Check', icon: '⚖️', keywords: ['feasib', 'realistic', 'challenging', 'achievable', 'possible'] },
    { id: 'curriculum', label: 'Curriculum Design', icon: '📚', keywords: ['curriculum', 'resource', 'course', 'recommend', 'suggest', 'structure'] },
];

const ReasoningView: React.FC<ReasoningViewProps> = ({ reasoningText, isComplete }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom as new content streams in
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [reasoningText]);

    // Detect which phases have been reached based on keywords
    const activePhases = useMemo(() => {
        const lowerText = reasoningText.toLowerCase();
        return REASONING_PHASES.map(phase => ({
            ...phase,
            active: phase.keywords.some(kw => lowerText.includes(kw))
        }));
    }, [reasoningText]);

    const completedPhaseCount = activePhases.filter(p => p.active).length;
    const progressPercent = isComplete ? 100 : Math.round((completedPhaseCount / REASONING_PHASES.length) * 80);

    const formatText = (text: string) => {
        // Parse markdown-like formatting
        return text.split('\n').map((line, idx) => {
            // Headers
            if (line.startsWith('### ')) {
                return (
                    <h3 key={idx} className="text-sm font-bold text-gray-800 mt-3 mb-1">
                        {line.replace('### ', '')}
                    </h3>
                );
            }
            if (line.startsWith('## ')) {
                return (
                    <h2 key={idx} className="text-base font-bold text-gray-900 mt-4 mb-2">
                        {line.replace('## ', '')}
                    </h2>
                );
            }
            // Bullet points
            if (line.startsWith('- ') || line.startsWith('* ')) {
                return (
                    <li key={idx} className="text-gray-600 ml-4 text-sm leading-relaxed">
                        {line.replace(/^[-*] /, '')}
                    </li>
                );
            }
            // Numbered lists
            if (/^\d+\. /.test(line)) {
                return (
                    <li key={idx} className="text-gray-600 ml-4 text-sm leading-relaxed list-decimal">
                        {line.replace(/^\d+\. /, '')}
                    </li>
                );
            }
            // Empty lines
            if (line.trim() === '') {
                return <br key={idx} />;
            }
            // Regular paragraphs
            return (
                <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                    {line}
                </p>
            );
        });
    };

    return (
        <div className="mb-8 animate-fade-in-up">
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                        <span className="text-white font-semibold text-sm">
                            {isComplete ? '✅ Analysis Complete' : '🧠 AI Reasoning in Progress...'}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>

                {/* Phase Indicators */}
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {activePhases.map((phase) => (
                            <div
                                key={phase.id}
                                className={`
                                    flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300
                                    ${phase.active
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm'
                                        : 'bg-gray-200 text-gray-400'
                                    }
                                `}
                            >
                                <span>{phase.icon}</span>
                                <span>{phase.label}</span>
                                {phase.active && <span className="ml-1">✓</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div
                    ref={scrollRef}
                    className="p-5 max-h-80 overflow-y-auto reasoning-scroll"
                    role="log"
                    aria-live="polite"
                    aria-label="AI reasoning process"
                >
                    {reasoningText ? (
                        <div className="space-y-1 font-mono text-sm">
                            {formatText(reasoningText)}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-gray-500">
                            <span className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full dot-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full dot-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full dot-bounce"></span>
                            </span>
                            <span className="text-sm">Initializing analysis...</span>
                        </div>
                    )}

                    {/* Thinking cursor when not complete */}
                    {!isComplete && reasoningText && (
                        <span className="inline-block w-2 h-4 bg-gray-600 animate-pulse ml-1"></span>
                    )}
                </div>

                {/* Progress indicator */}
                <div className="h-1.5 bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ReasoningView;

