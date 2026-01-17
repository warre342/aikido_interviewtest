// server/routes/issues.ts
import { aikidoApi } from '../services/aikidoAuth.js';
import * as express from 'express';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

//https://apidocs.aikido.dev/reference/rate-limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,              // max 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

// Apply limiter to all routes in this router
router.use(limiter);
// GET /api/issues/:repoId
router.get('/:repoId', async (req, res) => {
  const { repoId } = req.params;

  if (!repoId) {
    return res.status(400).json({ error: 'Repository ID is required' });
  }

  try {
    const api = await aikidoApi();
    const response = await api.get('/public/v1/issues/export', {
      params: {
        format: 'json',
        filter_code_repo_id: Number(repoId), // filter issues by this repo
        filter_status: 'all' // you can change to 'open' if needed
      }
    });

    // Return the filtered issues
    res.json(response.data);
  } catch (err) {
    console.error(`Error fetching issues for repo ${repoId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch issues from Aikido' });
  }
});

export default router;
