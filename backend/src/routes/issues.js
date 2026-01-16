// server/routes/issues.ts
import { aikidoApi } from '../services/aikidoAuth.js';
import * as express from 'express';

const router = express.Router();

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
