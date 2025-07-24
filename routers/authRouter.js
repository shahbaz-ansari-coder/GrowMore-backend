import express from 'express';
import { accountLogin, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', accountLogin ) 
router.post('/google', googleLogin ) 

export default router