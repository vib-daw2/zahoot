import express from 'express';
import authMiddleware from '../../middleware/auth';
import handleStats from './stats';

const router = express.Router();

router.get('/stats', authMiddleware, handleStats);

// Export the router
export default router;