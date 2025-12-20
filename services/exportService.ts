import { LearningPlan, LearningTopic } from '../types';

// ============================================================================
// SCHEDULE GENERATION
// ============================================================================

export interface ScheduleSession {
    date: Date;
    dayLabel: string;
    topicTitle: string;
    topicIndex: number;
    hours: number;
    completed: boolean;
}

export interface GeneratedSchedule {
    sessions: ScheduleSession[];
    startDate: Date;
    endDate: Date;
    totalWeeks: number;
}

/**
 * Generate a study schedule based on the learning plan and user preferences
 */
export function generateSchedule(
    topics: LearningTopic[],
    hoursPerDay: number,
    daysPerWeek: number,
    startDate: Date = new Date()
): GeneratedSchedule {
    const sessions: ScheduleSession[] = [];
    const studyDays = getStudyDays(daysPerWeek);

    let currentDate = new Date(startDate);
    let topicIndex = 0;
    let remainingTopicHours = topics[0]?.estimatedHours || 0;

    while (topicIndex < topics.length) {
        // Move to next study day if current day is not a study day
        while (!studyDays.includes(currentDate.getDay())) {
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const sessionHours = Math.min(hoursPerDay, remainingTopicHours);

        sessions.push({
            date: new Date(currentDate),
            dayLabel: formatDayLabel(currentDate),
            topicTitle: topics[topicIndex].title,
            topicIndex,
            hours: sessionHours,
            completed: false
        });

        remainingTopicHours -= sessionHours;

        // Move to next topic if current one is done
        if (remainingTopicHours <= 0) {
            topicIndex++;
            if (topicIndex < topics.length) {
                remainingTopicHours = topics[topicIndex].estimatedHours;
            }
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalWeeks = Math.ceil(sessions.length / daysPerWeek);

    return {
        sessions,
        startDate: new Date(startDate),
        endDate: sessions.length > 0 ? sessions[sessions.length - 1].date : new Date(startDate),
        totalWeeks
    };
}

function getStudyDays(daysPerWeek: number): number[] {
    // Default study days based on count (0 = Sunday, 6 = Saturday)
    const allDays = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sat, then Sun
    return allDays.slice(0, daysPerWeek);
}

function formatDayLabel(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

// ============================================================================
// ICS CALENDAR EXPORT
// ============================================================================

/**
 * Generate ICS calendar file content
 */
export function generateICS(plan: LearningPlan, schedule: GeneratedSchedule): string {
    const lines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Skill Learning Buddy//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:${plan.skillName} Learning Plan`,
    ];

    schedule.sessions.forEach((session, idx) => {
        const startTime = new Date(session.date);
        startTime.setHours(9, 0, 0); // Default 9 AM start

        const endTime = new Date(startTime);
        endTime.setHours(startTime.getHours() + Math.ceil(session.hours));

        const uid = `session-${idx}-${Date.now()}@skilllearningbuddy`;

        lines.push(
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${formatICSDate(new Date())}`,
            `DTSTART:${formatICSDate(startTime)}`,
            `DTEND:${formatICSDate(endTime)}`,
            `SUMMARY:📚 ${session.topicTitle}`,
            `DESCRIPTION:Learning session for ${plan.skillName}\\n\\nTopic: ${session.topicTitle}\\nDuration: ${session.hours} hour(s)`,
            'STATUS:CONFIRMED',
            'END:VEVENT'
        );
    });

    lines.push('END:VCALENDAR');

    return lines.join('\r\n');
}

function formatICSDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

// ============================================================================
// CSV SPREADSHEET EXPORT
// ============================================================================

/**
 * Generate CSV spreadsheet content
 */
export function generateCSV(plan: LearningPlan, schedule: GeneratedSchedule): string {
    const headers = ['Date', 'Day', 'Topic', 'Module #', 'Hours', 'Completed'];
    const rows: string[][] = [headers];

    schedule.sessions.forEach((session) => {
        rows.push([
            session.date.toISOString().split('T')[0],
            session.dayLabel,
            `"${session.topicTitle.replace(/"/g, '""')}"`,
            String(session.topicIndex + 1),
            String(session.hours),
            session.completed ? 'Yes' : 'No'
        ]);
    });

    // Add summary section
    rows.push([]);
    rows.push(['--- LEARNING PLAN SUMMARY ---']);
    rows.push(['Skill', `"${plan.skillName}"`]);
    rows.push(['Timeline', plan.timeline]);
    rows.push(['Complexity', plan.complexity]);
    rows.push(['Total Hours', String(plan.totalHours)]);
    rows.push(['Feasibility', plan.feasibility]);
    rows.push(['Feasibility Reason', `"${plan.feasibilityReason}"`]);

    return rows.map(row => row.join(',')).join('\n');
}

