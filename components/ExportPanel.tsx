import React, { useMemo } from 'react';
import { LearningPlan } from '../types';
import {
    generateSchedule,
    downloadICS,
    downloadCSV,
    downloadMarkdown,
    printToPDF,
    GeneratedSchedule
} from '../services/exportService';

interface ExportPanelProps {
    plan: LearningPlan;
    hoursPerDay?: number;
    daysPerWeek?: number;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
    plan,
    hoursPerDay = 2,
    daysPerWeek = 5
}) => {
    const schedule: GeneratedSchedule = useMemo(() => {
        return generateSchedule(plan.topics, hoursPerDay, daysPerWeek);
    }, [plan.topics, hoursPerDay, daysPerWeek]);

    const exportButtons = [
        {
            id: 'ics',
            label: 'Calendar (.ics)',
            description: 'Google, Outlook, Apple',
            icon: '📅',
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            onClick: () => downloadICS(plan, schedule)
        },
        {
            id: 'csv',
            label: 'Spreadsheet (.csv)',
            description: 'Excel, Google Sheets',
            icon: '📊',
            color: 'from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
            onClick: () => downloadCSV(plan, schedule)
        },
        {
            id: 'md',
            label: 'Markdown (.md)',
            description: 'Notion, Obsidian',
            icon: '📝',
            color: 'from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
            onClick: () => downloadMarkdown(plan)
        },
        {
            id: 'pdf',
            label: 'Print / PDF',
            description: 'Save as document',
            icon: '🖨️',
            color: 'from-orange-500 to-orange-600',
            hoverColor: 'hover:from-orange-600 hover:to-orange-700',
            onClick: printToPDF
        }
    ];

    return (
        <div className="mt-8 animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📥</span>
                        <div>
                            <h3 className="text-white font-bold">Export Your Plan</h3>
                            <p className="text-emerald-100 text-xs">Take your learning journey anywhere</p>
                        </div>
                    </div>
                </div>

                {/* Export Buttons Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {exportButtons.map((btn) => (
                            <button
                                key={btn.id}
                                onClick={btn.onClick}
                                className={`
                                    relative group p-4 rounded-xl 
                                    bg-gradient-to-br ${btn.color} ${btn.hoverColor}
                                    text-white transition-all duration-200
                                    hover:shadow-lg hover:-translate-y-0.5
                                    active:translate-y-0 active:shadow-md
                                    flex flex-col items-center text-center
                                `}
                            >
                                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                                    {btn.icon}
                                </span>
                                <span className="font-semibold text-sm">{btn.label}</span>
                                <span className="text-xs opacity-80 mt-1">{btn.description}</span>

                                {/* Download indicator */}
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Schedule Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>📆</span>
                                <span>Schedule based on <strong>{hoursPerDay}h/day</strong>, <strong>{daysPerWeek} days/week</strong></span>
                            </div>
                            <div className="text-gray-500">
                                {schedule.sessions.length} sessions • {schedule.totalWeeks} weeks
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportPanel;
