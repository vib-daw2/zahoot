import express from 'express';
import authMiddleware from '../../middleware/auth';
import { handleGetMySets, handleGetSetById } from './getSet';
import { handleCreateQuestionSet } from './createSet';
import { handleUpdateQuestionSet } from './updateSet';
import { handleDeleteQuestionSet } from './deleteSet';

const router = express.Router();

router.get('/mine', authMiddleware, handleGetMySets);
router.get('/:id', authMiddleware, handleGetSetById);
router.post('/', authMiddleware, handleCreateQuestionSet);
router.put('/', authMiddleware, handleUpdateQuestionSet);
router.delete('/:id', authMiddleware, handleDeleteQuestionSet);

// Export the router
export default router;
