import express from 'express';
import handleSignup from './signup';
import handleLogin from './login';

const router = express.Router();

router.post('/signup', handleSignup);
router.post('/login', handleLogin);

// Export the router
export default router;