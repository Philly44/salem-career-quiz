// Configuration for Salem University Career Quiz
const config = {
    // Claude API Configuration - no key needed in browser
    claude: {
        apiKey: 'configured-on-server',  // Dummy value for browser
        model: 'claude-3-sonnet-20240229',
        maxTokens: 1000,
        temperature: 0.7
    },

    // Keep openai config for compatibility
    openai: {
        apiKey: 'configured-on-server',  // Dummy value for browser
        model: 'claude-3-sonnet-20240229',
        maxTokens: 1000,
        temperature: 0.7
    },

    // LLM Feature Flags
    features: {
        dynamicQuestions: true,
        intelligentFollowups: true,
        nlpAnalysis: true,
        aiBlueprints: true,
        smartRouting: true,
        conversationMemory: true
    },

    // Rest of config...
    fallback: {
        enabled: true,
        maxRetries: 3,
        timeout: 10000
    },

    costControl: {
        maxApiCallsPerQuiz: 15,
        cacheResponses: true,
        batchRequests: true
    },

    salem: {
        programs: [
            'Business Administration',
            'Healthcare Management',
            'Nursing',
            'Education',
            'Criminal Justice',
            'Computer Science',
            'Psychology',
            'Public Health'
        ],
        sellingPoints: [
            '130+ years of excellence',
            'Flexible online programs',
            'Free weekly tutoring',
            'Career-focused curriculum',
            'Accelerated programs available',
            'Military and corporate partnerships'
        ]
    }
};

// Don't validate API key in browser
function validateConfig() {
    return config;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = validateConfig();
} else {
    window.quizConfig = validateConfig();
}