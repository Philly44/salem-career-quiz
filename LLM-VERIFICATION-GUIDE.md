# LLM Verification Guide

## How to Tell if LLM is Working

### 1. Visual Indicators

Look for the **AI Status Indicator** in the top-right corner of the quiz:

- 🤖 AI: **Active ✅** - LLM is working properly
- 🤖 AI: **Thinking... 🤔** - Currently making an API call
- 🤖 AI: **Analyzing... 📝** - Processing text responses
- 🤖 AI: **Local Mode** - Running locally (no LLM)
- 🤖 AI: **Offline ❌** - LLM connection failed

The indicator also shows the number of API calls made (e.g., "Active ✅ (3 calls)")

### 2. Browser Console

Open DevTools (F12) and check the Console tab for:

```
✅ Claude LLM service initialized and connected
```

If you see this message, LLM is working.

### 3. Network Activity

In DevTools Network tab, look for calls to `/api/claude`:

1. An initial "ping" test on page load
2. API calls when you answer questions (especially open-text ones)
3. Successful responses should return 200 status

### 4. Test the Features

To verify each LLM feature:

#### Dynamic Follow-ups
- Answer any question
- If LLM is working, you'll see personalized follow-up questions
- The AI indicator will show "Thinking... 🤔" while generating

#### Text Analysis (Questions 15 & 25)
- Question 15: "In your ideal role 5 years from now..."
- Question 25: "Is there anything else you'd like us to know?"
- Type detailed responses
- Watch for "Analyzing... 📝" status
- You should get AI-generated insights

#### Natural Conversation
With LLM active, responses should:
- Reference your specific answers
- Ask relevant follow-up questions
- Feel conversational, not scripted

### 5. Test Page

Visit `/test-llm.html` for comprehensive diagnostics:
- Configuration status
- API endpoint testing
- Feature flag verification
- Live testing tools

### 6. Common Issues

**"Local Mode" Status**
- You're running locally
- LLM features only work on Vercel deployment

**"Offline ❌" Status**
- Check Vercel environment variables
- Ensure CLAUDE_API_KEY is set in Vercel dashboard

**No API Calls in Network Tab**
- LLM might not be initialized
- Check console for errors

### 7. Verification Checklist

✓ AI status shows "Active ✅"  
✓ Console shows initialization success  
✓ Network tab shows /api/claude calls  
✓ Dynamic follow-ups appear after answers  
✓ Text questions trigger analysis  
✓ API call counter increases  

## Quick Test

1. Go to your deployed site
2. Start the quiz
3. Answer the first question
4. Watch for:
   - Status change to "Thinking... 🤔"
   - A personalized follow-up message
   - Status return to "Active ✅ (1 calls)"

If all three happen, your LLM integration is working perfectly! 🎉