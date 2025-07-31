// Configuration for Salem University Career Quiz
// IMPORTANT: In production, use environment variables for sensitive data

const config = {
    // Claude API Configuration
    claude: {
        apiKey: (typeof process !== 'undefined' && process.env?.CLAUDE_API_KEY) || 'YOUR-API-KEY-HERE',
        model: 'claude-3-sonnet-20240229', // Best balance of quality and cost
        maxTokens: 1000,
        temperature: 0.7
    },
    
    // Keep openai config for compatibility
    openai: {
        apiKey: (typeof process !== 'undefined' && process.env?.CLAUDE_API_KEY) || 'YOUR-API-KEY-HERE',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 1000,
        temperature: 0.7
    },

    // LLM Feature Flags
    features: {
        dynamicQuestions: true,        // Generate questions based on responses
        intelligentFollowups: true,    // AI-powered follow-up questions
        nlpAnalysis: true,            // Analyze open-text responses
        aiBlueprints: true,           // Generate personalized blueprints
        smartRouting: true,           // Dynamic question routing
        conversationMemory: true      // Maintain context throughout quiz
    },

    // Fallback Options
    fallback: {
        enabled: true,                // Use static quiz if API fails
        maxRetries: 3,                // API retry attempts
        timeout: 10000                // API timeout in ms
    },

    // Cost Management
    costControl: {
        maxApiCallsPerQuiz: 15,       // Limit API calls per session
        cacheResponses: true,         // Cache similar responses
        batchRequests: true           // Batch multiple analyses
    },

    // Salem University Context
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

// Validate configuration
function validateConfig() {
    if (config.claude.apiKey === 'YOUR-API-KEY-HERE' || !config.claude.apiKey.startsWith('sk-ant-')) {
        console.warn('⚠️ Claude API key not configured. LLM features will be disabled.');
        config.features = Object.fromEntries(
            Object.entries(config.features).map(([key]) => [key, false])
        );
    }
    return config;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = validateConfig();
} else {
    window.quizConfig = validateConfig();
}