import express from 'express';
import authMiddleware from '../../middleware/auth';
import { handleGetMySets } from './mine';

const router = express.Router();

router.get('/mine', authMiddleware, handleGetMySets);

// Export the router
export default router;
