import bcrypt from "bcryptjs";
import authModel from "../models/authModel.js";

export const addUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✅ Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Check if email already exists
        const existingUser = await authModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // ✅ Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create user
        const newUser = await authModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // ✅ Hide password in response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: "User created successfully.",
            user: userResponse
        });

    } catch (error) {
        console.error("Error in addUser:", error);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, password , uid } = req.body;

        // ✅ Check if user exists
        const user = await authModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Update fields if provided
        if (name) user.name = name;
        if (email) {
            // check if new email already exists (other than this user)
            const existingUser = await authModel.findOne({ email, _id: { $ne: uid } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use by another user." });
            }
            user.email = email;
        }

        // ✅ If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // ✅ Save updated user
        const updatedUser = await user.save();

        // ✅ Hide password in response
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "User updated successfully.",
            user: userResponse
        });

    } catch (error) {
        console.error("Error in updateUser:", error);
        return res.status(500).json({
            message: "Server error. Please try again later.",
            error: error.message
        });
    }
};

export const blockUser = async (req, res) => {
    try {
        const { uid } = req.body;

        console.log(uid);

        if (!uid) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await authModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ❌ Admin ko block karna allowed nahi
        if (user.role === "admin") {
            return res.status(403).json({ message: "Admins cannot be blocked." });
        }

        if (user.is_blocked) {
            return res.status(400).json({ message: "User is already blocked." });
        }

        user.is_blocked = true;
        await user.save();

        return res.status(200).json({
            message: "User blocked successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_blocked: user.is_blocked
            }
        });

    } catch (error) {
        console.error("Error in blockUser:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const { uid } = req.body;

        if (!uid) {
            return res.status(400).json({ message: "User ID (uid) is required." });
        }

        const user = await authModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Lekin safe side ke liye rakh dete hain
        if (user.role === "admin") {
            return res.status(400).json({ message: "Admin cannot be blocked/unblocked." });
        }

        if (!user.is_blocked) {
            return res.status(400).json({ message: "User is already unblocked." });
        }

        user.is_blocked = false;
        await user.save();

        return res.status(200).json({
            message: "User unblocked successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_blocked: user.is_blocked
            }
        });

    } catch (error) {
        console.error("Error in unblockUser:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await authModel.find().select("-password"); // password exclude

        return res.status(200).json({
            message: "Users fetched successfully.",
            total: users.length,
            users
        });

    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.body;

        if (!uid) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Pehle user find karo
        const user = await authModel.findById(uid);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // 👇 Agar user admin hai to delete na karo
        if (user.role === "admin") {
            return res.status(403).json({ message: "Admin cannot be deleted." });
        }

        // Agar admin nahi hai to delete karo
        const deletedUser = await authModel.findByIdAndDelete(uid);

        return res.status(200).json({
            message: "User deleted successfully.",
            deletedUser,
        });

    } catch (error) {
        console.error("Error in deleteUser:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

export const sendMessageToUser = async (req, res) => {
    try {
        const { uid, text } = req.body;  // 👈 text le rahe hain

        if (!uid || !text) {
            return res.status(400).json({ message: "User ID and message text are required." });
        }

        const user = await authModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Push object with text
        user.messages.push({ text });
        await user.save();

        return res.status(200).json({
            message: "Message sent successfully.",
        });

    } catch (error) {
        console.error("Error in sendMessageToUser:", error);
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};
