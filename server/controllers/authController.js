import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// REGISTER
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "fields are missing" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to MERN Auth Project",
            text: `Welcome! Your account has been created successfully with email: ${email}.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "fields are missing" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Login successful" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


// LOGOUT
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


// SEND VERIFY OTP
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpire = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: "verification otp sent to email" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ message: "fields are missing" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "invalid otp" });
        }

        if (user.verifyOtpExpire < Date.now()) {
            return res.json({ success: false, message: "otp expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpire = null;

        await user.save();

        return res.json({ success: true, message: "email verified successfully" });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
};
