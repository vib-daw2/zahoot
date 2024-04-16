import express from 'express';
import authMiddleware from '../../middleware/auth';
import handleStats from './stats';
import handleUpdate from './update';

const router = express.Router();

router.post('/', authMiddleware, handleUpdate);
router.get('/stats', authMiddleware, handleStats);

// Export the router
export default router;