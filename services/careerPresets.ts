import { UserContext } from '../types';

export interface CareerPreset {
    id: string;
    label: string;
    fromCareer: string;
    toCareer: string;
    emoji: string;
    background: string;
    suggestedGoals: string[];
}

/**
 * Pre-configured career transition profiles that demonstrate
 * how the AI adjusts depth based on previous knowledge
 */
export const CAREER_PRESETS: CareerPreset[] = [
    {
        id: 'healthcare-to-pm',
        label: 'Healthcare → Product Manager',
        fromCareer: 'Healthcare',
        toCareer: 'Product Manager',
        emoji: '🏥',
        background: `I'm a healthcare professional (nurse/doctor/medical technician) with 3+ years of clinical experience. 
I understand patient workflows, medical terminology, and healthcare regulations (HIPAA).
I have experience with electronic health records (EHR) systems and clinical documentation.
I'm looking to transition into product management, ideally in health-tech or medical SaaS.
I have basic familiarity with technology but no formal product management training.`,
        suggestedGoals: [
            'Learn product management fundamentals for healthcare',
            'Transition from nursing to health-tech PM',
            'Product strategy for digital health applications'
        ]
    },
    {
        id: 'marketing-to-growth',
        label: 'Marketing → Growth Engineer',
        fromCareer: 'Marketing',
        toCareer: 'Growth Engineer',
        emoji: '📈',
        background: `I'm a digital marketer with 4+ years of experience in SEO, paid ads, and content marketing.
I understand analytics, A/B testing, conversion optimization, and customer acquisition funnels.
I'm comfortable with marketing tools (Google Analytics, HubSpot, Meta Ads Manager).
I want to learn programming and data skills to become a technical growth engineer.
I have basic familiarity with spreadsheets and SQL but no coding experience.`,
        suggestedGoals: [
            'Learn Python for marketing automation',
            'Master growth engineering and data analytics',
            'Build data pipelines for marketing insights'
        ]
    },
    {
        id: 'teacher-to-ux',
        label: 'Teacher → UX Designer',
        fromCareer: 'Teacher',
        toCareer: 'UX Designer',
        emoji: '👩‍🏫',
        background: `I'm an educator with 5+ years of teaching experience (K-12 or higher education).
I have strong skills in curriculum design, lesson planning, and understanding learner needs.
I'm experienced in creating engaging educational materials and presentations.
I want to transition into UX design where I can apply my understanding of user learning and behavior.
I've used Canva and PowerPoint but have no experience with professional design tools like Figma.`,
        suggestedGoals: [
            'Learn UX design fundamentals from teaching background',
            'Master Figma for educational product design',
            'User research methods for learning platforms'
        ]
    },
    {
        id: 'finance-to-data',
        label: 'Finance → Data Scientist',
        fromCareer: 'Finance',
        toCareer: 'Data Scientist',
        emoji: '💹',
        background: `I'm a finance professional with experience in financial analysis, modeling, and risk assessment.
I'm proficient in Excel (advanced formulas, pivot tables, VBA macros) and financial modeling.
I understand statistics, probability, and quantitative analysis from my finance background.
I want to transition into data science to work on predictive modeling and machine learning.
I have basic Python/R knowledge but limited experience with ML frameworks.`,
        suggestedGoals: [
            'Machine learning for financial forecasting',
            'Python for quantitative finance professionals',
            'Data science for risk and credit modeling'
        ]
    },
    {
        id: 'engineer-to-manager',
        label: 'Engineer → Engineering Manager',
        fromCareer: 'Software Engineer',
        toCareer: 'Engineering Manager',
        emoji: '👨‍💻',
        background: `I'm a senior software engineer with 5+ years of hands-on coding experience.
I've led small teams or mentored junior developers informally.
I'm strong in technical architecture, code review, and system design.
I want to transition into engineering management to lead teams and drive technical strategy.
I have limited formal training in people management, hiring, or organizational leadership.`,
        suggestedGoals: [
            'Engineering leadership and team management',
            'Technical interviews and hiring processes',
            'Building high-performing engineering teams'
        ]
    }
];

/**
 * Get a career preset by ID
 */
export function getPresetById(id: string): CareerPreset | undefined {
    return CAREER_PRESETS.find(p => p.id === id);
}

/**
 * Apply a preset to user context
 */
export function applyPreset(preset: CareerPreset): UserContext {
    return {
        background: preset.background,
        profileUrl: ''
    };
}
