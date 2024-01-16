import express from 'express';
import { handleCreateQuestions } from './createQuestions';
import authMiddleware from '../../middleware/auth';

const router = express.Router();

router.post('/:id', authMiddleware, handleCreateQuestions);

// Export the router
export default router;