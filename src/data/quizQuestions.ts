export interface QuizOption {
    id: string;
    value: number; // Score weight (0-10)
    nextQuestion?: number;
}

export interface QuizQuestion {
    id: number;
    key: string; // Translation key prefix
    options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
    {
        id: 1,
        key: "debt_amount",
        options: [
            { id: "opt1", value: 10 }, // < R10k
            { id: "opt2", value: 7 },  // R10k - R50k
            { id: "opt3", value: 4 },  // R50k - R200k
            { id: "opt4", value: 1 },  // > R200k
        ],
    },
    {
        id: 2,
        key: "monthly_status",
        options: [
            { id: "opt1", value: 10 }, // Saves money
            { id: "opt2", value: 7 },  // Breaks even
            { id: "opt3", value: 3 },  // Short every month
            { id: "opt4", value: 0 },  // Drowning / Taking new debt
        ],
    },
    {
        id: 3,
        key: "sleep_quality",
        options: [
            { id: "opt1", value: 10 }, // Sleeps well
            { id: "opt2", value: 6 },  // Wakes up worrying
            { id: "opt3", value: 3 },  // Frequent insomnia
            { id: "opt4", value: 0 },  // Nightmares / Panic
        ],
    },
    {
        id: 4,
        key: "collection_status",
        options: [
            { id: "opt1", value: 10 }, // None
            { id: "opt2", value: 7 },  // Occasional calls
            { id: "opt3", value: 3 },  // Constant harassment
            { id: "opt4", value: 0 },  // Legal threats / Garnishee
        ],
    },
    {
        id: 5,
        key: "relationship_impact",
        options: [
            { id: "opt1", value: 10 }, // No impact
            { id: "opt2", value: 7 },  // Minor tension
            { id: "opt3", value: 3 },  // Frequent arguments
            { id: "opt4", value: 0 },  // Separation / Divorce risk
        ],
    },
    {
        id: 6,
        key: "emotional_state",
        options: [
            { id: "opt1", value: 10 }, // Hopeful
            { id: "opt2", value: 6 },  // Anxious
            { id: "opt3", value: 3 },  // Guilty / Ashamed
            { id: "opt4", value: 0 },  // Desperate / Paralyzed
        ],
    },
    {
        id: 7,
        key: "past_attempts",
        options: [
            { id: "opt1", value: 8 },  // First time tackling it
            { id: "opt2", value: 6 },  // Tried budgeting apps
            { id: "opt3", value: 4 },  // Tried consolidation loans
            { id: "opt4", value: 2 },  // Tried debt review / counseling
        ],
    },
    {
        id: 8,
        key: "primary_goal",
        options: [
            { id: "opt1", value: 5 }, // Sleep peacefully
            { id: "opt2", value: 5 }, // Provide for family
            { id: "opt3", value: 5 }, // Travel / Enjoy life
            { id: "opt4", value: 5 }, // Leave a legacy
        ],
    },
];
