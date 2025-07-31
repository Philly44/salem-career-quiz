// Conversational Enhancements for Salem Career Quiz
// This module adds dynamic give-and-take to make the quiz more engaging

const ConversationalEnhancements = {
    // Contextual responses based on user patterns
    contextualResponses: {
        'high_achiever': {
            triggers: ['Master\'s Degree', 'Doctoral Degree', 'Executive', 'More than 20 years'],
            responses: [
                "Impressive! Your achievements speak volumes. 🌟",
                "You've clearly invested in excellence. That dedication shows!",
                "With your track record, the next step needs to match your ambitions."
            ]
        },
        'career_changer': {
            triggers: ['transition to a new field', 'Want to change careers', 'Different person now'],
            responses: [
                "Career pivots take courage! I admire that. Let's make sure your next move is strategic.",
                "Starting fresh can be the best decision. Many of our most successful grads were career changers.",
                "You're not alone - 43% of our students are making career transitions too!"
            ]
        },
        'returning_student': {
            triggers: ['Academic confidence after time away', 'More than 10 years ago'],
            responses: [
                "Welcome back to learning! It's like riding a bike - with better support this time.",
                "The best students are often those who return with life experience.",
                "Don't worry - our programs are designed for people getting back into academics."
            ]
        }
    },

    // Mini-insights to share between questions
    insights: [
        {
            trigger: { question: 'q5_favorite_aspect', response: 'Hands-on projects' },
            insight: "📊 Fun fact: 78% of hands-on learners report higher job satisfaction after completing project-based programs!"
        },
        {
            trigger: { question: 'q9_employment_status', response: 'Employed full-time' },
            insight: "💼 You're in good company - 82% of Salem students study while working full-time. We've perfected the balance!"
        },
        {
            trigger: { question: 'q11_years_experience', response: '10-15 years' },
            insight: "🎯 Perfect timing! The 10-15 year mark is when professionals see the biggest ROI from advanced education."
        }
    ],

    // Thoughtful probes for deeper understanding
    deeperProbes: {
        'q8_biggest_concern': {
            'Financial investment and value': {
                probe: "Money matters are real. What would 'worth it' look like for you? A specific salary increase? New opportunities?",
                followUpOptions: ['Specific salary goal', '20-30% increase', 'More about opportunities']
            }
        },
        'q15_ideal_role': {
            keywords: ['leadership', 'manage', 'director'],
            probe: "Leadership is calling! What draws you most - the strategic thinking, developing people, or driving results?",
            followUpOptions: ['Strategic vision', 'Developing teams', 'Driving outcomes', 'All of the above']
        }
    },

    // Dynamic follow-ups based on response combinations
    getDynamicFollowUp: function(currentQuestion, currentResponse, previousResponses) {
        // Check for patterns in responses
        const responses = Object.values(previousResponses);
        
        // High achiever pattern
        if (responses.filter(r => this.contextualResponses.high_achiever.triggers.includes(r)).length >= 2) {
            return "I'm noticing a pattern of excellence in your background. Let's make sure your next move lives up to your standards...";
        }
        
        // Uncertainty pattern
        if (responses.filter(r => r.includes('unsure') || r.includes('exploring')).length >= 2) {
            return "It's perfectly okay to be exploring options. Sometimes the best insights come from these questions themselves...";
        }
        
        return null;
    },

    // Conversational bridges between sections
    sectionBridges: {
        'education_to_experience': "Great! Now I have a clear picture of your educational journey. Let's talk about how you've been putting that knowledge to work...",
        'experience_to_vision': "Your experience tells quite a story! Now comes the fun part - let's dream about where you're headed...",
        'vision_to_decision': "I love your vision! 🚀 Now let's get practical about making it happen...",
        'decision_to_finish': "Almost there! Just a few more insights to create your perfect roadmap..."
    },

    // Personality injections
    personalityResponses: [
        { trigger: 'morning', message: "Early bird or night owl? Either way, Salem has classes that fit your schedule! 🌅🌙" },
        { trigger: 'technology', message: "Don't worry about the tech - if you can use a smartphone, you can handle our platform! 📱" },
        { trigger: 'family', message: "Family support is crucial. Many of our grads say their kids became their biggest cheerleaders! 👨‍👩‍👧‍👦" }
    ],

    // Encouragement at key moments
    getEncouragement: function(questionNumber, totalQuestions) {
        const progress = (questionNumber / totalQuestions) * 100;
        
        if (progress === 25) return "You're doing great! Your answers are painting a clear picture... 🎨";
        if (progress === 50) return "Halfway there! I'm already seeing some exciting possibilities for you... ⚡";
        if (progress === 75) return "Home stretch! Your blueprint is taking shape beautifully... 🏗️";
        
        return null;
    },

    // Smart question variations based on context
    getQuestionVariation: function(questionId, userProfile) {
        const variations = {
            'q16_primary_goal': {
                'experienced': "After all you've accomplished, what's the ONE thing that would make the next chapter truly fulfilling?",
                'struggling': "If we could wave a magic wand and fix your biggest career challenge, what would change?",
                'default': "Let's talk goals! 🎯 What's your primary career goal for the next 3-5 years?"
            }
        };
        
        // Determine user profile type
        let profileType = 'default';
        if (userProfile.yearsExperience > 15) profileType = 'experienced';
        if (userProfile.frustration && userProfile.frustration.includes('stuck')) profileType = 'struggling';
        
        return variations[questionId]?.[profileType] || variations[questionId]?.default;
    }
};

// Export for use in main quiz
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConversationalEnhancements;
} else {
    window.ConversationalEnhancements = ConversationalEnhancements;
}