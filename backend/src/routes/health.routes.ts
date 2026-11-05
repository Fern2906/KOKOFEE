import { Router } from 'express';
import { getDatabaseState } from '../config/database';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'KOKOFEE API',
    database: getDatabaseState(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
