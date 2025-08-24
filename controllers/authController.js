import authModel from "../models/authModel.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import { OAuth2Client } from 'google-auth-library';

export const accountLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Private app by Shahbaz Ansari." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password.",
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send token and user data
        res.status(200).json({
            message: "Login successfully ",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, 
                avatar: user.avatar,
                capital_price: user.capital_price,
                loss_price: user.loss_price,
                profit_price: user.profit_price
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error." });
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // ✅ Step 1: Get user info from Google using access_token
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const { email } = response.data;

        // ✅ Step 2: Check if user exists in DB
        let user = await authModel.findOne({ email });

        if (!user) {
            // ❌ User not found → private app, block access
            return res.status(404).json({ message: "Private app by Shahbaz Ansari." });
        }

        // ✅ Step 3: Generate JWT token
        const jwtToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successfully",
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, 
                avatar: user.avatar,
                capital_price: user.capital_price,
                loss_price: user.loss_price,
                profit_price: user.profit_price,
            },
        });
    } catch (err) {
        console.error("Google login error:", err.message);
        res.status(401).json({ message: "Invalid Google access token" });
    }
};
