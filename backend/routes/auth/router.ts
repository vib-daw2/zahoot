import express from 'express';
import handleSignup from './signup';

const router = express.Router();

router.post('/signup', handleSignup);

// Export the router
export default router;