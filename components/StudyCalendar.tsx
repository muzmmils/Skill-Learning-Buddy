import React, { useState, useMemo } from 'react';
import { LearningTopic } from '../types';
import { generateSchedule, ScheduleSession } from '../services/exportService';

interface StudyCalendarProps {
    topics: LearningTopic[];
    hoursPerDay: number;
    daysPerWeek: number;
}

// Color palette for different topics
const TOPIC_COLORS = [
    { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', dot: 'bg-blue-500' },
    { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', dot: 'bg-purple-500' },
    { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', dot: 'bg-green-500' },
    { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800', dot: 'bg-amber-500' },
    { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-800', dot: 'bg-rose-500' },
    { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-800', dot: 'bg-cyan-500' },
];

const StudyCalendar: React.FC<StudyCalendarProps> = ({
    topics,
    hoursPerDay,
    daysPerWeek
}) => {
    const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

    const schedule = useMemo(() => {
        return generateSchedule(topics, hoursPerDay, daysPerWeek);
    }, [topics, hoursPerDay, daysPerWeek]);

    // Calculate total weeks needed
    const totalWeeksNeeded = useMemo(() => {
        const totalHours = topics.reduce((sum, t) => sum + t.estimatedHours, 0);
        const weeklyHours = hoursPerDay * daysPerWeek;
        return Math.ceil(totalHours / weeklyHours);
    }, [topics, hoursPerDay, daysPerWeek]);

    // Group sessions by week (show ALL weeks, not just 4)
    const weeklySchedule = useMemo(() => {
        const weeks: ScheduleSession[][] = [];
        let currentWeek: ScheduleSession[] = [];
        let lastWeekNumber = -1;

        schedule.sessions.forEach((session, idx) => {
            const weekNumber = Math.floor(idx / daysPerWeek);

            if (weekNumber !== lastWeekNumber && currentWeek.length > 0) {
                weeks.push(currentWeek);
                currentWeek = [];
            }

            currentWeek.push(session);
            lastWeekNumber = weekNumber;
        });

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return weeks;
    }, [schedule.sessions, daysPerWeek]);

    // Group weeks into months (4 weeks per month view)
    const monthlyGroups = useMemo(() => {
        const groups: { label: string; weeks: ScheduleSession[][] }[] = [];
        const weeksPerMonth = 4;

        for (let i = 0; i < weeklySchedule.length; i += weeksPerMonth) {
            const monthWeeks = weeklySchedule.slice(i, i + weeksPerMonth);
            const monthNum = Math.floor(i / weeksPerMonth) + 1;
            groups.push({
                label: `Month ${monthNum}`,
                weeks: monthWeeks
            });
        }

        return groups;
    }, [weeklySchedule]);

    const toggleSession = (sessionKey: string) => {
        setCompletedSessions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sessionKey)) {
                newSet.delete(sessionKey);
            } else {
                newSet.add(sessionKey);
            }
            return newSet;
        });
    };

    const getTopicColor = (topicIndex: number) => {
        return TOPIC_COLORS[topicIndex % TOPIC_COLORS.length];
    };

    const completedCount = completedSessions.size;
    const totalSessions = schedule.sessions.length;
    const progressPercent = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

    const currentMonth = monthlyGroups[currentMonthIndex] || monthlyGroups[0];
    const canGoPrev = currentMonthIndex > 0;
    const canGoNext = currentMonthIndex < monthlyGroups.length - 1;

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, daysPerWeek);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <span>📅</span> Your Study Calendar
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {totalWeeksNeeded} weeks total • {totalSessions} study sessions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-xs text-gray-500">
                        {completedCount}/{totalSessions} done
                    </div>
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-green-600">{progressPercent}%</span>
                </div>
            </div>

            {/* Month Navigation (only show if more than 1 month) */}
            {monthlyGroups.length > 1 && (
                <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg p-2">
                    <button
                        onClick={() => setCurrentMonthIndex(prev => prev - 1)}
                        disabled={!canGoPrev}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${canGoPrev
                                ? 'hover:bg-white text-gray-700'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        ← Prev
                    </button>
                    <div className="text-center">
                        <span className="font-bold text-gray-800">{currentMonth?.label}</span>
                        <span className="text-xs text-gray-400 ml-2">
                            (Weeks {currentMonthIndex * 4 + 1}-{Math.min((currentMonthIndex + 1) * 4, totalWeeksNeeded)})
                        </span>
                    </div>
                    <button
                        onClick={() => setCurrentMonthIndex(prev => prev + 1)}
                        disabled={!canGoNext}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${canGoNext
                                ? 'hover:bg-white text-gray-700'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Topic Legend */}
            <div className="flex flex-wrap gap-2 mb-4">
                {topics.slice(0, 6).map((topic, idx) => {
                    const color = getTopicColor(idx);
                    return (
                        <div
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1.5"
                        >
                            <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                            <span className="truncate max-w-[80px]">{topic.title}</span>
                        </div>
                    );
                })}
                {topics.length > 6 && (
                    <span className="text-xs px-2 py-1 text-gray-400">+{topics.length - 6} more</span>
                )}
            </div>

            {/* Calendar Grid */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                {/* Day Headers */}
                <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `50px repeat(${daysPerWeek}, 1fr)` }}>
                    <div></div>
                    {dayLabels.map(day => (
                        <div key={day} className="text-center text-[10px] font-semibold text-gray-400 uppercase">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Week Rows */}
                {currentMonth?.weeks.map((week, weekLocalIdx) => {
                    const weekGlobalIdx = currentMonthIndex * 4 + weekLocalIdx;

                    return (
                        <div
                            key={weekLocalIdx}
                            className="grid gap-2 mb-2"
                            style={{ gridTemplateColumns: `50px repeat(${daysPerWeek}, 1fr)` }}
                        >
                            {/* Week Label */}
                            <div className="flex items-center justify-center">
                                <span className="text-[10px] font-bold text-gray-400">W{weekGlobalIdx + 1}</span>
                            </div>

                            {/* Day Cells */}
                            {Array.from({ length: daysPerWeek }).map((_, dayIdx) => {
                                const session = week[dayIdx];
                                if (!session) {
                                    return (
                                        <div
                                            key={dayIdx}
                                            className="h-14 bg-gray-100 rounded-lg border border-dashed border-gray-200"
                                        />
                                    );
                                }

                                const sessionKey = `${weekGlobalIdx}-${dayIdx}`;
                                const isCompleted = completedSessions.has(sessionKey);
                                const color = getTopicColor(session.topicIndex);

                                return (
                                    <div
                                        key={dayIdx}
                                        className={`
                                            h-14 p-2 rounded-lg border transition-all cursor-pointer relative
                                            ${color.bg} ${color.border}
                                            ${isCompleted ? 'opacity-50' : 'hover:shadow-md'}
                                        `}
                                        onClick={() => toggleSession(sessionKey)}
                                    >
                                        <p className={`text-[10px] font-semibold ${color.text} truncate`}>
                                            {session.topicTitle}
                                        </p>
                                        <p className="text-[9px] text-gray-500 mt-0.5">
                                            {session.hours}h
                                        </p>
                                        {isCompleted && (
                                            <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-[8px]">✓</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{totalWeeksNeeded}</p>
                    <p className="text-[10px] text-gray-600">Total Weeks</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{(hoursPerDay * daysPerWeek).toFixed(1)}h</p>
                    <p className="text-[10px] text-gray-600">Per Week</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{topics.reduce((s, t) => s + t.estimatedHours, 0)}h</p>
                    <p className="text-[10px] text-gray-600">Total Hours</p>
                </div>
            </div>

            {/* Tip */}
            <p className="text-[10px] text-gray-400 mt-3 text-center">
                💡 Click sessions to mark complete. Use arrows to navigate months.
            </p>
        </div>
    );
};

export default StudyCalendar;
