import express from 'express';
const router = express.Router();
import { logOut, login, register } from '../controllers/authController.js';

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logOut)

export default router;