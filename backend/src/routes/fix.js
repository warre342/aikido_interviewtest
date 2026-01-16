import express from 'express';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiter (OpenRouter free tier ≈ 20/min)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(limiter);

/**
 * GET /api/fix-code
 * Query parameters:
 *  - code: string (required)
 *  - language: string (optional, default "php")
 *  - issue: string (optional)
 */
router.get('/', async (req, res) => {

  const code = req.query.code;
  const language = req.query.language || 'php';
  const issue =
    req.query.issue ||
    'Using backticks in PHP can lead to remote code execution';

  if (!code || typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Query parameter "code" is required' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OpenRouter API key not configured' });
  }

  try {
    const prompt = `
You are a senior security engineer.

The following ${language} code contains a security vulnerability:
"${issue}"

Your task:
- Fix the vulnerability
- Follow secure coding best practices
- Preserve original behavior
- Output ONLY the fixed code
- Do NOT include explanations, markdown, or extra text

Vulnerable code:
${code}
`.trim();

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.1-24b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          // OpenRouter recommended headers
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Aikido Security Fix Generator',
        },
      }
    );

    const fixedCode =
      response.data?.choices?.[0]?.message?.content?.trim();

    if (!fixedCode) {
      return res.status(500).json({ error: 'Model returned empty response' });
    }

    res.json({ fixedCode });
  } catch (err) {
    console.error(
      'Error generating fix:',
      err?.response?.data || err.message || err
    );
    res.status(500).json({ error: 'Failed to generate fix' });
  }
});

export default router;
