import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;  // store in req, NOT req.body

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token verification failed" });
    }
};

export default userAuth;
