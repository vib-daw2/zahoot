import express from 'express';
import authMiddleware from '../../middleware/auth';
import { handleGetMySets, handleGetSetById, handleHomePageSets } from './getSet';
import { handleCreateQuestionSet } from './createSet';
import { handleUpdateQuestionSet } from './updateSet';
import { handleDeleteQuestionSet } from './deleteSet';
import parseUserMiddleware from '../../middleware/parseUser';

const router = express.Router();

router.get('/', handleHomePageSets);
router.get('/mine', authMiddleware, handleGetMySets);
router.get('/:id', parseUserMiddleware, handleGetSetById);
router.post('/', authMiddleware, handleCreateQuestionSet);
router.put('/', authMiddleware, handleUpdateQuestionSet);
router.delete('/:id', authMiddleware, handleDeleteQuestionSet);

// Export the router
export default router;
