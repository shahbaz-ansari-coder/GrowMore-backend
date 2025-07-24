import jwt from "jsonwebtoken";

const allowedEmail = 'shahbazansari.dev@gmail.com';

const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: Token is missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userEmail = decoded.email;

        if (userEmail !== allowedEmail) {
            return res.status(403).json({ message: "You're not authorized to access this app." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token." });
    }
};

export default verifyJWT
