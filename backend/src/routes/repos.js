import { aikidoApi } from '../services/aikidoAuth.js';

import * as express from 'express';

const router = express.Router(); // now this works

// GET /api/repos
router.get('/', async (req, res) => {
  try {
    const api = await aikidoApi();
    const response = await api.get('/public/v1/repositories/code', {
      params: { page: 0, per_page: 20, include_inactive: false }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching repositories:', err.message);
    res.status(500).json({ error: 'Failed to fetch repositories from Aikido' });
  }
});

export default router;
