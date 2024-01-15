import express from 'express';
import handlePing from './ping';
import authMiddleware from '../../middleware/auth';

const router = express.Router();

router.get('/ping', handlePing);
router.get('/ping-auth', authMiddleware, handlePing);

// Export the router
export default router;
