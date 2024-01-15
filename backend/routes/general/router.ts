import express from 'express';
import handlePing from './ping';

const router = express.Router();

router.use('/', (req, res, next) => {
    next();
});

router.get('/api/ping', handlePing);

// Export the router
export default router;
