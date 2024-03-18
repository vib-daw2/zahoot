import express from 'express';
import authMiddleware from '../../middleware/auth';
import handleCreateGame from './createGame';
import handleGameExists from './gameExists';

const router = express.Router();

router.post('/create', authMiddleware, handleCreateGame);
router.head('/exists', handleGameExists);

// Export the router
export default router;