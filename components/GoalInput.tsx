import React, { useState } from 'react';
import { UserContext } from '../types';
import { CAREER_PRESETS, CareerPreset } from '../services/careerPresets';

interface GoalInputProps {
  onSubmit: (goal: string, context: UserContext) => void;
  isLoading: boolean;
}

const GoalInput: React.FC<GoalInputProps> = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');
  const [background, setBackground] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isLoading) {
      onSubmit(goal.trim(), { background: background.trim(), profileUrl: profileUrl.trim() });
    }
  };

  const applyPreset = (preset: CareerPreset) => {
    setSelectedPreset(preset.id);
    setBackground(preset.background);
    setIsExpanded(true);
    // Suggest the first goal if no goal is set
    if (!goal.trim() && preset.suggestedGoals.length > 0) {
      setGoal(preset.suggestedGoals[0]);
    }
  };

  const clearPreset = () => {
    setSelectedPreset(null);
    setBackground('');
  };

  const exampleGoals = [
    "Learn Python for data science in 3 months",
    "Master React and build production apps",
    "Become proficient in machine learning",
    "Learn UI/UX design fundamentals"
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Goal Input */}
        <div className="relative">
          <label htmlFor="goal-input" className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 What skill do you want to master?
          </label>
          <div className="relative">
            <input
              id="goal-input"
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Learn Python for data science in 3 months"
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
              disabled={isLoading}
              aria-describedby="goal-hint"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <p id="goal-hint" className="mt-2 text-xs text-gray-500">
            Be specific about the skill, level, and timeline for better recommendations
          </p>
        </div>

        {/* Quick Examples */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 font-medium">Try:</span>
          {exampleGoals.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setGoal(example)}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-primary rounded-full transition-colors"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>

        {/* Context Expansion Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
            <span>🧬 Add personalization context (optional)</span>
          </button>
        </div>

        {/* Expandable Context Fields */}
        {isExpanded && (
          <div className="space-y-4 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 animate-fade-in-up">

            {/* Career Transition Presets */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🚀 Quick Start: Career Transition Presets
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select a preset to auto-fill your background and get tailored recommendations
              </p>
              <div className="flex flex-wrap gap-2">
                {CAREER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectedPreset === preset.id ? clearPreset() : applyPreset(preset)}
                    className={`
                      text-xs px-3 py-2 rounded-lg border-2 transition-all flex items-center gap-2
                      ${selectedPreset === preset.id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                      }
                    `}
                    disabled={isLoading}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>

              {/* Suggested Goals for Selected Preset */}
              {selectedPreset && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-indigo-200">
                  <p className="text-xs font-semibold text-indigo-700 mb-2">Suggested goals for this transition:</p>
                  <div className="flex flex-wrap gap-2">
                    {CAREER_PRESETS.find(p => p.id === selectedPreset)?.suggestedGoals.map((sg, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGoal(sg)}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${goal === sg
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                          }`}
                      >
                        {sg}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-indigo-200 pt-4">
              <label htmlFor="background-input" className="block text-sm font-semibold text-gray-700 mb-2">
                📚 Your Background & Experience
              </label>
              <textarea
                id="background-input"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="e.g., I'm a marketing professional with 3 years of experience. I know basic Excel and have some exposure to SQL from creating reports..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none h-24 text-sm"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="profile-input" className="block text-sm font-semibold text-gray-700 mb-2">
                🔗 Portfolio / LinkedIn / GitHub URL
              </label>
              <input
                id="profile-input"
                type="url"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                We'll analyze your profile to suggest resources that build on your existing skills
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!goal.trim() || isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all transform ${!goal.trim() || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-white rounded-full dot-bounce"></span>
                <span className="w-2 h-2 bg-white rounded-full dot-bounce"></span>
                <span className="w-2 h-2 bg-white rounded-full dot-bounce"></span>
              </span>
              <span>AI is Thinking...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Generate My Learning Path</span>
              <span>🚀</span>
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default GoalInput;
