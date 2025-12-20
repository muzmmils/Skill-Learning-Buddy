import React, { useState, useMemo } from 'react';
import { LearningTopic } from '../types';
import StudyCalendar from './StudyCalendar';

interface TimeCommitmentCalculatorProps {
    totalHours: number;
    originalTimelineString: string;
    topics: LearningTopic[];
}

const TimeCommitmentCalculator: React.FC<TimeCommitmentCalculatorProps> = ({
    totalHours,
    originalTimelineString,
    topics
}) => {
    const [daysPerWeek, setDaysPerWeek] = useState(4);
    const [sessionMinutes, setSessionMinutes] = useState(60); // in minutes
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [startTime, setStartTime] = useState('09:00');
    const [showSchedule, setShowSchedule] = useState(false);

    const sessionOptions = [
        { label: '15 min', value: 15 },
        { label: '30 min', value: 30 },
        { label: '45 min', value: 45 },
        { label: '1 hr', value: 60 },
        { label: '1.5 hrs', value: 90 },
        { label: '2 hrs', value: 120 },
    ];

    const hoursPerDay = sessionMinutes / 60;

    const calculations = useMemo(() => {
        const weeklyHours = hoursPerDay * daysPerWeek;
        const weeksNeeded = Math.ceil(totalHours / weeklyHours);
        const monthsNeeded = (weeksNeeded / 4.33).toFixed(1);

        // Calculate end date
        const start = new Date(startDate);
        const endDate = new Date(start);
        endDate.setDate(endDate.getDate() + (weeksNeeded * 7));

        return {
            weeklyHours,
            weeksNeeded,
            monthsNeeded,
            endDate: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
    }, [hoursPerDay, daysPerWeek, totalHours, startDate]);

    const handleGenerateSchedule = () => {
        setShowSchedule(true);
    };

    return (
        <div className="mt-8 animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⏰</span>
                        <h3 className="text-gray-900 font-bold text-lg">Your Time Commitment</h3>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Left Column - Inputs */}
                        <div className="space-y-6">
                            {/* Days per Week */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    How many days per week can you study?
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => setDaysPerWeek(day)}
                                            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${daysPerWeek === day
                                                    ? 'bg-gray-900 text-white shadow-md'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-blue-500 mt-2">{daysPerWeek} days / week</p>
                            </div>

                            {/* Session Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    How much time per session?
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {sessionOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setSessionMinutes(option.value)}
                                            className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${sessionMinutes === option.value
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-2">
                                        Daily Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerateSchedule}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <span>✨</span>
                                <span>Generate My Schedule</span>
                            </button>
                        </div>

                        {/* Right Column - Calendar Preview */}
                        <div className="flex items-center justify-center">
                            {!showSchedule ? (
                                <div className="w-full h-full min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-6">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                        <span className="text-3xl">📅</span>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Configure your availability to see your<br />personalized timeline.
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full space-y-4">
                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-100">
                                            <p className="text-2xl font-bold text-blue-600">{calculations.weeksNeeded}</p>
                                            <p className="text-xs text-gray-600 font-medium">weeks to complete</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center border border-purple-100">
                                            <p className="text-2xl font-bold text-purple-600">{calculations.weeklyHours}h</p>
                                            <p className="text-xs text-gray-600 font-medium">per week</p>
                                        </div>
                                    </div>

                                    {/* Timeline Summary */}
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🎯</span>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Finish by {calculations.endDate}</p>
                                                <p className="text-xs text-gray-600">
                                                    {totalHours} total hours • {sessionMinutes} min/day • {daysPerWeek} days/week
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Module Breakdown Mini */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-xs font-semibold text-gray-700 mb-2">📚 Modules included:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {topics.slice(0, 5).map((topic, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-600"
                                                >
                                                    {topic.title.length > 15 ? topic.title.substring(0, 15) + '...' : topic.title}
                                                </span>
                                            ))}
                                            {topics.length > 5 && (
                                                <span className="text-xs bg-blue-100 px-2 py-1 rounded-md text-blue-600">
                                                    +{topics.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Study Calendar (shown after generating) */}
                    {showSchedule && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <StudyCalendar
                                topics={topics}
                                hoursPerDay={hoursPerDay}
                                daysPerWeek={daysPerWeek}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimeCommitmentCalculator;
