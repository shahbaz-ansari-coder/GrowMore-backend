// routes/userRoutes.js
import express from "express";
import {
    addUser,
    updateUser,
    blockUser,
    unblockUser,
    getAllUsers,
    sendMessageToUser,
    deleteUser
} from "../controllers/adminController.js";
import { checkAdmin } from "../middleware/verifyJWT.js";

const router = express.Router();

// ✅ Add new user
router.post("/add-user/:id", addUser);

// ✅ Update user
router.put("/update-user/:id", checkAdmin, updateUser);

// ✅ Block user
router.post("/block-user/:id", checkAdmin, blockUser);

// ✅ Unblock user
router.post("/unblock-user/:id", checkAdmin, unblockUser);

// ✅ Get all users
router.get("/get-all-users/:id", checkAdmin, getAllUsers);

// ✅ Send message to user
router.post("/send-message/:id", checkAdmin, sendMessageToUser);

// ✅ Delete User
router.delete("/delete-user/:id", checkAdmin, deleteUser);
export default router;
