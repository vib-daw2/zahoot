import express from 'express';
import authMiddleware from '../../middleware/auth';
import { handleGetMySets, handleGetSetById } from './getSet';
import { handleCreateQuestionSet } from './createSet';
import { handleUpdateQuestionSet } from './updateSet';

const router = express.Router();

router.get('/mine', authMiddleware, handleGetMySets);
router.get('/:id', authMiddleware, handleGetSetById);
router.post('/', authMiddleware, handleCreateQuestionSet);
router.put('/', authMiddleware, handleUpdateQuestionSet);

// Export the router
export default router;
