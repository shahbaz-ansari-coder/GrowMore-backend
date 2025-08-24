import express from 'express';
import { deleteMessageForUser, getUser, setUserOffline, setUserOnline, updateAvatar, updatePassword } from '../controllers/userController.js';

const router = express.Router();

router.get('/get-user/:id' , getUser)
router.post("/delete-message", deleteMessageForUser);
router.put("/set-online/:id", setUserOnline);
router.post("/set-offline/:id", setUserOffline);
router.post("/update-password/:id", updatePassword);
router.post("/update-avatar/:id", updateAvatar);
export default router