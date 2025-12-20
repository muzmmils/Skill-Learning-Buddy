import React, { useState } from 'react';
import { LearningPlan } from '../types';

interface VisualStudioProps {
    plan: LearningPlan;
}

interface GeneratedImage {
    dataUrl: string;
    prompt: string;
}

const VisualStudio: React.FC<VisualStudioProps> = ({ plan }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [stylePrompt, setStylePrompt] = useState('');
    const [showStyleInput, setShowStyleInput] = useState(false);

    const generateImage = async (customStyle?: string) => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-roadmap-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skillName: plan.skillName,
                    topics: plan.topics,
                    style: customStyle || undefined
                }),
            });

            const data = await response.json();

            if (data.success && data.image) {
                setGeneratedImage(data.image);
            } else {
                setError(data.error || 'Failed to generate image');
                if (data.suggestion) {
                    setError(prev => `${prev}. ${data.suggestion}`);
                }
            }
        } catch (err) {
            console.error('Image generation error:', err);
            setError('Failed to connect to image generation service');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleStyleRefinement = () => {
        if (stylePrompt.trim()) {
            generateImage(stylePrompt.trim());
            setStylePrompt('');
            setShowStyleInput(false);
        }
    };

    const downloadImage = () => {
        if (!generatedImage) return;

        const link = document.createElement('a');
        link.href = generatedImage.dataUrl;
        link.download = `${plan.skillName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-roadmap.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="mt-8 animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🎨</span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">Visual Studio</h3>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                    Nano Banana Powered
                                </span>
                            </div>
                            <p className="text-gray-500 text-xs">Generate a visual study aid to reinforce your learning path.</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!generatedImage && !isGenerating && (
                        <div className="text-center py-8">
                            {/* Decorative Map Icon */}
                            <div className="w-20 h-20 mx-auto mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl transform rotate-3"></div>
                                <div className="absolute inset-0 bg-white rounded-2xl border-2 border-gray-200 flex items-center justify-center">
                                    <span className="text-4xl">🗺️</span>
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 mb-2">Visualize Your Journey</h4>
                            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                                Turn your "{plan.skillName}" text plan into a stunning, single-page visual roadmap.
                                Perfect for setting as your desktop wallpaper to keep you motivated.
                            </p>

                            <button
                                onClick={() => generateImage()}
                                disabled={isGenerating}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <span>✨</span>
                                <span>Create Visual Study Aid</span>
                            </button>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="text-center py-12">
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-3xl animate-bounce">🎨</span>
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Creating Your Visual Roadmap...</h4>
                            <p className="text-gray-500 text-sm">
                                The AI is designing a beautiful infographic for your learning journey
                            </p>
                            <div className="flex justify-center gap-1 mt-4">
                                <span className="w-2 h-2 bg-purple-500 rounded-full dot-bounce"></span>
                                <span className="w-2 h-2 bg-purple-500 rounded-full dot-bounce" style={{ animationDelay: '0.1s' }}></span>
                                <span className="w-2 h-2 bg-purple-500 rounded-full dot-bounce" style={{ animationDelay: '0.2s' }}></span>
                            </div>
                        </div>
                    )}

                    {error && !isGenerating && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Image Generation Unavailable</h4>
                            <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">{error}</p>
                            <button
                                onClick={() => generateImage()}
                                className="text-purple-600 hover:text-purple-700 font-medium text-sm underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {generatedImage && !isGenerating && (
                        <div className="space-y-4">
                            {/* Generated Image */}
                            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                                <img
                                    src={generatedImage.dataUrl}
                                    alt={`Visual roadmap for ${plan.skillName}`}
                                    className="w-full h-auto"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button
                                        onClick={downloadImage}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-colors"
                                        title="Download image"
                                    >
                                        <span>📥</span>
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                <button
                                    onClick={downloadImage}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm"
                                >
                                    <span>📥</span>
                                    <span>Download Wallpaper</span>
                                </button>

                                <button
                                    onClick={() => generateImage()}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                >
                                    <span>🔄</span>
                                    <span>Regenerate</span>
                                </button>

                                <button
                                    onClick={() => setShowStyleInput(!showStyleInput)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors text-sm"
                                >
                                    <span>🎨</span>
                                    <span>Change Style</span>
                                </button>
                            </div>

                            {/* Style Refinement Input */}
                            {showStyleInput && (
                                <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100 animate-fade-in-up">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        ✏️ Natural Language Style Refinement
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={stylePrompt}
                                            onChange={(e) => setStylePrompt(e.target.value)}
                                            placeholder="e.g., Make it cyberpunk style, Use warmer colors, Add more icons..."
                                            className="flex-grow px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                                            onKeyDown={(e) => e.key === 'Enter' && handleStyleRefinement()}
                                        />
                                        <button
                                            onClick={handleStyleRefinement}
                                            disabled={!stylePrompt.trim()}
                                            className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Describe how you want to modify the visual style (e.g., "Cyberpunk theme", "Minimalist design", "Vibrant colors")
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualStudio;
