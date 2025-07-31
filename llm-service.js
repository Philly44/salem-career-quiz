// LLM Service for Salem University Career Quiz
// This module handles all AI-powered features including dynamic questions,
// intelligent follow-ups, and personalized career blueprint generation

class LLMService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        // Use Vercel endpoint if available, otherwise direct API
        // Always use the API endpoint when deployed
  this.apiUrl = window.location.hostname === 'localhost' || window.location.hostname === ''
      ? 'https://api.anthropic.com/v1/messages'
      : '/api/claude';
        this.model = 'claude-3-sonnet-20240229'; // Best balance of quality and cost
        this.conversationHistory = [];
        this.userProfile = {};
    }

    // Initialize conversation with system prompt
    async initializeConversation() {
        this.systemPrompt = `You are Salem, an AI career advisor for Salem University. You're warm, encouraging, and expert at helping prospective students discover their career paths.

Salem University context:
- 130+ years of transforming lives
- Flexible online programs for working adults
- Free weekly tutoring support
- Focus on practical, career-advancing education
- Programs: Business, Healthcare, Education, Criminal Justice, Technology

Your personality:
- Conversational and friendly (use emojis appropriately)
- Encouraging but not pushy
- Ask follow-up questions to understand deeper motivations
- Show genuine interest in their story
- Build confidence while addressing concerns

Remember: You're conducting a career assessment to help them envision their future and see how Salem can help them get there.`;

        this.conversationHistory.push({
            role: 'system',
            content: this.systemPrompt
        });
    }

    // Generate dynamic follow-up questions based on responses
    async generateFollowUpQuestion(currentQuestion, userResponse, userProfile) {
        try {
            const prompt = `Based on this career assessment response, generate a personalized follow-up question.

Current question: "${currentQuestion}"
User response: "${userResponse}"
User profile so far: ${JSON.stringify(userProfile, null, 2)}

Generate a follow-up question that:
1. Digs deeper into their specific situation
2. Is conversational and encouraging
3. Helps uncover their true motivations or concerns
4. Is relevant to Salem University's programs
5. Keeps the conversation flowing naturally

Return ONLY the follow-up question, nothing else.`;

            const response = await this.callAPI([
                { role: 'system', content: 'You are a career counselor creating personalized follow-up questions.' },
                { role: 'user', content: prompt }
            ]);

            return response;
        } catch (error) {
            console.error('Error generating follow-up:', error);
            return null; // Fallback to static questions
        }
    }

    // Process open-text responses with NLP
    async analyzeTextResponse(question, response, context) {
        try {
            const prompt = `Analyze this career assessment response and extract key insights.

Question: "${question}"
Response: "${response}"
Context: ${JSON.stringify(context, null, 2)}

Extract and return as JSON:
{
    "sentiment": "positive/neutral/negative",
    "keyThemes": ["theme1", "theme2"],
    "careerMotivations": ["motivation1", "motivation2"],
    "concerns": ["concern1", "concern2"],
    "programFit": {
        "recommendedPrograms": ["program1", "program2"],
        "fitScore": 0-100
    },
    "followUpNeeded": true/false,
    "suggestedProbe": "Optional follow-up question if needed"
}`;

            const response = await this.callAPI([
                { role: 'system', content: 'You are an expert at analyzing career assessment responses.' },
                { role: 'user', content: prompt }
            ]);

            return JSON.parse(response);
        } catch (error) {
            console.error('Error analyzing response:', error);
            return {
                sentiment: 'neutral',
                keyThemes: [],
                careerMotivations: [],
                concerns: [],
                programFit: { recommendedPrograms: [], fitScore: 50 },
                followUpNeeded: false
            };
        }
    }

    // Generate personalized career blueprint
    async generateCareerBlueprint(userProfile, responses) {
        try {
            const prompt = `Create a personalized career blueprint for this prospective Salem University student.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Quiz Responses:
${JSON.stringify(responses, null, 2)}

Generate a compelling, personalized career blueprint that includes:

1. PERSONALIZED INTRODUCTION
- Address them by name
- Acknowledge their current situation
- Validate their goals and aspirations

2. YOUR CAREER TRAJECTORY (3 timelines)
- 3-Year Vision: Specific role, skills, achievements
- 5-Year Vision: Leadership position, expanded impact
- 10-Year Vision: Ultimate career goal realization

3. RECOMMENDED SALEM PROGRAMS
- Primary program recommendation with rationale
- Alternative program options
- Specific courses/concentrations that align with goals

4. SKILL DEVELOPMENT ROADMAP
- Current strengths to build on
- Critical skills to develop
- How Salem's curriculum addresses skill gaps

5. OVERCOMING YOUR CHALLENGES
- Address their specific concerns from the quiz
- Provide concrete solutions Salem offers
- Success stories of similar students

6. NEXT STEPS
- Clear action items
- Timeline for enrollment
- Support resources available

Format as JSON with these sections. Make it inspiring, specific, and actionable.`;

            const response = await this.callAPI([
                { role: 'system', content: 'You are creating personalized career blueprints that inspire action and show clear paths to success.' },
                { role: 'user', content: prompt }
            ]);

            return JSON.parse(response);
        } catch (error) {
            console.error('Error generating blueprint:', error);
            throw error;
        }
    }

    // Generate dynamic questions based on conversation flow
    async generateDynamicQuestion(userProfile, answeredQuestions, remainingTopics) {
        try {
            const prompt = `Generate the next question for a career assessment based on what we know so far.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Questions Already Asked: ${answeredQuestions.length}
Topics Still to Cover: ${remainingTopics.join(', ')}

Generate a question that:
1. Feels natural in the conversation flow
2. Addresses gaps in our understanding
3. Is relevant to their stated goals
4. Helps determine Salem University program fit

Return as JSON:
{
    "question": "The question text with appropriate emoji",
    "type": "multiple-choice|text|scale|checkbox",
    "options": ["option1", "option2"] // if applicable,
    "purpose": "What insight this provides"
}`;

            const response = await this.callAPI([
                { role: 'system', content: 'You are designing personalized career assessment questions.' },
                { role: 'user', content: prompt }
            ]);

            return JSON.parse(response);
        } catch (error) {
            console.error('Error generating question:', error);
            return null;
        }
    }

    // Intelligent response handling
    async processResponse(questionId, response, context) {
        // Update conversation history
        this.conversationHistory.push({
            role: 'user',
            content: `Question ${questionId}: ${response}`
        });

        // Analyze response for insights
        const analysis = await this.analyzeTextResponse(
            context.questionText,
            response,
            this.userProfile
        );

        // Update user profile with insights
        this.updateUserProfile(questionId, response, analysis);

        // Determine if we need a follow-up
        if (analysis.followUpNeeded && analysis.suggestedProbe) {
            return {
                type: 'follow-up',
                message: analysis.suggestedProbe,
                analysis: analysis
            };
        }

        return {
            type: 'continue',
            analysis: analysis
        };
    }

    // Update user profile with insights
    updateUserProfile(questionId, response, analysis) {
        this.userProfile[questionId] = {
            response: response,
            analysis: analysis,
            timestamp: new Date().toISOString()
        };

        // Aggregate themes and motivations
        if (!this.userProfile.aggregated) {
            this.userProfile.aggregated = {
                themes: [],
                motivations: [],
                concerns: [],
                recommendedPrograms: []
            };
        }

        // Merge new insights
        this.userProfile.aggregated.themes.push(...analysis.keyThemes);
        this.userProfile.aggregated.motivations.push(...analysis.careerMotivations);
        this.userProfile.aggregated.concerns.push(...analysis.concerns);
        this.userProfile.aggregated.recommendedPrograms.push(...analysis.programFit.recommendedPrograms);
    }

    // Call Claude API
    async callAPI(messages, temperature = 0.7) {
        try {
            // Convert OpenAI format to Claude format
            const systemMessage = messages.find(m => m.role === 'system');
            const userMessages = messages.filter(m => m.role !== 'system');
            
            // Build Claude-formatted messages
            const claudeMessages = userMessages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));
            
            // Different headers/body for Vercel endpoint vs direct API
            const isVercelEndpoint = this.apiUrl === '/api/claude';
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(isVercelEndpoint ? {} : {
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01'
                    })
                },
                body: JSON.stringify({
                    ...(isVercelEndpoint ? {
                        messages: claudeMessages,
                        system: systemMessage ? systemMessage.content : undefined,
                        temperature: temperature,
                        max_tokens: 1000
                    } : {
                        model: this.model,
                        messages: claudeMessages,
                        system: systemMessage ? systemMessage.content : undefined,
                        temperature: temperature,
                        max_tokens: 1000
                    })
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API call failed: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            // Vercel endpoint returns simplified response
            return isVercelEndpoint ? data.content : data.content[0].text;
        } catch (error) {
            console.error('Claude API call error:', error);
            throw error;
        }
    }

    // Generate personalized email content
    async generateEmailContent(userProfile, blueprint) {
        try {
            const prompt = `Create a personalized follow-up email for this Salem University prospect.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Career Blueprint Highlights:
${JSON.stringify(blueprint, null, 2)}

Generate an email that:
1. References specific things they shared
2. Highlights how Salem addresses their concerns
3. Includes their personalized career timeline
4. Has a clear, compelling call-to-action
5. Feels personal, not templated

Format as JSON:
{
    "subject": "Compelling subject line",
    "preheader": "Preview text",
    "body": "HTML email content with proper formatting",
    "cta": "Call to action text"
}`;

            const response = await this.callAPI([
                { role: 'system', content: 'You are writing personalized emails that convert prospects to applicants.' },
                { role: 'user', content: prompt }
            ]);

            return JSON.parse(response);
        } catch (error) {
            console.error('Error generating email:', error);
            throw error;
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LLMService;
}