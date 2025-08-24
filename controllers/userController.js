import authModel from "../models/authModel.js";
import bcrypt from "bcryptjs";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await authModel.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "User fetched successfully.",
            user
        });

    } catch (error) {
        console.error("Error in getUser:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const deleteMessageForUser = async (req, res) => {
    try {
        const { uid, messageId } = req.body; // 👈 messageId bhejna hoga

        if (!uid || !messageId) {
            return res.status(400).json({ message: "User ID and messageId are required." });
        }

        const user = await authModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Remove message by matching _id
        user.messages = user.messages.filter(
            msg => msg._id.toString() !== messageId
        );

        await user.save();

        return res.status(200).json({
            message: "Message deleted successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                messages: user.messages
            }
        });

    } catch (error) {
        console.error("Error in deleteMessageForUser:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const setUserOnline = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await authModel.findByIdAndUpdate(
            id,
            { is_online: true },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "User marked as online.",
            user,
        });
    } catch (error) {
        console.error("Error in setUserOnline:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const setUserOffline = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await authModel.findByIdAndUpdate(
            id,
            { is_online: false },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "User marked as offline.",
            user,
        });
    } catch (error) {
        console.error("Error in setUserOffline:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!id || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Find user by ID
        const user = await authModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        // ✅ Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // ✅ Update password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error in updatePassword:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const { id } = req.params;
        const { avatar } = req.body; // avatar = image URL

        if (!id || !avatar) {
            return res.status(400).json({ message: "User ID and avatar are required." });
        }

        // ✅ Find and update
        const user = await authModel.findByIdAndUpdate(
            id,
            { avatar }, // update avatar field
            { new: true, select: "-password" } // return updated user without password
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({
            message: "Avatar updated successfully.",
            user,
        });
    } catch (error) {
        console.error("Error in updateAvatar:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};
