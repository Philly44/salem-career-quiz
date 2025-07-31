# Salem University Career Assessment Quiz

An interactive, AI-powered career assessment quiz designed to help prospective students discover their ideal educational path at Salem University.

## Features

- 🎯 **25-Question Smart Assessment** - Comprehensive career evaluation
- 🤖 **AI-Powered Conversations** - Dynamic follow-ups using Claude AI
- 📱 **Mobile-First Design** - Optimized for all devices
- 🎨 **Engaging UI** - Card-based questions, progress tracking, celebrations
- 📊 **Personalized Career Blueprints** - 3, 5, and 10-year projections
- ✨ **No-Scroll Design** - Single-screen experience reduces fatigue

## Local Development

1. Clone the repository
2. Open `index.html` in your browser
3. Note: AI features won't work locally due to CORS

## Deployment to Vercel

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Salem Career Quiz"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Deploy to Vercel:
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variable: `CLAUDE_API_KEY` with your API key
- Deploy!

## Environment Variables

Set in Vercel dashboard:
- `CLAUDE_API_KEY` - Your Anthropic Claude API key

## Tech Stack

- Pure HTML/CSS/JavaScript (no frameworks)
- Claude 3 Sonnet API for AI features
- Vercel Functions for API proxy
- Mobile-responsive design

## Cost

Approximately $0.03-0.05 per quiz completion with Claude Sonnet

## License

Copyright Salem University 2024 
