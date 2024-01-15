import express from 'express';
import handlePing from './ping';

const router = express.Router();

router.get('/ping', handlePing);

// Export the router
export default router;
