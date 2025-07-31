# LLM Integration Setup Guide

## Overview
The Salem University Career Quiz now supports AI-powered features using Anthropic's Claude for:
- Dynamic question generation
- Intelligent follow-up questions
- Natural language analysis of text responses
- Personalized career blueprint generation
- Context-aware conversations

## Setup Instructions

### 1. Get a Claude API Key
1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key (starts with sk-ant-)

### 2. Configure the API Key
Edit `config.js` and replace the API key with your actual Claude API key:

```javascript
claude: {
    apiKey: 'sk-ant-your-actual-api-key-here',
    model: 'claude-3-opus-20240229', // or 'claude-3-sonnet-20240229' for lower cost
}
```

### 3. Test the Integration
Open `index.html` in your browser and check the console:
- You should see: "✅ LLM service initialized"
- If you see warnings about API key, double-check your configuration

## Features

### Dynamic Follow-ups
The AI generates personalized follow-up questions based on user responses:
- Analyzes context from previous answers
- Asks relevant probing questions
- Maintains conversational flow

### Text Response Analysis
For open-ended questions (Q15, Q25), the AI:
- Extracts key themes and motivations
- Identifies concerns to address
- Suggests program recommendations
- Generates follow-up questions if needed

### AI-Powered Blueprints
Career blueprints are now personalized using AI:
- Specific role recommendations based on responses
- Tailored skill development paths
- Addresses individual concerns
- Creates compelling career narratives

## Cost Management

### Estimated Costs
- Claude 3 Opus: ~$0.30-0.50 per quiz completion
- Claude 3 Sonnet: ~$0.05-0.10 per quiz completion
- Claude 3 Haiku: ~$0.01-0.03 per quiz completion

### Cost Controls in config.js
```javascript
costControl: {
    maxApiCallsPerQuiz: 15,      // Limit API calls
    cacheResponses: true,         // Cache similar responses
    batchRequests: true          // Batch multiple analyses
}
```

### Disable Features to Reduce Costs
In `config.js`, you can disable specific features:
```javascript
features: {
    dynamicQuestions: false,      // Disable dynamic question generation
    intelligentFollowups: true,   // Keep smart follow-ups
    nlpAnalysis: true,           // Keep text analysis
    aiBlueprints: true,          // Keep AI blueprints
}
```

## Fallback Behavior

If the API fails or no key is configured:
- Quiz automatically falls back to static questions
- Pre-written blueprints are shown
- All core functionality remains intact
- Users won't see errors

## Security Notes

⚠️ **Important**: Never commit your API key to version control!

For production:
1. Use environment variables
2. Set up a backend proxy for API calls
3. Implement rate limiting
4. Add authentication

## Monitoring

Check the browser console for:
- API call count per session
- Failed API calls
- Fallback activations
- Response times

## Troubleshooting

### "LLM features disabled" warning
- Check that your API key is correctly set in config.js
- Verify the API key is valid at platform.openai.com

### No AI responses appearing
- Check browser console for errors
- Verify internet connection
- Check API quota at Anthropic console

### High costs
- Switch to gpt-3.5-turbo model
- Reduce maxApiCallsPerQuiz
- Disable some AI features

## Future Enhancements

Potential improvements:
- Streaming responses for faster perceived performance
- Voice input/output capabilities
- Multi-language support
- Integration with Salem's CRM
- A/B testing different conversation flows