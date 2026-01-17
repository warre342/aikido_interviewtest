import { aikidoApi } from '../services/aikidoAuth.js';
import { rateLimit } from 'express-rate-limit';

import * as express from 'express';

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
