import React, { useState } from 'react';
import { LearningPlan, LearningTopic, LearningResource } from '../types';

interface LearningPlanDisplayProps {
    plan: LearningPlan;
}

// Spiral learning phase configuration
const getSpiralPhase = (index: number, totalTopics: number) => {
    const position = index / totalTopics;
    if (position < 0.33) {
        return { label: 'Foundation', icon: '🌱', color: 'bg-green-100 text-green-700 border-green-200' };
    } else if (position < 0.67) {
        return { label: 'Intermediate', icon: '⚡', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    } else {
        return { label: 'Applied', icon: '🚀', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    }
};

const ResourceIcon: React.FC<{ type: LearningResource['type'] }> = ({ type }) => {
    switch (type) {
        case 'video':
            return <span>🎬</span>;
        case 'article':
            return <span>📄</span>;
        case 'course':
            return <span>🎓</span>;
        case 'tool':
            return <span>🛠️</span>;
        default:
            return <span>🔗</span>;
    }
};

const TopicCard: React.FC<{ topic: LearningTopic; index: number; totalTopics: number }> = ({ topic, index, totalTopics }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const spiralPhase = getSpiralPhase(index, totalTopics);

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Topic Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isExpanded}
            >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                    {index + 1}
                </div>
                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{topic.title}</h3>
                        {/* Spiral Learning Badge */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${spiralPhase.color}`}>
                            {spiralPhase.icon} {spiralPhase.label}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{topic.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {topic.estimatedHours}h
                    </span>
                    <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-100 animate-fade-in-up">
                    {/* Detailed Guidance */}
                    <div className="mt-4">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <span>📋</span> Step-by-Step Guide
                        </h4>
                        <ol className="space-y-2">
                            {topic.detailedGuidance.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
                                        {idx + 1}
                                    </span>
                                    <span className="leading-relaxed">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Resources */}
                    {topic.resources && topic.resources.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span>🔗</span> Recommended Resources
                            </h4>
                            <div className="grid gap-2">
                                {topic.resources.map((resource, idx) => (
                                    <a
                                        key={idx}
                                        href={resource.url || `https://www.google.com/search?q=${encodeURIComponent(resource.searchQuery)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="text-xl">
                                            <ResourceIcon type={resource.type} />
                                        </span>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-medium text-gray-800 group-hover:text-primary truncate">
                                                {resource.title}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                                        </div>
                                        <span className="text-gray-400 group-hover:text-primary transition-colors">
                                            →
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const LearningPlanDisplay: React.FC<LearningPlanDisplayProps> = ({ plan }) => {
    const getFeasibilityColor = (feasibility: string) => {
        switch (feasibility) {
            case 'Realistic':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'Challenging':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Unrealistic':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getComplexityBadge = (complexity: string) => {
        switch (complexity) {
            case 'Low':
                return { text: 'Beginner Friendly', color: 'bg-green-100 text-green-700' };
            case 'Medium':
                return { text: 'Intermediate', color: 'bg-amber-100 text-amber-700' };
            case 'High':
                return { text: 'Advanced', color: 'bg-red-100 text-red-700' };
            default:
                return { text: complexity, color: 'bg-gray-100 text-gray-700' };
        }
    };

    const complexityBadge = getComplexityBadge(plan.complexity);

    return (
        <div className="animate-fade-in-up">
            {/* Plan Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-xl shadow-blue-500/20">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${complexityBadge.color} text-opacity-90`}>
                            {complexityBadge.text}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{plan.totalHours}h</div>
                        <div className="text-sm text-blue-100">Total Time</div>
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-2">{plan.skillName}</h2>
                <p className="text-blue-100 text-sm">📅 Timeline: {plan.timeline}</p>

                {/* Feasibility Banner */}
                <div className={`mt-4 p-3 rounded-xl border ${getFeasibilityColor(plan.feasibility)}`}>
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <span>{plan.feasibility === 'Realistic' ? '✅' : plan.feasibility === 'Challenging' ? '⚠️' : '❌'}</span>
                        <span>Feasibility: {plan.feasibility}</span>
                    </div>
                    <p className="text-xs mt-1 opacity-80">{plan.feasibilityReason}</p>
                </div>
            </div>

            {/* Topics List */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <span>📚</span> Learning Roadmap ({plan.topics.length} modules)
                </h3>
                {plan.topics.map((topic, index) => (
                    <TopicCard key={index} topic={topic} index={index} totalTopics={plan.topics.length} />
                ))}
            </div>
        </div>
    );
};

export default LearningPlanDisplay;
