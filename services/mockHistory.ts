import { LearningPlan } from '../types';

// Sample community learning plans for demonstration and inspiration
export const COMMUNITY_HISTORY: LearningPlan[] = [
    {
        id: 'community-1',
        createdAt: 'Featured',
        skillName: 'Full-Stack Web Development with React & Node.js',
        timeline: '6 months',
        complexity: 'High',
        totalHours: 320,
        feasibility: 'Realistic',
        feasibilityReason: 'With consistent practice of 3-4 hours daily, this is achievable in 6 months for someone with basic programming knowledge.',
        topics: [
            {
                title: 'HTML, CSS & JavaScript Fundamentals',
                description: 'Master the core building blocks of web development',
                estimatedHours: 40,
                detailedGuidance: [
                    'Complete an interactive HTML/CSS course on freeCodeCamp',
                    'Build 3 static websites from scratch using only HTML/CSS',
                    'Learn JavaScript fundamentals: variables, functions, arrays, objects',
                    'Practice DOM manipulation by building interactive components'
                ],
                resources: [
                    { title: 'freeCodeCamp - Responsive Web Design', searchQuery: 'freeCodeCamp responsive web design certification', type: 'course' },
                    { title: 'JavaScript.info', searchQuery: 'javascript.info modern tutorial', type: 'article' }
                ]
            },
            {
                title: 'React Fundamentals',
                description: 'Build modern user interfaces with React',
                estimatedHours: 60,
                detailedGuidance: [
                    'Understand component-based architecture and JSX',
                    'Master React hooks: useState, useEffect, useContext',
                    'Learn state management patterns',
                    'Build a complete CRUD application'
                ],
                resources: [
                    { title: 'React Official Tutorial', searchQuery: 'react official tutorial tic tac toe', type: 'article' },
                    { title: 'Scrimba React Course', searchQuery: 'scrimba learn react free course', type: 'course' }
                ]
            },
            {
                title: 'Node.js & Express Backend',
                description: 'Create robust server-side applications',
                estimatedHours: 50,
                detailedGuidance: [
                    'Set up a Node.js development environment',
                    'Build RESTful APIs with Express.js',
                    'Implement authentication and authorization',
                    'Connect to databases (MongoDB or PostgreSQL)'
                ],
                resources: [
                    { title: 'The Odin Project - NodeJS', searchQuery: 'the odin project nodejs course', type: 'course' },
                    { title: 'Express.js Documentation', searchQuery: 'express.js getting started guide', type: 'article' }
                ]
            }
        ]
    },
    {
        id: 'community-2',
        createdAt: 'Featured',
        skillName: 'Machine Learning for Data Scientists',
        timeline: '4 months',
        complexity: 'High',
        totalHours: 200,
        feasibility: 'Challenging',
        feasibilityReason: 'Requires strong math background. If coming from a technical field, 4 months is achievable with dedicated study.',
        topics: [
            {
                title: 'Python for Data Science',
                description: 'Master Python libraries essential for ML',
                estimatedHours: 30,
                detailedGuidance: [
                    'Master NumPy for numerical computing',
                    'Learn Pandas for data manipulation',
                    'Create visualizations with Matplotlib and Seaborn',
                    'Practice with real-world datasets from Kaggle'
                ],
                resources: [
                    { title: 'Kaggle Python Course', searchQuery: 'kaggle free python course', type: 'course' },
                    { title: 'Python Data Science Handbook', searchQuery: 'python data science handbook online free', type: 'article' }
                ]
            },
            {
                title: 'Machine Learning Fundamentals',
                description: 'Understand core ML algorithms and concepts',
                estimatedHours: 60,
                detailedGuidance: [
                    'Learn supervised learning: regression, classification',
                    'Understand unsupervised learning: clustering, dimensionality reduction',
                    'Master model evaluation metrics and cross-validation',
                    'Implement algorithms from scratch to understand internals'
                ],
                resources: [
                    { title: 'Andrew Ng ML Course', searchQuery: 'andrew ng machine learning coursera', type: 'course' },
                    { title: 'Scikit-learn Documentation', searchQuery: 'scikit-learn user guide tutorials', type: 'article' }
                ]
            },
            {
                title: 'Deep Learning & Neural Networks',
                description: 'Build and train neural network models',
                estimatedHours: 70,
                detailedGuidance: [
                    'Understand neural network architecture and backpropagation',
                    'Master TensorFlow or PyTorch frameworks',
                    'Build CNNs for computer vision tasks',
                    'Implement RNNs and Transformers for NLP'
                ],
                resources: [
                    { title: 'Fast.ai Practical Deep Learning', searchQuery: 'fast.ai practical deep learning for coders', type: 'course' },
                    { title: 'PyTorch Tutorials', searchQuery: 'pytorch official tutorials beginner', type: 'article' }
                ]
            }
        ]
    },
    {
        id: 'community-3',
        createdAt: 'Featured',
        skillName: 'UI/UX Design Fundamentals',
        timeline: '2 months',
        complexity: 'Medium',
        totalHours: 80,
        feasibility: 'Realistic',
        feasibilityReason: 'Very achievable for motivated learners. Design thinking can be learned quickly with practice.',
        topics: [
            {
                title: 'Design Principles & Theory',
                description: 'Learn fundamental design concepts',
                estimatedHours: 15,
                detailedGuidance: [
                    'Study color theory and typography basics',
                    'Learn visual hierarchy and composition',
                    'Understand accessibility and inclusive design',
                    'Analyze award-winning designs for patterns'
                ],
                resources: [
                    { title: 'Refactoring UI Book', searchQuery: 'refactoring UI design book', type: 'article' },
                    { title: 'Google UX Design Course', searchQuery: 'google UX design certificate coursera', type: 'course' }
                ]
            },
            {
                title: 'Figma Mastery',
                description: 'Become proficient in industry-standard design tools',
                estimatedHours: 25,
                detailedGuidance: [
                    'Master Figma interface and shortcuts',
                    'Learn component and auto-layout systems',
                    'Create design systems with variables',
                    'Build interactive prototypes'
                ],
                resources: [
                    { title: 'Figma YouTube Channel', searchQuery: 'figma official youtube tutorials', type: 'video' },
                    { title: 'Figma Academy', searchQuery: 'figma academy free course', type: 'course' }
                ]
            },
            {
                title: 'User Research & Testing',
                description: 'Validate designs with real users',
                estimatedHours: 20,
                detailedGuidance: [
                    'Conduct user interviews and surveys',
                    'Create user personas and journey maps',
                    'Run usability tests and gather feedback',
                    'Iterate designs based on user insights'
                ],
                resources: [
                    { title: 'Nielsen Norman Group Articles', searchQuery: 'nielsen norman group ux research methods', type: 'article' },
                    { title: 'Maze User Testing', searchQuery: 'maze design user testing tool', type: 'tool' }
                ]
            }
        ]
    },
    {
        id: 'community-4',
        createdAt: '2 days ago',
        skillName: 'Public Speaking & Presentation Skills',
        timeline: '6 weeks',
        complexity: 'Low',
        totalHours: 30,
        feasibility: 'Realistic',
        feasibilityReason: 'Low time commitment, but requires consistent practice. Great for busy professionals.',
        topics: [
            {
                title: 'Overcoming Stage Fright',
                description: 'Build confidence and manage anxiety',
                estimatedHours: 8,
                detailedGuidance: [
                    'Practice breathing techniques for calm',
                    'Use visualization to prepare mentally',
                    'Start with small, low-stakes presentations',
                    'Record yourself and review objectively'
                ],
                resources: [
                    { title: 'TED Talk: Power of Vulnerability', searchQuery: 'brene brown ted talk vulnerability', type: 'video' },
                    { title: 'Toastmasters International', searchQuery: 'toastmasters find a club near me', type: 'tool' }
                ]
            },
            {
                title: 'Storytelling & Structure',
                description: 'Craft compelling narratives',
                estimatedHours: 12,
                detailedGuidance: [
                    'Learn the hero\'s journey story structure',
                    'Practice opening hooks and strong closings',
                    'Use data to support your narrative',
                    'Master the rule of three'
                ],
                resources: [
                    { title: 'Nancy Duarte: Resonate', searchQuery: 'nancy duarte resonate presentation book', type: 'article' },
                    { title: 'Presentation Zen', searchQuery: 'garr reynolds presentation zen', type: 'article' }
                ]
            }
        ]
    },
    {
        id: 'community-5',
        createdAt: '1 week ago',
        skillName: 'Learn Spanish for Travel',
        timeline: '3 months',
        complexity: 'Medium',
        totalHours: 90,
        feasibility: 'Realistic',
        feasibilityReason: 'Conversational level for travel is very achievable in 3 months with daily 30-minute practice.',
        topics: [
            {
                title: 'Basic Vocabulary & Pronunciation',
                description: 'Build your foundation with essential words',
                estimatedHours: 25,
                detailedGuidance: [
                    'Learn the 500 most common Spanish words',
                    'Master Spanish pronunciation rules',
                    'Practice with native audio daily',
                    'Create flashcards for vocabulary retention'
                ],
                resources: [
                    { title: 'Duolingo Spanish Course', searchQuery: 'duolingo spanish course free', type: 'course' },
                    { title: 'SpanishPod101 Survival Phrases', searchQuery: 'spanishpod101 survival phrases youtube', type: 'video' }
                ]
            },
            {
                title: 'Grammar Essentials',
                description: 'Understand key grammatical structures',
                estimatedHours: 30,
                detailedGuidance: [
                    'Master present tense verb conjugations',
                    'Learn past tenses for storytelling',
                    'Understand ser vs estar',
                    'Practice with fill-in-the-blank exercises'
                ],
                resources: [
                    { title: 'StudySpanish.com Grammar', searchQuery: 'studyspanish.com grammar lessons', type: 'article' },
                    { title: 'Language Transfer Spanish', searchQuery: 'language transfer complete spanish free', type: 'course' }
                ]
            },
            {
                title: 'Conversational Practice',
                description: 'Apply your knowledge in real conversations',
                estimatedHours: 35,
                detailedGuidance: [
                    'Practice with language exchange partners',
                    'Role-play common travel scenarios',
                    'Listen to Spanish podcasts for learners',
                    'Immerse yourself with Spanish media'
                ],
                resources: [
                    { title: 'iTalki Language Exchange', searchQuery: 'italki spanish tutors conversation practice', type: 'tool' },
                    { title: 'Notes in Spanish Podcast', searchQuery: 'notes in spanish podcast beginners', type: 'video' }
                ]
            }
        ]
    }
];
