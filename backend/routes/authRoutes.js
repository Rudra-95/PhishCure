const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Registered" });
});

router.post("/login", async (req, res) => {
    let { username, password } = req.body;
    
    // Trim accidental whitespace just in case
    if (username) username = username.trim();
    if (password) password = password.trim();

    // Use a case-insensitive match for the username
    const user = await User.findOne({ 
        username: { $regex: new RegExp(`^${username}$`, "i") }, 
        password 
    });

    if (!user) return res.status(401).json({ message: "incorrect username or password" });

    res.json({ message: "Login success", user });
});

const crypto = require('crypto');

router.post("/forgot-password", async (req, res) => {
    // Only placeholder since we are implementing it via direct route now
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (!user) return res.status(404).json({ message: "No account found with that email." });

    // Generate secure token
    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = rawToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour validity
    await user.save();

    // MOCK EMAIL SEND: We return it in the json specifically so the UI can mock it.
    res.json({ message: "Secure reset link processed", resetToken: rawToken });
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