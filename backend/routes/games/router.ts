import express from 'express';
import authMiddleware from '../../middleware/auth';
import handleCreateGame from './createGame';

const router = express.Router();

router.post('/create', authMiddleware, handleCreateGame);

// Export the router
export default router;