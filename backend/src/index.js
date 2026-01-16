import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import reposRouter from './routes/repos.js';
import issuesRouter from './routes/issues.js';
import fixRouter from './routes/fix.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/repos', reposRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/fix', fixRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
