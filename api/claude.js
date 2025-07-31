// Vercel API endpoint for Claude
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system, temperature = 0.7, max_tokens = 1000 } = req.body;

    // Get API key from environment variable
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages: messages,
        system: system,
        temperature: temperature,
        max_tokens: max_tokens
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API error');
    }

    const data = await response.json();
    res.status(200).json({ content: data.content[0].text });

  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: error.message });
  }
}