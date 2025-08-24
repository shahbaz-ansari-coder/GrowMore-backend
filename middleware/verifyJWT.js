// middlewares/checkAdmin.js
import authModel from "../models/authModel.js";

export const checkAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await authModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        req.adminUser = user; // store admin data if needed
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
