const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json({ message: "Registered" });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Database connection failed. Check your MongoDB IP Whitelist." });
    }
});

router.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body;
        
        if (username) username = username.trim();
        if (password) password = password.trim();

        const user = await User.findOne({ 
            username: { $regex: new RegExp(`^${username}$`, "i") }, 
            password 
        });

        if (!user) return res.status(401).json({ message: "incorrect username or password" });

        res.json({ message: "Login success", user });
    } catch (err) {
        console.error("Login route error:", err);
        res.status(500).json({ message: "Database connection failed. Check your MongoDB IP Whitelist." });
    }
});


const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) return res.status(404).json({ message: "No account found with that email." });

    // Generate secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = rawToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour validity
    await user.save();

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER || 'your_email@gmail.com', // Set in backend/.env
                pass: process.env.EMAIL_PASS || 'your_app_password' // Set in backend/.env
            }
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'your_email@gmail.com',
            to: user.email,
            subject: 'PhishCure Password Reset',
            text: `You requested a password reset. Click here to reset: ${resetLink}`
        };

        // Attempt to send email
        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset link sent successfully to your email.", resetToken: rawToken });
    } catch (err) {
        console.error("Email send error:", err);
        // Fallback for UI if email creds are missing
        res.json({ message: "Secure reset link processed (Email failing due to missing credentials)", resetToken: rawToken });
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Invalid payload" });

    const user = await User.findOne({ 
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() } // Must not be expired
    });

    if (!user) {
        return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    
    res.json({ message: "Password updated successfully" });
});

module.exports = router;