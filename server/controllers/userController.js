import User from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("name isAccountVerified");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            userData: user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
