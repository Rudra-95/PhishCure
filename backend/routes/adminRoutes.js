const express = require("express");
const router = express.Router();
const SearchLog = require("../models/SearchLog");
const User = require("../models/User");

// Endpoint for Dashboard to silently save user's search
router.post("/logs/add", async (req, res) => {
    try {
        const { userId, username, type, value, score, verdict } = req.body;
        // Truncate excessively long text (keep first 500 characters to prevent huge document sizes)
        const truncatedValue = value.length > 500 ? value.substring(0, 500) + "..." : value;

        const log = new SearchLog({
            userId, username, type, value: truncatedValue, score, verdict
        });
        await log.save();
        res.json({ message: "Log saved" });
    } catch (err) {
        console.error("Log error", err);
        res.status(500).json({ message: "Error saving log" });
    }
});

// Admin Endpoint: Fetch all registered users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, 'username email');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Admin Endpoint: Fetch logs for a specific user
router.get("/logs/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const logs = await SearchLog.find({ username }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching logs" });
    }
});

// Admin Endpoint: Delete a specific log
router.delete("/logs/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await SearchLog.findByIdAndDelete(id);
        res.json({ message: "Log uniquely deleted" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Error deleting log" });
    }
});

module.exports = router;