// ============================================================================
// MARKDOWN EXPORT (Notion-ready)
// ============================================================================

/**
 * Generate Markdown content for Notion/Obsidian
 */
export function generateMarkdown(plan: LearningPlan): string {
    const lines: string[] = [];

    // Header
    lines.push(`# 📚 ${plan.skillName}`);
    lines.push('');
    lines.push(`> Generated by Skill Learning Buddy`);
    lines.push('');

    // Overview
    lines.push('## 📊 Overview');
    lines.push('');
    lines.push(`| Property | Value |`);
    lines.push(`|----------|-------|`);
    lines.push(`| **Timeline** | ${plan.timeline} |`);
    lines.push(`| **Total Hours** | ${plan.totalHours} |`);
    lines.push(`| **Complexity** | ${plan.complexity} |`);
    lines.push(`| **Feasibility** | ${plan.feasibility} |`);
    lines.push('');
    lines.push(`**Assessment:** ${plan.feasibilityReason}`);
    lines.push('');

    // Modules
    lines.push('## 📖 Learning Modules');
    lines.push('');

    plan.topics.forEach((topic, idx) => {
        const phase = idx < plan.topics.length / 3 ? '🌱 Foundation'
            : idx < (plan.topics.length * 2) / 3 ? '⚡ Intermediate'
                : '🚀 Applied';

        lines.push(`### ${idx + 1}. ${topic.title} ${phase}`);
        lines.push('');
        lines.push(`*${topic.description}*`);
        lines.push('');
        lines.push(`**Estimated Time:** ${topic.estimatedHours} hours`);
        lines.push('');

        // Guidance
        if (topic.detailedGuidance?.length > 0) {
            lines.push('**Steps:**');
            topic.detailedGuidance.forEach((step, sIdx) => {
                lines.push(`${sIdx + 1}. ${step}`);
            });
            lines.push('');
        }

        // Resources
        if (topic.resources?.length > 0) {
            lines.push('**Resources:**');
            topic.resources.forEach((resource) => {
                const icon = resource.type === 'video' ? '🎥'
                    : resource.type === 'course' ? '📚'
                        : resource.type === 'tool' ? '🛠️'
                            : '📄';
                const url = resource.url || `https://www.google.com/search?q=${encodeURIComponent(resource.searchQuery)}`;
                lines.push(`- ${icon} [${resource.title}](${url})`);
            });
            lines.push('');
        }

        lines.push('---');
        lines.push('');
    });

    // Progress Tracker
    lines.push('## ✅ Progress Tracker');
    lines.push('');
    plan.topics.forEach((topic, idx) => {
        lines.push(`- [ ] Module ${idx + 1}: ${topic.title}`);
    });
    lines.push('');

    return lines.join('\n');
}

// ============================================================================
// PDF PRINT (CSS-optimized)
// ============================================================================

/**
 * Trigger print dialog with CSS optimizations
 */
export function printToPDF(): void {
    // Add print-specific styles temporarily
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
        @media print {
            body * {
                visibility: hidden;
            }
            .learning-plan-printable, .learning-plan-printable * {
                visibility: visible;
            }
            .learning-plan-printable {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .no-print {
                display: none !important;
            }
            @page {
                margin: 1cm;
            }
        }
    `;
    document.head.appendChild(style);

    window.print();

    // Remove print styles after
    setTimeout(() => {
        const printStyle = document.getElementById('print-styles');
        if (printStyle) printStyle.remove();
    }, 1000);
}

// ============================================================================
// DOWNLOAD HELPERS
// ============================================================================

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Download ICS calendar file
 */
export function downloadICS(plan: LearningPlan, schedule: GeneratedSchedule): void {
    const content = generateICS(plan, schedule);
    const filename = `${plan.skillName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-schedule.ics`;
    downloadFile(content, filename, 'text/calendar;charset=utf-8');
}

/**
 * Download CSV spreadsheet file
 */
export function downloadCSV(plan: LearningPlan, schedule: GeneratedSchedule): void {
    const content = generateCSV(plan, schedule);
    const filename = `${plan.skillName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-schedule.csv`;
    downloadFile(content, filename, 'text/csv;charset=utf-8');
}

/**
 * Download Markdown file
 */
export function downloadMarkdown(plan: LearningPlan): void {
    const content = generateMarkdown(plan);
    const filename = `${plan.skillName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-plan.md`;
    downloadFile(content, filename, 'text/markdown;charset=utf-8');
}
