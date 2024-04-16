import express from 'express';
import authMiddleware from '../../middleware/auth';
import handleStats from './stats';
import handleUpdate from './update';
import handleGetMyProfile from './get';

const router = express.Router();

router.get('/', authMiddleware, handleGetMyProfile);
router.post('/', authMiddleware, handleUpdate);
router.get('/stats', authMiddleware, handleStats);

// Export the router
export default router;